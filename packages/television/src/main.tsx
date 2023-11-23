import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App.tsx";
import "./index.css";
import AudioMotionAnalyzer from "audiomotion-analyzer";

navigator.mediaDevices
  .getUserMedia({
    audio: true,
  })
  .then((stream) => {
    const wss = new WebSocket(
      import.meta.env.VITE_SERVER_WS || `ws://localhost:3000`,
    );
    const analyzer = new AudioMotionAnalyzer(undefined, {
      useCanvas: false,
      connectSpeakers: false,
    });
    const micStream = analyzer.audioCtx.createMediaStreamSource(stream);
    analyzer.connectInput(micStream);
    analyzer.volume = 0; // mute output to prevent feedback loops from the speakers
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App audioAnalyzer={analyzer} wss={wss} />
      </React.StrictMode>,
    );
  })
  .catch((e) => {
    console.error(e);
  });
