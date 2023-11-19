import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App.tsx";
import "./index.css";

navigator.mediaDevices
  .getUserMedia({
    audio: true,
  })
  .then((stream) => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <App stream={stream} />
      </React.StrictMode>,
    );
  })
  .catch((e) => {
    console.error(e);
  });
