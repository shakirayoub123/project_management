<template>
  <div class="card card-primary">
    <div class="card-header">
      <h3 class="card-title">All Employees</h3>
    </div>
    <div class="card-body p-0">
      <!-- Filters -->
      <div v-if="employees.length > 0" class="p-3">
        <!-- Filter by Name or Email -->
        <div class="form-group">
          <label for="filterText">Filter by Name or Email</label>
          <input
              type="text"
              class="form-control"
              id="filterText"
              v-model="filterText"
              @input="filterEmployees"
              placeholder="Type to filter..."
          />
        </div>

        <!-- Filter by Position -->
        <div class="form-group">
          <label for="filterPosition">Filter by Position</label>
          <select
              class="form-control"
              id="filterPosition"
              v-model="filterPosition"
              @change="filterEmployees"
          >
            <option value="">All Positions</option>
            <option
                v-for="position in uniquePositions"
                :key="position"
                :value="position"
            >
              {{ position }}
            </option>
          </select>
        </div>
      </div>

      <!-- Employee Table -->
      <table class="table table-striped table-bordered m-0">
        <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Position</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="filteredEmployees.length === 0">
          <td colspan="4" class="text-center">No employees found.</td>
        </tr>
        <tr v-for="employee in filteredEmployees" :key="employee.id">
          <td>{{ employee.name }}</td>
          <td>{{ employee.email }}</td>
          <td>{{ employee.position }}</td>
          <td>
            <button
                class="btn btn-secondary btn-sm mb-1"
                @click="editEmployee(employee)"
            >
              <i class="fas fa-edit"></i>
            </button>
            <button
                class="btn btn-danger btn-sm"
                @click="confirmDeleteEmployee(employee.id)"
            >
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
import Swal from "sweetalert2";

export default {
  name: "EmployeeList",
  data() {
    return {
      employees: [],
      filteredEmployees: [],
      filterText: "",
      filterPosition: "",
    };
  },
  mounted() {
    const stored = JSON.parse(localStorage.getItem("employees")) || [];
    this.employees = stored;
    this.filteredEmployees = stored;
  },
  computed: {
    uniquePositions() {
      return [...new Set(this.employees.map((e) => e.position).filter(Boolean))];
    },
  },
  methods: {
    editEmployee(employee) {
      this.$router.push({ name: "employee-form", params: { id: employee.id } });
    },
    confirmDeleteEmployee(employeeId) {
      Swal.fire({
        title: "Are you sure?",
        text: "You are about to delete this employee. This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteEmployee(employeeId);
        }
      });
    },
    deleteEmployee(employeeId) {
      this.employees = this.employees.filter((e) => e.id !== employeeId);
      localStorage.setItem("employees", JSON.stringify(this.employees));
      this.filterEmployees();
      Swal.fire({
        icon: "success",
        title: "Employee Deleted!",
        text: "The employee has been successfully deleted.",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    filterEmployees() {
      this.filteredEmployees = this.employees.filter((emp) => {
        const matchesText = this.filterText
            ? emp.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
            emp.email.toLowerCase().includes(this.filterText.toLowerCase())
            : true;
        const matchesPosition = this.filterPosition
            ? emp.position === this.filterPosition
            : true;
        return matchesText && matchesPosition;
      });
    },
  },
};
</script>

<style scoped>
button {
  cursor: pointer;
  margin-right: 10px;
}

.fas {
  font-size: 1.2rem;
}
</style>
