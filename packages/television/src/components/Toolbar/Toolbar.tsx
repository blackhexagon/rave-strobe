import "./Toolbar.css";
import { ChangeEvent, Dispatch } from "react";
import {
  Presets,
  SettingsAction,
  SettingsState,
} from "../../hooks/useSettings.ts";

interface Props {
  settings: SettingsState;
  onChange: Dispatch<SettingsAction>;
  open: boolean;
}

const Toolbar = ({ settings, onChange, open }: Props) => {
  const handlePresetChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      key: "preset",
      value: e.currentTarget.value as Presets,
    });
  };

  const handleNumberInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.currentTarget.name as keyof SettingsState;
    onChange({
      key,
      value: e.currentTarget.valueAsNumber,
    });
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      key: "color",
      value: e.currentTarget.value,
    });
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      key: "text",
      value: e.currentTarget.value,
    });
  };

  return (
    <dialog open={open} className={"toolbar"}>
      <form method="dialog">
        <label>
          <span>preset</span>
          <select name="preset" onChange={handlePresetChange}>
            <option value="">select</option>
            <option value="bass">bass</option>
            <option value="lowMid">lowMid</option>
            <option value="mid">mid</option>
            <option value="highMid">highMid</option>
            <option value="treble">treble</option>
          </select>
        </label>
        <label>
          <span>lower freq threshold</span>
          <input
            name="lowerFreq"
            value={settings.lowerFreq}
            type="range"
            step="1"
            min="0"
            max="16000"
            onChange={handleNumberInputChange}
          />
          <output>{settings.lowerFreq} Hz</output>
        </label>
        <label>
          <span>upper freq threshold</span>
          <input
            name="upperFreq"
            value={settings.upperFreq}
            type="range"
            step="1"
            min="0"
            max="16000"
            onChange={handleNumberInputChange}
          />
          <output>{settings.upperFreq} Hz</output>
        </label>
        <label>
          <span>BPM</span>
          <input
            name="bpm"
            value={settings.bpm}
            type="range"
            step="1"
            min="70"
            max="200"
            onChange={handleNumberInputChange}
          />
          <output>{settings.bpm}</output>
        </label>
        <label>
          <span>amplifier</span>
          <input
            name="amplifier"
            value={settings.amplifier}
            type="range"
            step="0.1"
            min="0.1"
            max="100"
            onChange={handleNumberInputChange}
          />
          <output>{settings.amplifier}</output>
        </label>
        <label>
          <span>image tick threshold</span>
          <input
            name="tickThreshold"
            value={settings.tickThreshold}
            type="range"
            step="0.1"
            min="0.1"
            max="1"
            onChange={handleNumberInputChange}
          />
          <output>{settings.tickThreshold}</output>
        </label>
        <label>
          <span>color</span>
          <input
            name="color"
            value={settings.color}
            type="color"
            onChange={handleColorChange}
          />
          <output>{settings.color}</output>
        </label>
        <label>
          <span>strobe</span>
          <input
            name="strobe"
            value={settings.strobe}
            type="range"
            min="0"
            max="500"
            onInput={handleNumberInputChange}
          />
          <output>{settings.strobe}</output>
        </label>
        <label>
          <span>text</span>
          <input
            name="text"
            value={settings.text}
            type="text"
            onInput={handleTextChange}
          />
        </label>
      </form>
    </dialog>
  );
};

export default Toolbar;
