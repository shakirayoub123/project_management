// src/router/router.js

import Vue from 'vue';
import VueRouter from 'vue-router';

// Import your components
import ProjectForm from "@/components/ProjectForm.vue";
import EmployeesForm from "@/components/EmployeesForm.vue";
import ProjectList from "@/components/ProjectList.vue";
import EmployeeList from "@/components/EmployeeList.vue";
import DashboardPage from "@/components/DashboardPage.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'DashboardPage',
        component: DashboardPage
    },
    {
        path: '/projects',
        name: 'ProjectList',
        component: ProjectList
    },

    {
        path: '/projects/add',
        name: 'Projects',
        component: ProjectForm
    },
    {
        path: '/projects/:id?',  // Optional 'id' parameter for editing, no 'id' for creating
        name: 'ProjectForm',
        component: ProjectForm,
        props: true  // Pass route params as props to the component
    },
    {
        path: '/employees',
        name: 'EmployeeList',
        component: EmployeeList
    },
    {
        path: '/employee/:id?',  // Optional 'id' parameter for editing, no 'id' for creating
        name: 'employee-form',
        component: EmployeesForm,
        props: true  // Pass route params as props to the component
    },
    {
        path: '/employees/add',
        name: 'Employees',
        component: EmployeesForm
    }
];

const router = new VueRouter({
    mode: 'history',
    routes
});

export default router;
