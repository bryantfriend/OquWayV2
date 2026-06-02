class StudentDashboardStore {
  constructor() {
    this.state = createInitialState();
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

  reset() {
    this.state = createInitialState();
    this.notify();
  }
}

function createInitialState() {
  return {
    isLoading: true,
    isCourseOpening: false,
    isPlayerLoading: false,
    isSavingProgress: false,
    error: null,
    statusMessage: "",
    student: null,
    courses: [],
    continueLearning: null,
    dailyBonus: null,
    intentionPoints: {
      cognitive: 0,
      physical: 0,
      creative: 0,
      social: 0
    },
    progressSummary: null,
    selectedCourseId: null,
    selectedModuleId: null,
    selectedSessionId: null,
    selectedPracticeModeKey: "beforeClass",
    playerMode: false,
    currentStepIndex: 0,
    practiceModeFinished: false,
    actorIsPreview: false
  };
}

export const studentDashboardStore = new StudentDashboardStore();
