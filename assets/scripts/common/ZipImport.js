const JSZip = require("jszip");

const Emitter = require("EventEmitter");
const EventCode = require("EventCode");

cc.Class({
    extends: cc.Component,

    properties: {
        _fileSelector: null,
        _spineName: "",
        _countFile: 0,
    },

    onLoad() {
        this.initFileSelector();
        this.node.on("click", this.onClick, this);
    },

    initFileSelector() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed";
        input.style.visibility = "hidden";

        input.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = this.loadZip.bind(this);
            reader.readAsArrayBuffer(file);
        });

        document.body.appendChild(input);
        this._fileSelector = input;
    },

    onClick() {
        this._fileSelector.click();
    },

    loadZip(event) {
        const jszip = new JSZip();
        jszip.loadAsync(event.target.result).then((zip) => {
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
        });
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
            Emitter.instance.emit(EventCode.SPINE_POOL.ADD_JSON, this._spineName, json);
            this.loadCountCheck();
        });
    },

    loadAtlas(zipFile) {
        this._spineName = zipFile.name.split("/")[0];
        zipFile.async("string").then((data) => {
            Emitter.instance.emit(EventCode.SPINE_POOL.ADD_ATLAS, this._spineName, data);
            this.loadCountCheck();
        });
    },

    loadTexture(zipFile) {
        const paths = zipFile.name.split("/");
        this._spineName = paths[0];
        const imageName = paths[paths.length - 1];
        zipFile.async("base64").then((data) => {
            const img = new Image();
            img.src = "data:image/png;base64," + data;
            img.onload = () => {
                const texture = new cc.Texture2D();
                texture.initWithElement(img);
                texture.name = imageName;

                Emitter.instance.emit(EventCode.SPINE_POOL.ADD_TEXTURE, this._spineName, texture);
                this.loadCountCheck();
            };
        });
    },
});
