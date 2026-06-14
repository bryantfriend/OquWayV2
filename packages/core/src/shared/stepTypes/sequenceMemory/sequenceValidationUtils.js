export function isCorrectSequenceInput(sequence, playerIndex, padId) {
  if (!Array.isArray(sequence) || playerIndex < 0 || playerIndex >= sequence.length) {
    return false;
  }

  return normalizeId(sequence[playerIndex]) === normalizeId(padId);
}

export function createRandomSequence(pads, length) {
  var safePads = Array.isArray(pads) ? pads.filter(function (pad) {
    return pad && typeof pad.id === "string" && pad.id.length > 0;
  }) : [];
  var safeLength = Math.max(1, Math.round(Number(length) || 1));
  var sequence = [];
  var index = 0;

  if (safePads.length === 0) {
    return sequence;
  }

  while (index < safeLength) {
    sequence.push(safePads[Math.floor(Math.random() * safePads.length)].id);
    index = index + 1;
  }

  return sequence;
}

export function readPadById(pads, padId) {
  var safePadId = normalizeId(padId);
  var index = 0;

  if (!Array.isArray(pads)) {
    return null;
  }

  while (index < pads.length) {
    if (normalizeId(pads[index] && pads[index].id) === safePadId) {
      return pads[index];
    }
    index = index + 1;
  }

  return null;
}

function normalizeId(value) {
  return typeof value === "string" ? value.trim() : "";
}
