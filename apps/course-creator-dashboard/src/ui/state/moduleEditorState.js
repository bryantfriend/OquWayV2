// Simple observable store for module step editor state
class ModuleEditorStore {
  constructor() {
    this.state = {
      course: null,
      module: null,
      sessions: [],
      selectedSessionId: null,
      selectedPracticeModeKey: "beforeClass",
      steps: [],
      selectedStepId: null,
      isFetching: false,
      isDraftSaving: false,
      lastSaved: null,
      error: null,
      permissions: { canEdit: false }
    };
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return function unsubscribe() {
      var index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    }.bind(this);
  }

  notify() {
    var listenerIndex = 0;

    while (listenerIndex < this.listeners.length) {
      this.listeners[listenerIndex](this.state);
      listenerIndex = listenerIndex + 1;
    }
  }

  resetState() {
    this.state = {
      course: null,
      module: null,
      sessions: [],
      selectedSessionId: null,
      selectedPracticeModeKey: "beforeClass",
      steps: [],
      selectedStepId: null,
      isFetching: false,
      isDraftSaving: false,
      lastSaved: null,
      error: null,
      permissions: { canEdit: false }
    };
    this.notify();
  }
}

export const moduleEditorStore = new ModuleEditorStore();
