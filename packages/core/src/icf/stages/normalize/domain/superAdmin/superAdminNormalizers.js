export function normalizeLocationPayload(executionState) {
  var payload = executionState.payload || {};
  var normalizedStatus = normalizeStatus(payload.status);
  var normalizedSlug = normalizeLoginSlug(payload.loginSlug);
  var photoUrl = normalizeText(payload.photoUrl || payload.imageUrl);

  return {
    locationId: normalizeText(payload.locationId),
    name: normalizeText(payload.name),
    type: normalizeText(payload.type) || "Private location",
    status: normalizedStatus,
    isArchived: normalizedStatus === "archived",
    description: normalizeText(payload.description),
    schoolCode: normalizeText(payload.schoolCode),
    photoUrl: photoUrl,
    imageUrl: photoUrl,
    address: normalizeText(payload.address),
    city: normalizeText(payload.city),
    region: normalizeText(payload.region),
    country: normalizeText(payload.country) || "Kyrgyzstan",
    twoGisUrl: normalizeText(payload.twoGisUrl),
    latitude: normalizeOptionalNumber(payload.latitude),
    longitude: normalizeOptionalNumber(payload.longitude),
    contact: normalizeText(payload.contact),
    email: normalizeText(payload.email),
    website: normalizeText(payload.website),
    hours: normalizeText(payload.hours),
    socialLinks: normalizeSocialLinks(payload.socialLinks),
    loginMode: normalizeLoginMode(payload.loginMode),
    loginSlug: normalizedSlug,
    loginPath: normalizedSlug ? "/l/" + normalizedSlug : "",
    allowStudentLogin: payload.allowStudentLogin === false ? false : true,
    languages: normalizeTextArray(payload.languages, ["en", "ru"]),
    intentionStoreEnabled: payload.intentionStoreEnabled === false ? false : true,
    parentPortalEnabled: payload.parentPortalEnabled === true ? true : false,
    courseEditorEnabled: payload.courseEditorEnabled === false ? false : true,
    gamificationEnabled: payload.gamificationEnabled === false ? false : true,
    adminUids: normalizeTextArray(payload.adminUids, []),
    subscription: normalizeSubscription(payload.subscription)
  };
}

export function normalizeClassPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    classId: normalizeText(payload.classId),
    name: normalizeText(payload.name),
    locationId: normalizeText(payload.locationId),
    status: normalizeStatus(payload.status),
    isVisible: payload.isVisible === false ? false : true,
    photoDataUrl: normalizeText(payload.photoDataUrl)
  };
}

export function normalizeStudentPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    studentId: normalizeText(payload.studentId),
    name: normalizeText(payload.name),
    photoUrl: normalizeText(payload.photoUrl),
    classId: normalizeText(payload.classId),
    locationId: normalizeText(payload.locationId),
    status: normalizeStatus(payload.status),
    email: normalizeText(payload.email),
    username: normalizeText(payload.username),
    fruitPassword: normalizeFruitPassword(payload.fruitPassword)
  };
}

export function normalizeFruitPasswordResetPayload(executionState) {
  var payload = executionState.payload || {};

  return {
    studentId: normalizeText(payload.studentId),
    fruitPassword: normalizeFruitPassword(payload.fruitPassword)
  };
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function normalizeStatus(value) {
  if (value === "inactive" || value === "archived" || value === "approved") {
    return value;
  }

  return "active";
}

function normalizeLoginMode(value) {
  if (value === "standard" || value === "hybrid") {
    return value;
  }

  return "fruit";
}

function normalizeLoginSlug(value) {
  var text = normalizeText(value).toLowerCase();

  text = text.replace(/[^a-z0-9]+/g, "-");
  text = text.replace(/^-+/, "");
  text = text.replace(/-+$/, "");

  return text;
}

function normalizeOptionalNumber(value) {
  var numberValue = null;

  if (value === "" || value === undefined || value === null) {
    return null;
  }

  numberValue = Number(value);

  if (!Number.isFinite(numberValue)) {
    return null;
  }

  return numberValue;
}

function normalizeTextArray(value, fallback) {
  var result = [];
  var index = 0;
  var source = value;

  if (typeof source === "string") {
    source = source.split(",");
  }

  if (!Array.isArray(source)) {
    return fallback.slice();
  }

  while (index < source.length) {
    var item = normalizeText(source[index]);

    if (item && result.indexOf(item) === -1) {
      result.push(item);
    }

    index = index + 1;
  }

  return result;
}

function normalizeSocialLinks(value) {
  var links = value || {};

  return {
    instagram: normalizeText(links.instagram),
    facebook: normalizeText(links.facebook),
    telegram: normalizeText(links.telegram),
    whatsapp: normalizeText(links.whatsapp),
    youtube: normalizeText(links.youtube)
  };
}

function normalizeSubscription(value) {
  var subscription = value || {};

  return {
    plan: normalizeText(subscription.plan) || "pilot",
    maxStudents: normalizeOptionalNumber(subscription.maxStudents),
    expiresAt: normalizeText(subscription.expiresAt) || null
  };
}

function normalizeFruitPassword(value) {
  var result = [];
  var index = 0;

  if (!Array.isArray(value)) {
    return result;
  }

  while (index < value.length && index < 4) {
    if (typeof value[index] === "string") {
      result.push(value[index]);
    }

    index = index + 1;
  }

  return result;
}
