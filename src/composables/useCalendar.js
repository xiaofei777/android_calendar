import { ref, computed } from 'vue';
import { getLunarText, getLunarDateString } from '@/utils/lunar';

// Global state for sharing between components if needed
const currentDateObj = ref(new Date());
const currentView = ref('month');

export function useCalendar() {
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

    const currentYear = computed(() => currentDateObj.value.getFullYear());
    const currentMonth = computed(() => currentDateObj.value.getMonth());

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const calendarCells = computed(() => {
        const year = currentYear.value;
        const month = currentMonth.value;
        const firstDayOfMonth = new Date(year, month, 1);
        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(1 - firstDayOfMonth.getDay());

        const cells = [];
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            cells.push({
                date: date,
                dateString: formatDate(date),
                day: date.getDate(),
                isCurrentMonth: date.getMonth() === month,
                lunar: getLunarText(date)
            });
        }
        return cells;
    });

    const currentWeekDays = computed(() => {
        const curr = new Date(currentDateObj.value);
        const day = curr.getDay(); 
        const firstDayOfWeek = new Date(curr.setDate(curr.getDate() - day));

        const days = [];
        for(let i=0; i<7; i++) {
            const d = new Date(firstDayOfWeek);
            d.setDate(firstDayOfWeek.getDate() + i);
            days.push({
                date: d,
                dateString: formatDate(d),
                day: d.getDate(),
                lunar: getLunarText(d)
            });
        }
        return days;
    });

    const changeDate = (offset) => {
        const newDate = new Date(currentDateObj.value);
        if (currentView.value === 'month') {
            newDate.setMonth(newDate.getMonth() + offset);
        } else if (currentView.value === 'week') {
            newDate.setDate(newDate.getDate() + (offset * 7));
        } else {
            newDate.setDate(newDate.getDate() + offset);
        }
        currentDateObj.value = newDate;
    };

    const resetToday = () => {
        currentDateObj.value = new Date();
    };

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    return {
        currentDateObj,
        currentView,
        weekDays,
        currentYear,
        currentMonth,
        calendarCells,
        currentWeekDays,
        formatDate,
        changeDate,
        resetToday,
        isToday,
        getLunarDateString
    };
}
