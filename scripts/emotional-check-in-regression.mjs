import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  buildEmotionalCheckInContext,
  buildEmotionalCheckInDocumentId,
  buildEmotionalCheckInRecord
} from "../packages/domain/emotionalCheckIns/context.js";
import { isKnownEmotionalCheckInOption } from "../packages/domain/emotionalCheckIns/options.js";

var __dirname = path.dirname(fileURLToPath(import.meta.url));
var repoRoot = path.resolve(__dirname, "..");
var failures = [];

await runTest("valid student check-in context and record", verifyValidStudentCheckInRecord);
await runTest("validation rejects missing or invalid mood", verifyMoodValidation);
await runTest("optional classroom context stays safe", verifyOptionalContext);
await runTest("process write and retry contract", verifyProcessWriteContract);
await runTest("Firestore emotional check-in rules contract", verifyFirestoreRulesContract);
await runTest("Student Dashboard gate contract", verifyStudentDashboardGateContract);
await runTest("emotional check-in governance source scan", verifyEmotionalCheckInGovernance);

if (failures.length > 0) {
  console.error("Emotional Check-In regression failed:");
  failures.forEach(function (failure) {
    console.error("- " + failure);
  });
  process.exit(1);
}

console.log("Emotional Check-In regression passed.");

async function runTest(name, testFunction) {
  try {
    await testFunction();
    console.log("PASS " + name);
  } catch (error) {
    failures.push(name + ": " + readErrorMessage(error));
  }
}

function verifyValidStudentCheckInRecord() {
  var context = createStudentCheckInContext();
  var record = buildEmotionalCheckInRecord(Object.assign({}, context, {
    emotionKey: "happy"
  }), "happy");
  var documentId = buildEmotionalCheckInDocumentId(record);

  assert.equal(isKnownEmotionalCheckInOption("happy"), true, "valid student check-in mood should be known");
  assert.equal(record.participantUserId, "auth-student-1", "record should keep auth uid as participant user id");
  assert.equal(record.studentId, "student-profile-1", "record should include student profile id for support views");
  assert.equal(record.emotionKey, "happy", "record should keep normalized emotion key");
  assert.equal(record.checkInDate, "2026-06-19", "record should include day key");
  assert.equal(record.version, "1.1.0", "record should use the current check-in schema version");
  assert.equal(documentId.endsWith("_auth-student-1"), true, "document id should end with auth uid for rules");
  assertNoUndefined(record, "record");
}

function verifyMoodValidation() {
  assert.equal(isKnownEmotionalCheckInOption(""), false, "missing mood should not be a known option");
  assert.equal(isKnownEmotionalCheckInOption("ranked-best"), false, "invalid mood should not be a known option");
}

function verifyOptionalContext() {
  var context = buildEmotionalCheckInContext({
    participantUserId: "auth-student-1",
    participantProfileId: "student-profile-1",
    participantRole: "student"
  }, {
    programId: "course-1",
    programType: "course",
    programName: "Course",
    contextScope: "course-entry",
    checkInSource: "student_panel",
    timezone: "UTC"
  });
  var record = buildEmotionalCheckInRecord(Object.assign({}, context, {
    emotionKey: "okay",
    localDate: "2026-06-19",
    localTime: "09:00:00"
  }), "okay");

  assert.equal(record.classId, null, "missing optional class id should remain non-undefined");
  assert.equal(record.locationId, "", "missing optional location id should remain non-undefined");
  assertNoUndefined(record, "optional-context record");
}

async function verifyProcessWriteContract() {
  var validateSource = await readSource("packages/core/src/icf/stages/validate/domain/emotionalCheckIn/validateEmotionalCheckInPayload.js");
  var normalizeSource = await readSource("packages/core/src/icf/stages/normalize/domain/emotionalCheckIn/normalizeEmotionalCheckInPayload.js");
  var repositorySource = await readSource("packages/domain/emotionalCheckIns/repository.js");
  var processSource = await readSource("packages/core/src/icf/stages/process/domain/emotionalCheckIn/processRecordEmotionalCheckIn.js");

  assertSourceIncludes(validateSource, "EMOTION_KEY_REQUIRED", "validate should reject missing mood");
  assertSourceIncludes(validateSource, "UNKNOWN_EMOTION_KEY", "validate should reject invalid mood");
  assertSourceIncludes(normalizeSource, "normalizeCheckInContext", "normalize should normalize check-in context before process");
  assertSourceIncludes(normalizeSource, "checkInDate: context.localDate", "normalize should provide a day key before process");
  assertSourceIncludes(repositorySource, "cleanEmotionalCheckInRecord", "repository should clean write payloads before Firestore");
  assertSourceIncludes(repositorySource, "typeof record[keys[index]] !== \"undefined\"", "repository should omit undefined fields");
  assertSourceIncludes(repositorySource, "setDoc(doc(db, \"emotionalCheckIns\", documentId), writeRecord, { merge: true })", "same-day check-in should merge existing doc");
  assertSourceIncludes(processSource, "retryable: true", "process save failures should be marked retryable");
  assertSourceIncludes(processSource, "writeOperationType", "process save failures should log safe write context");
  assertSourceIncludes(processSource, "payloadFieldNames", "process save failures should log field names without values");
  assertSourceIncludes(processSource, "Could not save your check-in. Please try again.", "process should return clear retry copy");
}

async function verifyFirestoreRulesContract() {
  var rulesSource = await readSource("firestore.rules");
  var checkInBlock = readBlock(rulesSource, "match /emotionalCheckIns/{checkInId}");

  assertSourceIncludes(rulesSource, "emotionalCheckInAllowedKeys", "rules should whitelist emotional check-in fields");
  assertSourceIncludes(rulesSource, '"1.1.0"', "rules should allow the current check-in schema version");
  assertSourceIncludes(rulesSource, "allow update: if isValidEmotionalCheckInWrite(checkInId)", "rules should allow owned same-day updates");
  assertSourceIncludes(rulesSource, "isEmotionalCheckInStudentProfileOwner", "rules should allow owned profile-id student documents");
  assertSourceIncludes(rulesSource, "isSelfOwnedEmotionalCheckInStudent", "rules should allow self-owned auth-id student check-ins");
  assertSourceIncludes(rulesSource, "request.resource.data.studentId == request.auth.uid", "self-owned student rule should require student id ownership");
  assertSourceIncludes(rulesSource, "request.resource.data.participantProfileId", "profile owner rule should be tied to the submitted student profile id");
  assertSourceIncludes(rulesSource, ".data.get(\"authUid\", \"\") == request.auth.uid", "profile owner rule should require auth uid ownership");
  assertSourceIncludes(rulesSource, "request.resource.data.createdAt == resource.data.createdAt", "updates should preserve createdAt");
  assertSourceIncludes(rulesSource, "allow delete: if false", "students should not delete check-ins");
  assertNoSourceIncludes(checkInBlock, "isTeacher()", "check-in write rules should not grant teacher writes");
  assertNoSourceIncludes(checkInBlock, "isSuperAdmin()", "check-in write rules should not add broad admin writes");
}

async function verifyStudentDashboardGateContract() {
  var mainSource = await readSource("apps/student-dashboard/src/main.js");
  var serviceSource = await readSource("packages/shared/emotionalCheckIns/emotionalCheckInService.js");
  var gateSource = await readSource("packages/ui/emotionalCheckInGate.js");

  assertSourceIncludes(mainSource, "emotionalCheckInService.shouldShowCheckIn(checkInContext)", "Student Dashboard should check existing daily check-in");
  assertSourceIncludes(mainSource, "emotionalCheckInService.recordCheckIn(checkInContext, emotionKey)", "Student Dashboard should save through the service");
  assertSourceIncludes(serviceSource, "RecordEmotionalCheckInIntent", "service should use RecordEmotionalCheckInIntent");
  assertSourceIncludes(gateSource, "readSaveErrorMessage", "gate should show retryable save copy");
  assertSourceIncludes(gateSource, "oqu-check-in-retry", "gate should keep a retry action");
  assertNoSourceIncludes(gateSource, "setDoc(", "gate must not write directly to Firestore");
  assertNoSourceIncludes(gateSource, "alert(", "gate must not use alerts");
}

async function verifyEmotionalCheckInGovernance() {
  var sources = [
    await readSource("packages/domain/emotionalCheckIns/context.js"),
    await readSource("packages/domain/emotionalCheckIns/repository.js"),
    await readSource("packages/shared/emotionalCheckIns/emotionalCheckInService.js"),
    await readSource("packages/ui/emotionalCheckInGate.js"),
    await readSource("packages/core/src/icf/stages/process/domain/emotionalCheckIn/processRecordEmotionalCheckIn.js")
  ].join("\n");

  assertNoSourceIncludes(sources, "reward", "check-in should not trigger rewards");
  assertNoSourceIncludes(sources, "diagnostic", "check-in should not create diagnostics");
  assertNoSourceIncludes(sources, "ranking", "check-in should not rank students");
  assertNoSourceIncludes(sources, "ranked", "check-in should not rank students");
}

function createStudentCheckInContext() {
  var context = buildEmotionalCheckInContext({
    participantUserId: "auth-student-1",
    participantProfileId: "student-profile-1",
    participantRole: "student",
    schoolId: "school-1",
    locationId: "location-1",
    classId: "class-1",
    timezone: "UTC"
  }, {
    schoolId: "school-1",
    locationId: "location-1",
    programId: "course-1",
    programType: "course",
    programName: "ICT Grade 6",
    classId: "class-1",
    courseId: "course-1",
    contextScope: "class-session",
    checkInSource: "student_panel",
    timezone: "UTC"
  });

  return Object.assign({}, context, {
    localDate: "2026-06-19",
    localTime: "09:00:00",
    contextId: "class-1_course-1_2026-06-19"
  });
}

function readErrorCodes(result) {
  return (Array.isArray(result && result.errors) ? result.errors : []).map(function (error) {
    return error && error.code ? error.code : "";
  });
}

function assertNoUndefined(value, pathName) {
  var keys = Object.keys(value || {});
  var index = 0;

  while (index < keys.length) {
    assert.notEqual(typeof value[keys[index]], "undefined", pathName + "." + keys[index] + " should not be undefined");
    index = index + 1;
  }
}

async function readSource(relativePath) {
  return await readFile(path.join(repoRoot, relativePath), "utf8");
}

function assertSourceIncludes(source, text, message) {
  assert.equal(source.indexOf(text) !== -1, true, message);
}

function assertNoSourceIncludes(source, text, message) {
  assert.equal(source.indexOf(text) === -1, true, message);
}

function readBlock(source, marker) {
  var startIndex = source.indexOf(marker);
  var braceIndex = startIndex === -1 ? -1 : source.indexOf("{", startIndex);
  var depth = 0;
  var index = braceIndex;

  assert.equal(startIndex !== -1, true, "missing source marker " + marker);
  assert.equal(braceIndex !== -1, true, "missing block brace for " + marker);

  while (index < source.length) {
    if (source[index] === "{") {
      depth = depth + 1;
    } else if (source[index] === "}") {
      depth = depth - 1;
      if (depth === 0) {
        return source.slice(startIndex, index + 1);
      }
    }

    index = index + 1;
  }

  return source.slice(startIndex);
}

function readErrorMessage(error) {
  return error && error.message ? error.message : String(error);
}
