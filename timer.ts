const listenerOptions = { once: true, passive: true } as const;

const timer = (delay: number, signal?: AbortSignal): Promise<void> => {
    if (delay < 0) {
        throw new RangeError("Argument `delay` must be a positive number");
    }

    if (signal === undefined) {
        return new Promise((resolve) => setTimeout(resolve, delay));
    }

    return new Promise((resolve, reject) => {
        if (signal.aborted) {
            throw signal.reason;
        }

        const callback = () => {
            resolve();
            signal.removeEventListener("abort", listener);
        };

        const listener = (_ev: Event) => {
            clearTimeout(id);
            reject(signal.reason);
        };

        const id = setTimeout(callback, delay);

        signal.addEventListener("abort", listener, listenerOptions);
    });
};

export default timer;
