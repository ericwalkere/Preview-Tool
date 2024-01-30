const EventCode = require("EventCode");
const Emitter = require("EventEmitter");
const { registerEvent } = require("eventHelper");

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        this._json = null;
        this._name = "";

        // this.node.on('click', this.onClick, this);
        this.initEvents();
    },

    initEvents() {
        registerEvent(EventCode.EXPORT.GET_DATA, this.getData, this);
    },

    getData(name, json) {
        this._name = name;
        this._json = json;
    },

    onClick() {
        Emitter.instance.emit(EventCode.SPINE_POOL.EXPORT_JSON);
        delete this._json.listeners;

        if ("showSaveFilePicker" in window) {
            this.useSaveFilePicker(this._name, this._json);
        } else {
            this.useDownload(this._name, this._json);
        }
    },

    useSaveFilePicker(name, json) {
        const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
        window
            .showSaveFilePicker({
                startIn: "downloads",
                suggestedName: `${name}.json`,
                types: [{ accept: { "application/json": [".json"] } }],
            })
            .then((fileHandle) => fileHandle.createWritable())
            .then((stream) => stream.write(blob).then(() => stream))
            .then((stream) => stream.close())
            .catch((err) => cc.error("ERROR:", err));
    },

    useDownload(name, json) {
        const filename = `${name}.json`;
        const jsonStr = JSON.stringify(json);

        let element = document.createElement("a");
        element.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(jsonStr));
        element.setAttribute("download", filename);
        element.click();
    },
});
