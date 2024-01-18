cc.Class({
    extends: cc.Component,

    properties: {
        _fileSelector: null,
    },

    onLoad() {
        this.initFileSelector();
        this.node.on("click", this.onClick, this);
    },

    initFileSelector() {
        this._fileSelector = document.createElement("input");
        this._fileSelector.type = "file";
        this._fileSelector.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;

            this.loadFile(file);
        });
        this.acceptFile();
    },

    acceptFile() {
        this._fileSelector.accept = "";
    },

    onClick() {
        this._fileSelector.click();
    },

    loadFile(file) {},
});
