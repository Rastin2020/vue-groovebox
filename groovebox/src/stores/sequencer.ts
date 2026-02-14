import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as Tone from 'tone';
import { useAudio } from '../composables/useAudio';

export const useSequencer = defineStore('sequencer', () => {
    const { playSound } = useAudio();

    const isPlaying = ref(false);
    const bpm = ref(120);
    const currentStep = ref(0);
    
    const rows = ref([
        { name: 'Kick', color: 'bg-rose-500', steps: Array(16).fill(false) },
        { name: 'Snare', color: 'bg-amber-500', steps: Array(16).fill(false) },
        { name: 'HiHat', color: 'bg-cyan-500', steps: Array(16).fill(false) },
        { name: 'Clap', color: 'bg-emerald-500', steps: Array(16).fill(false) },
    ]);

    const toggleStep = (rowIndex: number, stepIndex: number) => {
        rows.value[rowIndex].steps[stepIndex] = !rows.value[rowIndex].steps[stepIndex];
    };

    const setBpm = (val: number) => {
        bpm.value = val;
        Tone.Transport.bpm.value = val;
    };

    const loop = new Tone.Sequence(
        (time, step) => {
            Tone.Draw.schedule(() => {
                currentStep.value = step;
            }, time);

            rows.value.forEach((row) => {
                if (row.steps[step]) {
                    playSound(row.name);
                }
            });
        },
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        "16n"
    );

    loop.start(0);

    const togglePlay = async () => {
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }

        if (!isPlaying.value) {
            Tone.Transport.bpm.value = bpm.value;
            
            Tone.Transport.start();
            
            isPlaying.value = true;
        } else {
            Tone.Transport.stop();
            
            currentStep.value = 0;
            isPlaying.value = false;
        }
    };

    const clearGrid = () => {
        rows.value.forEach(row => row.steps.fill(false));
    };

    const randomize = () => {
        clearGrid();
        rows.value.forEach(row => {
            row.steps = row.steps.map(() => Math.random() > 0.8);
        });
    };

    return { 
        isPlaying, 
        bpm, 
        currentStep, 
        rows, 
        toggleStep, 
        setBpm, 
        togglePlay,
        clearGrid,
        randomize 
    };
});