
const ctx = document.getElementById("salesChart");
if (ctx && typeof Chart !=="undefined") { 

new Chart(ctx, {
  type: "bar",

  data: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul"
    ],
    datasets: [{
      label: "Sales",
      data: [12, 19, 3, 5, 2, 3, 10],
      borderWidth: 1
    }]
  },

  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});  }

const addBtn = document.getElementById('add-project-btn');
const tableBody = document.getElementById('projects-tbody');
if ( addBtn && tableBody) {  
addBtn.addEventListener('click', function() {     
    let projectName = prompt("أدخل اسم المشروع الجديد:");
    if (!projectName) return alert("تم إلغاء العملية، لم يتم إدخال اسم المشروع.");
    let clientName = prompt("أدخل اسم العميل:");
    if (!clientName) return alert("تم إلغاء العملية، لم يتم إدخال اسم العميل.");
    // 3. إنشاء صف جديد (tr)
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${projectName}</td>
        <td>${clientName}</td>
        <td><span class="status in-progress" style="background: #ff9800; color: #fff; padding: 2px 5px; border-radius: 3px; font-size: 12px;">In progress</span></td>
        <td>
            0%
            <div class="progress-bar" style="background: #ddd; width: 100%; height: 5px; border-radius: 3px; margin-top: 5px;">
                <div style="background: #ff9800; width: 0%; height: 100%; border-radius: 3px;"></div>
            </div>
        </td>
    `;
    tableBody.insertBefore(newRow, tableBody.firstChild);    

    savedProjects.push({
    projectName: projectName,
    clientName: clientName
});

localStorage.setItem("projects", JSON.stringify(savedProjects));
    alert("تم إضافة المشروع الجديد بنجاح إلى الجدول!");
});
}


let savedProjects = JSON.parse(localStorage.getItem("projects")) || [];

localStorage.setItem("projects", JSON.stringify(savedProjects));




// ===============================
// Add Employee
// ===============================

const addEmployeeBtn = document.getElementById("addEmployeeBtn");
const employeeForm = document.getElementById("employeeForm");
const employeesTableBody = document.getElementById("employeesTableBody");

if (addEmployeeBtn && employeeForm && employeesTableBody) {

    const addEmployeeModal = new bootstrap.Modal(
        document.getElementById("addEmployeeModal")
    );

    // Open Modal
    addEmployeeBtn.addEventListener("click", function () {
        addEmployeeModal.show();
    });

    // Add Employee to Table
    employeeForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("employeeName").value;
        const role = document.getElementById("employeeRole").value;
        const department = document.getElementById("employeeDepartment").value;
        const status = document.getElementById("employeeStatus").value;

        const statusColor = status === "Active"
            ? "rgba(16, 185, 129, 0.15)"
            : "rgba(220, 53, 69, 0.15)";

        const newRow = document.createElement("tr");

        newRow.innerHTML = `
    <td class="py-3 align-middle">${name}</td>

    <td class="py-3 align-middle" style="color: #636c93;">
        ${role}
    </td>

    <td class="py-3 align-middle" style="color: #636c93;">
        ${department}
    </td>

    <td class="py-3 align-middle">
        <span class="badge" style="background-color: ${statusColor};">
            ${status}
        </span>
    </td>

    <td class="py-3 align-middle">
        <button class="delete-employee-btn btn btn-sm text-danger"
                title="Delete Employee">
            <i class="bi bi-trash"></i>
        </button>
    </td>
        `;

        employeesTableBody.appendChild(newRow);

        savedEmployees.push({
    name: name,
    role: role,
    department: department,
    status: status
});
localStorage.setItem("employees", JSON.stringify(savedEmployees));
        employeeForm.reset();
        addEmployeeModal.hide();
    });
}
let savedEmployees = JSON.parse(localStorage.getItem("employees")) || [];
// ================================
// Display Saved Projects
// ================================

if (tableBody) {

    savedProjects.forEach(function(project) {

        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${project.projectName}</td>
            <td>${project.clientName}</td>
            <td>
                <span class="status in-progress"
                    style="background: #ff9800; color: #fff; padding: 2px 5px; border-radius: 4px;">
                    In Progress
                </span>
            </td>
            <td>
                <div class="progress-bar"
                    style="background: #ddd; width: 100%; height: 5px; border-radius: 3px; margin: 5px 0;">
                    <div style="background: #ff9800; width: 0%; height: 100%; border-radius: 3px;"></div>
                </div>
            </td>
        `;

        tableBody.appendChild(newRow);
    });
}


// ================================
// Display Saved Employees
// ================================

if (employeesTableBody) {

    savedEmployees.forEach(function(employee) {

        const newRow = document.createElement("tr");



        newRow.innerHTML = `
    <td class="py-3 align-middle">${employee.name}</td>

    <td class="py-3 align-middle" style="color: #636c93;">
        ${employee.role}
    </td>

    <td class="py-3 align-middle" style="color: #636c93;">
        ${employee.department}
    </td>

    <td class="py-3 align-middle">
        <span class="badge" style="background-color: ${
            employee.status === "Active"
                ? "rgba(16, 185, 129, 0.15)"
                : "rgba(220, 53, 69, 0.15)"
        };">
            ${employee.status}
        </span>
    </td>

    <td class="py-3 align-middle">
        <button class="delete-employee-btn btn btn-sm text-danger"
                title="Delete Employee">
            <i class="bi bi-trash"></i>
        </button>
    </td>
`;


        employeesTableBody.appendChild(newRow);
    });
}

// ================================
// Add Customer - Open Modal
// ================================

const addCustomerBtn = document.getElementById("addCustomerBtn");
const addCustomerModalElement = document.getElementById("addCustomerModal");

if (addCustomerBtn && addCustomerModalElement) {

    const addCustomerModal = new bootstrap.Modal(addCustomerModalElement);

    addCustomerBtn.addEventListener("click", function () {
        addCustomerModal.show();
    });

}

// ================================
// Add Customer to Table
// ================================

const customerForm = document.getElementById("customerForm");
const customersTableBody = document.getElementById("customersTableBody");

if (customerForm && customersTableBody) {

    customerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("customerName").value;
        const company = document.getElementById("customerCompany").value;
        const email = document.getElementById("customerEmail").value;
        const projects = document.getElementById("customerProjects").value;

        const newRow = document.createElement("tr");

        newRow.innerHTML = `
    <td>${name}</td>

    <td>${company}</td>

    <td>${email}</td>

    <td>
        ${projects}
        ${projects == 1 ? "Project" : "Projects"}
    </td>

    <td>
        <button class="delete-customer-btn btn btn-sm text-danger"
                title="Delete Customer">
            <i class="bi bi-trash"></i>
        </button>
    </td>
`;
        customersTableBody.appendChild(newRow);


        let customers = JSON.parse(localStorage.getItem("customers")) || [];

customers.push({
    name: name,
    company: company,
    email: email,
    projects: projects
});

localStorage.setItem("customers", JSON.stringify(customers));

        customerForm.reset();

        const modalElement = document.getElementById("addCustomerModal");
        const modal = bootstrap.Modal.getInstance(modalElement);

        if (modal) {
            modal.hide();
        }
    });

}

// ================================
// Deleted Customers
// ================================

let deletedCustomers = JSON.parse(localStorage.getItem("deletedcustomers")) || [];


// ================================
// Hide Deleted Basic Customers
// ================================

if (customersTableBody) {

    const basicCustomers = customersTableBody.querySelectorAll("tr[data-email]");

    basicCustomers.forEach(function (row) {

        const email = row.dataset.email;

        if (deletedCustomers.includes(email)) {
            row.remove();
        }

    });

}


// ================================
// Delete Customer
// ================================

if (customersTableBody) {

    customersTableBody.addEventListener("click", function (event) {

        const deleteButton = event.target.closest(".delete-customer-btn");

        if (!deleteButton) return;

        const row = deleteButton.closest("tr");

        const emailCell = row.querySelector("td:nth-child(3)");

        const email = emailCell.textContent.trim();

        // Remove customer from the table
        row.remove();

        // Save deleted customer
        if (!deletedCustomers.includes(email)) {

            deletedCustomers.push(email);

            localStorage.setItem(
                "deletedcustomers",
                JSON.stringify(deletedCustomers)
            );

        }

    });

}

// ================================
// New Project - Open Modal
// ================================

const addProjectBtn = document.getElementById("addProjectBtn");
const newProjectModalElement = document.getElementById("newProjectModal");

if (addProjectBtn && newProjectModalElement) {

    const newProjectModal = new bootstrap.Modal(newProjectModalElement);

    addProjectBtn.addEventListener("click", function () {
        newProjectModal.show();
    });

}
// ================================
// Add Project to Projects Page
// ================================

const projectForm = document.getElementById("projectForm");
const projectsContainer = document.getElementById("projectsContainer");

if (projectForm && projectsContainer) {

    projectForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("projectName").value;
        const client = document.getElementById("projectClient").value;
        const progress = document.getElementById("projectProgress").value;
        const status = document.getElementById("projectStatus").value;

        const newProject = document.createElement("div");

        newProject.className = "col-md-6 col-lg-4";

        newProject.innerHTML = `
            <div class="card border-0 p-4 h-100"
                 style="background-color: #0d122e; border-radius: 12px;">

                <div class="d-flex justify-content-between align-items-start mb-2">

                    <h5 class="fw-bold text-white m-0">
                        ${name}
                    </h5>

                    <span class="badge"
                          style="background-color: rgba(59, 130, 246, 0.15);
                                 color: #3b82f6;
                                 border: 1px solid rgba(59, 130, 246, 0.3);">
                        ${status}
                    </span>

                </div>

                <p style="color: #636c93; font-size: 14px;">
                    Client: ${client}
                </p>

                <div class="mt-4">

                    <div class="d-flex justify-content-between text-white mb-2"
                         style="font-size: 13px;">

                        <span style="color: #636c93;">
                            Progress
                        </span>

                        <span class="fw-bold">
                            ${progress}%
                        </span>

                    </div>

                    <div class="progress"
                         style="height: 6px; background-color: #070b1e;">

                        <div class="progress-bar"
                             role="progressbar"
                             style="width: ${progress}%;
                                    background-color: #4f35f3;">
                        </div>

                    </div>

                </div>

            </div>
        `;

        projectsContainer.insertBefore(
            newProject,
            projectsContainer.firstElementChild
        );

        savedProjectsPage.push({
    name: name,
    client: client,
    progress: progress,
    status: status
});

localStorage.setItem(
    "projectsPage",
    JSON.stringify(savedProjectsPage)
);

        projectForm.reset();

        const modalElement = document.getElementById("newProjectModal");
        const modal = bootstrap.Modal.getInstance(modalElement);

        if (modal) {
            modal.hide();
        }
    });
}

// Save Projects Page in LocalStorage

let savedProjectsPage = JSON.parse(localStorage.getItem("projectsPage")) || [];


// ================================
// Display Saved Projects - Projects Page
// ================================

if (projectsContainer) {

    savedProjectsPage.forEach(function(project) {

        const newProject = document.createElement("div");

        newProject.className = "col-md-6 col-lg-4";

        newProject.innerHTML = `
            <div class="card border-0 p-4 h-100"
                 style="background-color: #0d122e; border-radius: 12px;">

                <div class="d-flex justify-content-between align-items-start mb-2">

                    <h5 class="fw-bold text-white m-0">
                        ${project.name}
                    </h5>

                    <span class="badge"
                          style="background-color: rgba(59, 130, 246, 0.15);
                                 color: #3b82f6;
                                 border: 1px solid rgba(59, 130, 246, 0.3);">
                        ${project.status}
                    </span>

                </div>

                <p style="color: #636c93; font-size: 14px;">
                    Client: ${project.client}
                </p>

                <div class="mt-4">

                    <div class="d-flex justify-content-between text-white mb-2"
                         style="font-size: 13px;">

                        <span style="color: #636c93;">
                            Progress
                        </span>

                        <span class="fw-bold">
                            ${project.progress}%
                        </span>

                    </div>

                    <div class="progress"
                         style="height: 6px; background-color: #070b1e;">

                        <div class="progress-bar"
                             role="progressbar"
                             style="width: ${project.progress}%;
                                    background-color: #4f35f3;">
                        </div>

                    </div>

                </div>

            </div>
        `;

        projectsContainer.appendChild(newProject);
    });
}
// ================================
// Create Task - Open Modal
// ================================

const createTaskBtn = document.getElementById("createTaskBtn");
const createTaskModalElement = document.getElementById("createTaskModal");

if (createTaskBtn && createTaskModalElement) {

    const createTaskModal = new bootstrap.Modal(createTaskModalElement);

    createTaskBtn.addEventListener("click", function () {
        createTaskModal.show();
    });

}

// ================================
// Add Task to Tasks Page
// ================================

const taskForm = document.getElementById("taskForm");
const tasksContainer = document.getElementById("tasksContainer");

if (taskForm && tasksContainer) {

    taskForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const taskName = document.getElementById("taskName").value;
        const taskAssigned = document.getElementById("taskAssigned").value;

        const newTask = document.createElement("div");

        newTask.className = "d-flex align-items-center gap-3 pb-3";
        newTask.style.borderBottom =
            "1px solid rgba(99, 108, 147, 0.1)";

        newTask.innerHTML = `
            <input type="checkbox"
                   class="form-check-input bg-dark border-secondary m-0"
                   style="width: 20px; height: 20px;">

            <div>
                <h6 class="fw-bold text-white m-0">
                    ${taskName}
                </h6>

                <small style="color: #636c93;">
                    Assigned to: ${taskAssigned}
                </small>
            </div>
        `;

        tasksContainer.appendChild(newTask);


        savedTasks.push({
    name: taskName,
    assignedTo: taskAssigned
});

localStorage.setItem("tasks", JSON.stringify(savedTasks));

        taskForm.reset();

        const modalElement =
            document.getElementById("createTaskModal");

        const modal =
            bootstrap.Modal.getInstance(modalElement);

        if (modal) {
            modal.hide();
        }

    });

}

// ================================
// Save Tasks in LocalStorage
// ================================

let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];


// ================================
// Display Saved Tasks
// ================================

if (tasksContainer) {

    savedTasks.forEach(function(task) {

        const newTask = document.createElement("div");

        newTask.className = "d-flex align-items-center gap-3 pb-3";
        newTask.style.borderBottom =
            "1px solid rgba(99, 108, 147, 0.1)";

        newTask.innerHTML = `
            <input type="checkbox"
                   class="form-check-input bg-dark border-secondary m-0"
                   style="width: 20px; height: 20px;">

            <div>
                <h6 class="fw-bold text-white m-0">
                    ${task.name}
                </h6>

                <small style="color: #636c93;">
                    Assigned to: ${task.assignedTo}
                </small>
            </div>
        `;

        tasksContainer.appendChild(newTask);
    });
}


// ================================
// Dark Mode Toggle
// ================================

const darkModeToggle = document.getElementById("darkModeToggle");

if (darkModeToggle) {

    darkModeToggle.addEventListener("change", function () {

        if (this.checked) {
            document.body.classList.remove("light-mode");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.add("light-mode");
            localStorage.setItem("theme", "light");
        }

    });

}


// ================================
// Load Saved Theme
// ================================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.add("light-mode");

    if (darkModeToggle) {
        darkModeToggle.checked = false;
    }

} else {

    document.body.classList.remove("light-mode");

    if (darkModeToggle) {
        darkModeToggle.checked = true;
    }
  }

  // ================================
// Delete Employee
// ================================

const deleteEmployeeButtons =
    document.querySelectorAll(".delete-employee-btn");

if (deleteEmployeeButtons.length > 0) {

    deleteEmployeeButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const row = this.closest("tr");

            const employeeName =
                row.querySelector("td").textContent.trim();

            const confirmDelete =
                confirm("Are you sure you want to delete " + employeeName + "?");

            if (!confirmDelete) return;

            row.remove();

            savedEmployees =
                savedEmployees.filter(function (employee) {
                    return employee.name !== employeeName;
                });

            localStorage.setItem(
                "employees",
                JSON.stringify(savedEmployees)
            );

        });

    });

}

// ================================
// Delete Customer
// ================================


if (customersTableBody) {

    customersTableBody.addEventListener("click", function (event) {

        const deleteButton =
            event.target.closest(".delete-customer-btn");

        if (!deleteButton) return;

        const row = deleteButton.closest("tr");

        const customerName =
            row.querySelector("td").textContent.trim();

        const confirmDelete =
            confirm(
                "Are you sure you want to delete " +
                customerName +
                "?"
            );

        if (!confirmDelete) return;

        row.remove();

        savedCustomers =
            savedCustomers.filter(function (customer) {
                return customer.name !== customerName;
            });

        localStorage.setItem(
            "customers",
            JSON.stringify(savedCustomers)
        );

    });

}


