var analyticsCache = {
  key: "",
  snapshot: null
};

export function createTeacherAnalyticsSnapshot(input) {
  var safeInput = input && typeof input === "object" ? input : {};
  var cacheKey = createAnalyticsCacheKey(safeInput);

  if (analyticsCache.key === cacheKey && analyticsCache.snapshot) {
    return analyticsCache.snapshot;
  }

  var students = uniqueRecords(safeInput.students || []);
  var courses = uniqueRecords(safeInput.courses || []);
  var submissions = uniqueRecords(safeInput.submissions || []);
  var studentRows = students.map(function (student) {
    return createStudentAnalyticsRow(student, submissions, courses);
  });
  var activityRows = createActivityRows(submissions, courses);
  var mood = createMoodAnalytics(students);
  var mastery = createMasteryAnalytics(studentRows, courses);
  var engagement = createEngagementAnalytics(studentRows);
  var overview = createOverviewAnalytics(studentRows, activityRows, mood, mastery, engagement, submissions);
  var snapshot = {
    overview: overview,
    students: studentRows,
    activities: activityRows,
    mood: mood,
    mastery: mastery,
    engagement: engagement,
    trends: createTrendAnalytics(students, submissions),
    insights: createInsights(overview, studentRows, activityRows, mood, engagement),
    generatedAt: Date.now()
  };

  analyticsCache = {
    key: cacheKey,
    snapshot: snapshot
  };

  return snapshot;
}

export function sortStudentAnalyticsRows(students, sortKey) {
  var rows = (students || []).slice();
  var key = sortKey || "highestXp";

  return rows.sort(function (left, right) {
    if (key === "lowestXp") return left.xpEarned - right.xpEarned;
    if (key === "highestCompletion") return right.completionPercent - left.completionPercent;
    if (key === "lowestCompletion") return left.completionPercent - right.completionPercent;
    if (key === "mostActive") return right.lastActiveMillis - left.lastActiveMillis;
    if (key === "leastActive") return left.lastActiveMillis - right.lastActiveMillis;
    return right.xpEarned - left.xpEarned;
  });
}

export function createStudentAnalyticsDetail(studentId, snapshot) {
  var safeSnapshot = snapshot || {};
  var student = (safeSnapshot.students || []).find(function (row) {
    return row.studentId === studentId;
  }) || null;

  if (!student) {
    return null;
  }

  return {
    student: student,
    completionTrend: createSingleStudentTrend(student, "completion"),
    moodTrend: student.moodHistory,
    accuracyTrend: createSingleStudentTrend(student, "accuracy"),
    recentActivities: student.recentActivities,
    observations: createStudentObservations(student)
  };
}

function createOverviewAnalytics(students, activities, mood, mastery, engagement, submissions) {
  var completionValues = students.map(function (student) { return student.completionPercent; });
  var accuracyValues = students.map(function (student) { return student.accuracyPercent; });
  var xpValues = students.map(function (student) { return student.xpEarned; });
  var starValues = students.map(function (student) { return student.starsEarned; });
  var completedSubmissions = submissions.filter(isCompleteSubmission).length;
  var completionRate = average(completionValues);

  if (completionRate === 0 && submissions.length > 0) {
    completionRate = Math.round((completedSubmissions / submissions.length) * 100);
  }

  return {
    completionRate: completionRate,
    averageAccuracy: average(accuracyValues),
    averageXp: average(xpValues),
    averageStars: average(starValues),
    masteryRate: mastery.masteryRate,
    engagementScore: engagement.averageScore,
    completedSubmissions: completedSubmissions,
    totalSubmissions: submissions.length,
    activityCount: activities.length,
    moodCheckInRate: mood.checkInRate
  };
}

function createStudentAnalyticsRow(student, submissions, courses) {
  var studentId = readId(student);
  var studentSubmissions = submissions.filter(function (submission) {
    return readStudentId(submission) === studentId;
  });
  var completedSubmissions = studentSubmissions.filter(isCompleteSubmission);
  var accuracy = readNumberByKeys(student, ["accuracyPercent", "averageAccuracy", "accuracy"], null);
  var completion = readNumberByKeys(student, ["completionPercent", "progressPercent", "currentCourseProgressPercent", "overallProgressPercent"], null);
  var xp = readNumberByKeys(student, ["xpEarned", "totalXp", "xp", "experiencePoints"], null);
  var stars = readNumberByKeys(student, ["starsEarned", "totalStars", "stars"], null);
  var mastery = readNumberByKeys(student, ["masteryPercent", "masteryRate"], null);
  var streak = readNumberByKeys(student, ["currentStreak", "streak", "bestStreak"], 0);
  var lastActiveMillis = readMillis(student.lastActiveAt || student.updatedAt || student.lastSeenAt);
  var moodHistory = readMoodHistory(student);

  if (completion == null && studentSubmissions.length > 0) {
    completion = Math.round((completedSubmissions.length / studentSubmissions.length) * 100);
  }
  if (accuracy == null) {
    accuracy = average(studentSubmissions.map(readSubmissionScore).filter(isKnownNumber));
  }
  if (xp == null) {
    xp = sum(studentSubmissions.map(readSubmissionXp));
  }
  if (stars == null) {
    stars = sum(studentSubmissions.map(readSubmissionStars));
  }
  if (mastery == null) {
    mastery = calculateMasteryFromRecords(student, studentSubmissions);
  }

  completion = clampPercent(completion == null ? 0 : completion);
  accuracy = clampPercent(accuracy == null ? completion : accuracy);

  return {
    studentId: studentId,
    name: readTextByKeys(student, ["name", "displayName", "studentName"], "Student"),
    className: readTextByKeys(student, ["className", "classLabel", "primaryClassName"], ""),
    completionPercent: completion,
    accuracyPercent: accuracy,
    xpEarned: Math.round(xp || 0),
    starsEarned: Math.round(stars || 0),
    masteryPercent: clampPercent(mastery || 0),
    currentStreak: Math.round(streak || 0),
    lastActiveAt: student.lastActiveAt || student.updatedAt || student.lastSeenAt || null,
    lastActiveMillis: lastActiveMillis,
    moodTrend: readMoodTrendLabel(moodHistory),
    moodHistory: moodHistory,
    engagementScore: calculateStudentEngagementScore({
      completionPercent: completion,
      xpEarned: xp || 0,
      submissionCount: studentSubmissions.length,
      lastActiveMillis: lastActiveMillis,
      currentStreak: streak || 0
    }),
    engagementLabel: "",
    achievements: readAchievements(student),
    recentActivities: createRecentActivityRows(studentSubmissions, courses)
  };
}

function createActivityRows(submissions, courses) {
  var groups = {};

  submissions.forEach(function (submission) {
    var activityId = readTextByKeys(submission, ["stepId", "activityId", "moduleId", "courseId", "id"], "activity");
    var group = groups[activityId] || createActivityGroup(activityId, submission, courses);
    var score = readSubmissionScore(submission);

    group.records += 1;
    if (isCompleteSubmission(submission)) {
      group.completed += 1;
    }
    if (isKnownNumber(score)) {
      group.scoreTotal += score;
      group.scoreCount += 1;
    }
    group.attempts += readNumberByKeys(submission, ["attemptNumber", "attempts"], 1) || 1;
    group.timeSeconds += readNumberByKeys(submission, ["completionTimeSeconds", "timeSpentSeconds"], 0) || 0;
    groups[activityId] = group;
  });

  return Object.keys(groups).map(function (key) {
    var group = groups[key];

    return {
      activityId: group.activityId,
      title: group.title,
      type: group.type,
      completionRate: group.records > 0 ? Math.round((group.completed / group.records) * 100) : 0,
      averageScore: group.scoreCount > 0 ? Math.round(group.scoreTotal / group.scoreCount) : 0,
      averageAttempts: group.records > 0 ? roundToTenth(group.attempts / group.records) : 0,
      averageTimeSeconds: group.records > 0 ? Math.round(group.timeSeconds / group.records) : 0,
      completedCount: group.completed,
      totalCount: group.records
    };
  }).sort(function (left, right) {
    return right.totalCount - left.totalCount || left.title.localeCompare(right.title);
  });
}

function createActivityGroup(activityId, submission, courses) {
  var course = findCourseForSubmission(submission, courses);

  return {
    activityId: activityId,
    title: readTextByKeys(submission, ["stepTitle", "activityTitle", "moduleTitle", "courseTitle"], course ? (course.courseTitle || course.title) : "Activity"),
    type: readTextByKeys(submission, ["stepType", "activityTemplate", "type"], "Activity"),
    records: 0,
    completed: 0,
    scoreTotal: 0,
    scoreCount: 0,
    attempts: 0,
    timeSeconds: 0
  };
}

function createMoodAnalytics(students) {
  var distribution = {};
  var histories = [];
  var checkedIn = 0;

  students.forEach(function (student) {
    var history = readMoodHistory(student);
    var latest = history.length > 0 ? history[0] : null;

    if (latest && latest.label) {
      checkedIn += 1;
      distribution[latest.label] = (distribution[latest.label] || 0) + 1;
    }

    if (history.length > 0) {
      histories.push({
        studentId: readId(student),
        studentName: readTextByKeys(student, ["name", "displayName", "studentName"], "Student"),
        history: history
      });
    }
  });

  return {
    distribution: distribution,
    histories: histories,
    checkInRate: students.length > 0 ? Math.round((checkedIn / students.length) * 100) : 0,
    totalCheckedIn: checkedIn,
    totalStudents: students.length
  };
}

function createMasteryAnalytics(students, courses) {
  var mastered = students.filter(function (student) { return student.masteryPercent >= 90; }).length;
  var completed = students.filter(function (student) { return student.masteryPercent >= 50 && student.masteryPercent < 90; }).length;
  var inProgress = students.filter(function (student) { return student.completionPercent > 0 && student.masteryPercent < 50; }).length;
  var notStarted = Math.max(0, students.length - mastered - completed - inProgress);
  var heatmapRows = students.map(function (student) {
    return {
      studentId: student.studentId,
      studentName: student.name,
      cells: createMasteryCells(student, courses)
    };
  });

  return {
    mastered: mastered,
    completed: completed,
    inProgress: inProgress,
    notStarted: notStarted,
    masteryRate: students.length > 0 ? Math.round((mastered / students.length) * 100) : 0,
    heatmapRows: heatmapRows,
    courseLabels: courses.slice(0, 6).map(function (course) {
      return course.courseTitle || course.title || course.name || "Course";
    })
  };
}

function createMasteryCells(student, courses) {
  var visibleCourses = courses.slice(0, 6);

  if (visibleCourses.length === 0) {
    return [{
      label: "Overall",
      status: readMasteryStatus(student.masteryPercent, student.completionPercent)
    }];
  }

  return visibleCourses.map(function (course) {
    return {
      label: course.courseTitle || course.title || course.name || "Course",
      status: readMasteryStatus(student.masteryPercent, student.completionPercent)
    };
  });
}

function createEngagementAnalytics(students) {
  var withLabels = students.map(function (student) {
    var label = readEngagementLabel(student.engagementScore);

    student.engagementLabel = label;
    return student;
  });

  return {
    averageScore: average(withLabels.map(function (student) { return student.engagementScore; })),
    highlyEngaged: withLabels.filter(function (student) { return student.engagementLabel === "Highly Engaged"; }).length,
    moderatelyEngaged: withLabels.filter(function (student) { return student.engagementLabel === "Moderately Engaged"; }).length,
    needsAttention: withLabels.filter(function (student) { return student.engagementLabel === "Needs Attention"; }).length,
    rows: withLabels.slice().sort(function (left, right) {
      return right.engagementScore - left.engagementScore;
    })
  };
}

function createTrendAnalytics(students, submissions) {
  return {
    completion: createDateBuckets(submissions.filter(isCompleteSubmission), "updatedAt"),
    xp: createDateBuckets(students.filter(function (student) { return student.xpEarned > 0; }), "lastActiveAt", "xpEarned"),
    mood: createMoodTrend(students)
  };
}

function createDateBuckets(records, dateKey, valueKey) {
  var buckets = createLastSevenDayBuckets();

  records.forEach(function (record) {
    var millis = readMillis(record[dateKey] || record.completedAt || record.createdAt);
    var bucket = readBucketKey(millis);

    if (buckets[bucket]) {
      buckets[bucket].value += valueKey ? (Number(record[valueKey]) || 0) : 1;
    }
  });

  return Object.keys(buckets).map(function (key) {
    return buckets[key];
  });
}

function createMoodTrend(students) {
  var buckets = createLastSevenDayBuckets();

  students.forEach(function (student) {
    readMoodHistory(student).forEach(function (mood) {
      var bucket = readBucketKey(mood.millis);

      if (buckets[bucket]) {
        buckets[bucket].value += 1;
      }
    });
  });

  return Object.keys(buckets).map(function (key) {
    return buckets[key];
  });
}

function createInsights(overview, students, activities, mood, engagement) {
  var insights = [];
  var lowestActivity = activities.slice().sort(function (left, right) {
    return left.averageScore - right.averageScore;
  })[0];
  var highestActivity = activities.slice().sort(function (left, right) {
    return right.averageScore - left.averageScore;
  })[0];

  if (overview.completionRate >= 80) {
    insights.push("Most students are completing assigned work successfully.");
  } else if (students.length > 0) {
    insights.push("Completion rates may benefit from a quick teacher check-in.");
  }

  if (highestActivity && highestActivity.averageScore >= 80) {
    insights.push(highestActivity.title + " has one of the strongest average scores.");
  }

  if (lowestActivity && lowestActivity.averageScore > 0 && lowestActivity.averageScore < 60) {
    insights.push(lowestActivity.title + " may need review or additional support.");
  }

  if (mood.distribution.Tired || mood.distribution.Frustrated || mood.distribution.Sad) {
    insights.push("Several students reported lower-energy moods recently.");
  }

  if (engagement.needsAttention > 0) {
    insights.push(engagement.needsAttention + " student(s) may benefit from additional support.");
  }

  if (insights.length === 0) {
    insights.push("Analytics will become more specific as students complete activities.");
  }

  return insights;
}

function createStudentObservations(student) {
  var observations = [];
  var lowerMoodCount = student.moodHistory.filter(function (mood) {
    return ["Tired", "Frustrated", "Sad"].indexOf(mood.label) !== -1;
  }).length;

  if (student.completionPercent < 40) {
    observations.push("May benefit from additional support with completion.");
  }
  if (student.engagementScore < 50) {
    observations.push("Participation has decreased recently or is still developing.");
  }
  if (lowerMoodCount >= 2) {
    observations.push("Recent check-ins suggest the student may appreciate a supportive check-in.");
  }
  if (student.lastActiveMillis && Date.now() - student.lastActiveMillis > 7 * 24 * 60 * 60 * 1000) {
    observations.push("Has not been active recently.");
  }
  if (observations.length === 0) {
    observations.push("No support observations from current analytics.");
  }

  return observations;
}

function calculateStudentEngagementScore(data) {
  var recencyScore = 0;
  var age = data.lastActiveMillis ? Date.now() - data.lastActiveMillis : Infinity;

  if (age <= 24 * 60 * 60 * 1000) {
    recencyScore = 100;
  } else if (age <= 7 * 24 * 60 * 60 * 1000) {
    recencyScore = 70;
  } else if (age <= 30 * 24 * 60 * 60 * 1000) {
    recencyScore = 40;
  }

  return clampPercent(Math.round(
    (data.completionPercent * 0.35)
    + (Math.min(data.xpEarned, 500) / 500 * 100 * 0.2)
    + (Math.min(data.submissionCount, 10) / 10 * 100 * 0.2)
    + (recencyScore * 0.15)
    + (Math.min(data.currentStreak, 10) / 10 * 100 * 0.1)
  ));
}

function readEngagementLabel(score) {
  if (score >= 75) return "Highly Engaged";
  if (score >= 50) return "Moderately Engaged";
  return "Needs Attention";
}

function readMasteryStatus(masteryPercent, completionPercent) {
  if (masteryPercent >= 90) return "mastered";
  if (completionPercent >= 80 || masteryPercent >= 50) return "completed";
  if (completionPercent > 0) return "in-progress";
  return "needs-support";
}

function readMoodHistory(student) {
  var values = [];
  var rawHistory = Array.isArray(student && student.moodHistory) ? student.moodHistory : [];

  rawHistory.forEach(function (entry) {
    appendMood(values, entry);
  });
  appendMood(values, student ? (student.todayCheckIn || student.latestCheckIn || student.emotionalCheckIn || student) : null);

  return values.sort(function (left, right) {
    return right.millis - left.millis;
  }).slice(0, 10);
}

function appendMood(values, entry) {
  var label = normalizeMoodLabel(readTextByKeys(entry, ["moodLabel", "mood", "feeling", "emotionalState", "todayMood"], ""));

  if (!label) {
    return;
  }

  values.push({
    label: label,
    note: readTextByKeys(entry, ["note", "reflection", "comment"], ""),
    millis: readMillis(entry && (entry.submittedAt || entry.createdAt || entry.updatedAt)) || Date.now()
  });
}

function readMoodTrendLabel(history) {
  if (!history || history.length === 0) {
    return "Not recorded";
  }

  return history.slice(0, 3).map(function (entry) {
    return entry.label;
  }).join(" -> ");
}

function normalizeMoodLabel(value) {
  var mood = String(value || "").trim().toLowerCase();

  if (!mood) return "";
  if (mood === "very happy") return "Very Happy";
  if (mood === "happy" || mood === "good" || mood === "great") return "Happy";
  if (mood === "okay" || mood === "ok" || mood === "neutral") return "Okay";
  if (mood === "tired" || mood === "sleepy") return "Tired";
  if (mood === "frustrated" || mood === "angry" || mood === "overwhelmed") return "Frustrated";
  if (mood === "sad" || mood === "down") return "Sad";
  return titleCase(mood);
}

function createRecentActivityRows(submissions, courses) {
  return submissions.slice().sort(function (left, right) {
    return readMillis(right.updatedAt || right.createdAt) - readMillis(left.updatedAt || left.createdAt);
  }).slice(0, 8).map(function (submission) {
    var course = findCourseForSubmission(submission, courses);

    return {
      activity: readTextByKeys(submission, ["stepTitle", "activityTitle", "moduleTitle"], course ? (course.courseTitle || course.title) : "Activity"),
      score: readSubmissionScore(submission),
      stars: readSubmissionStars(submission),
      completedAt: submission.updatedAt || submission.createdAt || null
    };
  });
}

function createSingleStudentTrend(student, key) {
  var value = key === "accuracy" ? student.accuracyPercent : student.completionPercent;

  return [
    { label: "Start", value: 0 },
    { label: "Now", value: value }
  ];
}

function readAchievements(student) {
  var achievements = student && Array.isArray(student.achievements) ? student.achievements : [];

  return achievements.map(function (achievement) {
    return typeof achievement === "string" ? achievement : readTextByKeys(achievement, ["name", "id"], "Achievement");
  });
}

function calculateMasteryFromRecords(student, submissions) {
  var direct = readNumberByKeys(student, ["bestScore", "score"], null);

  if (direct != null) {
    return direct >= 90 ? 100 : direct;
  }

  if (submissions.length === 0) {
    return 0;
  }

  return average(submissions.map(readSubmissionScore).filter(isKnownNumber));
}

function readSubmissionScore(submission) {
  return readNumberByKeys(submission, ["score", "accuracy", "finalScore", "bestScore"], null);
}

function readSubmissionXp(submission) {
  return readNumberByKeys(submission, ["xpEarned", "xp"], readNestedNumber(submission, ["gamification"], "xpEarned") || 0) || 0;
}

function readSubmissionStars(submission) {
  return readNumberByKeys(submission, ["starsEarned", "stars"], readNestedNumber(submission, ["gamification"], "stars") || 0) || 0;
}

function readNestedNumber(source, path, key) {
  var current = source;
  var index = 0;

  while (current && index < path.length) {
    current = current[path[index]];
    index += 1;
  }

  if (!current || !isKnownNumber(Number(current[key]))) {
    return null;
  }

  return Number(current[key]);
}

function isCompleteSubmission(submission) {
  var status = String(submission && (submission.reviewStatus || submission.status || "")).toLowerCase();

  return status === "complete" || status === "completed" || submission.completed === true;
}

function findCourseForSubmission(submission, courses) {
  var courseId = readTextByKeys(submission, ["courseId", "courseAssignmentId", "assignmentId"], "");

  return (courses || []).find(function (course) {
    return course.id === courseId || course.courseId === courseId || course.assignmentId === courseId || course.courseAssignmentId === courseId;
  }) || null;
}

function createLastSevenDayBuckets() {
  var buckets = {};
  var today = new Date();
  var index = 6;

  while (index >= 0) {
    var date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - index);
    var key = date.toISOString().slice(0, 10);
    buckets[key] = {
      key: key,
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      value: 0
    };
    index -= 1;
  }

  return buckets;
}

function readBucketKey(millis) {
  if (!millis) {
    return "";
  }

  return new Date(millis).toISOString().slice(0, 10);
}

function createAnalyticsCacheKey(input) {
  return [
    recordSignature(input.students),
    recordSignature(input.courses),
    recordSignature(input.submissions),
    recordSignature(input.classes)
  ].join("|");
}

function recordSignature(records) {
  var safeRecords = Array.isArray(records) ? records : [];

  return safeRecords.length + ":" + safeRecords.map(function (record) {
    return readId(record) + "@" + readMillis(record && (record.updatedAt || record.lastActiveAt || record.createdAt));
  }).join(",");
}

function uniqueRecords(records) {
  var seen = {};
  var output = [];

  (Array.isArray(records) ? records : []).forEach(function (record, index) {
    var id = readId(record) || "record-" + index;

    if (!seen[id]) {
      seen[id] = true;
      output.push(record);
    }
  });

  return output;
}

function readId(record) {
  return readTextByKeys(record, ["id", "studentId", "uid", "authUid", "courseId", "assignmentId", "submissionId"], "");
}

function readStudentId(record) {
  return readTextByKeys(record, ["studentId", "studentUid", "userId", "uid"], "");
}

function readTextByKeys(source, keys, fallbackValue) {
  var index = 0;

  while (source && typeof source === "object" && index < keys.length) {
    if (typeof source[keys[index]] === "string" && source[keys[index]].trim()) {
      return source[keys[index]].trim();
    }
    index += 1;
  }

  return fallbackValue || "";
}

function readNumberByKeys(source, keys, fallbackValue) {
  var index = 0;
  var number = null;

  while (source && typeof source === "object" && index < keys.length) {
    number = Number(source[keys[index]]);
    if (Number.isFinite(number)) {
      return number;
    }
    index += 1;
  }

  return fallbackValue;
}

function readMillis(value) {
  if (!value) {
    return 0;
  }
  if (typeof value.toMillis === "function") {
    return value.toMillis();
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    var parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value.seconds) {
    return value.seconds * 1000;
  }

  return 0;
}

function average(values) {
  var known = (values || []).filter(isKnownNumber);

  if (known.length === 0) {
    return 0;
  }

  return Math.round(sum(known) / known.length);
}

function sum(values) {
  return (values || []).reduce(function (total, value) {
    return total + (Number(value) || 0);
  }, 0);
}

function isKnownNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function clampPercent(value) {
  var number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(number)));
}

function roundToTenth(value) {
  return Math.round((Number(value) || 0) * 10) / 10;
}

function titleCase(value) {
  return String(value || "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, function (letter) {
      return letter.toUpperCase();
    });
}
