import Home from '../../views/Home.vue'


export const base = [
    {
        path: '/',
        name: 'home',
        component:Home
    },
    {
        path:'/about',
        name:'about',
        component:()=>import('@/views/About.vue')
    }
]