cc.Class({
    extends: cc.Component,

    properties: {
        _canMove: false,
    },

    onLoad() {
        this.node.on("mousedown", this.onMouseDown, this);
        this.node.on("mousemove", this.onMouseMove, this);
        this.node.on("mouseup", this.onMouseUp, this);
        this.node.on("mouseleave", this.onMouseLeave, this);
    },

    onMouseDown() {
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

    onMouseLeave() {
        this._canMove = false;
    },
});
