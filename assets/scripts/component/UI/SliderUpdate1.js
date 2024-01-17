cc.Class({
    extends: cc.Component,

    properties: {
        slide: cc.Slider,
        bar: cc.Node,
        background: cc.Node,
    },

    updateSlide() {
        this.bar.width = this.slide.progress * this.background.width;
    },

    updateProgress(progress) {
        this.slide.progress = progress;
        this.updateSlide();
    },
});
