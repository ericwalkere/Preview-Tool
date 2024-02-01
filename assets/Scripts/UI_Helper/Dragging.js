cc.Class({
    extends: cc.Component,

    properties: {
        _canMove: false,
    },

    onLoad() {
        this.node.on("mousedown", this.onMouseDown, this);
        this.node.on("mousemove", this.onMouseMove, this);
        this.node.on("mouseup", this.onMouseUp, this);
    },

    onMouseDown(event) {
        this._canMove = true;
    },

    onMouseMove(event) {
        if (this._canMove) {
            const delta = event.getDelta();
            const newPosition = this.node.position.add(delta);
            this.node.position = newPosition;
        }
    },

    onMouseUp() {
        this._canMove = false;
    },
});
