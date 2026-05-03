<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin • Pulse</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
</head>
<body class="bg-gray-950 text-white">
  <div class="max-w-7xl mx-auto p-6">
    <h1 class="text-4xl font-bold text-orange-500 mb-8">Pulse Management Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Stats Cards -->
      <div class="bg-gray-900 p-6 rounded-2xl">
        <h3 class="text-gray-400">Total Revenue</h3>
        <p class="text-4xl font-bold" id="totalRevenue">0</p>
      </div>
      <div class="bg-gray-900 p-6 rounded-2xl">
        <h3 class="text-gray-400">Active Sessions</h3>
        <p class="text-4xl font-bold text-green-400" id="activeSessions">0</p>
      </div>
      <div class="bg-gray-900 p-6 rounded-2xl">
        <h3 class="text-gray-400">Total Users</h3>
        <p class="text-4xl font-bold" id="totalUsers">0</p>
      </div>
    </div>

    <!-- Staff Management -->
    <div class="bg-gray-900 p-6 rounded-2xl mb-8">
      <h2 class="text-xl font-semibold mb-4">Staff Management</h2>
      <input id="staffName" placeholder="Staff Name" class="bg-gray-800 p-3 rounded-lg mr-2">
      <input id="staffPhone" placeholder="Phone" class="bg-gray-800 p-3 rounded-lg mr-2">
      <input id="staffPassword" type="password" placeholder="Password" class="bg-gray-800 p-3 rounded-lg mr-2">
      <button onclick="addStaff()" class="bg-blue-600 px-6 py-3 rounded-lg">Add Staff</button>
    </div>

    <!-- Packages Table -->
    <div class="bg-gray-900 rounded-2xl p-6">
      <h2 class="text-xl font-semibold mb-4">Packages</h2>
      <table class="w-full" id="packagesTable"></table>
    </div>
  </div>

  <script>
    // Load stats, packages, etc.
    async function loadDashboard() {
      // Add your fetch calls here
      console.log("Dashboard loaded");
    }

    async function addStaff() {
      // Implementation
      alert("Staff added (backend needed)");
    }

    window.onload = loadDashboard;
  </script>
</body>
</html>
