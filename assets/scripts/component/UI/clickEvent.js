
cc.Class({
    extends: cc.Component,

    properties: {
        hintText: cc.Label,
        removeBtn: cc.Node,
    },

    onLoad() {
        this.node.on("mouseenter", this.onEnter.bind(this));
        this.node.on("mouseleave", this.onExit.bind(this));
        this.node.on(cc.Node.EventType.MOUSE_DOWN, this.showRemove, this);
    },

    onEnter() {
        this.hintText.node.active = true;
    },

    onExit() {
        this.hintText.node.active = false;
    },

    hint(text) {
        this.hintText.string = text;
    },

    showRemove(event){
        if (event.getButton() === 2) {
            this.removeBtn.active = true;
            event.stopPropagation();
        }
    },

    removeEventKey(){
        this.node.active = false;
        cc.log('REMOVED')
    },
});
