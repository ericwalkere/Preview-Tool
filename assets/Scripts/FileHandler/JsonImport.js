const EventCode = require("EventCode");
const Emitter = require("EventEmitter");

cc.Class({
    extends: require("FileImport"),

    acceptFile() {
        return "application/json";
    },

    loadFile(file) {
        const reader = new FileReader();
        reader.onload = this.loadJson.bind(this);
        reader.readAsText(file);
        cc.log("LOADED:", file.name);
    },

    loadJson(event) {
        const json = JSON.parse(event.target.result);
        Emitter.instance.emit(EventCode.SPINE_POOL.LOAD_JSON, json);
    },
});
