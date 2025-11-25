<template>
  <div class="h-full flex flex-col">
      <div class="grid grid-cols-7 h-full">
          <div v-for="(dayObj, idx) in currentWeekDays" :key="idx" 
               class="border-r border-b min-h-full p-2 hover:bg-gray-50 cursor-pointer" 
               @click="$emit('add', dayObj.date)">
              <div class="text-center border-b pb-2 mb-2">
                  <div class="font-bold">{{ dayObj.day }}</div>
                  <div class="text-xs text-gray-500">{{ dayObj.lunar }}</div>
              </div>
               <div class="flex flex-col gap-2">
                  <div 
                      v-for="evt in getEventsForDate(dayObj.dateString)" 
                      :key="evt.id"
                      @click.stop="$emit('edit', evt)"
                      class="p-2 rounded text-xs text-white shadow-sm hover:opacity-80"
                      :class="evt.color || 'bg-blue-500'"
                  >
                      <div class="font-bold">{{ evt.time }}</div>
                      <div>{{ evt.title }}</div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { useCalendar } from '@/composables/useCalendar';
import { useEventStore } from '@/composables/useEventStore';

const { currentWeekDays } = useCalendar();
const { getEventsForDate } = useEventStore();

defineEmits(['add', 'edit']);
</script>
