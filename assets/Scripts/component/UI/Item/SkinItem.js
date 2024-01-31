const Emitter = require("EventEmitter");
const EventCode = require("EventCode");
cc.Class({
    extends: require("LoadData"),

    onClick() {
        cc.log("click skin :", this.value);
    },
});
