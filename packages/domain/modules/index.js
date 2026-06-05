import { readSafeString } from "../../shared/utils/index.js";

export function normalizeModule(moduleRecord) {
  var safeModule = moduleRecord || {};

  return Object.assign({}, safeModule, {
    id: readSafeString(safeModule.id || safeModule.moduleId),
    title: readModuleTitle(safeModule),
    status: readSafeString(safeModule.status || "draft") || "draft"
  });
}

export function readModuleTitle(moduleRecord) {
  var title = moduleRecord && moduleRecord.title;

  if (typeof title === "string") {
    return title.trim() || "Untitled Module";
  }

  if (title && typeof title.en === "string") {
    return title.en.trim() || "Untitled Module";
  }

  return readSafeString(moduleRecord && (moduleRecord.name || moduleRecord.displayName)).trim() || "Untitled Module";
}

export * from "./moduleRepository.js";
