import { useReducer } from "react";

export const presetData = {
  bass: [20, 250, 10],
  lowMid: [250, 500, 5],
  mid: [500, 2000, 5],
  highMid: [2000, 4000, 10],
  treble: [4000, 6000, 30],
};

export interface SettingsState {
  lowerFreq: number;
  upperFreq: number;
  amplifier: number;
  tickThreshold: number;
  bpm: number;
  strobe: number;
  color: string;
}

export type Presets = keyof typeof presetData;

export type SettingsAction =
  | {
      key: keyof SettingsState;
      value: number;
    }
  | {
      key: "preset";
      value: Presets;
    }
  | {
      key: "color";
      value: string;
    };

const reducer = (
  prevState: SettingsState,
  { key, value }: SettingsAction,
): SettingsState => {
  if (key === "preset") {
    return {
      ...prevState,
      strobe: 0,
      lowerFreq: presetData[value][0],
      upperFreq: presetData[value][1],
      amplifier: presetData[value][2],
    };
  }
  return {
    ...prevState,
    [key]: value,
  };
};

const initialState: SettingsState = {
  lowerFreq: presetData.bass[0],
  upperFreq: presetData.bass[1],
  amplifier: presetData.bass[2],
  tickThreshold: 0.5,
  bpm: 120,
  color: "#00ff00",
  strobe: 0,
};

export default function useSettings() {
  return useReducer(reducer, initialState);
}
