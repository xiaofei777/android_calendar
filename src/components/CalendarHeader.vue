<template>
  <header class="bg-white shadow-sm px-6 py-4 flex justify-between items-center z-10">
    <div class="flex items-center gap-4">
        <div class="text-2xl font-bold text-blue-600"><i class="fa-regular fa-calendar-check mr-2"></i>日历</div>
        <div class="flex bg-gray-100 rounded-lg p-1">
            <button @click="currentView = 'month'" :class="{'bg-white shadow': currentView === 'month'}" class="px-3 py-1 rounded text-sm transition">月</button>
            <button @click="currentView = 'week'" :class="{'bg-white shadow': currentView === 'week'}" class="px-3 py-1 rounded text-sm transition">周</button>
            <button @click="currentView = 'day'" :class="{'bg-white shadow': currentView === 'day'}" class="px-3 py-1 rounded text-sm transition">日</button>
        </div>
    </div>

    <div class="flex items-center gap-4">
        <div class="text-lg font-semibold">{{ currentYear }}年 {{ currentMonth + 1 }}月</div>
        <div class="flex gap-2">
            <button @click="changeDate(-1)" class="w-8 h-8 rounded-full hover:bg-gray-100"><i class="fa-solid fa-chevron-left"></i></button>
            <button @click="resetToday" class="px-3 py-1 border rounded hover:bg-gray-50 text-sm">今天</button>
            <button @click="changeDate(1)" class="w-8 h-8 rounded-full hover:bg-gray-100"><i class="fa-solid fa-chevron-right"></i></button>
        </div>

        <div class="relative group">
            <button class="w-8 h-8 rounded-full hover:bg-gray-100"><i class="fa-solid fa-bars"></i></button>
            <div class="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg hidden group-hover:block border p-2 z-20">
                <label class="block px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm">
                    <i class="fa-solid fa-file-import mr-2"></i>导入 .ics
                    <input type="file" accept=".ics" @change="handleImport" class="hidden">
                </label>
                <button @click="handleExport" class="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">
                    <i class="fa-solid fa-file-export mr-2"></i>导出日程
                </button>
                 <button @click="handleClear" class="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 text-sm">
                    <i class="fa-solid fa-trash mr-2"></i>清空数据
                </button>
            </div>
        </div>
    </div>
  </header>
</template>

<script setup>
import { useCalendar } from '@/composables/useCalendar';
import { useEventStore } from '@/composables/useEventStore';
import { exportICS, parseICS } from '@/utils/ics-helper';

const { currentView, currentYear, currentMonth, changeDate, resetToday } = useCalendar();
const { events, addEvent, clearEvents } = useEventStore();

const handleExport = () => {
    exportICS(events.value);
};

const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (re) => {
        const parsed = parseICS(re.target.result);
        parsed.forEach(evt => addEvent(evt));
        alert(`成功导入 ${parsed.length} 个日程！`);
    };
    reader.readAsText(file);
};

const handleClear = () => {
    if(confirm('确定清空所有数据吗？')) clearEvents();
}
</script>
