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
  },
  
  start() {
    this.node.on("click", this.buttonClickCallback, this);
  },

  buttonClickCallback(event) {
    cc.log("Button Clicked!");
    this.openFileDialog();
  },

  openFileDialog() {
    const input = document.createElement("input");
    input.type = "file";
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
        for (const fileName in zip.files) {
          zip
            .file(fileName)
            .async("string")
            .then((data) => {
              if (fileName.split(".").pop() === "json") {
                let json = JSON.parse(data);
                console.log(json);
                let animList = Object.keys(json.animations);
                cc.log(animList);
              }
            });
        }
      });
    };
    reader.readAsArrayBuffer(file);
  },
});
