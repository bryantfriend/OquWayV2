export function getRequiredElement(id) {
  var element = document.getElementById(id);

  if (!element) {
    throw new Error("Missing required element: " + id);
  }

  return element;
}

export function setHtml(element, html) {
  element.innerHTML = html;
}
