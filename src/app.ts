import AudioMotionAnalyzer from "audiomotion-analyzer"

const container = document.getElementById("container")
const amplifier = 10 // todo: user input
const energyPreset = "treble" // todo: user input

async function start(): Promise<AudioMotionAnalyzer> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const analyzer = new AudioMotionAnalyzer(null, {
        useCanvas: false,
        connectSpeakers: false,
        onCanvasDraw(instance) {
            const energy = instance.getEnergy(energyPreset) * amplifier
            container.style.setProperty("--opacity", `${energy}`)
        }
    })
    const micStream = analyzer.audioCtx.createMediaStreamSource( stream );
    analyzer.connectInput( micStream );
    // mute output to prevent feedback loops from the speakers
    analyzer.volume = 0;
    return analyzer
}

start()
    .then(() => {
        console.log("rave strobe is running")
    })
    .catch((e) => {
        console.error(e)
    })