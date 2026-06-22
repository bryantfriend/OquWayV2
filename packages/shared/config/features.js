export const OQUWAY_FEATURE_FLAGS = {
  sortableAuthoring: true,
  localizedUi: true,
  svgRoadmapRenderer: true
};

export function isFeatureEnabled(featureName) {
  if (!featureName) {
    return false;
  }

  if (typeof window !== "undefined" && window.OQUWAY_FEATURE_FLAGS && Object.prototype.hasOwnProperty.call(window.OQUWAY_FEATURE_FLAGS, featureName)) {
    return window.OQUWAY_FEATURE_FLAGS[featureName] !== false;
  }

  return OQUWAY_FEATURE_FLAGS[featureName] !== false;
}
