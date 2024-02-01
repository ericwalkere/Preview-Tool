cc.Class({
    extends: cc.Component,

    properties: {
        text: cc.Label,
    },

    setText(name) {
        this.text.string = name;
    },
});
