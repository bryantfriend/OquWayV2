"use strict";

const crypto = require("crypto");
const { validateBosEvent } = require("./bosEventContract");

function BosPublisherError(code, message, details) {
  Error.call(this, message);
  this.name = "BosPublisherError";
  this.code = code;
  this.message = message;
  this.details = details || {};
}

BosPublisherError.prototype = Object.create(Error.prototype);
BosPublisherError.prototype.constructor = BosPublisherError;

function BosEventPublisher(options) {
  var config = options || {};

  this.endpoint = config.endpoint;
  this.integrationId = config.integrationId;
  this.secret = config.secret;
  this.timeoutMs = readBoundedInteger(config.timeoutMs, 5000, 100, 30000);
  this.maxAttempts = readBoundedInteger(config.maxAttempts, 3, 1, 5);
  this.baseDelayMs = readBoundedInteger(config.baseDelayMs, 250, 1, 5000);
  this.fetchImplementation = config.fetchImplementation || globalThis.fetch;
  this.sleepImplementation = config.sleepImplementation || sleep;
  this.nowImplementation = config.nowImplementation || Date.now;
  this.logger = config.logger || console;
}

BosEventPublisher.prototype.publish = async function (event) {
  var validationErrors = validateBosEvent(event);
  var attempt = 0;
  var lastError = null;

  validateConfiguration(this);

  if (validationErrors.length > 0) {
    throw new BosPublisherError("BOS_PAYLOAD_INVALID", "BOS event payload is invalid.", {
      validationErrors: validationErrors
    });
  }

  while (attempt < this.maxAttempts) {
    attempt += 1;

    try {
      return await sendAttempt(this, event, attempt);
    } catch (error) {
      lastError = normalizePublisherError(error);
      logSafe(this.logger, "warn", "BOS delivery attempt failed.", {
        eventId: event.eventId,
        eventType: event.eventType,
        attempt: attempt,
        code: lastError.code,
        responseStatus: lastError.details.responseStatus || null
      });

      if (!lastError.details.retryable || attempt >= this.maxAttempts) {
        lastError.details.attempts = attempt;
        throw lastError;
      }

      await this.sleepImplementation(this.baseDelayMs * Math.pow(2, attempt - 1));
    }
  }

  throw lastError;
};

async function sendAttempt(publisher, event, attempt) {
  var body = JSON.stringify(event);
  var timestamp = String(Math.floor(publisher.nowImplementation() / 1000));
  var signature = createSignature(publisher.secret, timestamp, body);
  var controller = new AbortController();
  var timeoutId = setTimeout(function () {
    controller.abort();
  }, publisher.timeoutMs);
  var response = null;

  try {
    response = await publisher.fetchImplementation(publisher.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": event.eventId,
        "X-BOS-Integration-Id": publisher.integrationId,
        "X-BOS-Timestamp": timestamp,
        "X-BOS-Signature": signature
      },
      body: body,
      signal: controller.signal
    });
  } catch (error) {
    if (error && error.name === "AbortError") {
      throw new BosPublisherError("BOS_TIMEOUT", "BOS delivery timed out.", {
        retryable: true
      });
    }

    throw new BosPublisherError("BOS_UNAVAILABLE", "BOS is unavailable.", {
      retryable: true
    });
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status >= 200 && response.status < 300) {
    logSafe(publisher.logger, "info", "BOS event delivered.", {
      eventId: event.eventId,
      eventType: event.eventType,
      attempt: attempt,
      responseStatus: response.status,
      duplicate: false
    });

    return {
      accepted: true,
      duplicate: false,
      attempts: attempt,
      responseStatus: response.status
    };
  }

  if (response.status === 409) {
    logSafe(publisher.logger, "info", "BOS duplicate accepted as success.", {
      eventId: event.eventId,
      eventType: event.eventType,
      attempt: attempt,
      responseStatus: response.status,
      duplicate: true
    });

    return {
      accepted: true,
      duplicate: true,
      attempts: attempt,
      responseStatus: response.status
    };
  }

  throw new BosPublisherError("BOS_RESPONSE_REJECTED", "BOS rejected the event.", {
    responseStatus: response.status,
    retryable: isRetryableStatus(response.status)
  });
}

function createSignature(secret, timestamp, body) {
  var signingInput = timestamp + "." + body;
  var digest = crypto.createHmac("sha256", secret).update(signingInput, "utf8").digest("hex");

  return "sha256=" + digest;
}

function validateConfiguration(publisher) {
  var errors = [];

  if (typeof publisher.endpoint !== "string" || !/^https:\/\//.test(publisher.endpoint)) {
    errors.push("BOS_EVENTS_ENDPOINT must be an HTTPS URL");
  }

  if (typeof publisher.integrationId !== "string" || publisher.integrationId.trim().length === 0) {
    errors.push("BOS_INTEGRATION_ID is required");
  }

  if (typeof publisher.secret !== "string" || publisher.secret.length < 16) {
    errors.push("BOS_INTEGRATION_SECRET must be at least 16 characters");
  }

  if (typeof publisher.fetchImplementation !== "function") {
    errors.push("fetch is unavailable");
  }

  if (errors.length > 0) {
    throw new BosPublisherError("BOS_CONFIG_INVALID", "BOS configuration is invalid.", {
      validationErrors: errors
    });
  }
}

function isRetryableStatus(status) {
  return status === 408 || status === 425 || status === 429 || status >= 500;
}

function normalizePublisherError(error) {
  if (error instanceof BosPublisherError) {
    return error;
  }

  return new BosPublisherError("BOS_UNAVAILABLE", "BOS is unavailable.", {
    retryable: true
  });
}

function readBoundedInteger(value, defaultValue, minimum, maximum) {
  var numberValue = Number(value);

  if (!Number.isInteger(numberValue)) {
    return defaultValue;
  }

  return Math.min(maximum, Math.max(minimum, numberValue));
}

function sleep(milliseconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, milliseconds);
  });
}

function logSafe(logger, level, message, metadata) {
  if (!logger || typeof logger[level] !== "function") {
    return;
  }

  logger[level](message, metadata);
}

module.exports = {
  BosEventPublisher: BosEventPublisher,
  BosPublisherError: BosPublisherError,
  createSignature: createSignature
};
