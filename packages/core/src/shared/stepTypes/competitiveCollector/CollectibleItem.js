export function renderCollectibleItem(item, escapeHtml) {
  var rarity = item.rarity || "common";
  var correctness = item.isCorrect === false ? "incorrect" : "correct";

  return '<button type="button" class="collector-item collector-item-' + escapeHtml(rarity) + ' collector-item-' + correctness + '" data-collector-item="' + escapeHtml(item.id) + '">'
    + '<span class="collector-item-orb" aria-hidden="true">' + escapeHtml(readRarityGlyph(rarity, correctness)) + '</span>'
    + '<strong>' + escapeHtml(item.label) + '</strong>'
    + '<em>' + (item.points > 0 ? "+" : "") + escapeHtml(String(item.points)) + '</em>'
    + '</button>';
}

function readRarityGlyph(rarity, correctness) {
  if (correctness === "incorrect") {
    return "!";
  }

  if (rarity === "rare") {
    return "*";
  }

  return "+";
}
