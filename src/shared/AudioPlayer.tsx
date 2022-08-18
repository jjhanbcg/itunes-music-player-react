import { useEffect, useReducer, useRef } from "react";
import { StreamState } from "../interfaces/StreamState";

export const AUDIO_PLAYER_EVENTS = ["canplay", "playing", "pause", "error"];

export interface AudioPlayerAction {
  type: string;
  payload?:
    | {
        url?: string | undefined;
        duration?: number | undefined;
        control?: "play" | "pause";
      }
    | undefined;
}

function initAudioPlayerState(): StreamState {
  return {
    url: undefined,
    control: undefined,
    playing: false,
    duration: undefined,
    canplay: false,
    error: false,
  };
}

const initState = initAudioPlayerState();

function audioPlayerReducer(state: StreamState, action: AudioPlayerAction) {
  switch (action.type) {
    case "load":
      return {
        url: action.payload?.url,
        control: "play",
        playing: false,
        duration: undefined,
        canplay: false,
        error: false,
      };
    case "canplay":
      return {
        ...state,
        duration: action.payload?.duration,
        canplay: true,
      };
    case "control":
      return {
        ...state,
        control: action.payload?.control,
      };
    case "playing":
      return {
        ...state,
        control: undefined,
        playing: true,
      };
    case "pause":
      return {
        ...state,
        control: undefined,
        playing: false,
      };
    case "error":
      return {
        ...initState,
        error: true,
      };
    case "reset":
      return initState;
    default:
      return state;
  }
}

export function useAudioPlayer(): [
  state: StreamState,
  dispatch: React.Dispatch<AudioPlayerAction>
] {
  const audioEl = new Audio();
  const audioRef = useRef<HTMLAudioElement>(audioEl);
  const [state, dispatch] = useReducer(
    audioPlayerReducer,
    undefined,
    initAudioPlayerState
  );

  useEffect(() => {
    if (!state.url) {
      return;
    }

    const audioObj = audioRef.current;
    audioObj.src = state.url;
    audioObj.load();

    const handleAudioEvents: EventListenerOrEventListenerObject = ({
      type,
    }) => {
      switch (type) {
        case "canplay":
          dispatch({ type, payload: { duration: audioObj.duration } });
          break;

        default:
          dispatch({ type });
          break;
      }
    };

    // Attach event listeners
    AUDIO_PLAYER_EVENTS.forEach((event) => {
      audioObj.addEventListener(event, handleAudioEvents);
    });

    // Specify how to clean up after this effect:
    return function cleanup() {
      // remove event listeners
      AUDIO_PLAYER_EVENTS.forEach((event) => {
        audioObj.removeEventListener(event, handleAudioEvents);
      });
    };
  }, [state.url]);

  useEffect(() => {
    if (!state.url) {
      return;
    }

    const audioObj = audioRef.current;

    if (state.control === "play" && state.canplay && !state.playing) {
      audioObj.play();
    } else if (state.control === "pause" && state.playing) {
      audioObj.pause();
    }
  }, [state.url, state.control, state.canplay, state.playing]);

  return [state, dispatch];
}
