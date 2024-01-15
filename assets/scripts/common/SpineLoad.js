const JSZip = require("jszip");

cc.Class({
    extends: cc.Component,

    properties: {
        spinePrefab: cc.Prefab,
    },

    openFileDialog() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".zip";
        input.style.display = "none";

        input.addEventListener("change", (event) => {
            const zipFile = event.target.files[0];
            this.loadZip(zipFile);
        });

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
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
                                img.onload = () => {
                                    const texture = new cc.Texture2D();
                                    texture.width = img.width;
                                    texture.height = img.height;
                                    texture.initWithElement(img);
                                    texture.name = fileName.split("/")[fileName.split("/").length - 1];
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
});
