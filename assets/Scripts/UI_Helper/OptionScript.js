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
