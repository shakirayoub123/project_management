<template>
  <div class="card card-primary">
    <div class="card-header">
      <h3 class="card-title">{{ project.id ? 'Edit Project' : 'Add New Project' }}</h3>
    </div>
    <form @submit.prevent="submitForm">
      <div class="card-body">
        <div class="form-group">
          <label for="projectName">Project Name</label>
          <input type="text" class="form-control" id="projectName" v-model="project.name" required />
        </div>

        <div class="form-group">
          <label for="deadline">Deadline</label>
          <input type="date" class="form-control" id="deadline" v-model="project.deadline" required />
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
        <button type="submit" class="btn btn-primary">{{ project.id ? 'Save Changes' : 'Create Project' }}</button>
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
      employeeList: []
    };
  },
  mounted() {
    // Check if we're editing an existing project
    if (this.$route.params.id) {
      const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
      const project = storedProjects.find(p => p.id === parseInt(this.$route.params.id));
      if (project) {
        this.project = { ...project }; // Pre-fill form fields for editing
      }
    }

    // Load employee list for the multiselect component
    const storedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
    this.employeeList = storedEmployees;
  },
  methods: {
    submitForm() {
      const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];

      if (this.project.id) {
        // Edit existing project
        const index = storedProjects.findIndex(p => p.id === this.project.id);
        if (index !== -1) {
          storedProjects[index] = { ...this.project }; // Update project
        }

        Swal.fire({
          icon: 'success',
          title: 'Project Updated!',
          text: 'The project has been successfully updated.',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        // Add new project
        this.project.id = Date.now(); // Unique ID for the new project
        storedProjects.push(this.project);

        Swal.fire({
          icon: 'success',
          title: 'Project Added!',
          text: 'The project has been successfully created.',
          timer: 1500,
          showConfirmButton: false
        });
      }

      // Save projects to localStorage
      localStorage.setItem("projects", JSON.stringify(storedProjects));

      // Redirect to project list after a brief delay to show the SweetAlert
      setTimeout(() => {
        this.$router.push("/projects");
      }, 1600);

      // Clear the form for new project creation
      this.project = { name: "", deadline: "", priority: "Medium", assignedEmployees: [] };
    }
  }
};
</script>

<style scoped>
/* Optional styling */
</style>
