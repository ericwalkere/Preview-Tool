cc.Class({
    extends: cc.Component,

    properties: {
        toggleContainer: cc.ToggleContainer,
    },

    setToggle() {
        this.toggleContainer.toggleItems.forEach((toggle) => {
            toggle.getComponent("Toggle").setSplash();
        });
    },
});
