import { SVG } from "../../vendor/svgdotjs/svg.esm.js";
import { sanitizeRestrictedSvg } from "../../shared/security/contentSanitizer.js";

export function initializeSvgScene(containerElement, configuration) {
  var safeConfiguration = configuration || {};

  if (!containerElement) {
    throw new Error("A valid containerElement is required for SVG scenes.");
  }

  destroyExistingScene(containerElement);
  containerElement.textContent = "";

  var viewBox = safeConfiguration.viewBox || { x: 0, y: 0, width: 640, height: 320 };
  var draw = SVG().addTo(containerElement).viewbox(viewBox.x, viewBox.y, viewBox.width, viewBox.height).attr({
    role: "img",
    "aria-labelledby": safeConfiguration.titleId || "oqu-svg-scene-title"
  });

  draw.node.style.width = "100%";
  draw.node.style.height = "auto";
  draw.node.setAttribute("data-oqu-svg-root", "true");

  if (safeConfiguration.title) {
    var titleElement = document.createElementNS("http://www.w3.org/2000/svg", "title");
    titleElement.setAttribute("id", escapeAttribute(safeConfiguration.titleId || "oqu-svg-scene-title"));
    titleElement.textContent = safeConfiguration.title;
    draw.node.appendChild(titleElement);
  }

  if (safeConfiguration.description) {
    var desc = document.createElementNS("http://www.w3.org/2000/svg", "desc");
    desc.textContent = safeConfiguration.description;
    draw.node.appendChild(desc);
  }

  var listeners = [];
  var reducedMotion = typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  if (safeConfiguration.rawSvgMarkup) {
    draw.svg(sanitizeRestrictedSvg(safeConfiguration.rawSvgMarkup));
  }

  var scene = {
    draw: draw,
    reducedMotion: reducedMotion,
    addNode: function (nodeConfiguration) {
      return addSceneNode(draw, nodeConfiguration || {}, safeConfiguration, listeners, reducedMotion);
    },
    destroy: function () {
      listeners.forEach(function (listener) {
        listener.element.removeEventListener(listener.type, listener.handler);
      });
      draw.clear();
      draw.remove();
      containerElement.__oquwaySvgScene = null;
    }
  };

  containerElement.__oquwaySvgScene = scene;
  return scene;
}

export function renderRoadmapSvgScene(containerElement, configuration) {
  var safeConfiguration = configuration || {};
  var items = Array.isArray(safeConfiguration.items) ? safeConfiguration.items : [];
  var scene = initializeSvgScene(containerElement, {
    title: safeConfiguration.title || "Roadmap",
    description: safeConfiguration.description || "Interactive roadmap scene",
    viewBox: { x: 0, y: 0, width: 640, height: 300 },
    onInteraction: safeConfiguration.onInteraction
  });

  if (items.length === 0) {
    scene.draw.text(safeConfiguration.emptyText || "Roadmap needs items.").font({ size: 20, weight: 700 }).move(40, 130).fill("#475569");
    return scene;
  }

  var gap = items.length > 1 ? 520 / (items.length - 1) : 0;
  var previousPoint = null;

  items.forEach(function (item, index) {
    var x = 60 + gap * index;
    var y = index % 2 === 0 ? 92 : 190;
    var point = { x: x, y: y };

    if (previousPoint) {
      scene.draw.line(previousPoint.x, previousPoint.y, x, y).stroke({ color: "#bfdbfe", width: 8, linecap: "round" });
      scene.draw.line(previousPoint.x, previousPoint.y, x, y).stroke({ color: "#2563eb", width: 3, linecap: "round" });
    }

    scene.addNode({
      id: item.id || "roadmap-" + index,
      label: item.title || "Roadmap item " + (index + 1),
      description: item.description || "",
      number: item.number || String(index + 1),
      x: x,
      y: y,
      interactive: true
    });

    previousPoint = point;
  });

  return scene;
}

function addSceneNode(draw, nodeConfiguration, sceneConfiguration, listeners, reducedMotion) {
  var group = draw.group().attr({
    tabindex: nodeConfiguration.interactive ? "0" : null,
    role: nodeConfiguration.interactive ? "button" : "img",
    "aria-label": nodeConfiguration.label || ""
  });

  group.circle(58).center(nodeConfiguration.x, nodeConfiguration.y).fill("#eff6ff").stroke({ color: "#2563eb", width: 3 });
  group.text(String(nodeConfiguration.number || "")).font({ size: 18, weight: 900, anchor: "middle" }).center(nodeConfiguration.x, nodeConfiguration.y - 1).fill("#1d4ed8");
  group.text(String(nodeConfiguration.label || "")).font({ size: 13, weight: 800, anchor: "middle" }).center(nodeConfiguration.x, nodeConfiguration.y + 48).fill("#0f172a");

  if (!reducedMotion) {
    group.animate(280).ease("-").transform({ scale: 1.02, origin: [nodeConfiguration.x, nodeConfiguration.y] }).animate(280).transform({ scale: 1, origin: [nodeConfiguration.x, nodeConfiguration.y] });
  }

  if (nodeConfiguration.interactive) {
    bindInteraction(group.node, "click", nodeConfiguration, sceneConfiguration, listeners);
    bindInteraction(group.node, "keydown", nodeConfiguration, sceneConfiguration, listeners);
  }

  return group;
}

function bindInteraction(element, type, nodeConfiguration, sceneConfiguration, listeners) {
  function handler(event) {
    if (type === "keydown" && event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    if (typeof sceneConfiguration.onInteraction === "function") {
      sceneConfiguration.onInteraction({
        type: "activate",
        elementId: nodeConfiguration.id,
        label: nodeConfiguration.label
      });
    }
  }

  element.addEventListener(type, handler);
  listeners.push({ element: element, type: type, handler: handler });
}

function destroyExistingScene(containerElement) {
  if (containerElement && containerElement.__oquwaySvgScene) {
    containerElement.__oquwaySvgScene.destroy();
  }
}

function escapeAttribute(value) {
  return String(value == null ? "" : value).replace(/[^a-zA-Z0-9_-]/g, "-");
}
