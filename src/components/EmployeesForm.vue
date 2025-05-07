<template>
  <div class="card card-primary">
    <div class="card-header">
      <h3 class="card-title">{{ employee.id ? 'Edit Employee' : 'Create Employee' }}</h3>
    </div>
    <form @submit.prevent="submitForm">
      <div class="card-body">
        <div class="form-group">
          <label for="employeeName">Name</label>
          <input type="text" id="employeeName" v-model="employee.name" class="form-control" required />
        </div>

        <div class="form-group">
          <label for="employeeEmail">Email</label>
          <input type="email" id="employeeEmail" v-model="employee.email" class="form-control" required />
        </div>

        <div class="form-group">
          <label for="employeePosition">Position</label>
          <input type="text" id="employeePosition" v-model="employee.position" class="form-control" required />
        </div>

        <button type="submit" class="btn btn-primary">{{ employee.id ? 'Save Changes' : 'Create Employee' }}</button>
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
    };
  },
  mounted() {
    // If there's an 'id' in the route parameters, pre-fill the form for editing
    if (this.$route.params.id) {
      const employees = JSON.parse(localStorage.getItem("employees")) || [];
      const employee = employees.find(emp => emp.id === parseInt(this.$route.params.id));
      if (employee) {
        this.employee = { ...employee }; // Pre-fill form fields
      }
    }
  },
  methods: {
    submitForm() {
      const employees = JSON.parse(localStorage.getItem("employees")) || [];

      if (this.employee.id) {
        // Editing an existing employee
        const index = employees.findIndex(emp => emp.id === this.employee.id);
        if (index !== -1) {
          employees[index] = { ...this.employee }; // Update employee
        }

        Swal.fire({
          title: 'Success!',
          text: 'Employee updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } else {
        // Creating a new employee
        this.employee.id = Date.now(); // Assign a unique ID
        employees.push(this.employee); // Add new employee

        Swal.fire({
          title: 'Success!',
          text: 'Employee created successfully!',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      }

      // Save changes to localStorage
      localStorage.setItem("employees", JSON.stringify(employees));
      // Redirect back to the employee list
      setTimeout(() => {
        this.$router.push('/employees');
      }, 1600);

      // Reset the form
      this.employee = { name: '', email: '', position: '' };
    },
  },
};
</script>

<style scoped>
.employee-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 1rem;
}

button {
  margin-top: 1rem;
}
</style>
