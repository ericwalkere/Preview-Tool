const EventCode = {
    SPINE_POOL: {
        ADD_JSON: "ADD_JSON",
        ADD_ATLAS: "ADD_ATLAS",
        ADD_TEXTURE: "ADD_TEXTURE",
        ADD_SPINE: "ADD_SPINE",
    },

    SPINE_CTRL: {
        SET_ANIM: "SET_ANIM",
        SET_EVENT_LISTENER: "SET_EVENT_LISTENER",
        SET_LOOP: "SET_ANIM_LOOP",
        SET_PAUSED: "SET_ANIM_PAUSED",
        UPDATE_TIME: "UPDATE_TIME",

        ADD_EVENT_KEY: "ADD_EVENT_KEY",
        REMOVE_EVENT_KEY: "REMOVE_EVENT_KEY",
    },

    UI_BOTTOM: {
        TIME_BAR: "TIME_BAR",
    },

    TIMELINE: {
        UPDATE_TIMELINE: "UPDATE_TIMELINE",
        SET_DURATION_TIME: "SET_DURATION_TIME",
        SET_EVENT_KEY: "SET_EVENT_KEY",
        SET_CHILDREN: "SET_CHILDREN",
        GET_ANIM: "GET_ANIM",
        GET_EVENT_NAME: "GET_EVENT_NAME",
    },

    AUDIO: {
        PLAY_SOUND: "PLAY_SOUND",
    },

    MENU: {
        GET_JSON: "GET_JSON",
        LOAD_EVENT: "LOAD_EVENT",
        SET_CHILDREN: "SET_CHILDREN_MENU",
        UPDATE_EVENT: "SET_ALL_EVENT",
        FILTER_EVENT: "FILTER_EVENT",
    },

    BUTTON: {
        SET_PAUSED: "SET_PAUSED",
        SET_LOOP: "SET_LOOP",
        SAVE_KEY: "SAVE_KEY",
        GET_EVENT: "GET_EVENT",
    },
};

module.exports = EventCode;
