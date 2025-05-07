<template>
  <div class="dashboard-page">
    <h1>Dashboard</h1>
    <div class="row">
      <!-- Total Projects Box -->
      <div class="col-lg-3 col-6">
        <div class="small-box bg-info">
          <div class="inner">
            <h3>{{ totalProjects }}</h3>
            <p>Total Projects</p>
          </div>
          <div class="icon">
            <i class="ion ion-folder"></i>
          </div>
          <!-- Link for more info -->
          <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
      </div>

      <!-- Completed Projects Box -->
      <div class="col-lg-3 col-6">
        <div class="small-box bg-success">
          <div class="inner">
            <h3>{{ completedProjects }}</h3>
            <p>Completed Projects</p>
          </div>
          <div class="icon">
            <i class="ion ion-checkmark-circled"></i>
          </div>
          <!-- Link for more info -->
          <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
      </div>

      <!-- In-progress Projects Box -->
      <div class="col-lg-3 col-6">
        <div class="small-box bg-warning">
          <div class="inner">
            <h3>{{ inProgressProjects }}</h3>
            <p>In-progress Projects</p>
          </div>
          <div class="icon">
            <i class="ion ion-load-a"></i>
          </div>
          <!-- Link for more info -->
          <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
      </div>

      <!-- Total Employees Box -->
      <div class="col-lg-3 col-6">
        <div class="small-box bg-primary">
          <div class="inner">
            <h3>{{ totalEmployees }}</h3>
            <p>Total Employees</p>
          </div>
          <div class="icon">
            <i class="ion ion-person-stalker"></i>
          </div>
          <!-- Link for more info -->
          <a href="#" class="small-box-footer">More info <i class="fas fa-arrow-circle-right"></i></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage', // Component name
  data() {
    return {
      projects: [], // Array to store project data
      employees: [] // Array to store employee data
    };
  },
  computed: {
    // Computed property to calculate total number of projects
    totalProjects() {
      return this.projects.length;
    },
    // Computed property to calculate the number of completed projects
    completedProjects() {
      return this.projects.filter(project => project.status === 'Completed').length;
    },
    // Computed property to calculate the number of in-progress projects
    inProgressProjects() {
      return this.projects.filter(project => project.status !== 'Completed').length;
    },
    // Computed property to calculate total number of employees
    totalEmployees() {
      return this.employees.length;
    }
  },
  mounted() {
    // Load projects and employees data from localStorage when component is mounted
    const storedProjects = JSON.parse(localStorage.getItem('projects')) || []; // Fetch stored projects or set an empty array
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || []; // Fetch stored employees or set an empty array
    this.projects = storedProjects; // Assign to local data
    this.employees = storedEmployees; // Assign to local data
  }
};
</script>
