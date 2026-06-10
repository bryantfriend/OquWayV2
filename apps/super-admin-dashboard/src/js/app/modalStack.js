var MODAL_STACK_BASE_Z_INDEX = 1000;
var modalStackKeys = [];
var runtimeModalId = 0;
var installedRoots = new WeakSet();

var MODAL_STACK_SELECTOR = "[data-modal-stack-key], .sa-modal-backdrop, .sa-location-command-backdrop";

export function installModalStacking(root) {
  if (!root || installedRoots.has(root)) {
    return;
  }

  root.addEventListener("pointerdown", handleModalStackInteraction, true);
  root.addEventListener("focusin", handleModalStackInteraction, true);
  installedRoots.add(root);
  syncModalStack(root);
}

export function syncModalStack(root) {
  var modalRoots = readModalRoots(root);
  var activeKeys = modalRoots.map(readModalKey);

  modalStackKeys = modalStackKeys.filter(function (key) {
    return activeKeys.indexOf(key) !== -1;
  });

  modalRoots.forEach(function (modalRoot) {
    var key = readModalKey(modalRoot);

    if (modalStackKeys.indexOf(key) === -1) {
      modalStackKeys.push(key);
    }
  });

  applyModalStack(modalRoots);
}

export function bringModalToFront(modalElement) {
  var modalRoot = resolveModalRoot(modalElement);

  if (!modalRoot) {
    return 0;
  }

  var key = readModalKey(modalRoot);
  modalStackKeys = modalStackKeys.filter(function (existingKey) {
    return existingKey !== key;
  });
  modalStackKeys.push(key);
  applyModalStack(readModalRoots(readModalStackRoot(modalRoot)));

  return Number(modalRoot.style.zIndex) || 0;
}

function handleModalStackInteraction(event) {
  bringModalToFront(event.target);
}

function applyModalStack(modalRoots) {
  modalRoots.forEach(function (modalRoot) {
    var key = readModalKey(modalRoot);
    var stackIndex = modalStackKeys.indexOf(key);

    modalRoot.style.zIndex = String(MODAL_STACK_BASE_Z_INDEX + Math.max(stackIndex, 0) + 1);
  });
}

function readModalRoots(root) {
  if (!root || !root.querySelectorAll) {
    return [];
  }

  return Array.from(root.querySelectorAll(MODAL_STACK_SELECTOR));
}

function resolveModalRoot(element) {
  if (!element || !element.closest) {
    return null;
  }

  return element.closest(MODAL_STACK_SELECTOR);
}

function readModalStackRoot(modalRoot) {
  return modalRoot.parentElement || modalRoot.parentNode || modalRoot.parent || document;
}

function readModalKey(modalRoot) {
  var configuredKey = modalRoot.getAttribute("data-modal-stack-key");

  if (configuredKey) {
    return configuredKey;
  }

  var classKey = readClassModalKey(modalRoot);

  if (classKey) {
    return classKey;
  }

  var runtimeKey = modalRoot.getAttribute("data-modal-stack-runtime-key");

  if (!runtimeKey) {
    runtimeModalId += 1;
    runtimeKey = "runtime-modal-" + runtimeModalId;
    modalRoot.setAttribute("data-modal-stack-runtime-key", runtimeKey);
  }

  return runtimeKey;
}

function readClassModalKey(modalRoot) {
  var modalClasses = [
    "sa-user-create-backdrop",
    "sa-user-command-backdrop",
    "sa-user-edit-backdrop",
    "sa-user-location-picker-backdrop",
    "sa-course-command-backdrop",
    "sa-module-command-backdrop",
    "sa-class-command-backdrop",
    "sa-class-staff-backdrop",
    "sa-assignment-staff-backdrop",
    "sa-location-command-backdrop"
  ];
  var index = 0;

  while (index < modalClasses.length) {
    if (modalRoot.classList.contains(modalClasses[index])) {
      return modalClasses[index];
    }

    index += 1;
  }

  return "";
}
