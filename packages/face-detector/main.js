import "./styles.css";

window.onload = () => {
  detect();
};

async function detect() {
  const canvas = document.querySelector("canvas");
  const video = document.querySelector("video");
  const context = canvas.getContext("2d");
  video.srcObject = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
  });
  video.autoplay = true;
  video.onloadedmetadata = () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  };

  function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  }
  (function renderLoop() {
    requestAnimationFrame(renderLoop);
    render();
  })();
}
