import { StepNameEngine } from "./StepNameEngine.js?v=1.1.112-student-assignment-error-debug";
import { StepNameIntent } from "./StepNameIntent.js?v=1.1.112-student-assignment-error-debug";

export default class StepName {

  static get id() { return "stepName"; }
  static get version() { return "1.0.0"; }
  static get displayName() { return "Step Name"; }

  static get defaultConfig() {
    return {};
  }

  static get editorSchema() {
    return { type: "object", fields: [] };
  }

  static get icfHandlers() {
    return StepNameIntent;
  }

  static _renderStep({ container, config, context }) {

    var engine = new StepNameEngine({
      container,
      config,
      onIntent: function (intent, payload) {
        context.icf.dispatch({
          intent: intent,
          payload: payload
        });
      }
    });

    engine.mount();
  }
}
