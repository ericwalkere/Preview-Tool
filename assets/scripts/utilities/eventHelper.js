const Emitter = require("EventEmitter");

const registerEvent = (eventName, listener, target) => {
    if (!target.eventMap) {
        target.eventMap = {};
    }

    if (!target.eventMap[eventName]) {
        target.eventMap[eventName] = [];
    }

    const func = listener.bind(target);
    target.eventMap[eventName].push(func);
    Emitter.instance.registerEvent(eventName, func);
};

const registerOnce = (eventName, listener, target) => {
    const func = listener.bind(target);
    Emitter.instance.registerOnce(eventName, func);
};

const removeEvent = (eventName, target) => {
    if (!Emitter.instance || !target.eventMap || !target.eventMap[eventName]) {
        return;
    }

    target.eventMap[eventName].forEach((func) =>
        Emitter.instance.removeEvent(eventName, func)
    );
    delete target.eventMap[eventName];
};

const removeEvents = (target) => {
    if (!Emitter.instance || !target.eventMap) {
        return;
    }

    for (const eventName in target.eventMap) {
        removeEvent(eventName, target);
    }
    target.eventMap = {};
};

module.exports = {
    registerEvent,
    registerOnce,
    removeEvent,
    removeEvents,
};
