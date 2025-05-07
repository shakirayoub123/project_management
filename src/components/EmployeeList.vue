<template>
  <div class="card card-primary">
    <div class="card-header">
      <h3 class="card-title">All Employees</h3>
    </div>
    <div class="card-body p-0">
      <table class="table table-striped table-bordered m-0">
        <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Position</th>
          <th>Actions</th> <!-- New column for actions -->
        </tr>
        </thead>
        <tbody>
        <!-- If no employees are available, display a message -->
        <tr v-if="employees.length === 0">
          <td colspan="4" class="text-center">No employees found.</td>
        </tr>
        <!-- Loop through the list of employees and display each employee's data -->
        <tr v-for="employee in employees" :key="employee.id">
          <td>{{ employee.name }}</td>
          <td>{{ employee.email }}</td>
          <td>{{ employee.position }}</td>
          <td>
            <!-- Edit Button: Redirect to employee form for editing -->
            <button
                class="btn btn-secondary btn-sm mb-1"
                @click="editEmployee(employee)">
              <i class="fas fa-edit"></i>
            </button>

            <!-- Delete Button: Confirm and delete employee -->
            <button
                class="btn btn-danger btn-sm"
                @click="confirmDeleteEmployee(employee.id)">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2'; // Import SweetAlert for confirmation and success messages

export default {
  name: 'EmployeeList', // Component name
  data() {
    return {
      employees: [] // Array to hold employee data
    };
  },
  mounted() {
    // Load the list of employees from localStorage when the component is mounted
    const stored = JSON.parse(localStorage.getItem("employees")) || [];
    this.employees = stored;
  },
  methods: {
    // Edit employee method: redirects to the employee form page to edit
    editEmployee(employee) {
      this.$router.push({ name: 'employee-form', params: { id: employee.id } });
    },

    // Confirm delete employee method using SweetAlert
    confirmDeleteEmployee(employeeId) {
      Swal.fire({
        title: 'Are you sure?', // Alert title
        text: "You are about to delete this employee. This action cannot be undone.", // Confirmation message
        icon: 'warning', // Warning icon
        showCancelButton: true, // Show cancel button
        confirmButtonText: 'Yes, delete it!', // Confirm button text
        cancelButtonText: 'No, cancel!', // Cancel button text
        reverseButtons: true // Reverse the order of confirm and cancel buttons
      }).then((result) => {
        // If the user confirmed the deletion, proceed with the delete operation
        if (result.isConfirmed) {
          this.deleteEmployee(employeeId);
        }
      });
    },

    // Delete employee method: removes the employee from the list and updates localStorage
    deleteEmployee(employeeId) {
      // Filter out the employee to be deleted from the employees array
      this.employees = this.employees.filter(employee => employee.id !== employeeId);

      // Update the localStorage with the new employees list
      localStorage.setItem("employees", JSON.stringify(this.employees));

      // Show a success message using SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Employee Deleted!', // Success title
        text: 'The employee has been successfully deleted.', // Success message
        timer: 1500, // Duration for the success message
        showConfirmButton: false // Hide the confirm button
      });
    }
  }
};
</script>

<style scoped>
/* Style the buttons with pointer cursor and margin */
button {
  cursor: pointer;
  margin-right: 10px;
}

/* Style the icons */
.fas {
  font-size: 1.2rem;
}
</style>
