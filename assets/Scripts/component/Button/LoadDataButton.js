cc.Class({
    extends: require("CustomButton"),

    properties: {
        text: cc.Label,
    },

    setData(value) {
        this.text.string = value;
        this.value = value;
    },
});
