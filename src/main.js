import Vue from 'vue';
import App from './App.vue';
import router from './router';

import '../adminlte/css/adminlte.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../adminlte/js/adminlte.min';

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
