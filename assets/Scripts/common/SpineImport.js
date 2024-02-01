const JSZip = require("jszip");

const EventCode = require("EventCode");
const Emitter = require("EventEmitter");

cc.Class({
    extends: require("FileImport"),

    properties: {
        _spineName: "",
        _countFile: 0,
    },

    acceptFile() {
        return "application/zip";
    },

    loadFile(file) {
        const reader = new FileReader();
        reader.onload = this.loadZip.bind(this);
        reader.readAsArrayBuffer(file);
    },

    loadZip(event) {
        const jszip = new JSZip();
        jszip
            .loadAsync(event.target.result)
            .then((zip) => {
                const files = zip.files;
                this._countFile = Object.keys(files).length;
                for (const fileName in files) {
                    if (fileName.includes("__MACOSX")) {
                        this.loadCountCheck();
                        continue;
                    }

                    const types = fileName.split(".");
                    const type = types[types.length - 1];
                    const subtype = types[types.length - 2];

                    const zipFile = zip.file(fileName);
                    if (type === "json") {
                        this.loadJson(zipFile);
                    } else if (type === "atlas" || (type === "txt" && subtype === "atlas")) {
                        this.loadAtlas(zipFile);
                    } else if (type === "png") {
                        this.loadTexture(zipFile);
                    } else {
                        this.loadCountCheck();
                    }
                }
            })
            .catch((err) => cc.error("ERROR:", err));
    },

    loadCountCheck() {
        this._countFile--;
        if (this._countFile === 0) {
            Emitter.instance.emit(EventCode.SPINE_POOL.ADD_SPINE, this._spineName);
        }
    },

    loadJson(zipFile) {
        this._spineName = zipFile.name.split("/")[0];
        zipFile.async("string").then((data) => {
            const json = JSON.parse(data);
            Emitter.instance.emit(EventCode.SPINE_POOL.ADD_JSON, json);
            cc.log(`LOADED: ${zipFile.name}`);
            this.loadCountCheck();
        });
    },

    loadAtlas(zipFile) {
        this._spineName = zipFile.name.split("/")[0];
        zipFile.async("string").then((data) => {
            Emitter.instance.emit(EventCode.SPINE_POOL.ADD_ATLAS, data);
            cc.log(`LOADED: ${zipFile.name}`);
            this.loadCountCheck();
        });
    },

    loadTexture(zipFile) {
        const paths = zipFile.name.split("/");
        this._spineName = paths[0];
        const imageName = paths[paths.length - 1];
        zipFile.async("blob").then((data) => {
            const file = new File([data], imageName);
            const path = URL.createObjectURL(file);
            cc.loader.load({ url: path, type: "png" }, (err, texture) => {
                URL.revokeObjectURL(path);
                if (err) {
                    cc.error("ERROR:", err);
                    return;
                }

                texture.name = imageName;
                Emitter.instance.emit(EventCode.SPINE_POOL.ADD_TEXTURE, texture);
                cc.log(`LOADED: ${zipFile.name}`);
                this.loadCountCheck();
            });
        });
    },
});
