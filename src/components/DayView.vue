<template>
  <div class="h-full p-4 max-w-2xl mx-auto overflow-y-auto">
      <div class="text-center mb-6">
          <h2 class="text-3xl font-bold">{{ currentDateObj.getDate() }}</h2>
          <p class="text-gray-500">{{ currentYear }}年 {{ currentMonth + 1 }}月 • {{ getLunarDateString(currentDateObj) }}</p>
      </div>
      <div class="space-y-4">
          <div v-if="getEventsForDate(formatDate(currentDateObj)).length === 0" class="text-center text-gray-400 py-10">
              今日无安排
              <button @click="$emit('add', currentDateObj)" class="block mx-auto mt-2 text-blue-500 text-sm">新建日程</button>
          </div>
          <div 
              v-for="evt in getEventsForDate(formatDate(currentDateObj))" 
              :key="evt.id"
              @click="$emit('edit', evt)"
              class="flex gap-4 items-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
          >
              <div class="w-16 text-right font-mono text-lg text-gray-600">{{ evt.time }}</div>
              <div class="w-1 h-10 rounded-full" :class="evt.color || 'bg-blue-500'"></div>
              <div class="flex-1">
                  <h3 class="font-bold text-lg">{{ evt.title }}</h3>
                  <p class="text-sm text-gray-500">{{ evt.description || '无描述' }}</p>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { useCalendar } from '@/composables/useCalendar';
import { useEventStore } from '@/composables/useEventStore';

const { currentDateObj, currentYear, currentMonth, getLunarDateString, formatDate } = useCalendar();
const { getEventsForDate } = useEventStore();

defineEmits(['add', 'edit']);
</script>
