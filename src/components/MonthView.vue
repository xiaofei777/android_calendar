<template>
  <div class="h-full grid grid-cols-7 grid-rows-6">
      <div 
          v-for="(cell, index) in calendarCells" 
          :key="index"
          @click="$emit('add', cell.date)"
          class="border-b border-r min-h-[100px] p-2 transition hover:bg-blue-50 cursor-pointer relative flex flex-col gap-1"
          :class="{'bg-gray-50 text-gray-400': !cell.isCurrentMonth, 'bg-blue-50': isToday(cell.date)}"
      >
          <div class="flex justify-between items-start">
              <span class="text-sm font-medium" :class="{'text-blue-600': isToday(cell.date)}">{{ cell.day }}</span>
              <span class="text-xs text-gray-400 scale-90 origin-top-right">{{ cell.lunar }}</span>
          </div>

          <div class="flex flex-col gap-1 mt-1 overflow-hidden">
              <div 
                  v-for="evt in getEventsForDate(cell.dateString)" 
                  :key="evt.id"
                  @click.stop="$emit('edit', evt)"
                  class="text-xs px-1 py-0.5 rounded truncate text-white cursor-pointer hover:opacity-80"
                  :class="evt.color || 'bg-blue-500'"
              >
                  {{ evt.time }} {{ evt.title }}
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { useCalendar } from '@/composables/useCalendar';
import { useEventStore } from '@/composables/useEventStore';

const { calendarCells, isToday } = useCalendar();
const { getEventsForDate } = useEventStore();

defineEmits(['add', 'edit']);
</script>
