import "./App.css";
import Cartoon from "../Cartoon/Cartoon.tsx";
import { useEffect, useState } from "react";
import Strobe from "../Strobe/Strobe.tsx";
import Toolbar from "../Toolbar/Toolbar.tsx";
import useSettings from "../../hooks/useSettings.ts";
import Toggle from "../Toggle/Toggle.tsx";
import AudioMotionAnalyzer from "audiomotion-analyzer";
import Audience from "../Audience/Audience.tsx";

interface Props {
  audioAnalyzer: AudioMotionAnalyzer;
  wss: WebSocket
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
    })
  }, [ settings.amplifier, settings.lowerFreq, settings.upperFreq ]);

  useEffect(() => {
    wss.addEventListener("message", function (event) {
      const data = JSON.parse(event.data);
      if (data.photo) {
          setPhotos((prev) => [
              ...prev,
              [Date.now(), `http://localhost:3000/photo/${data.photo}`],
          ]);
      } else {
          dispatch(data)
      }
    });
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
