import AudioMotionAnalyzer from "audiomotion-analyzer"
import throttle from "lodash.throttle"

const presetData = {
    bass: [20, 250, 5, 0.5],
    lowMid: [250, 500, 5, 0.5],
    mid: [500, 2000, 5, 0.5],
    highMid: [2000, 4000, 10, 0.5],
    treble: [4000, 16000, 15, 0.5],
}

let settings = {
    preset: "treble",
    lowerFreq: presetData.treble[0],
    upperFreq: presetData.treble[1],
    amplifier: presetData.treble[2],
    tickThreshold: presetData.treble[3],
    bpm: 120
}

const secondsInMinute = 60 * 1000
const images = [...document.querySelectorAll("link[rel=preload][as=image]")].map((link: HTMLLinkElement) => link.href)
const container = document.getElementById("container")
const form = document.getElementById("settings")
const fullscreen = document.getElementById("fullscreen")
const dialog = form.parentNode
const image = document.createElement("img")
container.appendChild(image)

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

async function start(): Promise<AudioMotionAnalyzer> {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    const analyzer = new AudioMotionAnalyzer(null, {
        useCanvas: false, connectSpeakers: false, onCanvasDraw(instance) {
            const amplifiedEnergy = instance.getEnergy(settings.lowerFreq, settings.upperFreq) * settings.amplifier
            const energy = amplifiedEnergy > 1 ? 1 : amplifiedEnergy
            container.style.setProperty("--opacity", `${energy}`)
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
start()
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

fullscreen.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
});