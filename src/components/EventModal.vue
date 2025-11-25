<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
          <div class="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 class="font-bold text-lg text-gray-800">{{ isEditing ? '编辑日程' : '新建日程' }}</h3>
              <button @click="close" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-times"></i></button>
          </div>
          <div class="p-6 space-y-4">
              <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">标题</label>
                  <input v-model="form.title" type="text" class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="例如：团队周会">
              </div>
              <div class="grid grid-cols-2 gap-4">
                  <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">日期</label>
                      <input v-model="form.date" type="date" class="w-full border rounded p-2 text-sm">
                  </div>
                  <div>
                      <label class="block text-xs font-bold text-gray-500 uppercase mb-1">时间</label>
                      <input v-model="form.time" type="time" class="w-full border rounded p-2 text-sm">
                  </div>
              </div>
              <div>
                   <label class="block text-xs font-bold text-gray-500 uppercase mb-1">标签颜色</label>
                   <div class="flex gap-2">
                       <button v-for="color in colors" :key="color" type="button" @click="form.color = color" 
                           class="w-6 h-6 rounded-full ring-offset-1" 
                           :class="[color, {'ring-2 ring-gray-400': form.color === color}]"></button>
                   </div>
              </div>
              <div>
                  <label class="block text-xs font-bold text-gray-500 uppercase mb-1">描述</label>
                  <textarea v-model="form.description" class="w-full border rounded p-2 text-sm" rows="3" placeholder="添加备注..."></textarea>
              </div>
          </div>
          <div class="px-6 py-4 bg-gray-50 border-t flex justify-between">
              <button v-if="isEditing" @click="handleDelete" class="text-red-500 hover:text-red-700 text-sm font-medium">删除</button>
              <div v-else></div>
              <div class="flex gap-2">
                  <button @click="close" class="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded text-sm">取消</button>
                  <button @click="handleSave" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm shadow">保存</button>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  eventData: Object
});

const emit = defineEmits(['close', 'save', 'delete']);

const isEditing = ref(false);
const form = ref({
  id: null,
  title: '',
  date: '',
  time: '09:00',
  description: '',
  color: 'bg-blue-500'
});

const colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500'];

watch(() => props.show, (newVal) => {
  if (newVal) {
      if (props.eventData && props.eventData.id) {
          isEditing.value = true;
          form.value = { ...props.eventData };
      } else {
          isEditing.value = false;
          // props.eventData might be a Date object for new events
          const d = props.eventData instanceof Date ? props.eventData : new Date();
          const y = d.getFullYear();
          const m = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');

          form.value = {
              id: Date.now(),
              title: '',
              date: `${y}-${m}-${day}`,
              time: '09:00',
              description: '',
              color: 'bg-blue-500'
          };
      }
  }
});

const close = () => emit('close');

const handleSave = () => {
  if (!form.value.title) return alert("请输入标题");
  emit('save', { ...form.value }, isEditing.value);
};

const handleDelete = () => {
  if(confirm('确定删除该日程吗？')) {
      emit('delete', form.value.id);
  }
};
</script>
