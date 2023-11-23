import "./App.css";
import Cartoon from "../Cartoon/Cartoon.tsx";
import { useEffect, useState } from "react";
import Strobe from "../Strobe/Strobe.tsx";
import Toolbar from "../Toolbar/Toolbar.tsx";
import useSettings, {
  Presets,
  SettingsState,
} from "../../hooks/useSettings.ts";
import Toggle from "../Toggle/Toggle.tsx";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import Audience from "../Audience/Audience.tsx";

interface Props {
  audioAnalyzer: AudioMotionAnalyzer;
  wss: WebSocket;
}

function App({ audioAnalyzer, wss }: Props) {
  const [settings, dispatch] = useSettings();
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [energy, setEnergy] = useState(0.5);
  const [photos, setPhotos] = useState<Array<[number, string]>>([]);

  useEffect(() => {
    audioAnalyzer.setOptions({
      onCanvasDraw(instance) {
        const amplifiedEnergy =
          instance.getEnergy(settings.lowerFreq, settings.upperFreq) *
          settings.amplifier;
        setEnergy(amplifiedEnergy > 1 ? 1 : amplifiedEnergy);
      },
    });
  }, [settings.amplifier, settings.lowerFreq, settings.upperFreq]);

  useEffect(() => {
    const handleEvent = (event: any) => {
      const data = JSON.parse(event.data);
      if (data.photo) {
        setPhotos((prev) => [
          ...prev,
          [
            Date.now(),
            `${
              import.meta.env.VITE_SERVER_API || "http://localhost:3000"
            }/photo/${data.photo}`,
          ],
        ]);
      } else {
        for (const [key, value] of Object.entries(data)) {
          if (key === "preset") {
            dispatch({ key, value: value as Presets });
          } else if (key === "color") {
            dispatch({ key, value: value as string });
          } else {
            dispatch({
              key: key as keyof SettingsState,
              value: parseFloat(value as string),
            });
          }
        }
      }
    };
    wss.addEventListener("message", handleEvent);
    return () => {
      wss.removeEventListener("message", handleEvent);
    };
  }, []);

  const handleToggleToolbar = () => setToolbarOpen((prev) => !prev);

  return (
    <>
      <Toggle onClick={handleToggleToolbar} />
      <Audience photos={photos} />
      <Cartoon
        energy={energy}
        tickThreshold={settings.tickThreshold}
        color={settings.color}
      />
      <Strobe
        energy={energy}
        color={settings.color}
        frequency={settings.strobe}
      />
      <Toolbar settings={settings} onChange={dispatch} open={toolbarOpen} />
    </>
  );
}

export default App;
