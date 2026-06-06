import { db, doc, serverTimestamp, setDoc } from "../../../../../infrastructure/firebase/firestore.js?v=1.1.106-student-assignment-error-trace";

export async function processClaimDailyBonus(executionState) {
  var actor = executionState.actor;
  var today = new Date().toISOString().slice(0, 10);
  var rewardXp = 10;

  try {
    await setDoc(doc(db, "users", actor.id), {
      dailyBonus: {
        lastClaimedDate: today,
        rewardXp: rewardXp,
        claimedAt: serverTimestamp()
      }
    }, { merge: true });

    executionState.result = {
      dailyBonus: {
        available: false,
        claimed: true,
        lastClaimedDate: today,
        rewardXp: rewardXp,
        nextAvailableAt: today + "T24:00:00.000Z",
        countdownLabel: "Available again tomorrow"
      }
    };

    return {
      valid: true,
      data: executionState.result
    };
  } catch (error) {
    logDailyBonusDebug(error, actor);
    return {
      valid: false,
      errors: [
        {
          code: "DAILY_BONUS_CLAIM_FAILED",
          message: "Daily bonus could not be claimed: " + readErrorMessage(error)
        }
      ]
    };
  }
}

function logDailyBonusDebug(error, actor) {
  if (!isDevelopmentHost()) {
    return;
  }

  console.warn("[student-dashboard-debug] ClaimDailyBonusIntent process issue.", {
    profilePath: actor && actor.id ? "users/" + actor.id : "",
    errorCode: error && error.code ? error.code : "",
    errorMessage: readErrorMessage(error)
  });
}

function isDevelopmentHost() {
  return typeof window !== "undefined"
    && (window.location.hostname === "localhost"
      || window.location.hostname === "127.0.0.1"
      || window.location.hostname === "");
}

function readErrorMessage(error) {
  if (!error) {
    return "unknown error";
  }

  if (error.code && error.message) {
    return error.code + " " + error.message;
  }

  return error.message || String(error);
}
