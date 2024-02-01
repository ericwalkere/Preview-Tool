cc.Class({
    extends: cc.Component,

    properties: {
        background: cc.Node,
        content: cc.Node,
        view: cc.Node,
    },

    update(dt) {
        this.reloadSize();
    },

    reloadSize() {
        const widthSize = 10;
        const heightSize = 5;
        this.background.x = this.view.x;
        this.background.y = this.view.y;

        if (this.content.children.length === 0) {
            this.background.width = 0;
            this.background.height = 0;
        } else if (this.content.height <= this.view.height) {
            this.node.width = this.content.width;
            this.node.height = this.content.height;
            this.background.width = this.content.width + widthSize;
            this.background.height = this.content.height + heightSize;
        } else if (this.content.height >= this.view.height) {
            this.node.width = this.view.width;
            this.node.height = this.view.height;
            this.background.width = this.content.width + widthSize;
            this.background.height = this.content.height + heightSize;
        }
    },
});
