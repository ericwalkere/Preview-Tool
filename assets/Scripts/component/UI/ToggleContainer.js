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
        toggleContainer: cc.ToggleContainer,
        showAll: cc.Node,
    },

    setToggle() {
        this.toggleContainer.toggleItems.forEach((toggle) => {
            toggle.getComponent("Toggle").setSplash();
        });
        if (this.toggleContainer.toggleItems[2]._pressed === true) {
            this.showAll.active = true;
        } else {
            this.showAll.active = false;
        }
    },
});
