cc.Class({
    extends: cc.Component,

    properties: {
        spineNode: cc.Node,
    },

    setSize(slide) {
        this.spineNode.scale = cc.v2(slide.progress * 2, slide.progress * 2);
    },
});
