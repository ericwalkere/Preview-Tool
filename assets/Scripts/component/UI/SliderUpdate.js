cc.Class({
    extends: cc.Slider,

    properties: {
        progressBar: cc.ProgressBar,
    },

    _updateHandlePosition() {
        this._super();
        this.progressBar.progress = this.progress;
    }
});
