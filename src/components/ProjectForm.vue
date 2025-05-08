<template>
  <div class="card card-primary">
    <!-- Breadcrumbs -->
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link to="/projects">Projects</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
          {{ formTitle }}
        </li>
      </ol>
    </nav>

    <div class="card-header">
      <h3 class="card-title">{{ formTitle }}</h3>
    </div>

    <form @submit.prevent="submitForm">
      <div class="card-body">
        <div class="form-group">
          <label for="projectName">Project Name <span class="text-danger">*</span></label>
          <input type="text" class="form-control" id="projectName" v-model="project.name" />
          <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
        </div>

        <div class="form-group">
          <label for="deadline">Deadline <span class="text-danger">*</span></label>
          <input type="date" class="form-control" id="deadline" v-model="project.deadline" />
          <small v-if="errors.deadline" class="text-danger">{{ errors.deadline }}</small>
        </div>

        <div class="form-group">
          <label for="priority">Priority</label>
          <select class="form-control" id="priority" v-model="project.priority">
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div class="form-group">
          <label for="assignedEmployees">Assign Employees</label>
          <multiselect
              v-model="project.assignedEmployees"
              :options="employeeList"
              :multiple="true"
              :track-by="'id'"
              label="name"
              placeholder="Select Employees"
              tag-placeholder="Add employee"
          ></multiselect>
        </div>
      </div>

      <div class="card-footer">
        <button type="submit" class="btn btn-primary">{{ buttonLabel }}</button>
      </div>
    </form>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import Swal from 'sweetalert2'

export default {
  name: "ProjectForm",
  components: {
    Multiselect
  },
  data() {
    return {
      project: {
        id: null,
        name: "",
        deadline: "",
        priority: "Medium",
        assignedEmployees: []
      },
      employeeList: [],
      errors: {
        name: '',
        deadline: ''
      }
    };
  },
  computed: {
    formTitle() {
      return this.project.id ? 'Edit Project' : 'Add New Project';
    },
    buttonLabel() {
      return this.project.id ? 'Save Changes' : 'Create Project';
    }
  },
  mounted() {
    // Load employee list
    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    this.employeeList = storedEmployees;

    // Load existing project if editing
    if (this.$route.params.id) {
      const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
      const project = storedProjects.find(p => p.id === parseInt(this.$route.params.id));
      if (project) {
        this.project = { ...project };
      }
    }
  },
  methods: {
    submitForm() {
      // Reset validation errors
      this.errors.name = this.project.name ? '' : 'Project name is required.';
      this.errors.deadline = this.project.deadline ? '' : 'Deadline is required.';

      // Stop submission if there are errors
      if (this.errors.name || this.errors.deadline) return;

      const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];

      if (this.project.id) {
        // Update existing
        const index = storedProjects.findIndex(p => p.id === this.project.id);
        if (index !== -1) storedProjects[index] = { ...this.project };

        Swal.fire({
          icon: 'success',
          title: 'Project Updated!',
          text: 'The project has been successfully updated.',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        // Create new
        this.project.id = Date.now();
        storedProjects.push({ ...this.project });

        Swal.fire({
          icon: 'success',
          title: 'Project Added!',
          text: 'The project has been successfully created.',
          timer: 1500,
          showConfirmButton: false
        });
      }

      // Save to localStorage
      localStorage.setItem("projects", JSON.stringify(storedProjects));

      // Redirect after a short delay
      setTimeout(() => {
        this.$router.push("/projects");
      }, 1600);

      // Reset form
      this.project = { id: null, name: "", deadline: "", priority: "Medium", assignedEmployees: [] };
      this.errors = { name: '', deadline: '' };
    }
  }
};
</script>

<style scoped>
.text-danger {
  color: red;
  font-size: 0.875em;
}
.breadcrumb {
  margin-bottom: 20px;
}
</style>
