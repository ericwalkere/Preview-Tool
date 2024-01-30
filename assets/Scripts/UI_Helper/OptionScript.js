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
        background: cc.Node,
        content: cc.Node,
        view: cc.Node,
    },

    update(dt) {
        this.background.width = this.content.width + 10;
        this.background.height = this.content.height + 5;
        this.background.x = this.content.x;
        this.background.y = this.content.y;

        if (this.content.height <= this.view.height) {
            this.node.width = this.content.width;
            this.node.height = this.content.height;
        } else if (this.content.height >= this.view.height) {
            this.node.width = this.view.width;
            this.node.height = this.view.height;
        }
    },
});
