const EventEmitter = require("events");

class Emitter {
    constructor() {
        this._emitter = new EventEmitter();
        this._emitter.setMaxListeners(100);
    }

    emit(eventName, ...args) {
        this._emitter.emit(eventName, ...args);
    }

    registerEvent(eventName, listener) {
        this._emitter.on(eventName, listener);
    }

    registerOnce(eventName, listener) {
        this._emitter.once(eventName, listener);
    }

    removeEvent(eventName, listener) {
        this._emitter.removeListener(eventName, listener);
    }

    destroy() {
        this._emitter.removeAllListeners();
        this._emitter = null;
        Emitter.instance = null;
    }
}

Emitter.instance = null;

module.exports = Emitter;
