<template>
  <div class="h-full flex flex-col">
    <!-- Top Bar -->
    <CalendarHeader />

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden relative flex flex-col bg-white">
        <!-- Weekday Headers (Only for Month view usually, but useful for Week too) -->
        <div v-if="currentView !== 'day'" class="grid grid-cols-7 border-b bg-white">
            <div v-for="(day, index) in weekDays" :key="index" class="py-2 text-center text-sm text-gray-500 font-medium">
                {{ day }}
            </div>
        </div>

        <!-- View Router -->
        <div class="flex-1 overflow-y-auto relative">
            <MonthView v-if="currentView === 'month'" @add="openAddModal" @edit="openEditModal" />
            <WeekView v-else-if="currentView === 'week'" @add="openAddModal" @edit="openEditModal" />
            <DayView v-else-if="currentView === 'day'" @add="openAddModal" @edit="openEditModal" />
        </div>
    </main>

    <!-- Modal -->
    <EventModal 
        :show="showModal" 
        :eventData="currentEventData"
        @close="showModal = false"
        @save="onSaveEvent"
        @delete="onDeleteEvent"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CalendarHeader from './components/CalendarHeader.vue';
import MonthView from './components/MonthView.vue';
import WeekView from './components/WeekView.vue';
import DayView from './components/DayView.vue';
import EventModal from './components/EventModal.vue';

import { useCalendar } from '@/composables/useCalendar';
import { useEventStore } from '@/composables/useEventStore';

const { currentView, weekDays, formatDate } = useCalendar();
const { loadEvents, addEvent, updateEvent, deleteEvent, events } = useEventStore();

const showModal = ref(false);
const currentEventData = ref(null);

onMounted(() => {
    loadEvents();
    // Start notification check loop
    setInterval(checkReminders, 60000);
});

// Modal Logic
const openAddModal = (date) => {
    currentEventData.value = date; // Pass date object
    showModal.value = true;
};

const openEditModal = (evt) => {
    currentEventData.value = evt; // Pass event object
    showModal.value = true;
};

const onSaveEvent = (formData, isEditing) => {
    if (isEditing) {
        updateEvent(formData);
    } else {
        addEvent(formData);
    }
    showModal.value = false;
};

const onDeleteEvent = (id) => {
    deleteEvent(id);
    showModal.value = false;
};

// Simple Reminder Logic (Global)
const checkReminders = () => {
    const now = new Date();
    const nowStr = formatDate(now);
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

    events.value.forEach(evt => {
        if (evt.date === nowStr && evt.time === timeStr) {
            if (Notification.permission === "granted") {
                new Notification(`日程提醒: ${evt.title}`, { body: evt.description });
            }
        }
    });

    if (Notification.permission !== "denied" && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
};
</script>
