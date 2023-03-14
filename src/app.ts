import AudioMotionAnalyzer from "audiomotion-analyzer"
import throttle from "lodash.throttle"
import {presetData, defaultSettings} from "./config";

let settings = {...defaultSettings}
const secondsInMinute = 60 * 1000
const images = [...document.querySelectorAll("link[rel=preload][as=image]")].map((link: HTMLLinkElement) => link.href)
const strobeContainer = document.getElementById("strobe")
const form = document.getElementById("settings")
const fullscreenButton = document.getElementById("fullscreen")
const dialog = form.parentNode
const image = document.createElement("img")
strobeContainer.appendChild(image)

const createImageUpdater = (bpm: number) => throttle(() => {
    const nextIndex = images.indexOf(image.src) + 1
    image.src = images[nextIndex] || images[0]
}, secondsInMinute / bpm)

const updateForm = () => {
    Object.entries(settings).map(([name, value]) => {
        const input = document.querySelector(`[name="${name}"]`) as HTMLInputElement
        if (input) {
            input.value = value.toString()
            input.dispatchEvent(new Event('input'));
        }
    })
}

let updateImage = createImageUpdater(settings.bpm)

async function getMediaStream(): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia({audio: true, video: true})
}

async function startStrobe(stream: MediaStream): Promise<AudioMotionAnalyzer> {
    const analyzer = new AudioMotionAnalyzer(null, {
        useCanvas: false, connectSpeakers: false, onCanvasDraw(instance) {
            const amplifiedEnergy = instance.getEnergy(settings.lowerFreq, settings.upperFreq) * settings.amplifier
            const energy = amplifiedEnergy > 1 ? 1 : amplifiedEnergy
            strobeContainer.style.setProperty("--opacity", `${energy}`)
            energy > settings.tickThreshold && updateImage()
        }
    })
    const micStream = analyzer.audioCtx.createMediaStreamSource(stream);
    analyzer.connectInput(micStream);
    // mute output to prevent feedback loops from the speakers
    analyzer.volume = 0;
    return analyzer
}

async function startFaceDetector(stream: MediaStream) {
    const canvas: HTMLCanvasElement = document.getElementById('video');
    const context = canvas.getContext('2d');
    const faceDetector = new FaceDetector({ fastMode: true });
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    };
}

// run
updateForm()
getMediaStream()
    .then(stream => startStrobe(stream).then(() => startFaceDetector(stream)))
    .then(() => console.log("rave strobe is running"))
    .catch((e) => console.error(e))


// event listeners
form.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement
    if (input.name === "preset" && input.value) {
        settings = {
            ...settings,
            preset: input.value,
            lowerFreq: presetData[input.value][0],
            upperFreq: presetData[input.value][1],
            amplifier: presetData[input.value][2],
            tickThreshold: presetData[input.value][3],
        }
    } else {
        settings = {
            ...settings,
            [input.name]: input.value
        }
    }
    if (input.name === "bpm" && input.valueAsNumber) {
        updateImage = createImageUpdater(input.valueAsNumber)
    }
    updateForm()
})

dialog.addEventListener("click", (e) => {
    const element = e.target as any
    if (!element.closest('form')) {
        element.close()
    }
})

fullscreenButton.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
});