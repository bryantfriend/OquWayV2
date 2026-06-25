import { getEmotionalCheckInOption, normalizeEmotionKey } from "./options.js?v=1.1.213-emotional-checkin-owner";

export function buildEmotionalCheckInContext(userContext, programContext) {
  var user = userContext && typeof userContext === "object" ? userContext : {};
  var program = programContext && typeof programContext === "object" ? programContext : {};
  var timezone = readText(program.timezone || user.timezone) || readBrowserTimezone();
  var localParts = createLocalDateTimeParts(timezone);
  var context = {
    participantUserId: readText(user.participantUserId || user.authUid || user.uid || user.id),
    participantProfileId: readText(user.participantProfileId || user.profileId || user.studentId || user.teacherId || user.adminId || user.id),
    participantRole: readText(user.participantRole || user.role || "participant"),
    schoolId: readText(program.schoolId || user.schoolId || program.locationId || user.locationId),
    locationId: readText(program.locationId || user.locationId || user.primaryLocationId),
    programId: readText(program.programId),
    programType: readText(program.programType),
    programName: readText(program.programName),
    classId: readNullableText(program.classId || user.classId || user.primaryClassId),
    className: readNullableText(program.className || user.className),
    courseId: readNullableText(program.courseId),
    courseName: readNullableText(program.courseName),
    moduleId: readNullableText(program.moduleId),
    moduleName: readNullableText(program.moduleName),
    classSessionId: readNullableText(program.classSessionId),
    programSessionId: readNullableText(program.programSessionId),
    scheduledLessonId: readNullableText(program.scheduledLessonId),
    courseSessionId: readNullableText(program.courseSessionId),
    contextScope: readText(program.contextScope || "program-entry"),
    timezone: timezone,
    localDate: localParts.localDate,
    localTime: localParts.localTime,
    checkInSource: readText(program.checkInSource || program.source || "student_panel")
  };

  context.contextId = buildEmotionalCheckInContextId(context);
  context.contextTimeFallbackUsed = timezone === readBrowserTimezone() && !readText(program.timezone || user.timezone);
  return context;
}

export function buildEmotionalCheckInContextId(checkInContext) {
  var context = checkInContext && typeof checkInContext === "object" ? checkInContext : {};
  var classId = readText(context.classId);
  var courseId = readText(context.courseId);
  var programId = readText(context.programId);
  var localDate = readText(context.localDate);

  if (readText(context.classSessionId)) return readText(context.classSessionId);
  if (readText(context.scheduledLessonId)) return readText(context.scheduledLessonId);
  if (readText(context.programSessionId)) return readText(context.programSessionId);
  if (readText(context.courseSessionId)) return readText(context.courseSessionId);
  if (classId && courseId && localDate) return classId + "_" + courseId + "_" + localDate;
  if (programId && localDate) return programId + "_" + localDate;
  return "program-entry_" + localDate;
}

export function buildEmotionalCheckInDocumentId(checkInContext) {
  var context = checkInContext && typeof checkInContext === "object" ? checkInContext : {};
  return [
    readText(context.locationId || context.schoolId || "global"),
    readText(context.contextId || buildEmotionalCheckInContextId(context)),
    readText(context.participantUserId)
  ].map(createSafeIdSegment).join("_");
}

export function buildEmotionalCheckInRecord(checkInContext, selectedEmotionKey) {
  var context = normalizeCheckInContext(checkInContext);
  var option = getEmotionalCheckInOption(selectedEmotionKey || context.emotionKey);

  if (!option) {
    throw new Error("Unknown emotional check-in option.");
  }

  return Object.assign({}, context, {
    emotionKey: normalizeEmotionKey(option.key),
    emotionLabel: option.label,
    emoji: option.emoji,
    moodKey: normalizeEmotionKey(option.key),
    moodLabel: option.label,
    moodCategory: option.category,
    moodCategoryLabel: option.categoryLabel,
    moodValue: option.moodValue,
    studentId: context.participantProfileId || context.participantUserId,
    checkInDate: context.localDate,
    source: readText(context.checkInSource || "student_panel"),
    version: "1.1.0"
  });
}

export function normalizeCheckInContext(checkInContext) {
  var context = checkInContext && typeof checkInContext === "object" ? checkInContext : {};
  var timezone = readText(context.timezone) || readBrowserTimezone();
  var localParts = {
    localDate: readText(context.localDate),
    localTime: readText(context.localTime)
  };

  if (!localParts.localDate || !localParts.localTime) {
    localParts = createLocalDateTimeParts(timezone);
  }

  var normalized = {
    participantUserId: readText(context.participantUserId),
    participantProfileId: readText(context.participantProfileId),
    participantRole: readText(context.participantRole),
    schoolId: readText(context.schoolId),
    locationId: readText(context.locationId),
    programId: readText(context.programId),
    programType: readText(context.programType),
    programName: readText(context.programName),
    classId: readNullableText(context.classId),
    className: readNullableText(context.className),
    courseId: readNullableText(context.courseId),
    courseName: readNullableText(context.courseName),
    moduleId: readNullableText(context.moduleId),
    moduleName: readNullableText(context.moduleName),
    classSessionId: readNullableText(context.classSessionId),
    programSessionId: readNullableText(context.programSessionId),
    scheduledLessonId: readNullableText(context.scheduledLessonId),
    courseSessionId: readNullableText(context.courseSessionId),
    contextScope: readText(context.contextScope),
    contextId: readText(context.contextId),
    localDate: localParts.localDate,
    localTime: localParts.localTime,
    timezone: timezone,
    checkInSource: readText(context.checkInSource || context.source || "student_panel"),
    contextTimeFallbackUsed: context.contextTimeFallbackUsed === true
  };

  normalized.contextId = normalized.contextId || buildEmotionalCheckInContextId(normalized);
  return normalized;
}

export function createLocalDateTimeParts(timezone) {
  var date = new Date();
  var safeTimezone = readText(timezone) || readBrowserTimezone();
  var formatter = null;
  var parts = null;

  try {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: safeTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    parts = readDateParts(formatter.formatToParts(date));
  } catch (error) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    parts = readDateParts(formatter.formatToParts(date));
  }

  return {
    localDate: parts.year + "-" + parts.month + "-" + parts.day,
    localTime: parts.hour + ":" + parts.minute + ":" + parts.second
  };
}

export function readBrowserTimezone() {
  if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  }

  return "UTC";
}

function readDateParts(parts) {
  var result = {};
  var index = 0;

  while (index < parts.length) {
    result[parts[index].type] = parts[index].value;
    index += 1;
  }

  return {
    year: result.year || "1970",
    month: result.month || "01",
    day: result.day || "01",
    hour: result.hour === "24" ? "00" : (result.hour || "00"),
    minute: result.minute || "00",
    second: result.second || "00"
  };
}

function createSafeIdSegment(value) {
  return readText(value).replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-|-$/g, "") || "missing";
}

function readNullableText(value) {
  var text = readText(value);
  return text.length > 0 ? text : null;
}

function readText(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}
