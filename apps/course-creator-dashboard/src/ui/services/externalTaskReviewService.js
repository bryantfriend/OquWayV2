import { auth } from "../../../../../packages/firebase/auth/index.js?v=1.1.136-emotional-check-in";
import { getIntentDefinition } from "../../../../../packages/icf/index.js?v=1.1.136-emotional-check-in";
import { runIntentPipeline } from "../../../../../packages/icf/index.js?v=1.1.136-emotional-check-in";

export const externalTaskReviewService = {
  loadSubmissions: async function (filters) {
    var result = await runExternalTaskIntent("LoadExternalTaskSubmissionsIntent", filters || {});
    var data = readIntentDataOrThrow(result);
    return Array.isArray(data.submissions) ? data.submissions : [];
  },

  reviewSubmission: async function (submissionId, reviewStatus, teacherFeedback) {
    var result = await runExternalTaskIntent("ReviewExternalTaskSubmissionIntent", {
      submissionId: submissionId,
      reviewStatus: reviewStatus,
      teacherFeedback: teacherFeedback || ""
    });

    return readIntentDataOrThrow(result);
  }
};

async function runExternalTaskIntent(intentType, payload) {
  return runIntentPipeline(getIntentDefinition(intentType), {
    payload: payload,
    actor: getActor(),
    meta: {
      createdAt: Date.now(),
      source: "course-creator-dashboard"
    }
  });
}

function getActor() {
  if (auth.currentUser) {
    return {
      id: auth.currentUser.uid,
      role: "ROLE_COURSE_CREATOR"
    };
  }

  return null;
}

function readIntentDataOrThrow(result) {
  if (result && result.emitted && result.emitted.success) {
    return result.emitted.data;
  }

  throw new Error(readIntentErrorMessage(result));
}

function readIntentErrorMessage(result) {
  if (result && result.emitted && result.emitted.errors && result.emitted.errors.length > 0) {
    return result.emitted.errors[0].message || result.emitted.errors[0].code;
  }

  if (result && result.errors && result.errors.length > 0) {
    return result.errors[0].message || result.errors[0].code;
  }

  return "Unknown external task review error";
}
