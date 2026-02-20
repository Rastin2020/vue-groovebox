import * as Tone from 'tone';

const kick = new Tone.MembraneSynth().toDestination();
const snare = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
}).toDestination();
const hihat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
}).toDestination();
const clap = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'square' },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
}).toDestination();

kick.volume.value = 0;
snare.volume.value = -10;
hihat.volume.value = -15;
clap.volume.value = -10;

export function useAudio() {
    const startAudio = async () => {
        await Tone.start();
        console.log('Audio Context Started');
    };

    const playSound = (rowName: string) => {
        switch (rowName) {
            case 'Kick':
                kick.triggerAttackRelease('C1', '8n');
                break;
            case 'Snare':
                snare.triggerAttackRelease('8n');
                break;
            case 'HiHat':
                hihat.triggerAttackRelease('32n');
                break;
            case 'Clap':
                clap.triggerAttackRelease(['C4', 'E4', 'G4'], '16n');
                break;
        }
    };

    return { startAudio, playSound };
}