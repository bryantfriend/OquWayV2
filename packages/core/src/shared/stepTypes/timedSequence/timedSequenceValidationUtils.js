export function isCorrectTimedSequenceInput(sequence, playerIndex, itemId) {
  if (!Array.isArray(sequence) || playerIndex < 0 || playerIndex >= sequence.length) {
    return false;
  }

  return normalize(sequence[playerIndex]) === normalize(itemId);
}

export function createTimedSequence(items, length, level) {
  var safeItems = Array.isArray(items) ? items.filter(function (item) {
    return item && typeof item.id === "string" && item.id.length > 0;
  }) : [];
  var safeLength = Math.max(1, Math.round(Number(length) || 1));
  var safeLevel = Math.max(1, Math.round(Number(level) || 1));
  var sequence = [];
  var index = 0;

  if (safeItems.length === 0) {
    return sequence;
  }

  while (index < safeLength) {
    sequence.push(safeItems[(index + safeLevel - 1) % safeItems.length].id);
    index = index + 1;
  }

  return sequence;
}

export function readTimedSequenceItem(items, itemId) {
  var safeItemId = normalize(itemId);
  var index = 0;

  if (!Array.isArray(items)) {
    return null;
  }

  while (index < items.length) {
    if (normalize(items[index] && items[index].id) === safeItemId) {
      return items[index];
    }
    index = index + 1;
  }

  return null;
}

function normalize(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}
