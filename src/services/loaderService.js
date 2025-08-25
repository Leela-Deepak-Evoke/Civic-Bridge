let listeners = [];

export const loaderService = {
    show() {
        listeners.forEach((cb) => cb(true));
    },
    hide() {
        listeners.forEach((cb) => cb(false));
    },
    subscribe(callback) {
        listeners.push(callback);
        return () => {
            listeners = listeners.filter((l) => l !== callback);
        };
    },
};
