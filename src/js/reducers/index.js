import { ADD_MUSIC,
         ADD_IMAGE,
         PLAY_PAUSE,
         SET_INSTR,
         SET_SCALE,
         SET_SPEED,
         NUM_NOTES,
         SET_POS,
         SET_MODE } from "../constants/action-types";

const initialState = {
    image: null,
    music: null,
    isPlaying: false,
    instrument: "Flute",
    scale: "Major",
    speed: "1x",
    numNotes: "1",
    pos: null,
    mode: "Board"
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case  ADD_MUSIC:
            return { ...state, music: action.payload};
        case  ADD_IMAGE:
            return { ...state, image: action.payload};
        case  PLAY_PAUSE:
            return { ...state, isPlaying: action.payload};
        case  SET_INSTR:
            return { ...state, instrument: action.payload};
        case SET_SCALE:
            return { ...state, scale: action.payload};
        case SET_SPEED:
            return { ...state, speed: action.payload};
        case NUM_NOTES:
            return { ...state, numNotes: action.payload};
        case SET_POS:
            return { ...state, pos: action.payload};
        case SET_MODE:
            return { ...state, mode: action.payload};
        default:
            return state;
    }
};

export default rootReducer;
