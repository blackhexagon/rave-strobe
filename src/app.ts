const sampleRate = 48000
const fftSize = 2048
const dbThreshold = 128
const frequencyBinCount = fftSize / 2
const frequencyStep = sampleRate / fftSize

type FreqRange = [string, number, number]

const ranges: FreqRange[] = [
    ['low', 50, 500],
    // ['mid', 301, 1600],
    ['hi', 1601, 500000]
]

async function getAudio(): Promise<AnalyserNode|null> {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new AudioContext( { sampleRate });
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = fftSize; // How much data should we collect
        // analyser.minDecibels = -80;
        // analyser.maxDecibels = -10;
        // audioCtx.sampleRate
        return analyser
    } catch (e) {
        console.error("cannot connect to the microphone")
        return null
    }
}

function drawFrequency(analyser: AnalyserNode) {
    document.body.className = ""
    const data = new Uint8Array(frequencyBinCount);
    analyser.getByteFrequencyData(data);
    const values = [...data.values()]
    const maximum = Math.max(...values)
    console.log(maximum)
    if (maximum > dbThreshold) {
        const dominantFrequency = values.indexOf(maximum) * frequencyStep
        const dominantRange = ranges.find(([, min, max]) => dominantFrequency > min && dominantFrequency < max)
        if (dominantRange) {
            document.body.classList.add(dominantRange[0])
        } else {
            // document.body.className = ""
        }
    } else {
        // document.body.className = ""
    }

    // requestAnimationFrame(() => drawFrequency(analyser));
}

getAudio()
    .then((analyser: AnalyserNode) => {
        // drawFrequency(analyser);
        setInterval(() => {
            drawFrequency(analyser)
        }, 100)
    })