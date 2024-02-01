cc.Class({
    extends: cc.Component,

    properties: {
        toggle: cc.Toggle,
        splash: cc.Node,
        list: cc.Node,
    },

    setSplash() {
        this.splash.active = !this.toggle.isChecked;
        this.list.active = this.toggle.isChecked;
    },
});
