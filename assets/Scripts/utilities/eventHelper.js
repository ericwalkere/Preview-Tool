const Emitter = require("EventEmitter");

const registerEvent = (eventName, listener, target) => {
    if (!target.__eventMap) {
        target.__eventMap = {};
    }

    if (!target.__eventMap[eventName]) {
        target.__eventMap[eventName] = [];
    }

    const func = listener.bind(target);
    target.__eventMap[eventName].push(func);
    Emitter.instance.registerEvent(eventName, func);
};

const registerOnce = (eventName, listener, target) => {
    const func = listener.bind(target);
    Emitter.instance.registerOnce(eventName, func);
};

const removeEvent = (eventName, target) => {
    if (!Emitter.instance || !target.__eventMap || !target.__eventMap[eventName]) {
        return;
    }

    target.__eventMap[eventName].forEach((func) =>
        Emitter.instance.removeEvent(eventName, func)
    );
    delete target.__eventMap[eventName];
};

const removeEvents = (target) => {
    if (!Emitter.instance || !target.__eventMap) {
        return;
    }

    for (const eventName in target.__eventMap) {
        removeEvent(eventName, target);
    }
    target.__eventMap = {};
};

module.exports = {
    registerEvent,
    registerOnce,
    removeEvent,
    removeEvents,
};
