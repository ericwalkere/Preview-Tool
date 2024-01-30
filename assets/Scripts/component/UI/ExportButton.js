
const { registerEvent } = require("eventHelper");
const EventCode = require("EventCode");

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad() {
        registerEvent(EventCode.EXPORT.GET_JSON, this.getJson, this);
    },

    onClick() {
        const filename = "data.json";
        delete this.json.listeners;
        const jsonStr = JSON.stringify(this.json, null, 2);

        let element = document.createElement("a");
        element.setAttribute("href", "data:application/json;charset=utf-8," + encodeURIComponent(jsonStr));
        element.setAttribute("download", filename);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },

    getJson(json) {
        this.json = json;
    },
});
