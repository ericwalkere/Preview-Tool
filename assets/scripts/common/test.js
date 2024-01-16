// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
const JSZip = require("jszip");
cc.Class({
    extends: cc.Component,

    properties: {
        spinePrefab: cc.Prefab,
        spineParent: cc.Node,
    },

    start() {
        this.openFileDialog();
        this.node.on("click", this.buttonClickCallback, this);
    },

    buttonClickCallback(event) {
        cc.log("Button Clicked!");
        this.input.click();
    },

    openFileDialog() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "zip,application/octet-stream,application/zip,application/x-zip,application/x-zip-compressed";
        input.style.display = "none";

        input.addEventListener("change", (event) => {
            const zipFile = event.target.files[0];
            this.loadZip(zipFile);
        });

        document.body.appendChild(input);
        this.input = input;
    },

    loadZip(file) {
        let zip = new JSZip();
        const reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target.result;
            zip.loadAsync(arrayBuffer).then((zip) => {
                this.loadCount = Object.keys(zip.files).length;
                for (const fileName in zip.files) {
                    if (fileName.includes("_MACOS")) {
                        this.loadCountCheck();
                        continue;
                    }

                    const nameTypes = fileName.split(".");
                    const type = nameTypes[nameTypes.length - 1];
                    if (type === "json") {
                        zip.file(fileName)
                            .async("string")
                            .then((data) => {
                                this.json = JSON.parse(data);
                                this.loadCountCheck();
                            });
                    } else if (type === "atlas") {
                        zip.file(fileName)
                            .async("string")
                            .then((data) => {
                                this.atlas = data;
                                this.loadCountCheck();
                            });
                    } else if (type === "png") {
                        zip.file(fileName)
                            .async("base64")
                            .then((data) => {
                                const img = new Image();
                                img.src = "data:image/png;base64," + data;
                                cc.log(img.localName)
                                img.onload = () => {
                                    const texture = new cc.Texture2D();
                                    // texture.width = img.width;
                                    // texture.height = img.height;
                                    texture.initWithElement(img);
                                    texture.name = fileName.split("/")[fileName.split("/").length - 1];
                                    cc.log(texture)
                                    this.img = texture;
                                    this.imgName = texture.name;
                                    this.loadCountCheck();
                                };
                            });
                    } else {
                        this.loadCountCheck();
                    }
                }
            });
        };
        reader.readAsArrayBuffer(file);
    },

    loadCountCheck() {
        this.loadCount--;
        if (this.loadCount === 0) {
            this.buildSpine();
        }
    },

    buildSpine() {
        const data = new sp.SkeletonData();
        data.skeletonJson = this.json;
        data.atlasText = this.atlas;
        data.textures.push(this.img);
        data.textureNames.push(this.imgName);

        const node = cc.instantiate(this.spinePrefab);
        node.parent = this.spineParent;
        node.getComponent(sp.Skeleton).skeletonData = data;
        // node.scale = cc.v2(0.5, 0.5);
        // node.getComponent(sp.Skeleton).setAnimation(0, 'run', true);
    },
});
