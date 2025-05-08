<template>
  <div class="card card-primary">
    <!-- Breadcrumbs Section -->
    <div class="breadcrumb-wrapper mb-3">
      <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">Projects</li>
      </ol>
    </div>

    <div class="card-header">
      <h3 class="card-title">All Projects</h3>
      <!-- Add "Create Project" button -->
      <router-link to="/projects/add">
        <button class="btn btn-success btn-sm float-right" title="Create New Project">
          <i class="fas fa-plus"></i>
        </button>
      </router-link>

      <button class="btn btn-success btn-sm float-right" @click="exportToExcel">Export to Excel</button>

    </div>

    <div class="card-body">
      <!-- Filters Section -->
      <div class="mb-3" v-if="projects.length > 0">
        <label for="filterPriority">Filter by Priority</label>
        <select class="form-control" id="filterPriority" v-model="filterPriority" @change="filterProjects">
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div class="mb-3" v-if="projects.length > 0">
        <label for="filterStatus">Filter by Status</label>
        <select class="form-control" id="filterStatus" v-model="filterStatus" @change="filterProjects">
          <option value="">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Not Completed">Not Completed</option>
        </select>
      </div>

      <!-- Employee Assignment Section -->
      <div class="mb-3 d-flex align-items-center gap-2" v-if="selectedProjects.length > 0">
        <select class="form-control mr-2" v-model="selectedEmployeeId">
          <option disabled value="">Select Employee</option>
          <option v-for="employee in employees" :key="employee.id" :value="employee.id">
            {{ employee.name }}
          </option>
        </select>
        <button class="btn btn-primary btn-sm" @click="assignEmployeeToSelected" :disabled="!selectedEmployeeId">
          Assign Projects
        </button>
      </div>

      <!-- Projects Table -->
      <div class="table-responsive">
        <table class="table table-striped table-bordered m-0">
          <thead>
          <tr>
            <th><input type="checkbox" @change="toggleSelectAll" v-model="selectAll" /></th>
            <th>Project Name</th>
            <th>Deadline</th>
            <th>Priority</th>
            <th>Assigned Employees</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="filteredProjects.length === 0">
            <td colspan="7" class="text-center">No projects found.</td>
          </tr>
          <tr v-for="project in filteredProjects" :key="project.id">
            <td><input type="checkbox" v-model="selectedProjects" :value="project.id" /></td>
            <td>{{ project.name }}</td>
            <td>{{ project.deadline }}</td>
            <td><span :class="priorityClass(project.priority)">{{ project.priority }}</span></td>
            <td>
              <ul class="mb-0 pl-3" v-if="project.assignedEmployees && project.assignedEmployees.length > 0">
                <li v-for="(emp, index) in project.assignedEmployees" :key="index" class="d-flex align-items-center">
                  <i class="fas fa-user-circle mr-2"></i> {{ emp.name }}
                </li>
              </ul>
              <ul v-else>--</ul>
            </td>
            <td>
              <span v-if="project.status === 'Completed'" class="badge badge-success">{{ project.status }}</span>
              <span v-else class="badge badge-secondary">Not Completed</span>
            </td>
            <td>
              <button class="btn btn-sm mb-1" :class="project.status === 'Completed' ? 'btn-warning' : 'btn-success'" @click="toggleProjectStatus(project)">
                {{ project.status === 'Completed' ? 'Mark as In Progress' : 'Mark as Completed' }}
              </button>
              <button class="btn btn-secondary btn-sm" @click="editProject(project)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-danger btn-sm" @click="confirmDeleteProject(project)">
                <i class="fa fa-trash"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

export default {
  name: 'ProjectList',
  data() {
    return {
      projects: [], // All projects
      filterPriority: '', // Selected priority filter
      filterStatus: '', // Selected status filter
      filteredProjects: [], // Filtered projects to display
      selectedProjects: [], // Selected project IDs for bulk actions
      selectedEmployeeId: '', // Selected employee for assignment
      selectAll: false, // Select all checkbox status
      employees: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
      ]
    };
  },
  mounted() {
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || [];

    // Normalize project status
    storedProjects.forEach(project => {
      if (!project.status || (project.status !== 'Completed' && project.status !== 'Not Completed')) {
        project.status = 'Not Completed';
      }
    });

    this.projects = storedProjects;
    this.filteredProjects = storedProjects;

    // Load employee data from localStorage
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    this.employees = storedEmployees; // Set the employees data from localStorage
  },
  methods: {
    priorityClass(priority) {
      switch (priority) {
        case 'High': return 'badge badge-danger';
        case 'Medium': return 'badge badge-warning';
        case 'Low': return 'badge badge-success';
        default: return '';
      }
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedProjects = this.filteredProjects.map(p => p.id);
      } else {
        this.selectedProjects = [];
      }
    },
    assignEmployeeToSelected() {
      // Check if any projects are selected
      if (this.selectedProjects.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'No projects selected!',
          text: 'Please select at least one project to assign the employee.',
          timer: 1500,
          showConfirmButton: false
        });
        return;
      }

      // Find the selected employee
      const selectedEmp = this.employees.find(e => e.id === this.selectedEmployeeId);
      if (!selectedEmp) {
        Swal.fire({
          icon: 'error',
          title: 'No employee selected!',
          text: 'Please select an employee to assign.',
          timer: 1500,
          showConfirmButton: false
        });
        return;
      }

      // Iterate over selected projects and assign the employee
      this.projects.forEach(project => {
        if (this.selectedProjects.includes(project.id)) {
          // Ensure assignedEmployees is an array
          project.assignedEmployees = Array.isArray(project.assignedEmployees) ? project.assignedEmployees : [];

          // Only assign if the employee is not already assigned
          if (!project.assignedEmployees.some(emp => emp.id === selectedEmp.id)) {
            project.assignedEmployees.push({ id: selectedEmp.id, name: selectedEmp.name });
          }
        }
      });

      // Save to localStorage and update UI
      localStorage.setItem('projects', JSON.stringify(this.projects));
      this.filterProjects();
      this.selectedProjects = [];
      this.selectAll = false;
      this.selectedEmployeeId = '';

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Employee Assigned',
        text: 'Selected projects have been updated.',
        timer: 1500,
        showConfirmButton: false
      });
    },
    toggleProjectStatus(project) {
      project.status = project.status === 'Completed' ? 'Not Completed' : 'Completed';
      localStorage.setItem('projects', JSON.stringify(this.projects));
      this.filterProjects();

      const message = project.status === 'Completed'
          ? 'Project marked as completed!'
          : 'Project marked as in progress!';

      Swal.fire({
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500
      });
    },
    confirmDeleteProject(project) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete the project "${project.name}". This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.deleteProject(project.id);
        }
      });
    },
    deleteProject(projectId) {
      this.projects = this.projects.filter(project => project.id !== projectId);
      localStorage.setItem('projects', JSON.stringify(this.projects));
      this.filterProjects();

      Swal.fire({
        icon: 'success',
        title: 'Project Deleted',
        text: 'The project has been successfully deleted.',
        timer: 1500,
        showConfirmButton: false
      });
    },
    filterProjects() {
      this.filteredProjects = this.projects.filter(project => {
        const matchesPriority = this.filterPriority ? project.priority === this.filterPriority : true;
        const matchesStatus = this.filterStatus ? project.status === this.filterStatus : true;
        return matchesPriority && matchesStatus;
      });
    },
    exportToExcel() {
      const data = this.filteredProjects.map(project => {
        return {
          'Project Name': project.name,
          'Deadline': project.deadline,
          'Priority': project.priority,
          'Assigned Employees': project.assignedEmployees.map(emp => emp.name).join(', '),
          'Status': project.status,
        };
      });
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Projects');
      XLSX.writeFile(wb, 'projects_report.xlsx');
    },
    editProject(project) {
      this.$router.push({ name: 'ProjectForm', params: { id: project.id } });
    }
  }
};
</script>

<style scoped>
ul {
  list-style-type: disc;
}

button {
  cursor: pointer;
  margin-right: 10px;
}

.fas {
  font-size: 1.2rem;
}

.d-flex {
  display: flex;
  align-items: center;
}

.mr-2 {
  margin-right: 0.5rem;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
