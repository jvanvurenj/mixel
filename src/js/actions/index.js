import { ADD_MUSIC,
         ADD_IMAGE,
         PLAY_PAUSE,
         SET_INSTR,
         SET_SCALE,
         SET_SPEED,
         NUM_NOTES,
         SET_POS,
         SET_MODE } from "../constants/action-types";

export const addMusic = music => ({ type: ADD_MUSIC, payload: music });
export const addImage = image => ({ type: ADD_IMAGE, payload: image });
export const setPlayPause = boolVal => ({ type: PLAY_PAUSE, payload: boolVal });
export const setInstrument = instr => ({ type: SET_INSTR, payload: instr });
export const setScale = scale => ({ type: SET_SCALE, payload: scale });
export const setSpeed = speed => ({ type: SET_SPEED, payload: speed });
export const setNumNotes = num => ({ type: NUM_NOTES, payload: num });
export const setPos = pos => ({ type: SET_POS, payload: pos });
export const setMode = mode => ({ type: SET_MODE, payload: mode});
