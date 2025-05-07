<template>
  <div class="card card-primary">
    <div class="card-header">
      <h3 class="card-title">All Projects</h3>
      <button class="btn btn-success btn-sm float-right" @click="exportToExcel">Export to Excel</button>
    </div>
    <div class="card-body">
      <!-- Filters Section -->
      <div class="mb-3">
        <label for="filterPriority">Filter by Priority</label>
        <select class="form-control" id="filterPriority" v-model="filterPriority" @change="filterProjects">
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="filterStatus">Filter by Status</label>
        <select class="form-control" id="filterStatus" v-model="filterStatus" @change="filterProjects">
          <option value="">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Not Completed">Not Completed</option>
        </select>
      </div>
      <div class="table-responsive"> <!-- ✅ Added wrapper -->

      <!-- Projects Table -->
      <table class="table table-striped table-bordered m-0">
        <thead>
        <tr>
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
          <td colspan="6" class="text-center">No projects found.</td>
        </tr>
        <tr v-for="project in filteredProjects" :key="project.id">
          <td>{{ project.name }}</td>
          <td>{{ project.deadline }}</td>
          <td>
              <span :class="priorityClass(project.priority)">
                {{ project.priority }}
              </span>
          </td>
          <td>
            <ul class="mb-0 pl-3">
              <li v-for="(emp, index) in project.assignedEmployees || []" :key="index" class="d-flex align-items-center">
                <i class="fas fa-user-circle mr-2"></i> {{ emp.name }}
              </li>
            </ul>
          </td>
          <td>
              <span v-if="project.status === 'Completed'" class="badge badge-success">
                {{ project.status }}
              </span>
            <span v-else class="badge badge-secondary">
                Not Completed
              </span>
          </td>
          <td>
            <button
                class="btn btn-sm mb-1"
                :class="project.status === 'Completed' ? 'btn-warning' : 'btn-success'"
                @click="toggleProjectStatus(project)">
              {{ project.status === 'Completed' ? 'Mark as In Progress' : 'Mark as Completed' }}
            </button>
            <button
                class="btn btn-secondary btn-sm"
                @click="editProject(project)">
              <i class="fas fa-edit"></i>
            </button>
            <button
                class="btn btn-danger btn-sm"
                @click="confirmDeleteProject(project)">
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
      filteredProjects: [] // Filtered projects to display
    };
  },
  mounted() {
    const stored = JSON.parse(localStorage.getItem('projects')) || [];
    this.projects = stored;
    this.filteredProjects = stored;
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
      this.filterProjects();
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
</style>
