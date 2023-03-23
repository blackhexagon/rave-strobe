import AudioMotionAnalyzer from "audiomotion-analyzer"
import throttle from "lodash.throttle"
import {presetData, defaultSettings} from "./config";

let settings = {...defaultSettings}
const secondsInMinute = 60 * 1000
const mouthSources = [...document.querySelectorAll("link[rel=preload][href*='svg']")].map((link: HTMLLinkElement) => link.href)
const smileySource = document.querySelector<HTMLLinkElement>("link[rel=preload][href*='beta']").href
const strobeContainer = document.getElementById("strobe")
const form = document.getElementById("settings")
const fullscreenButton = document.getElementById("fullscreen")
const dialog = form.parentNode
const mouthImage = document.createElement("img")
const smileyImage = document.createElement("img")
smileyImage.src = smileySource
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const context = canvas.getContext("2d");
const video = document.getElementById('video') as HTMLVideoElement;
video.volume = 0.001 // cannot be muted because FaceDetector will not work
const faceDetector = new FaceDetector({fastMode: true})
strobeContainer.appendChild(mouthImage)

const createImageUpdater = (bpm: number) => throttle(() => {
    const nextIndex = mouthSources.indexOf(mouthImage.src) + 1
    mouthImage.src = mouthSources[nextIndex] || mouthSources[0]
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


// run
updateForm()
getMediaStream()
    .then(stream => startStrobe(stream)
        .then(() => {
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                renderLoop()
            }
        }))
    .then(() => console.log("rave strobe is running"))
    .catch((e) => console.error(e))


function renderLoop() {
    requestAnimationFrame(renderLoop);
    render()
}

async function render() {
    try {
        const faces = await faceDetector.detect(video)
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        context.fillStyle = 'rgba(0, 255, 0, 0.9)';
        faces.forEach((face) => {
            const { top, left, width, height } = face.boundingBox
            const multiplier = 1.6
            context.beginPath();
            context.arc(left + width / 2, top + width / 2, width, 0, 2 * Math.PI);
            context.fill()
            const [imageWidth, imageHeight] = [width * multiplier, height * multiplier]
            context.drawImage(smileyImage, left - ((imageWidth - width) / 2), top - ((imageHeight - height) / 3), imageWidth, imageHeight)
        })
        if (faces.length > 0) {
            document.body.classList.add("with-faces")
        } else {
            throw new Error("Faces not detected")
        }
    } catch (e) {
        document.body.classList.remove("with-faces")
    }
}


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
            ...settings, [input.name]: input.value
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