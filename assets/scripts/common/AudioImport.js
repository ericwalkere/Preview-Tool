cc.Class({
    extends: require("FileImport"),

    acceptFile() {
        this._fileSelector.accept = "audio/*";
    },

    loadFile(file) {
        const path = URL.createObjectURL(file);
        const type = file.name.split(".").pop();
        cc.loader.load({ url: path, type }, (err, audioClip) => {
            // todo
            URL.revokeObjectURL(path);
        });
    },
});
