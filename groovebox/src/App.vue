<script setup lang="ts">
import { useSequencer } from './stores/sequencer';
import { Play, Square, RefreshCcw } from 'lucide-vue-next';

const sequencer = useSequencer();
</script>

<template>
  <div class="h-screen w-full bg-neutral-900 text-white flex flex-col items-center justify-center font-sans selection:bg-rose-500 selection:text-white">
    
    <div class="w-full max-w-5xl bg-neutral-800/50 backdrop-blur-xl p-8 rounded-3xl border border-neutral-700 shadow-2xl">
      
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-3">
          <div class="h-3 w-3 rounded-full bg-rose-500 animate-pulse"></div>
          <h1 class="text-2xl font-black tracking-widest text-neutral-100">GROOVEBOX</h1>
        </div>

        <div class="flex items-center gap-4 bg-neutral-900/80 p-2 rounded-xl border border-neutral-700">
          
          <div class="flex items-center gap-3 px-3 border-r border-neutral-700">
            <span class="text-xs font-bold text-neutral-500 tracking-wider">BPM</span>
            <input 
              type="range" 
              min="60" 
              max="200" 
              :value="sequencer.bpm" 
              @input="(e) => sequencer.setBpm(Number((e.target as HTMLInputElement).value))"
              class="w-24 accent-rose-500 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
            >
            <span class="text-sm font-mono font-bold w-8 text-right text-rose-400">{{ sequencer.bpm }}</span>
          </div>

          <button 
            @click="sequencer.togglePlay"
            class="flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm transition-all active:scale-95"
            :class="sequencer.isPlaying 
              ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)]' 
              : 'bg-emerald-500 text-white hover:bg-emerald-400'"
          >
            <component :is="sequencer.isPlaying ? Square : Play" class="w-4 h-4 fill-current" />
            {{ sequencer.isPlaying ? 'STOP' : 'PLAY' }}
          </button>

          <button 
            @click="sequencer.clearGrid"
            class="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
            title="Clear Grid"
          >
            <RefreshCcw class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="space-y-3"> <div 
          v-for="(row, rIndex) in sequencer.rows" 
          :key="row.name" 
          class="flex items-center gap-4 group"
        >
          
          <div class="w-16 flex items-center justify-end">
            <span class="text-xs font-bold text-neutral-500 tracking-widest group-hover:text-white transition-colors">
              {{ row.name.toUpperCase() }}
            </span>
          </div>

          <div class="flex-1 grid grid-cols-16 gap-1.5"> <button
              v-for="(active, sIndex) in row.steps"
              :key="sIndex"
              @click="sequencer.toggleStep(rIndex, sIndex)"
              class="aspect-square rounded-md transition-all duration-100 relative border border-transparent"
              :class="[
                active ? `bg-${row.color.split('-')[1]}-500 shadow-[0_0_10px_currentColor]` : 'bg-neutral-900 hover:bg-neutral-700',
                sequencer.currentStep === sIndex ? 'ring-2 ring-white scale-110 z-10 brightness-125' : '',
                !active && sIndex % 4 === 0 ? 'bg-neutral-800' : ''
              ]"
            >
             <div 
               v-if="!active" 
               class="absolute inset-0 m-auto w-1 h-1 rounded-full transition-opacity duration-300"
               :class="sIndex % 4 === 0 ? 'bg-neutral-600' : 'bg-neutral-800 opacity-0 group-hover:opacity-100'"
             ></div>
            </button>
          </div>
        </div>
      </div>

      <div class="mt-8 flex justify-center gap-1 h-4 items-end opacity-50">
         <div v-for="i in 16" :key="i" 
              class="w-1 bg-rose-500 transition-all duration-75 rounded-t-full"
              :class="sequencer.currentStep === i-1 && sequencer.isPlaying ? 'h-full' : 'h-1'"
         ></div>
      </div>

    </div>
  </div>
</template>

<style>
.grid-cols-16 {
  grid-template-columns: repeat(16, minmax(0, 1fr));
}
</style>