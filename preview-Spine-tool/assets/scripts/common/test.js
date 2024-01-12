// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {},

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
      const selectedFiles = event.target.files;

      if (selectedFiles.length > 0) {
        const selectedFolder =
          selectedFiles[0].webkitRelativePath.split("/")[0];
        cc.log("Selected folder:", selectedFolder);
      }
    });

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  },
});
