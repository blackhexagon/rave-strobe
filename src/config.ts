export const presetData = {
    bass: [20, 250, 5, 0.5],
    lowMid: [250, 500, 5, 0.5],
    mid: [500, 2000, 5, 0.5],
    highMid: [2000, 4000, 10, 0.5],
    treble: [4000, 16000, 15, 0.5],
}

export const defaultSettings = {
    preset: "treble",
    lowerFreq: presetData.treble[0],
    upperFreq: presetData.treble[1],
    amplifier: presetData.treble[2],
    tickThreshold: presetData.treble[3],
    bpm: 120
}