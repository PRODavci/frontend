<template>
  <div class="container mt-5">
    <h1 class="mb-4">Создание нового сканирования</h1>
    <form @submit.prevent="startScan">
      <div v-for="(field, index) in fields" :key="index" class="mb-3 row">
        <label class="col-sm-2 col-form-label">Сеть:</label>
        <div class="col-sm-8">
          <input
              type="text"
              class="form-control"
              v-model="fields[index]"
              placeholder="Введите диапазон (1.1.1.1, 1.1.1.1/20, 1.1.1.1-2.2.2.2)"
          />
        </div>
        <div class="col-sm-2">
          <button type="button" class="btn btn-danger" @click="removeField(index)">Удалить</button>
        </div>
      </div>
      <div class="mb-3">
        <button type="button" class="btn btn-success" @click="addField">Добавить поле</button>
      </div>
      <div class="mt-4">
        <button type="submit" class="btn btn-primary">Начать сканирование</button>
      </div>
    </form>
  </div>
</template>

<script>
import axiosInstance from '@/axiosInstance';

export default {
  name: 'CreateScanView',
  data() {
    return {
      fields: [''],
    };
  },
  methods: {
    addField() {
      this.fields.push('');
    },
    removeField(index) {
      this.fields.splice(index, 1);
    },
    async startScan() {
      const validFormat = /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(\/\d{1,2})?|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}-\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/;
      const isValid = this.fields.every((field) => validFormat.test(field.trim()));
      if (!isValid) {
        alert('Некорректный формат ввода. Проверьте значения полей.');
        return;
      }

      try {
        const response = await axiosInstance.post('/scans/start', {
          network: this.fields,
        });
        const scanId = response.data.id;
        this.$router.push({ name: 'ScanDetail', params: { id: scanId } });
      } catch (error) {
        console.error('Ошибка при запуске сканирования:', error);
        alert('Не удалось начать сканирование.');
      }
    },
  },
};
</script>
