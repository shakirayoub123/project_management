<template>
  <div class="card card-primary">
    <!-- Breadcrumbs -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/employees">Employees</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ employee.id ? 'Edit Employee' : 'Create Employee' }}
        </li>
      </ol>
    </nav>
    <div class="card-header">
      <h3 class="card-title">{{ employee.id ? 'Edit Employee' : 'Create Employee' }}</h3>
    </div>
    <form @submit.prevent="submitForm">
      <div class="card-body">
        <div class="form-group">
          <label for="employeeName">Name <span class="text-danger">*</span></label>
          <input type="text" id="employeeName" v-model="employee.name" class="form-control" />
          <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
        </div>

        <div class="form-group">
          <label for="employeeEmail">Email <span class="text-danger">*</span></label>
          <input type="email" id="employeeEmail" v-model="employee.email" class="form-control" />
          <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
        </div>

        <div class="form-group">
          <label for="employeePosition">Position <span class="text-danger">*</span></label>
          <input type="text" id="employeePosition" v-model="employee.position" class="form-control" />
          <small v-if="errors.position" class="text-danger">{{ errors.position }}</small>
        </div>

        <button type="submit" class="btn btn-primary">
          {{ employee.id ? 'Save Changes' : 'Create Employee' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'EmployeesForm',
  data() {
    return {
      employee: {
        id: null,
        name: '',
        email: '',
        position: '',
      },
      errors: {
        name: '',
        email: '',
        position: ''
      }
    };
  },
  mounted() {
    if (this.$route.params.id) {
      const employees = JSON.parse(localStorage.getItem("employees")) || [];
      const employee = employees.find(emp => emp.id === parseInt(this.$route.params.id));
      if (employee) {
        this.employee = { ...employee };
      }
    }
  },
  methods: {
    submitForm() {
      // Reset validation
      this.errors = { name: '', email: '', position: '' };

      if (!this.employee.name) {
        this.errors.name = 'Name is required.';
      }
      if (!this.employee.email) {
        this.errors.email = 'Email is required.';
      }
      if (!this.employee.position) {
        this.errors.position = 'Position is required.';
      }

      if (this.errors.name || this.errors.email || this.errors.position) {
        return;
      }

      const employees = JSON.parse(localStorage.getItem("employees")) || [];

      if (this.employee.id) {
        const index = employees.findIndex(emp => emp.id === this.employee.id);
        if (index !== -1) {
          employees[index] = { ...this.employee };
        }

        Swal.fire({
          title: 'Success!',
          text: 'Employee updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        this.employee.id = Date.now();
        employees.push(this.employee);

        Swal.fire({
          title: 'Success!',
          text: 'Employee created successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }

      localStorage.setItem("employees", JSON.stringify(employees));

      setTimeout(() => {
        this.$router.push('/employees');
      }, 1600);

      this.employee = { id: null, name: '', email: '', position: '' };
    }
  }
};
</script>

<style scoped>
.text-danger {
  font-size: 0.875em;
}
</style>
