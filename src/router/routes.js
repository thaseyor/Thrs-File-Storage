const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('layouts/MainLayout.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    redirect: { name: 'main' }
  }
]

export default routes
