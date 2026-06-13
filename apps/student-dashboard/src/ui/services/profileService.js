const PROFILE_STORAGE_PREFIX = "oquwayStudentProfilePrefs:";
// TODO: Replace local preference storage with a student profile preference intent when profile writes are ready.

export const STUDENT_PROFILE_AVATARS = [
  { id: "sunrise", label: "Sunrise", tone: "blue", initials: "SR" },
  { id: "forest", label: "Forest", tone: "green", initials: "FR" },
  { id: "spark", label: "Spark", tone: "amber", initials: "SP" },
  { id: "ocean", label: "Ocean", tone: "cyan", initials: "OC" },
  { id: "orchid", label: "Orchid", tone: "purple", initials: "OR" },
  { id: "coral", label: "Coral", tone: "coral", initials: "CO" },
  { id: "mint", label: "Mint", tone: "mint", initials: "MT" },
  { id: "sky", label: "Sky", tone: "sky", initials: "SK" },
  { id: "gold", label: "Gold", tone: "gold", initials: "GD" },
  { id: "berry", label: "Berry", tone: "berry", initials: "BY" },
  { id: "river", label: "River", tone: "river", initials: "RV" },
  { id: "clover", label: "Clover", tone: "clover", initials: "CL" },
  { id: "ember", label: "Ember", tone: "ember", initials: "EM" },
  { id: "stone", label: "Stone", tone: "stone", initials: "ST" },
  { id: "violet", label: "Violet", tone: "violet", initials: "VT" },
  { id: "leaf", label: "Leaf", tone: "leaf", initials: "LF" },
  { id: "wave", label: "Wave", tone: "wave", initials: "WV" },
  { id: "trail", label: "Trail", tone: "trail", initials: "TR" },
  { id: "north", label: "North", tone: "north", initials: "NR" },
  { id: "pixel", label: "Pixel", tone: "pixel", initials: "PX" },
  { id: "beam", label: "Beam", tone: "beam", initials: "BM" },
  { id: "quest", label: "Quest", tone: "quest", initials: "QS" },
  { id: "bloom", label: "Bloom", tone: "bloom", initials: "BL" },
  { id: "nova", label: "Nova", tone: "nova", initials: "NV" }
];

const PROFILE_TITLES = [
  { id: "learner", label: "Learner", description: "Keep showing up and building skills.", achievementId: "" },
  { id: "explorer", label: "Explorer", description: "Complete your first activity.", achievementId: "first-activity" },
  { id: "scholar", label: "Scholar", description: "Complete 5 activities.", achievementId: "5-activities" },
  { id: "master-solver", label: "Master Solver", description: "Earn your first mastery.", achievementId: "first-mastery" },
  { id: "ict-expert", label: "ICT Expert", description: "Master an ICT learning area.", achievementId: "ict-mastery" }
];

const ACHIEVEMENTS = [
  { id: "first-activity", category: "Learning", name: "First Activity", description: "Complete your first activity.", threshold: 1, metric: "activitiesCompleted" },
  { id: "first-perfect-score", category: "Mastery", name: "First Perfect Score", description: "Finish an activity with a perfect score.", threshold: 1, metric: "perfectActivities" },
  { id: "5-activities", category: "Learning", name: "5 Activities Completed", description: "Complete 5 learning activities.", threshold: 5, metric: "activitiesCompleted" },
  { id: "10-activities", category: "Learning", name: "10 Activities Completed", description: "Complete 10 learning activities.", threshold: 10, metric: "activitiesCompleted" },
  { id: "25-activities", category: "Participation", name: "25 Activities Completed", description: "Complete 25 learning activities.", threshold: 25, metric: "activitiesCompleted" },
  { id: "first-mastery", category: "Mastery", name: "First Mastery", description: "Earn 3 stars or 90%+ on one activity.", threshold: 1, metric: "masteries" },
  { id: "5-masteries", category: "Mastery", name: "5 Masteries", description: "Reach mastery on 5 activities.", threshold: 5, metric: "masteries" },
  { id: "10-masteries", category: "Mastery", name: "10 Masteries", description: "Reach mastery on 10 activities.", threshold: 10, metric: "masteries" },
  { id: "7-day-streak", category: "Consistency", name: "7 Day Streak", description: "Build a 7 day learning streak.", threshold: 7, metric: "longestStreak" },
  { id: "30-day-streak", category: "Consistency", name: "30 Day Streak", description: "Build a 30 day learning streak.", threshold: 30, metric: "longestStreak" },
  { id: "course-explorer", category: "Exploration", name: "Course Explorer", description: "Start learning in more than one course.", threshold: 2, metric: "coursesStarted" },
  { id: "ict-mastery", category: "Mastery", name: "ICT Mastery", description: "Master ICT activities.", threshold: 1, metric: "ictMasteries" }
];

export function createStudentProfileSnapshot(input) {
  var safeInput = input || {};
  var student = safeInput.student && typeof safeInput.student === "object" ? safeInput.student : {};
  var courses = Array.isArray(safeInput.courses) ? safeInput.courses : [];
  var progressSummary = safeInput.progressSummary && typeof safeInput.progressSummary === "object" ? safeInput.progressSummary : {};
  var preferences = readStudentProfilePreferences(student);
  var journey = buildLearningJourney(courses);
  var activities = buildActivityHistory(courses);
  var metrics = buildMetrics(student, progressSummary, journey, activities);
  var achievements = buildAchievementState(student, metrics);
  var titles = buildTitleState(preferences.activeTitleId, achievements);
  var activeTitle = titles.find(function (title) { return title.id === preferences.activeTitleId && title.unlocked; }) || titles[0];
  titles = titles.map(function (title) {
    return Object.assign({}, title, {
      active: title.id === activeTitle.id
    });
  });

  if (!preferences.avatarId) {
    preferences.avatarId = readText(student.avatarId) || STUDENT_PROFILE_AVATARS[0].id;
  }

  return {
    student: student,
    preferences: preferences,
    avatar: readAvatarById(preferences.avatarId),
    activeTitle: activeTitle,
    titles: titles,
    metrics: metrics,
    level: calculateLevelProgress(metrics.xpEarned),
    achievements: achievements,
    journey: journey,
    skills: buildSkillMastery(courses, activities),
    activities: activities
  };
}

export function calculateLevelProgress(xp) {
  var currentXp = Math.max(0, Math.round(Number(xp) || 0));
  var level = 1;
  var nextThreshold = readLevelThreshold(level + 1);

  while (currentXp >= nextThreshold && level < 100) {
    level = level + 1;
    nextThreshold = readLevelThreshold(level + 1);
  }

  var currentThreshold = readLevelThreshold(level);
  var neededRange = Math.max(1, nextThreshold - currentThreshold);
  var earnedInLevel = Math.max(0, currentXp - currentThreshold);

  return {
    level: level,
    currentXp: currentXp,
    nextLevel: level + 1,
    nextLevelXp: nextThreshold,
    xpToNextLevel: Math.max(0, nextThreshold - currentXp),
    progressPercent: clampPercent(Math.round((earnedInLevel / neededRange) * 100))
  };
}

export function readStudentProfilePreferences(student) {
  var studentId = readStudentId(student);
  var stored = readStoredPreferences(studentId);
  var avatarId = readText(stored.avatarId) || readText(student && student.avatarId) || "";
  var activeTitleId = readText(stored.activeTitleId) || readText(student && student.activeTitleId) || "learner";

  return {
    avatarId: readAvatarById(avatarId).id,
    activeTitleId: activeTitleId
  };
}

export function saveStudentProfilePreferences(student, preferences) {
  var studentId = readStudentId(student);
  var safePreferences = preferences && typeof preferences === "object" ? preferences : {};

  if (!studentId || !canUseLocalStorage()) {
    return false;
  }

  window.localStorage.setItem(PROFILE_STORAGE_PREFIX + studentId, JSON.stringify({
    avatarId: readAvatarById(safePreferences.avatarId).id,
    activeTitleId: readText(safePreferences.activeTitleId) || "learner",
    savedAt: Date.now()
  }));

  return true;
}

export function readAvatarById(avatarId) {
  var id = readText(avatarId);
  var index = 0;

  while (index < STUDENT_PROFILE_AVATARS.length) {
    if (STUDENT_PROFILE_AVATARS[index].id === id) {
      return STUDENT_PROFILE_AVATARS[index];
    }

    index = index + 1;
  }

  return STUDENT_PROFILE_AVATARS[0];
}

function buildMetrics(student, progressSummary, journey, activities) {
  var completedModules = sum(journey.courses.map(function (course) { return course.completedModules; }));
  var coursesStarted = journey.courses.filter(function (course) { return course.progressPercent > 0; }).length;
  var coursesCompleted = journey.courses.filter(function (course) { return course.progressPercent >= 100; }).length;
  var activitiesCompleted = activities.filter(function (activity) { return activity.completed; }).length;
  var xpEarned = readNumberByKeys(student, ["xpEarned", "totalXp", "xp"], null);
  var starsEarned = readNumberByKeys(student, ["starsEarned", "totalStars", "stars"], null);
  var perfectActivities = activities.filter(function (activity) { return activity.accuracy >= 100; }).length;
  var masteries = activities.filter(function (activity) { return activity.mastered; }).length;
  var currentStreak = readNumberByKeys(student, ["currentStreak", "streak"], 0);
  var longestStreak = Math.max(currentStreak, readNumberByKeys(student, ["longestStreak", "bestStreak"], 0));

  if (xpEarned == null) {
    xpEarned = sum(activities.map(function (activity) { return activity.xpEarned; }));
  }

  if (starsEarned == null) {
    starsEarned = sum(activities.map(function (activity) { return activity.starsEarned; }));
  }

  return {
    xpEarned: Math.max(0, Math.round(xpEarned || 0)),
    starsEarned: Math.max(0, Math.round(starsEarned || 0)),
    activitiesCompleted: activitiesCompleted,
    modulesCompleted: completedModules,
    achievementsEarned: 0,
    currentStreak: Math.max(0, Math.round(currentStreak || 0)),
    longestStreak: Math.max(0, Math.round(longestStreak || 0)),
    coursesStarted: coursesStarted,
    coursesCompleted: Math.max(coursesCompleted, Math.round(progressSummary.completedCourses || 0)),
    perfectActivities: perfectActivities,
    masteries: masteries,
    ictMasteries: countSkillMasteries(activities, "ict")
  };
}

function buildAchievementState(student, metrics) {
  var earnedIds = readEarnedAchievementIds(student);
  var achievements = ACHIEVEMENTS.map(function (achievement) {
    var metricValue = Number(metrics[achievement.metric]) || 0;
    var earned = earnedIds.indexOf(achievement.id) !== -1 || metricValue >= achievement.threshold;

    return Object.assign({}, achievement, {
      earned: earned,
      progress: Math.min(metricValue, achievement.threshold),
      progressPercent: clampPercent(Math.round((metricValue / achievement.threshold) * 100)),
      dateEarned: earned ? readAchievementDate(student, achievement.id) : ""
    });
  });

  metrics.achievementsEarned = achievements.filter(function (achievement) { return achievement.earned; }).length;
  return achievements;
}

function buildTitleState(activeTitleId, achievements) {
  return PROFILE_TITLES.map(function (title) {
    var unlocked = !title.achievementId || achievements.some(function (achievement) {
      return achievement.id === title.achievementId && achievement.earned;
    });

    return Object.assign({}, title, {
      active: title.id === activeTitleId,
      unlocked: unlocked
    });
  });
}

function buildLearningJourney(courses) {
  return {
    courses: courses.map(function (course) {
      var modules = Array.isArray(course.modules) ? course.modules : [];
      var totalSteps = countCourseSteps(course);
      var completedSteps = countCourseCompletedSteps(course);

      return {
        id: readText(course.id),
        title: readLocalizedText(course.title, "Untitled Course"),
        progressPercent: calculatePercent(completedSteps, totalSteps),
        completedModules: modules.filter(function (module) { return countModuleSteps(module) > 0 && countModuleCompletedSteps(module) >= countModuleSteps(module); }).length,
        totalModules: modules.length,
        completedSteps: completedSteps,
        totalSteps: totalSteps,
        modules: modules.map(function (module) {
          var moduleTotalSteps = countModuleSteps(module);
          var moduleCompletedSteps = countModuleCompletedSteps(module);
          var progressPercent = calculatePercent(moduleCompletedSteps, moduleTotalSteps);

          return {
            id: readText(module.id),
            title: readLocalizedText(module.title, "Module"),
            progressPercent: progressPercent,
            completedSteps: moduleCompletedSteps,
            totalSteps: moduleTotalSteps,
            status: readJourneyStatus(progressPercent, moduleCompletedSteps, moduleTotalSteps),
            mastered: progressPercent >= 90 && moduleTotalSteps > 0
          };
        })
      };
    })
  };
}

function buildActivityHistory(courses) {
  var activities = [];

  courses.forEach(function (course) {
    var modules = Array.isArray(course.modules) ? course.modules : [];

    modules.forEach(function (module) {
      var sessions = Array.isArray(module.sessions) ? module.sessions : [];

      sessions.forEach(function (session) {
        var practiceModes = normalizePracticeModes(session.practiceModes);
        Object.keys(practiceModes).forEach(function (practiceModeKey) {
          var mode = practiceModes[practiceModeKey];
          var steps = Array.isArray(mode.steps) ? mode.steps : [];
          var progress = readPracticeModeProgress(session.progress, practiceModeKey);
          var completedCount = countCompletedSteps(steps, progress.completedStepIds);
          var totalSteps = steps.length;
          var accuracy = readPracticeModeAccuracy(progress, completedCount, totalSteps);
          var completed = progress.completed === true || (totalSteps > 0 && completedCount >= totalSteps);
          var starsEarned = readPracticeModeStars(progress, accuracy, completed);
          var xpEarned = readPracticeModeXp(progress, completedCount, completed);

          if (totalSteps > 0 || completedCount > 0 || completed) {
            activities.push({
              id: [course.id, module.id, session.id, practiceModeKey].join(":"),
              activity: readLocalizedText(mode.title, "Practice Mode"),
              courseTitle: readLocalizedText(course.title, "Course"),
              moduleTitle: readLocalizedText(module.title, "Module"),
              date: readActivityDate(progress),
              score: accuracy,
              accuracy: accuracy,
              starsEarned: starsEarned,
              xpEarned: xpEarned,
              completed: completed,
              mastered: completed && (accuracy >= 90 || starsEarned >= 3),
              skill: readActivitySkill(course, module, mode),
              status: completed ? "Completed" : (completedCount > 0 ? "In Progress" : "Not Started")
            });
          }
        });
      });
    });
  });

  activities.sort(function (left, right) {
    return readDateMs(right.date) - readDateMs(left.date);
  });

  return activities;
}

function buildSkillMastery(courses, activities) {
  var skills = {};

  courses.forEach(function (course) {
    var courseSkill = readSkillName(course);
    ensureSkill(skills, courseSkill).courseCount += 1;
  });

  activities.forEach(function (activity) {
    var skill = ensureSkill(skills, activity.skill || "General");
    skill.total += 1;
    if (activity.completed) {
      skill.completed += 1;
    }
    if (activity.status === "In Progress") {
      skill.inProgress += 1;
    }
    if (activity.mastered) {
      skill.mastered += 1;
    }
  });

  return Object.keys(skills).map(function (skillName) {
    var skill = skills[skillName];
    return Object.assign({}, skill, {
      progressPercent: calculatePercent(skill.completed, Math.max(1, skill.total))
    });
  }).sort(function (left, right) {
    return right.progressPercent - left.progressPercent || left.name.localeCompare(right.name);
  });
}

function ensureSkill(skills, skillName) {
  var name = readText(skillName) || "General";

  if (!skills[name]) {
    skills[name] = {
      name: name,
      mastered: 0,
      completed: 0,
      inProgress: 0,
      total: 0,
      courseCount: 0
    };
  }

  return skills[name];
}

function readLevelThreshold(level) {
  if (level <= 1) {
    return 0;
  }

  return Math.round(50 * level * level - 50 * level + 100);
}

function readStoredPreferences(studentId) {
  if (!studentId || !canUseLocalStorage()) {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_PREFIX + studentId) || "{}") || {};
  } catch (error) {
    return {};
  }
}

function canUseLocalStorage() {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch (error) {
    return false;
  }
}

function readEarnedAchievementIds(student) {
  var achievements = student && Array.isArray(student.achievements) ? student.achievements : [];

  return achievements.map(function (achievement) {
    return typeof achievement === "string" ? achievement : readText(achievement && (achievement.id || achievement.name));
  }).filter(Boolean);
}

function readAchievementDate(student, achievementId) {
  var achievements = student && Array.isArray(student.achievements) ? student.achievements : [];
  var index = 0;

  while (index < achievements.length) {
    if (typeof achievements[index] === "object" && readText(achievements[index].id || achievements[index].name) === achievementId) {
      return achievements[index].earnedAt || achievements[index].dateEarned || achievements[index].createdAt || "";
    }

    index = index + 1;
  }

  return "";
}

function normalizePracticeModes(practiceModes) {
  var source = practiceModes && typeof practiceModes === "object" && !Array.isArray(practiceModes) ? practiceModes : {};

  return {
    beforeClass: normalizePracticeMode(source.beforeClass, "Before Class"),
    classroomLesson: normalizePracticeMode(source.classroomLesson, "Classroom Lesson"),
    afterClass: normalizePracticeMode(source.afterClass, "After Class"),
    dailyPractice: normalizePracticeMode(source.dailyPractice, "Daily Practice")
  };
}

function normalizePracticeMode(mode, fallbackTitle) {
  var safeMode = mode && typeof mode === "object" ? mode : {};

  return {
    title: safeMode.title || fallbackTitle,
    steps: Array.isArray(safeMode.steps) ? safeMode.steps : [],
    skill: safeMode.skill || safeMode.subject || ""
  };
}

function readPracticeModeProgress(progress, practiceModeKey) {
  var modes = progress && progress.practiceModes && typeof progress.practiceModes === "object" ? progress.practiceModes : {};
  var modeProgress = modes[practiceModeKey] && typeof modes[practiceModeKey] === "object" ? modes[practiceModeKey] : {};

  return {
    completedStepIds: Array.isArray(modeProgress.completedStepIds) ? modeProgress.completedStepIds : [],
    completionResults: modeProgress.completionResults && typeof modeProgress.completionResults === "object" ? modeProgress.completionResults : {},
    completed: modeProgress.completed === true,
    updatedAt: modeProgress.updatedAt || progress && progress.updatedAt || ""
  };
}

function readPracticeModeAccuracy(progress, completedCount, totalSteps) {
  var results = Object.keys(progress.completionResults || {}).map(function (key) { return progress.completionResults[key]; });
  var knownScores = results.map(readResultAccuracy).filter(function (value) { return value != null; });

  if (knownScores.length > 0) {
    return Math.round(sum(knownScores) / knownScores.length);
  }

  return calculatePercent(completedCount, totalSteps);
}

function readResultAccuracy(result) {
  if (!result || typeof result !== "object") {
    return null;
  }

  if (typeof result.accuracy === "number") {
    return clampPercent(Math.round(result.accuracy));
  }

  if (typeof result.score === "number" && typeof result.total === "number" && result.total > 0) {
    return clampPercent(Math.round((result.score / result.total) * 100));
  }

  if (typeof result.correctAnswers === "number" && typeof result.totalAnswers === "number" && result.totalAnswers > 0) {
    return clampPercent(Math.round((result.correctAnswers / result.totalAnswers) * 100));
  }

  return null;
}

function readPracticeModeStars(progress, accuracy, completed) {
  var stars = readNestedNumber(progress, "starsEarned");

  if (stars == null) {
    stars = readNestedNumber(progress, "stars");
  }

  if (stars != null) {
    return Math.max(0, Math.round(stars));
  }

  if (!completed) {
    return 0;
  }

  if (accuracy >= 90) {
    return 3;
  }

  if (accuracy >= 70) {
    return 2;
  }

  if (accuracy >= 50) {
    return 1;
  }

  return 0;
}

function readPracticeModeXp(progress, completedCount, completed) {
  var xp = readNestedNumber(progress, "xpEarned");

  if (xp == null) {
    xp = readNestedNumber(progress, "xp");
  }

  if (xp != null) {
    return Math.max(0, Math.round(xp));
  }

  return Math.max(0, completedCount * 5 + (completed ? 25 : 0));
}

function readNestedNumber(source, key) {
  if (source && typeof source[key] === "number") {
    return source[key];
  }

  if (source && source.gamification && typeof source.gamification[key] === "number") {
    return source.gamification[key];
  }

  return null;
}

function readActivityDate(progress) {
  return progress.updatedAt || "";
}

function readActivitySkill(course, module, mode) {
  return readText(mode && mode.skill) || readSkillName(module) || readSkillName(course) || "General";
}

function readSkillName(source) {
  var raw = readText(source && (source.skill || source.subject || source.category || source.domain || source.learningArea));

  if (raw) {
    return raw;
  }

  var tags = source && Array.isArray(source.tags) ? source.tags : [];
  if (tags.length > 0) {
    return readText(tags[0]) || "General";
  }

  return "General";
}

function countSkillMasteries(activities, skillName) {
  var normalized = skillName.toLowerCase();
  return activities.filter(function (activity) {
    return activity.mastered && String(activity.skill || "").toLowerCase().indexOf(normalized) !== -1;
  }).length;
}

function countCourseSteps(course) {
  return sum((Array.isArray(course.modules) ? course.modules : []).map(countModuleSteps));
}

function countCourseCompletedSteps(course) {
  return sum((Array.isArray(course.modules) ? course.modules : []).map(countModuleCompletedSteps));
}

function countModuleSteps(module) {
  return sum((Array.isArray(module.sessions) ? module.sessions : []).map(countSessionSteps));
}

function countModuleCompletedSteps(module) {
  return sum((Array.isArray(module.sessions) ? module.sessions : []).map(countSessionCompletedSteps));
}

function countSessionSteps(session) {
  var modes = normalizePracticeModes(session.practiceModes);
  return sum(Object.keys(modes).map(function (key) { return modes[key].steps.length; }));
}

function countSessionCompletedSteps(session) {
  var modes = normalizePracticeModes(session.practiceModes);
  return sum(Object.keys(modes).map(function (key) {
    var progress = readPracticeModeProgress(session.progress, key);
    return countCompletedSteps(modes[key].steps, progress.completedStepIds);
  }));
}

function countCompletedSteps(steps, completedStepIds) {
  var safeStepIds = Array.isArray(completedStepIds) ? completedStepIds : [];
  return (Array.isArray(steps) ? steps : []).filter(function (step) {
    return safeStepIds.indexOf(readText(step && step.id)) !== -1 || step && step.completed === true;
  }).length;
}

function readJourneyStatus(progressPercent, completedSteps, totalSteps) {
  if (totalSteps <= 0) {
    return "locked";
  }

  if (progressPercent >= 100) {
    return "completed";
  }

  if (completedSteps > 0) {
    return "inProgress";
  }

  return "available";
}

function readStudentId(student) {
  return readText(student && (student.id || student.studentId || student.uid || student.authUid)) || "preview-student";
}

function readNumberByKeys(source, keys, fallbackValue) {
  var index = 0;

  while (index < keys.length) {
    if (source && typeof source[keys[index]] === "number") {
      return source[keys[index]];
    }

    index = index + 1;
  }

  return fallbackValue;
}

function readLocalizedText(value, fallbackText) {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (value && typeof value === "object" && !Array.isArray(value)) {
    return readText(value.en) || readText(value.ru) || readText(value.ky) || fallbackText;
  }

  return fallbackText;
}

function calculatePercent(completedCount, totalCount) {
  if (totalCount <= 0) {
    return 0;
  }

  return clampPercent(Math.round((completedCount / totalCount) * 100));
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

function sum(values) {
  return values.reduce(function (total, value) {
    return total + (Number(value) || 0);
  }, 0);
}

function readDateMs(value) {
  if (!value) {
    return 0;
  }

  if (typeof value === "number") {
    return value;
  }

  if (value && typeof value.toMillis === "function") {
    return value.toMillis();
  }

  if (value && typeof value.seconds === "number") {
    return value.seconds * 1000;
  }

  var parsed = Date.parse(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function readText(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}
