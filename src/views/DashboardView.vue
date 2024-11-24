<template>
  <div class="container mt-5">
    <h1 class="mb-4">Список сканов</h1>
    <button class="btn btn-primary mb-3" @click="goToCreateScan">
      Начать сканирование
    </button>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    <div v-if="!loading && scans.length === 0" class="alert alert-warning" role="alert">
      Нет данных о сканах.
    </div>
    <ul class="list-group" v-if="!loading && scans.length > 0">
      <li
          v-for="scan in scans"
          :key="scan.id"
          class="list-group-item list-group-item-action"
          @click="goToScanDetail(scan.id)"
      >
        <strong>Скан номер {{ scan.id }}</strong> - время: {{ scan.timestamp }}
      </li>
    </ul>
  </div>
</template>

<script>
import axiosInstance from '@/axiosInstance';

export default {
  name: 'DashboardView',
  data() {
    return {
      scans: [],
      loading: true,
    };
  },
  mounted() {
    this.fetchScans();
  },
  methods: {
    async fetchScans() {
      try {
        const response = await axiosInstance.get('/scans');
        this.scans = response.data.data;
      } catch (error) {
        console.error('Ошибка при загрузке сканов:', error);
        alert('Не удалось загрузить данные о сканах.');
      } finally {
        this.loading = false;
      }
    },
    goToScanDetail(id) {
      this.$router.push({name: 'ScanDetail', params: {id}});
    },
    goToCreateScan() {
      this.$router.push({name: 'CreateScan'});
    },
  },
};
</script>
