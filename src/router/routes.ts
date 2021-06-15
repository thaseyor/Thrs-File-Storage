import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'main',
    component: () => import('layouts/MainLayout.vue'),
  },

  {
    path: '*',
    redirect: { name: 'main' },
  },
];

export default routes;
