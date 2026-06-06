let state = {
    course: null,
    modules: [],
    moduleSourceCheck: null,
    selectedModuleId: null,
    permissions: null,
    isDraftSaving: false,
    isPublishing: false,
    isRepairingModules: false,
    isFetching: false,
    error: null,
    lastSaved: null
};

const listeners = [];

export const courseEditorStore = {
    getState: function () {
        return Object.assign({}, state);
    },

    subscribe: function (listenerFn) {
        listeners.push(listenerFn);
        return function unsubscribe() {
            const index = listeners.indexOf(listenerFn);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    },

    setState: function (partialState) {
        const nextState = Object.assign({}, state, partialState);
        state = nextState;

        listeners.forEach(function (listenerFn) {
            listenerFn(state);
        });
    },

    resetState: function () {
        state = {
            course: null,
            modules: [],
            moduleSourceCheck: null,
            selectedModuleId: null,
            permissions: null,
            isDraftSaving: false,
            isPublishing: false,
            isRepairingModules: false,
            isFetching: false,
            error: null,
            lastSaved: null
        };
        // Do not notify on reset until explicitly needed, or notify null
    }
};
