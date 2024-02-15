cc.Class({
    extends: cc.Component,

    properties: {
        _fileSelector: null,
    },

    onLoad() {
        this.node.on("click", this.onClick, this);
    },

    onDestroy() {
        this.node.off("click", this.onClick, this);
    },

    onClick() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = this.acceptFile();
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) return;
            this.loadFile(file);
        };

        input.click();
    },

    acceptFile() {
        return "*";
    },

    loadFile(file) {},
});
