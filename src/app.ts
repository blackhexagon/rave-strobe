import AudioMotionAnalyzer from "audiomotion-analyzer"

async function getAudio(): Promise<AudioMotionAnalyzer|null> {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const analyzer = new AudioMotionAnalyzer()
        const micStream = analyzer.audioCtx.createMediaStreamSource( stream );
        analyzer.connectInput( micStream );
        // mute output to prevent feedback loops from the speakers
        analyzer.volume = 0;
        return analyzer
    } catch (e) {
        console.error("cannot connect to the microphone")
        return null
    }
}

getAudio()
    .then((analyzer: AudioMotionAnalyzer) => {
        console.log({analyzer})
    })