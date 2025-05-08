<template>
  <div class="wrapper">
    <!-- Navbar -->
    <nav class="main-header navbar navbar-expand navbar-white navbar-light">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link" data-widget="pushmenu" href="#" role="button">
            <i class="fas fa-bars"></i>
          </a>
        </li>
        <li class="nav-item d-none d-sm-inline-block">
          <router-link to="/" class="nav-link">Home</router-link>
        </li>
      </ul>
    </nav>

    <!-- Sidebar -->
    <aside class="main-sidebar sidebar-dark-primary elevation-4">
      <!-- Brand Logo -->
      <router-link to="/" class="brand-link">
        <img src="https://adminlte.io/themes/v3/dist/img/AdminLTELogo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
        <span class="brand-text font-weight-light">Project Manager</span>
      </router-link>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Sidebar Menu -->
        <nav class="mt-2">
          <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
            <!-- Dashboard Link with Badge -->
            <li class="nav-item">
              <router-link to="/" class="nav-link">
                <i class="nav-icon fas fa-tachometer-alt"></i>
                <p>
                  Dashboard
                  <span class="badge badge-info right">New</span> <!-- Optional Badge -->
                </p>
              </router-link>
            </li>
            <li class="nav-item has-treeview">
              <a href="#" class="nav-link">
                <i class="nav-icon fas fa-folder"></i>
                <p>
                  Projects
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li class="nav-item">
                  <router-link to="/projects/add" class="nav-link">
                    <i class="nav-icon fas fa-plus"></i>
                    <p>Create</p>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/projects" class="nav-link">
                    <i class="nav-icon fas fa-list"></i>
                    <p>List</p>
                  </router-link>
                </li>
              </ul>
            </li>

            <li class="nav-item has-treeview">
              <a href="#" class="nav-link">
                <i class="nav-icon fas fa-users"></i>
                <p>
                  Employees
                  <i class="right fas fa-angle-left"></i>
                </p>
              </a>
              <ul class="nav nav-treeview">
                <li class="nav-item">
                  <router-link to="/employees/add" class="nav-link">
                    <i class="nav-icon fas fa-plus"></i>
                    <p>Create</p>
                  </router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/employees" class="nav-link">
                    <i class="nav-icon fas fa-list"></i>
                    <p>List</p>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        <!-- /.sidebar-menu -->
      </div>
      <!-- /.sidebar -->
    </aside>

    <!-- Content Wrapper -->
    <div class="content-wrapper p-3">
      <!-- This renders the matched component for current route -->
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
}
</script>

<style scoped>
.content-wrapper {
  min-height: 100vh;
}
</style>
