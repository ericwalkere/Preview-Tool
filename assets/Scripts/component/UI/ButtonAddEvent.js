// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        button: cc.Node,
        box: cc.EditBox,
    },

    clickButton() {
        this.button.active = false;
        this.box.node.active = true;
        this.box.string = "";
    },

    enterText() {
        this.button.active = true;
        this.box.node.active = false;
        cc.log(this.box.string);
    },

    onLeave() {
        if (this.box.string.trim() !== "") {
            return;
        }
        this.button.active = true;
        this.box.node.active = false;
    },

});
