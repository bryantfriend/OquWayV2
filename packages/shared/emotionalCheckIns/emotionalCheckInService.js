import { auth } from "../../firebase/auth/index.js?v=1.1.162-modal-stack";
import { getIntentDefinition, runIntentPipeline } from "../../icf/index.js?v=1.1.162-modal-stack";
import {
  buildEmotionalCheckInContext,
  getExistingEmotionalCheckIn
} from "../../domain/emotionalCheckIns/index.js?v=1.1.162-modal-stack";

export const emotionalCheckInService = {
  buildContext: buildEmotionalCheckInContext,

  shouldShowCheckIn: async function (checkInContext) {
    var existing = await getExistingEmotionalCheckIn(checkInContext);

    return {
      shouldShow: !existing,
      existingCheckIn: existing || null
    };
  },

  recordCheckIn: async function (checkInContext, emotionKey) {
    var actor = createCheckInActor(checkInContext);
    var intentDefinition = getIntentDefinition("RecordEmotionalCheckInIntent");
    var result = await runIntentPipeline(intentDefinition, {
      actor: actor,
      payload: Object.assign({}, checkInContext, {
        emotionKey: emotionKey
      }),
      meta: {
        source: "emotional-check-in-service"
      }
    });

    if (result && result.emitted && result.emitted.success) {
      return result.emitted.data;
    }

    throw new Error(readIntentErrorMessage(result));
  }
};

export { buildEmotionalCheckInContext };

function createCheckInActor(checkInContext) {
  var context = checkInContext && typeof checkInContext === "object" ? checkInContext : {};
  var currentUser = auth.currentUser;
  var uid = currentUser && currentUser.uid ? currentUser.uid : readText(context.participantUserId);
  var role = readText(context.participantRole || "participant");

  return {
    id: uid,
    uid: uid,
    authUid: uid,
    userId: uid,
    profileId: readText(context.participantProfileId),
    studentId: role === "student" ? readText(context.participantProfileId) : "",
    role: role,
    roles: [role]
  };
}

function readIntentErrorMessage(result) {
  var emitted = result && result.emitted ? result.emitted : {};
  var errors = Array.isArray(emitted.errors) ? emitted.errors : [];

  if (errors.length > 0 && errors[0] && errors[0].message) {
    return errors[0].message;
  }

  return "Could not save emotional check-in.";
}

function readText(value) {
  return typeof value === "string" || typeof value === "number" ? String(value).trim() : "";
}
