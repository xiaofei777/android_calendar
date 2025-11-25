import { ref, onMounted, watch } from 'vue';

const events = ref([]);

export function useEventStore() {
    const loadEvents = () => {
        const saved = localStorage.getItem('uni_calendar_events');
        if (saved) {
            events.value = JSON.parse(saved);
        }
    };

    const saveEvents = () => {
        localStorage.setItem('uni_calendar_events', JSON.stringify(events.value));
    };

    const addEvent = (evt) => {
        events.value.push(evt);
        saveEvents();
    };

    const updateEvent = (evt) => {
        const index = events.value.findIndex(e => e.id === evt.id);
        if (index !== -1) {
            events.value[index] = { ...evt };
            saveEvents();
        }
    };

    const deleteEvent = (id) => {
        events.value = events.value.filter(e => e.id !== id);
        saveEvents();
    };

    const clearEvents = () => {
        events.value = [];
        saveEvents();
    };

    const getEventsForDate = (dateString) => {
        return events.value.filter(e => e.date === dateString).sort((a,b) => a.time.localeCompare(b.time));
    };

    return {
        events,
        loadEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        clearEvents,
        getEventsForDate
    };
}
