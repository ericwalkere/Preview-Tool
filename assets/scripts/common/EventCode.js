const EventCode = {
    SPINE_POOL: {
        ADD_JSON: "ADD_JSON",
        ADD_ATLAS: "ADD_ATLAS",
        ADD_TEXTURE: "ADD_TEXTURE",
        ADD_SPINE: "ADD_SPINE",
        LOAD_ANIMATIONS: "LOAD_ANIMATIONS",
        LOAD_SKINS: "LOAD_SKINS",
    },

    SPINE_CTRL: {
        SET_ANIM: "SET_ANIM",
        SET_LOOP:"SET_LOOP",
        UPDATE_TIME: "UPDATE_TIME",
    },

    UI_BOTTOM: {
        TIME_BAR: "TIME_BAR",
    },

    TIMELINE: {
        UPDATE_TIMELINE: "UPDATE_TIMELINE",
        SET_DURATION_TIME: "SET_DURATION_TIME",
    },

    AUDIO:{
        PLAY_SOUND:"PLAY_SOUND",
    }
};

module.exports = EventCode;
