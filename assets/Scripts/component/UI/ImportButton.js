const EventCode = require("EventCode");
const Emitter = require("EventEmitter");

cc.Class({
    extends: require("FileImport"),

    properties: {},

    acceptFile() {
        return "data/json";
    },

    loadFile(file) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            const json = JSON.parse(reader.result);
            Emitter.instance.emit(EventCode.SPINE_POOL.GET_JSON, json);
        };
    },
});
