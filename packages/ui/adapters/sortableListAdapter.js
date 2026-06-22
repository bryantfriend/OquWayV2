import Sortable from "../../vendor/sortablejs/sortable.esm.js";

export function initializeSortableList(containerElement, configuration) {
  var safeConfiguration = configuration || {};

  if (!containerElement || typeof containerElement.querySelectorAll !== "function") {
    throw new Error("A valid containerElement is required for sortable lists.");
  }

  destroyExistingSortable(containerElement);

  var itemSelector = safeConfiguration.itemSelector || "[data-sortable-item-id]";
  var handleSelector = safeConfiguration.handleSelector || "[data-sortable-handle]";
  var originalOrder = readOrderedIds(containerElement, itemSelector);
  var saving = false;
  var instance = Sortable.create(containerElement, {
    animation: 150,
    draggable: itemSelector,
    handle: handleSelector,
    ghostClass: safeConfiguration.ghostClass || "oqu-sortable-ghost",
    chosenClass: safeConfiguration.chosenClass || "oqu-sortable-chosen",
    dragClass: safeConfiguration.dragClass || "oqu-sortable-drag",
    disabled: safeConfiguration.disabled === true,
    onEnd: function () {
      if (saving) {
        restoreOrder(containerElement, itemSelector, originalOrder);
        return;
      }

      var orderedIds = readOrderedIds(containerElement, itemSelector);

      if (areOrdersEqual(originalOrder, orderedIds)) {
        if (typeof safeConfiguration.onUnchanged === "function") {
          safeConfiguration.onUnchanged(orderedIds);
        }
        return;
      }

      saving = true;
      setDisabledState(instance, true);

      Promise.resolve(safeConfiguration.onReorder({
        orderedIds: orderedIds,
        previousOrderedIds: originalOrder.slice()
      })).then(function (result) {
        if (result === false) {
          restoreOrder(containerElement, itemSelector, originalOrder);
          return;
        }

        originalOrder = orderedIds.slice();
      }).catch(function () {
        restoreOrder(containerElement, itemSelector, originalOrder);
        if (typeof safeConfiguration.onFailure === "function") {
          safeConfiguration.onFailure(originalOrder.slice());
        }
      }).then(function () {
        saving = false;
        setDisabledState(instance, false);
      });
    }
  });

  containerElement.__oquwaySortable = instance;

  return {
    readOrder: function () {
      return readOrderedIds(containerElement, itemSelector);
    },
    updateOrder: function (orderedIds) {
      originalOrder = Array.isArray(orderedIds) ? orderedIds.slice() : readOrderedIds(containerElement, itemSelector);
    },
    destroy: function () {
      destroyExistingSortable(containerElement);
    }
  };
}

export function readOrderedIds(containerElement, itemSelector) {
  var selector = itemSelector || "[data-sortable-item-id]";
  var elements = containerElement ? containerElement.querySelectorAll(selector) : [];
  var ids = [];

  Array.prototype.forEach.call(elements, function (element) {
    var id = element.getAttribute("data-sortable-item-id") || element.getAttribute("data-module-id") || element.getAttribute("data-step-id") || "";
    if (id) {
      ids.push(id);
    }
  });

  return ids;
}

export function areOrdersEqual(firstOrder, secondOrder) {
  if (!Array.isArray(firstOrder) || !Array.isArray(secondOrder) || firstOrder.length !== secondOrder.length) {
    return false;
  }

  for (var index = 0; index < firstOrder.length; index++) {
    if (firstOrder[index] !== secondOrder[index]) {
      return false;
    }
  }

  return true;
}

function restoreOrder(containerElement, itemSelector, orderedIds) {
  var elementById = {};
  var elements = Array.prototype.slice.call(containerElement.querySelectorAll(itemSelector));

  elements.forEach(function (element) {
    var id = element.getAttribute("data-sortable-item-id") || "";
    if (id) {
      elementById[id] = element;
    }
  });

  orderedIds.forEach(function (id) {
    if (elementById[id]) {
      containerElement.appendChild(elementById[id]);
    }
  });
}

function destroyExistingSortable(containerElement) {
  if (containerElement && containerElement.__oquwaySortable) {
    containerElement.__oquwaySortable.destroy();
    containerElement.__oquwaySortable = null;
  }
}

function setDisabledState(instance, disabled) {
  if (instance && typeof instance.option === "function") {
    instance.option("disabled", disabled);
  }
}
