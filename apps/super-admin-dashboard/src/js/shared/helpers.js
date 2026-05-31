export function readSafeString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value;
}

export function splitCommaList(value) {
  var source = value;
  var result = [];
  var index = 0;

  if (typeof source === "string") {
    source = source.split(",");
  }

  if (!Array.isArray(source)) {
    return result;
  }

  while (index < source.length) {
    var item = readSafeString(source[index]).trim();

    if (item && result.indexOf(item) === -1) {
      result.push(item);
    }

    index = index + 1;
  }

  return result;
}

export function normalizeIdList(value) {
  return splitCommaList(value);
}

export function countItems(items, predicate) {
  var count = 0;
  var index = 0;

  while (index < items.length) {
    if (predicate(items[index])) {
      count = count + 1;
    }
    index = index + 1;
  }

  return count;
}
