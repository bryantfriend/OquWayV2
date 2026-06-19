import { db, collection, doc, getDoc, getDocs } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.82-shared-command-center-shell";
import { getAssignedCourseIds } from "../../../../../../../domain/courses/index.js";
import { countCourseSteps } from "../../../../../../../domain/progress/index.js";
import {
  isStudentDashboardProfile,
  readStudentClassIdentifiers,
  readStudentIdentifiers,
  readStudentProfileRejectReason,
  resolveStudentId
} from "../../../../../../../domain/users/index.js";

export async function processLoadStudentDashboard(executionState) {
  var actor = executionState.actor;
  var studentProfile = executionState.context.studentProfile;
  var resolvedStudentId = resolveStudentId(studentProfile, actor);
  var resolvedActor = createResolvedStudentActor(actor, resolvedStudentId);
  var timing = createStudentDashboardTiming("LoadStudentDashboardIntent", executionState);

  try {
    ensureWarnings(executionState);

    if (!studentProfile && !isPreviewActor(actor)) {
      return createValidationError("STUDENT_PROFILE_MISSING", "Student profile is required before the dashboard can be loaded.");
    }

    if (!isPreviewActor(actor)) {
      var profileValidation = validateStudentProfileForDashboard(studentProfile);
      if (!profileValidation.valid) {
        return profileValidation;
      }
    }

    var courseAssignmentResult = await waitForStudentDashboardRead(
      loadAssignedCourseIds(resolvedActor, studentProfile, executionState),
      "student course assignment lookup"
    );
    timing.mark("course assignment query");
    appendWarnings(executionState, courseAssignmentResult.warnings || []);

    var courses = await waitForStudentDashboardRead(
      loadLightweightStudentCourses(courseAssignmentResult.courseIds || [], courseAssignmentResult, executionState),
      "student course summary lookup"
    );
    timing.mark("course summary hydration");
    var progressSummary = buildProgressSummary(courses);
    timing.mark("progress summary build");
    var debugInfo = buildStudentDashboardDebugInfo({
      actor: actor,
      studentProfile: studentProfile,
      resolvedStudentId: resolvedStudentId,
      courseAssignmentResult: courseAssignmentResult,
      courses: courses
    });

    executionState.result = {
      student: studentProfile,
      courses: courses,
      assignmentCount: courseAssignmentResult.assignmentCount || 0,
      assignmentSource: courseAssignmentResult.source || "courseAssignments",
      continueLearning: buildContinueLearning(courses),
      intentionPoints: readIntentionPoints(studentProfile),
      dailyBonus: readDailyBonus(studentProfile),
      progressSummary: progressSummary,
      debugInfo: shouldEmitDebug(executionState) ? debugInfo : null,
      emptyStateMessage: courses.length === 0 ? "No courses are ready yet. Your teacher will assign learning soon." : ""
    };

    logStudentDashboardDebug(debugInfo, executionState);
    timing.finish({
      courseCount: courses.length,
      assignmentCount: courseAssignmentResult.assignmentCount || 0
    });

    return {
      valid: true,
      data: executionState.result
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          code: "STUDENT_DASHBOARD_LOAD_FAILED",
          message: "Failed to load student dashboard: " + readErrorMessage(error)
        }
      ]
    };
  }
}

async function loadLightweightStudentCourses(courseIds, courseAssignmentResult, executionState) {
  var safeCourseIds = dedupeTextList(courseIds);
  var courseCache = {};
  var courses = await Promise.all(safeCourseIds.map(function (courseId) {
    return loadCourseSummary(courseId, courseAssignmentResult || {}, courseCache, executionState);
  }));

  return courses.filter(Boolean).sort(compareByOrderThenTitle);
}

async function loadCourseSummary(courseId, courseAssignmentResult, cache, executionState) {
  if (!courseId) {
    return null;
  }

  if (Object.prototype.hasOwnProperty.call(cache, courseId)) {
    return cache[courseId];
  }

  cache[courseId] = await readCourseSummaryFromSource(courseId, "courses", courseAssignmentResult, executionState)
    || await readCourseSummaryFromSource(courseId, "catalogCourses", courseAssignmentResult, executionState);

  if (!cache[courseId]) {
    executionState.warnings.push({
      code: "ASSIGNED_COURSE_NOT_FOUND",
      message: "Assigned course was skipped because it no longer exists: " + courseId
    });
  }

  return cache[courseId];
}

async function readCourseSummaryFromSource(courseId, source, courseAssignmentResult, executionState) {
  try {
    var courseSnap = await getDoc(doc(db, source, courseId));
    var courseData = {};

    if (!courseSnap.exists()) {
      return null;
    }

    courseData = courseSnap.data() || {};

    if (!isStudentVisibleCourseSummary(courseData)) {
      executionState.warnings.push({
        code: "ASSIGNED_COURSE_NOT_READY",
        message: "Assigned course is not published or ready for students: " + courseId
      });
      return null;
    }

    var summaryContext = await resolveCourseSummaryContext(
      source,
      courseSnap.id,
      courseData,
      courseAssignmentResult || {},
      executionState
    );

    return normalizeCourseSummary(
      courseSnap.id,
      courseData,
      source,
      courseAssignmentResult || {},
      summaryContext
    );
  } catch (error) {
    executionState.warnings.push({
      code: "ASSIGNED_COURSE_READ_FAILED",
      message: "Assigned course could not be read from " + source + ": " + readErrorMessage(error)
    });
    return null;
  }
}

function normalizeCourseSummary(courseId, data, source, courseAssignmentResult, summaryContext) {
  var assignmentId = readAssignmentIdForCourse(courseAssignmentResult, courseId) || data.assignmentId || data.courseAssignmentId || "";
  var context = summaryContext || {};
  var counts = context.counts || createCourseSummaryCounts(data, [], false);

  return {
    id: courseId,
    courseId: courseId,
    source: source,
    courseRecordSource: source,
    canonicalCourseId: context.canonicalCourseId || courseId,
    moduleCourseId: context.moduleCourseId || courseId,
    moduleSource: context.moduleSource || source,
    title: data.title || data.name || data.displayName || "Untitled Course",
    description: data.description || data.summary || "",
    status: data.status || data.state || "assigned",
    order: readNumber(data.order, readNumber(data.sortOrder, 0)),
    moduleCount: counts.moduleCount,
    activityCount: counts.activityCount,
    stepCount: counts.activityCount,
    countSource: counts.countSource,
    progressPercent: readStoredProgressPercent(data),
    assignmentId: assignmentId,
    courseAssignmentId: assignmentId,
    isLightweight: true
  };
}

async function resolveCourseSummaryContext(source, courseId, data, courseAssignmentResult, executionState) {
  var assignment = readAssignmentForCourse(courseAssignmentResult, courseId);
  var courseIds = buildCourseIdentityCandidates(courseId, data, assignment);
  var sources = buildCourseSourceOrder(source, readPreferredCourseSource(data, assignment));
  var fallbackContext = {
    counts: createCourseSummaryCounts(data, [], false),
    canonicalCourseId: courseId,
    moduleCourseId: courseId,
    moduleSource: source
  };
  var courseIndex = 0;

  while (courseIndex < courseIds.length) {
    var visibleCourseContext = await loadVisibleCourseContext(courseIds[courseIndex], sources, source, courseId, data);

    if (visibleCourseContext) {
      var moduleContext = await loadFirstCourseSummaryModules(
        sources,
        courseIds[courseIndex],
        visibleCourseContext.data,
        executionState
      );

      if (moduleContext && moduleContext.counts && moduleContext.counts.countSource === "canonicalModules") {
        return {
          counts: moduleContext.counts,
          canonicalCourseId: visibleCourseContext.courseId,
          moduleCourseId: courseIds[courseIndex],
          moduleSource: moduleContext.moduleSource
        };
      }

      if (moduleContext && hasStoredCourseCounts(moduleContext.counts) && !hasStoredCourseCounts(fallbackContext.counts)) {
        fallbackContext = {
          counts: moduleContext.counts,
          canonicalCourseId: visibleCourseContext.courseId,
          moduleCourseId: courseIds[courseIndex],
          moduleSource: moduleContext.moduleSource
        };
      }
    }

    courseIndex = courseIndex + 1;
  }

  return fallbackContext;
}

async function loadVisibleCourseContext(courseId, sources, originalSource, originalCourseId, originalData) {
  var sourceIndex = 0;

  while (sourceIndex < sources.length) {
    var source = sources[sourceIndex];

    if (source === originalSource && courseId === originalCourseId) {
      return {
        courseId: courseId,
        source: source,
        data: originalData || {}
      };
    }

    try {
      var courseSnap = await getDoc(doc(db, source, courseId));

      if (courseSnap.exists() && isStudentVisibleCourseSummary(courseSnap.data() || {})) {
        return {
          courseId: courseSnap.id,
          source: source,
          data: courseSnap.data() || {}
        };
      }
    } catch (error) {
      // Another source may still contain the published course document.
    }

    sourceIndex = sourceIndex + 1;
  }

  return null;
}

async function loadFirstCourseSummaryModules(sources, courseId, data, executionState) {
  var sourceIndex = 0;
  var fallbackCounts = createCourseSummaryCounts(data, [], false);
  var fallbackSource = sources.length > 0 ? sources[0] : "courses";

  while (sourceIndex < sources.length) {
    var source = sources[sourceIndex];
    var counts = await loadPublishedCourseSummaryCounts(source, courseId, data, executionState);

    if (counts.countSource === "canonicalModules") {
      return {
        counts: counts,
        moduleSource: source
      };
    }

    if (hasStoredCourseCounts(counts)) {
      fallbackCounts = counts;
      fallbackSource = source;
    }

    sourceIndex = sourceIndex + 1;
  }

  return {
    counts: fallbackCounts,
    moduleSource: fallbackSource
  };
}

async function loadPublishedCourseSummaryCounts(source, courseId, data, executionState) {
  try {
    var modulesSnap = await getDocs(collection(db, source, courseId, "modules"));
    var modules = [];

    modulesSnap.forEach(function (moduleSnap) {
      var moduleData = moduleSnap.data() || {};

      if (isStudentVisibleModuleSummary(moduleData)) {
        modules.push(Object.assign({ id: moduleSnap.id }, moduleData));
      }
    });

    modules = await Promise.all(modules.map(function (module) {
      return hydrateModuleActivitySummary(source, courseId, module);
    }));

    return createCourseSummaryCounts(data, modules, !modulesSnap.empty);
  } catch (error) {
    executionState.warnings.push({
      code: "ASSIGNED_COURSE_COUNT_READ_FAILED",
      message: "Assigned course module counts could not be read from " + source + ": " + readErrorMessage(error)
    });
    return createCourseSummaryCounts(data, [], false);
  }
}

async function hydrateModuleActivitySummary(source, courseId, module) {
  if (countCourseSteps({ modules: [module] }) > 0) {
    return module;
  }

  var modeCounts = await loadLearningModeActivityCounts(source, courseId, module.id);

  if (modeCounts.activityCount === 0) {
    return module;
  }

  return Object.assign({}, module, {
    stepCount: modeCounts.activityCount,
    learningModes: modeCounts.learningModes
  });
}

async function loadLearningModeActivityCounts(source, courseId, moduleId) {
  var modesSnap = await getDocs(collection(db, source, courseId, "modules", moduleId, "learningModes"));
  var learningModes = {};
  var modeRecords = [];

  modesSnap.forEach(function (modeSnap) {
    modeRecords.push(Object.assign({ id: modeSnap.id }, modeSnap.data() || {}));
  });

  await Promise.all(modeRecords.map(function (mode) {
    return readLearningModeActivityCount(source, courseId, moduleId, mode).then(function (activityCount) {
      learningModes[mode.id] = Object.assign({}, mode, {
        stepCount: activityCount,
        stepOrder: activityCount > 0 ? createPlaceholderStepOrder(activityCount) : []
      });
    });
  }));

  return {
    learningModes: learningModes,
    activityCount: Object.keys(learningModes).reduce(function (total, modeId) {
      return total + readNumber(learningModes[modeId].stepCount, 0);
    }, 0)
  };
}

async function readLearningModeActivityCount(source, courseId, moduleId, mode) {
  var directCount = readStoredCourseActivityCount(mode);

  if (directCount > 0) {
    return directCount;
  }

  if (Array.isArray(mode.steps) && mode.steps.length > 0) {
    return mode.steps.length;
  }

  if (Array.isArray(mode.stepOrder) && mode.stepOrder.length > 0) {
    return mode.stepOrder.length;
  }

  try {
    var stepsSnap = await getDocs(collection(db, source, courseId, "modules", moduleId, "learningModes", mode.id, "steps"));
    return stepsSnap.size || 0;
  } catch (error) {
    return 0;
  }
}

function createPlaceholderStepOrder(count) {
  var order = [];
  var index = 0;

  while (index < count) {
    order.push("summary-step-" + (index + 1));
    index = index + 1;
  }

  return order;
}

function createCourseSummaryCounts(data, modules, canonicalModulesLoaded) {
  var safeModules = Array.isArray(modules) ? modules : [];
  var activityCount = countCourseSteps({ modules: safeModules });

  if (canonicalModulesLoaded) {
    return {
      moduleCount: safeModules.length,
      activityCount: activityCount,
      countSource: "canonicalModules"
    };
  }

  return {
    moduleCount: readStoredCourseModuleCount(data),
    activityCount: readStoredCourseActivityCount(data),
    countSource: "storedSummary"
  };
}

function hasStoredCourseCounts(counts) {
  return Boolean(counts && (counts.moduleCount > 0 || counts.activityCount > 0));
}

function buildCourseIdentityCandidates(courseId, data, assignment) {
  var courseIds = [];

  addCourseIdentity(courseIds, courseId);
  addCourseIdentityFields(courseIds, assignment);
  addCourseIdentityFields(courseIds, data);

  return courseIds;
}

function addCourseIdentityFields(courseIds, source) {
  if (!source || typeof source !== "object") {
    return;
  }

  addCourseIdentity(courseIds, source.courseId);
  addCourseIdentity(courseIds, source.catalogCourseId);
  addCourseIdentity(courseIds, source.canonicalCourseId);
  addCourseIdentity(courseIds, source.moduleCourseId);
  addCourseIdentity(courseIds, source.sourceCourseId);
  addCourseIdentity(courseIds, source.publishedCourseId);
  addCourseIdentity(courseIds, source.targetCourseId);
  addCourseIdentity(courseIds, source.linkedCourseId);
  addCourseIdentity(courseIds, source.parentCourseId);
  addCourseIdentity(courseIds, source.baseCourseId);
  addCourseIdentity(courseIds, source.originalCourseId);
  addCourseIdentity(courseIds, source.templateCourseId);
  addCourseIdentity(courseIds, source.courseRefId);
  addCourseIdentity(courseIds, source.refId);

  if (source.course && typeof source.course === "object") {
    addCourseIdentity(courseIds, source.course.id || source.course.courseId);
  }
}

function addCourseIdentity(courseIds, value) {
  var courseId = readCourseIdentity(value);

  if (courseId && courseIds.indexOf(courseId) === -1) {
    courseIds.push(courseId);
  }
}

function readCourseIdentity(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (value && typeof value === "object") {
    return readText(value.id || value.courseId || value.refId || value.uid);
  }

  return "";
}

function buildCourseSourceOrder(primarySource, secondarySource) {
  var sources = [];

  addCourseSource(sources, primarySource);
  addCourseSource(sources, secondarySource);
  addCourseSource(sources, "courses");
  addCourseSource(sources, "catalogCourses");

  return sources;
}

function addCourseSource(sources, source) {
  var safeSource = readText(source);

  if ((safeSource === "courses" || safeSource === "catalogCourses") && sources.indexOf(safeSource) === -1) {
    sources.push(safeSource);
  }
}

function readPreferredCourseSource(data, assignment) {
  return readCourseSourceValue(data && (data.moduleSource || data.courseRecordSource || data.source || data.courseSource))
    || readCourseSourceValue(assignment && (assignment.moduleSource || assignment.courseRecordSource || assignment.source || assignment.courseSource));
}

function readCourseSourceValue(value) {
  var source = readText(value);

  if (source === "courses" || source === "catalogCourses") {
    return source;
  }

  return "";
}

function readAssignmentForCourse(courseAssignmentResult, courseId) {
  var assignments = Array.isArray(courseAssignmentResult && courseAssignmentResult.assignments)
    ? courseAssignmentResult.assignments
    : [];
  var assignmentIndex = 0;

  while (assignmentIndex < assignments.length) {
    if (assignmentMatchesCourse(assignments[assignmentIndex], courseId)) {
      return assignments[assignmentIndex];
    }

    assignmentIndex = assignmentIndex + 1;
  }

  return null;
}

function readAssignmentIdForCourse(courseAssignmentResult, courseId) {
  var assignmentIdByCourseId = courseAssignmentResult && courseAssignmentResult.assignmentIdByCourseId
    ? courseAssignmentResult.assignmentIdByCourseId
    : {};
  var assignment = readAssignmentForCourse(courseAssignmentResult, courseId);

  return assignmentIdByCourseId[courseId] || (assignment ? assignment.id || assignment.assignmentId || "" : "");
}

function assignmentMatchesCourse(assignment, courseId) {
  if (!assignment || !courseId) {
    return false;
  }

  return readText(assignment.courseId) === courseId
    || readText(assignment.catalogCourseId) === courseId
    || readText(assignment.canonicalCourseId) === courseId
    || readText(assignment.moduleCourseId) === courseId
    || readText(assignment.sourceCourseId) === courseId
    || readText(assignment.publishedCourseId) === courseId
    || readText(assignment.targetCourseId) === courseId;
}

async function loadAssignedCourseIds(actor, studentProfile, executionState) {
  var contextCourseIds = executionState && executionState.context ? executionState.context.assignedCourseIds : [];
  var profileWithActor = Object.assign({}, studentProfile || {}, {
    __actor: actor || null
  });

  return getAssignedCourseIds(actor && actor.id ? actor.id : "", profileWithActor, contextCourseIds);
}

function buildContinueLearning(courses) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var firstCourse = safeCourses.length > 0 ? safeCourses[0] : null;

  if (!firstCourse) {
    return {
      courseId: "",
      moduleId: "",
      sessionId: "",
      title: "Start your first course",
      courseTitle: "",
      moduleTitle: "",
      progressPercent: 0,
      status: "empty",
      actionLabel: "Start Learning",
      lastOpenedAt: 0
    };
  }

  var progressPercent = readStoredProgressPercent(firstCourse);

  return {
    courseId: firstCourse.id,
    moduleId: "",
    sessionId: "",
    title: progressPercent > 0 ? "Continue Learning" : "Start your first course",
    courseTitle: readLocalizedText(firstCourse.title, "Untitled Course"),
    moduleTitle: "Open course to load activities",
    progressPercent: progressPercent,
    status: progressPercent >= 100 ? "completed" : (progressPercent > 0 ? "inProgress" : "notStarted"),
    actionLabel: progressPercent > 0 ? "Continue" : "Start Learning",
    lastOpenedAt: 0
  };
}

function buildProgressSummary(courses) {
  var safeCourses = Array.isArray(courses) ? courses : [];
  var totalCourses = safeCourses.length;
  var completedCourses = 0;
  var inProgressCourses = 0;
  var overallProgress = 0;
  var courseIndex = 0;

  while (courseIndex < safeCourses.length) {
    var progressPercent = readStoredProgressPercent(safeCourses[courseIndex]);
    overallProgress = overallProgress + progressPercent;

    if (progressPercent >= 100) {
      completedCourses = completedCourses + 1;
    } else if (progressPercent > 0) {
      inProgressCourses = inProgressCourses + 1;
    }

    courseIndex = courseIndex + 1;
  }

  return {
    totalCourses: totalCourses,
    completedCourses: completedCourses,
    inProgressCourses: inProgressCourses,
    overallProgressPercent: totalCourses > 0 ? Math.round(overallProgress / totalCourses) : 0
  };
}

function readIntentionPoints(student) {
  var source = student && typeof student.intentionPoints === "object" ? student.intentionPoints : {};
  var rewards = student && typeof student.rewards === "object" ? student.rewards : {};

  return {
    cognitive: readNumber(source.cognitive, rewards.cognitivePoints),
    physical: readNumber(source.physical, rewards.physicalPoints),
    creative: readNumber(source.creative, rewards.creativePoints),
    social: readNumber(source.social, rewards.socialPoints)
  };
}

function readDailyBonus(student) {
  var dailyBonus = student && typeof student.dailyBonus === "object" ? student.dailyBonus : {};
  var lastClaimedDate = typeof dailyBonus.lastClaimedDate === "string" ? dailyBonus.lastClaimedDate : "";
  var today = new Date().toISOString().slice(0, 10);
  var claimed = lastClaimedDate === today;

  return {
    available: !claimed,
    claimed: claimed,
    lastClaimedDate: lastClaimedDate,
    rewardXp: readNumber(dailyBonus.rewardXp, 10),
    nextAvailableAt: claimed ? today + "T24:00:00.000Z" : "",
    countdownLabel: claimed ? "Available again tomorrow" : "Ready now"
  };
}

function buildStudentDashboardDebugInfo(details) {
  var actor = details.actor || {};
  var studentProfile = details.studentProfile || {};
  var assignmentResult = details.courseAssignmentResult || {};
  var courses = Array.isArray(details.courses) ? details.courses : [];

  return {
    resolvedStudentId: details.resolvedStudentId || "",
    authUid: actor.id || "",
    tokenStudentId: actor.claims && typeof actor.claims.studentId === "string" ? actor.claims.studentId : "",
    profileId: studentProfile.id || "",
    classIdentifiers: readStudentClassIdentifiers(studentProfile, actor),
    studentIdentifiers: readStudentIdentifiers(studentProfile, actor),
    directAssignmentCount: assignmentResult.directCount || 0,
    classAssignmentCount: assignmentResult.classCount || 0,
    locationAssignmentCount: assignmentResult.locationCount || 0,
    mergedAssignmentCount: assignmentResult.mergedCount || assignmentResult.assignmentCount || 0,
    loadedCourseCount: courses.length,
    courseIds: courses.map(function (course) {
      return course && course.id ? course.id : "";
    }).filter(Boolean),
    queryPaths: assignmentResult.queryPaths || [],
    queryErrors: readQueryErrors(assignmentResult),
    rejectionReasons: assignmentResult.rejectionReasons || []
  };
}

function readQueryErrors(assignmentResult) {
  var errors = Array.isArray(assignmentResult && assignmentResult.queryErrors) ? assignmentResult.queryErrors.slice() : [];
  var warnings = Array.isArray(assignmentResult && assignmentResult.warnings) ? assignmentResult.warnings : [];
  var warningIndex = 0;

  while (warningIndex < warnings.length) {
    if (warnings[warningIndex] && warnings[warningIndex].code === "STUDENT_ASSIGNMENT_QUERY_FAILED") {
      errors.push(warnings[warningIndex].message || warnings[warningIndex].code);
    }

    warningIndex = warningIndex + 1;
  }

  return errors;
}

function logStudentDashboardDebug(debugInfo, executionState) {
  if (!shouldEmitDebug(executionState) && !isDevelopmentHost()) {
    return;
  }

  console.info("[student-dashboard:summary-load]", debugInfo);
}

function validateStudentProfileForDashboard(studentProfile) {
  var reason = readStudentProfileRejectReason(studentProfile);

  if (isStudentDashboardProfile(studentProfile)) {
    return { valid: true };
  }

  if (reason === "profile-missing") {
    return createValidationError("STUDENT_PROFILE_MISSING", "Student profile is required.");
  }

  if (reason === "not-student-role") {
    return createValidationError("STUDENT_ROLE_REQUIRED", "Only student accounts can open the student dashboard.");
  }

  if (reason === "inactive-status") {
    return createValidationError("STUDENT_ACCOUNT_INACTIVE", "This student account is not active.");
  }

  if (reason === "missing-class") {
    return createValidationError("STUDENT_CLASS_REQUIRED", "This student profile is missing a class.");
  }

  if (reason === "missing-location") {
    return createValidationError("STUDENT_LOCATION_REQUIRED", "This student profile is missing a location.");
  }

  return createValidationError("STUDENT_PROFILE_INVALID", "Student profile is not valid for the dashboard.");
}

function createResolvedStudentActor(actor, resolvedStudentId) {
  return Object.assign({}, actor || {}, {
    id: resolvedStudentId || (actor && actor.id ? actor.id : "preview-student"),
    role: "ROLE_STUDENT"
  });
}

function createValidationError(code, message) {
  return {
    valid: false,
    errors: [
      {
        code: code,
        message: message
      }
    ]
  };
}

function readStoredCourseModuleCount(data) {
  if (Array.isArray(data.modules) && data.modules.length > 0) {
    return data.modules.length;
  }

  if (Array.isArray(data.moduleIds) && data.moduleIds.length > 0) {
    return data.moduleIds.length;
  }

  if (Array.isArray(data.moduleOrder) && data.moduleOrder.length > 0) {
    return data.moduleOrder.length;
  }

  if (typeof data.moduleCount === "number" && Number.isFinite(data.moduleCount)) {
    return Math.max(0, Math.round(data.moduleCount));
  }

  return 0;
}

function readStoredCourseActivityCount(data) {
  if (typeof data.activityCount === "number" && Number.isFinite(data.activityCount)) {
    return Math.max(0, Math.round(data.activityCount));
  }

  if (typeof data.stepCount === "number" && Number.isFinite(data.stepCount)) {
    return Math.max(0, Math.round(data.stepCount));
  }

  return 0;
}

function isStudentVisibleModuleSummary(data) {
  var status = readText(data && data.status).toLowerCase();

  if (!data || typeof data !== "object") {
    return false;
  }

  return !status
    || status === "published"
    || status === "active"
    || status === "ready"
    || status === "assigned";
}

function isStudentVisibleCourseSummary(data) {
  var status = readText(data && (data.status || data.state)).toLowerCase();

  if (!data || typeof data !== "object") {
    return false;
  }

  if (data.isPublished === true || data.published === true) {
    return true;
  }

  return status === "published" || status === "active" || status === "ready" || status === "assigned";
}

function readStoredProgressPercent(course) {
  var progress = course && typeof course.progress === "object" ? course.progress : {};

  return clampPercent(
    readNumber(
      course ? course.progressPercent : 0,
      readNumber(course ? course.completionPercent : 0, readNumber(course ? course.percentComplete : 0, progress.percent))
    )
  );
}

function readNumber(primaryValue, fallbackValue) {
  if (typeof primaryValue === "number" && Number.isFinite(primaryValue)) {
    return Math.max(0, Math.round(primaryValue));
  }

  if (typeof fallbackValue === "number" && Number.isFinite(fallbackValue)) {
    return Math.max(0, Math.round(fallbackValue));
  }

  return 0;
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, readNumber(value, 0)));
}

function compareByOrderThenTitle(left, right) {
  var leftOrder = typeof left.order === "number" ? left.order : 0;
  var rightOrder = typeof right.order === "number" ? right.order : 0;

  if (leftOrder !== rightOrder) {
    return leftOrder - rightOrder;
  }

  return readLocalizedText(left.title, "").localeCompare(readLocalizedText(right.title, ""));
}

function dedupeTextList(values) {
  var source = Array.isArray(values) ? values : [];
  var output = [];
  var index = 0;

  while (index < source.length) {
    if (typeof source[index] === "string" && source[index].length > 0 && output.indexOf(source[index]) === -1) {
      output.push(source[index]);
    }

    index = index + 1;
  }

  return output;
}

function appendWarnings(executionState, warnings) {
  var warningIndex = 0;

  ensureWarnings(executionState);

  while (warningIndex < warnings.length) {
    executionState.warnings.push(warnings[warningIndex]);
    warningIndex = warningIndex + 1;
  }
}

function ensureWarnings(executionState) {
  if (!Array.isArray(executionState.warnings)) {
    executionState.warnings = [];
  }
}

function isPreviewActor(actor) {
  return actor && actor.id === "preview-student";
}

function shouldEmitDebug(executionState) {
  return Boolean(executionState && executionState.payload && executionState.payload.debug === true);
}

function isDevelopmentHost() {
  return typeof window !== "undefined"
    && window.location
    && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "");
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  return error.code ? error.code + " " + error.message : error.message || String(error);
}

function readLocalizedText(value, fallbackValue) {
  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (value && typeof value.en === "string" && value.en.length > 0) {
    return value.en;
  }

  return fallbackValue;
}

function readText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function createStudentDashboardTiming(label, executionState) {
  var startedAt = Date.now();
  var previousAt = startedAt;
  var marks = [];

  return {
    mark: function (name) {
      var now = Date.now();
      marks.push({
        name: name,
        elapsedMs: now - startedAt,
        stepMs: now - previousAt
      });
      previousAt = now;
    },
    finish: function (details) {
      if (!shouldLogTiming(executionState)) {
        return;
      }

      console.info("[student-dashboard:timing]", Object.assign({
        label: label,
        totalMs: Date.now() - startedAt,
        marks: marks
      }, details || {}));
    }
  };
}

function shouldLogTiming(executionState) {
  return shouldEmitDebug(executionState) || isDevelopmentHost();
}

function waitForStudentDashboardRead(promise, label) {
  var timeoutMs = 12000;

  return new Promise(function (resolve, reject) {
    var settled = false;
    var timer = setTimeout(function () {
      if (settled) {
        return;
      }

      settled = true;
      reject(new Error(label + " timed out."));
    }, timeoutMs);

    Promise.resolve(promise).then(function (value) {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timer);
      resolve(value);
    }).catch(function (error) {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timer);
      reject(error);
    });
  });
}
