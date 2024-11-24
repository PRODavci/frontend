<template>
  <div class="container mt-5">
    <h1 class="mb-4">Детали скана #{{ scanId }}</h1>
    <div v-if="loading" class="text-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Загрузка...</span>
      </div>
    </div>
    <div v-else>
      <p class="text-muted">Статус скана: {{ status }}</p>
      <div v-if="hosts.length === 0">
        <!-- Если статус running и данных нет -->
        <div v-if="status === 'running'" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Загрузка...</span>
          </div>
          <p class="mt-2">Сканирование в процессе...</p>
        </div>
        <!-- Если статус finished и данных нет -->
        <div v-else-if="status === 'finished'" class="alert alert-warning">
          Данные для данного скана отсутствуют.
        </div>
      </div>
      <!-- Отображение списка хостов, если данные есть -->
      <ul class="list-group" v-else>
        <li
            v-for="host in hosts"
            :key="host.id"
            class="list-group-item list-group-item-action"
            @click="openHostDetails(host)"
            data-bs-toggle="modal"
            data-bs-target="#servicesModal"
        >
          Хост IP: {{ host.ip }}
        </li>
      </ul>
    </div>

    <!-- Модальное окно -->
    <div
        class="modal fade"
        id="servicesModal"
        tabindex="-1"
        aria-labelledby="servicesModalLabel"
        aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="servicesModalLabel">
              Сервисы хоста {{ selectedHost?.ip }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <!-- Условная логика отображения сервисов -->
            <div v-if="servicesLoading" class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Загрузка...</span>
              </div>
              <p class="mt-2">Загрузка данных...</p>
            </div>
            <div v-else-if="!selectedHost?.services || selectedHost.services.length === 0">
              <div v-if="status === 'running'" class="text-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Загрузка...</span>
                </div>
                <p class="mt-2">Сканирование в процессе...</p>
              </div>
              <div v-else-if="status === 'finished'" class="alert alert-warning">
                Для данного хоста нет доступных сервисов.
              </div>
            </div>
            <ul class="list-group" v-else>
              <li
                  v-for="service in selectedHost.services"
                  :key="service.id"
                  class="list-group-item"
              >
                <strong>{{ service.name || 'Неизвестно' }}</strong>
                <span>({{ service.protocol }}:{{ service.port }})</span>
                <div v-if="service.product">
                  Продукт: {{ service.product }}<br>
                  Версия: {{ service.version || 'Не определена' }}
                </div>
                <div v-if="service.ostype">OS: {{ service.ostype }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/axiosInstance';

export default {
  name: 'ScanDetailView',
  data() {
    return {
      scanId: null,
      hosts: [],
      status: null, // Статус сканирования
      loading: true, // Загрузка данных о скане
      servicesLoading: false, // Загрузка данных о сервисах
      selectedHost: null, // Выбранный хост
    };
  },
  mounted() {
    this.scanId = this.$route.params.id;
    this.fetchScanDetails();
    this.startAutoUpdate();
  },
  methods: {
    async fetchScanDetails() {
      try {
        const response = await axiosInstance.get(`/scans/${this.scanId}`);
        this.hosts = response.data.hosts;
        this.status = response.data.status; // Получаем статус
      } catch (error) {
        console.error('Ошибка при загрузке скана:', error);
        alert('Не удалось загрузить детали скана.');
      } finally {
        this.loading = false;
      }
    },
    async openHostDetails(host) {
      this.selectedHost = host;
      this.servicesLoading = true;

      try {
        // Имитируем загрузку сервисов (можно заменить на реальный источник данных)
        setTimeout(() => {
          this.selectedHost.services = host.services || [];
          this.servicesLoading = false;
        }, 500);
      } catch (error) {
        console.error('Ошибка при загрузке сервисов:', error);
        alert('Не удалось загрузить данные о сервисах.');
        this.servicesLoading = false;
      }
    },
    startAutoUpdate() {
      this.updateInterval = setInterval(() => {
        this.fetchScanDetails();
      }, 5000);
    },
  },
  beforeUnmount() {
    clearInterval(this.updateInterval);
  },
};
</script>
