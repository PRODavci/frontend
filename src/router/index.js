import { createRouter, createWebHistory } from 'vue-router';
import LoginView from "@/views/LoginView.vue";
import store from '@/store';
import DashboardView from "@/views/DashboardView.vue";
import ScanDetailView from "@/views/ScanDetailView.vue";
import CreateScanView from "@/views/CreateScanView.vue";

const routes = [
    { path: '', component: DashboardView, name: 'Home' },
    { path: '/login', component: LoginView, name: 'Login' },
    { path: '/scans/:id', component: ScanDetailView, name: 'ScanDetail' },
    { path: '/scans/create', component: CreateScanView, name: 'CreateScan' },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters.userIsLoggedIn;

    if (!isAuthenticated && to.name !== 'Login') {
        next({ name: 'Login' });
    } else {
        next();
    }
});

export default router;
