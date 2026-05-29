let state = {
    courses: [],
    searchQuery: "",
    filterTag: "Filter by Tag",
    sortBy: "Date Created",
    showArchived: false,
    isCreateModalOpen: false,
    isFetching: false,
    error: null
};

const listeners = [];

export const courseCreatorStore = {
    getState: function () {
        // ICF Rule: Return copies to prevent direct mutation
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
        // ICF Rule: Use Object.assign for fresh state objects
        const nextState = Object.assign({}, state, partialState);
        state = nextState;

        // Notify all subscribers
        listeners.forEach(function (listenerFn) {
            listenerFn(state);
        });
    }
};
