
// =====================================================
// SALES CHART
// =====================================================

const ctx = document.getElementById("salesChart");

if (ctx && typeof Chart !== "undefined") {

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
    });
}


// =====================================================
// PROJECTS - TABLE
// =====================================================

const addBtn = document.getElementById("add-project-btn");
const tableBody = document.getElementById("projects-tbody");

let savedProjects =
    JSON.parse(localStorage.getItem("projects")) || [];

localStorage.setItem(
    "projects",
    JSON.stringify(savedProjects)
);


if (addBtn && tableBody) {

    addBtn.addEventListener("click", function () {

        const projectName =
            prompt("أدخل اسم المشروع الجديد:");

        if (!projectName) {
            return alert(
                "تم إلغاء العملية، لم يتم إدخال اسم المشروع."
            );
        }

        const clientName =
            prompt("أدخل اسم العميل:");

        if (!clientName) {
            return alert(
                "تم إلغاء العملية، لم يتم إدخال اسم العميل."
            );
        }

        const newRow =
            document.createElement("tr");

        newRow.innerHTML = `
            <td>${projectName}</td>

            <td>${clientName}</td>

            <td>
                <span class="status in-progress project-status">
                    In progress
                </span>
            </td>

            <td>
                0%

                <div class="project-progress">
                    <div class="project-progress-fill"></div>
                </div>
            </td>
        `;

        tableBody.insertBefore(
            newRow,
            tableBody.firstChild
        );


        savedProjects.push({
            projectName: projectName,
            clientName: clientName
        });

        localStorage.setItem(
            "projects",
            JSON.stringify(savedProjects)
        );

        alert(
            "تم إضافة المشروع الجديد بنجاح إلى الجدول!"
        );
    });
}


// =====================================================
// DISPLAY SAVED PROJECTS - TABLE
// =====================================================

if (tableBody) {

    savedProjects.forEach(function (project) {

        const newRow =
            document.createElement("tr");

        newRow.innerHTML = `
            <td>${project.projectName}</td>

            <td>${project.clientName}</td>

            <td>
                <span class="status in-progress project-status">
                    In Progress
                </span>
            </td>

            <td>
                <div class="project-progress">
                    <div class="project-progress-fill"></div>
                </div>
            </td>
        `;

        tableBody.appendChild(newRow);
    });
}


// =====================================================
// EMPLOYEES
// =====================================================

const addEmployeeBtn =
    document.getElementById("addEmployeeBtn");

const employeeForm =
    document.getElementById("employeeForm");

const employeesTableBody =
    document.getElementById("employeesTableBody");

let savedEmployees =
    JSON.parse(localStorage.getItem("employees")) || [];

let deletedEmployees =
    JSON.parse(localStorage.getItem("deletedEmployees")) || [];


// =====================================================
// ADD EMPLOYEE
// =====================================================

if (
    addEmployeeBtn &&
    employeeForm &&
    employeesTableBody
) {

    const addEmployeeModal =
        new bootstrap.Modal(
            document.getElementById("addEmployeeModal")
        );


    addEmployeeBtn.addEventListener(
        "click",
        function () {
            addEmployeeModal.show();
        }
    );


    employeeForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById("employeeName").value;

            const role =
                document.getElementById("employeeRole").value;

            const department =
                document.getElementById(
                    "employeeDepartment"
                ).value;

            const status =
                document.getElementById(
                    "employeeStatus"
                ).value;


            const newRow =
                document.createElement("tr");


            newRow.innerHTML = `
                <td class="py-3 align-middle">
                    ${name}
                </td>

                <td class="py-3 align-middle employee-secondary-text">
                    ${role}
                </td>

                <td class="py-3 align-middle employee-secondary-text">
                    ${department}
                </td>

                <td class="py-3 align-middle">

                    <span
                        class="badge employee-status ${
                            status === "Active"
                                ? "employee-status-active"
                                : "employee-status-inactive"
                        }"
                    >
                        ${status}
                    </span>

                </td>

                <td class="py-3 align-middle">

                    <button
                        class="delete-employee-btn btn btn-sm text-danger"
                        title="Delete Employee"
                    >
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


            localStorage.setItem(
                "employees",
                JSON.stringify(savedEmployees)
            );


            employeeForm.reset();

            addEmployeeModal.hide();
        }
    );
}


// =====================================================
// DISPLAY SAVED EMPLOYEES
// =====================================================

if (employeesTableBody) {

    savedEmployees.forEach(function (employee) {

        const newRow =
            document.createElement("tr");


        newRow.innerHTML = `
            <td class="py-3 align-middle">
                ${employee.name}
            </td>

            <td class="py-3 align-middle employee-secondary-text">
                ${employee.role}
            </td>

            <td class="py-3 align-middle employee-secondary-text">
                ${employee.department}
            </td>

            <td class="py-3 align-middle">

                <span
                    class="badge employee-status ${
                        employee.status === "Active"
                            ? "employee-status-active"
                            : "employee-status-inactive"
                    }"
                >
                    ${employee.status}
                </span>

            </td>

            <td class="py-3 align-middle">

                <button
                    class="delete-employee-btn btn btn-sm text-danger"
                    title="Delete Employee"
                >
                    <i class="bi bi-trash"></i>
                </button>

            </td>
        `;


        employeesTableBody.appendChild(newRow);
    });
}


// =====================================================
// HIDE DELETED EMPLOYEES
// =====================================================

if (employeesTableBody) {

    const employeeRows =
        employeesTableBody.querySelectorAll("tr");


    employeeRows.forEach(function (row) {

        const employeeName =
            row.querySelector("td")
                .textContent
                .trim();


        if (deletedEmployees.includes(employeeName)) {
            row.remove();
        }
    });
}


// =====================================================
// DELETE EMPLOYEE
// =====================================================

const deleteEmployeeButtons =
    document.querySelectorAll(
        ".delete-employee-btn"
    );


if (deleteEmployeeButtons.length > 0) {

    deleteEmployeeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const row =
                        this.closest("tr");


                    const employeeName =
                        row.querySelector("td")
                            .textContent
                            .trim();


                    const confirmDelete =
                        confirm(
                            "Are you sure you want to delete " +
                            employeeName +
                            "?"
                        );


                    if (!confirmDelete) {
                        return;
                    }


                    row.remove();


                    savedEmployees =
                        savedEmployees.filter(
                            function (employee) {

                                return (
                                    employee.name !==
                                    employeeName
                                );
                            }
                        );


                    localStorage.setItem(
                        "employees",
                        JSON.stringify(
                            savedEmployees
                        )
                    );


                    if (
                        !deletedEmployees.includes(
                            employeeName
                        )
                    ) {

                        deletedEmployees.push(
                            employeeName
                        );


                        localStorage.setItem(
                            "deletedEmployees",
                            JSON.stringify(
                                deletedEmployees
                            )
                        );
                    }
                }
            );
        }
    );
}


// =====================================================
// CUSTOMERS
// =====================================================

const addCustomerBtn =
    document.getElementById(
        "addCustomerBtn"
    );

const addCustomerModalElement =
    document.getElementById(
        "addCustomerModal"
    );

const customerForm =
    document.getElementById(
        "customerForm"
    );

const customersTableBody =
    document.getElementById(
        "customersTableBody"
    );

let deletedCustomers =
    JSON.parse(
        localStorage.getItem(
            "deletedcustomers"
        )
    ) || [];

    // =====================================================
// DISPLAY SAVED CUSTOMERS
// =====================================================

if (customersTableBody) {

    let savedCustomers =
        JSON.parse(localStorage.getItem("customers")) || [];

    savedCustomers.forEach(function (customer) {

        const newRow = document.createElement("tr");

        newRow.innerHTML = `
            <td>${customer.name}</td>

            <td>${customer.company}</td>

            <td>${customer.email}</td>

            <td>
                ${customer.projects}
                ${
                    customer.projects == 1
                        ? "Project"
                        : "Projects"
                }
            </td>

            <td>
                <button
                    class="delete-customer-btn btn btn-sm text-danger"
                    title="Delete Customer"
                >
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;

        customersTableBody.appendChild(newRow);
    });
}


// =====================================================
// OPEN CUSTOMER MODAL
// =====================================================

if (
    addCustomerBtn &&
    addCustomerModalElement
) {

    const addCustomerModal =
        new bootstrap.Modal(
            addCustomerModalElement
        );


    addCustomerBtn.addEventListener(
        "click",
        function () {

            addCustomerModal.show();
        }
    );
}


// =====================================================
// ADD CUSTOMER
// =====================================================

if (
    customerForm &&
    customersTableBody
) {

    customerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "customerName"
                ).value;


            const company =
                document.getElementById(
                    "customerCompany"
                ).value;


            const email =
                document.getElementById(
                    "customerEmail"
                ).value;


            const projects =
                document.getElementById(
                    "customerProjects"
                ).value;


            const newRow =
                document.createElement("tr");


            newRow.innerHTML = `
                <td>${name}</td>

                <td>${company}</td>

                <td>${email}</td>

                <td>
                    ${projects}
                    ${
                        projects == 1
                            ? "Project"
                            : "Projects"
                    }
                </td>

                <td>

                    <button
                        class="delete-customer-btn btn btn-sm text-danger"
                        title="Delete Customer"
                    >
                        <i class="bi bi-trash"></i>
                    </button>

                </td>
            `;


            customersTableBody.appendChild(
                newRow
            );


            let customers =
                JSON.parse(
                    localStorage.getItem(
                        "customers"
                    )
                ) || [];


            customers.push({
                name: name,
                company: company,
                email: email,
                projects: projects
            });


            localStorage.setItem(
                "customers",
                JSON.stringify(customers)
            );


            customerForm.reset();


            const modalElement =
                document.getElementById(
                    "addCustomerModal"
                );


            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                );


            if (modal) {
                modal.hide();
            }
        }
    );
}


// =====================================================
// HIDE DELETED CUSTOMERS
// =====================================================

if (customersTableBody) {

    const basicCustomers =
        customersTableBody.querySelectorAll(
            "tr[data-email]"
        );


    basicCustomers.forEach(function (row) {

        const email =
            row.dataset.email;


        if (
            deletedCustomers.includes(email)
        ) {
            row.remove();
        }
    });
}


// =====================================================
// DELETE CUSTOMER
// =====================================================

if (customersTableBody) {

    customersTableBody.addEventListener(
        "click",
        function (event) {

            const deleteButton =
                event.target.closest(
                    ".delete-customer-btn"
                );


            if (!deleteButton) {
                return;
            }


            const row =
                deleteButton.closest("tr");


            const customerName =
                row.querySelector("td")
                    .textContent
                    .trim();


            const customerEmail =
                row.querySelector(
                    "td:nth-child(3)"
                )
                .textContent
                .trim();


            const confirmDelete =
                confirm(
                    "Are you sure you want to delete " +
                    customerName +
                    "?"
                );


            if (!confirmDelete) {
                return;
            }


            row.remove();


            let customers =
                JSON.parse(
                    localStorage.getItem(
                        "customers"
                    )
                ) || [];


            customers =
                customers.filter(
                    function (customer) {

                        return (
                            customer.email !==
                            customerEmail
                        );
                    }
                );


            localStorage.setItem(
                "customers",
                JSON.stringify(customers)
            );


            if (
                !deletedCustomers.includes(
                    customerEmail
                )
            ) {

                deletedCustomers.push(
                    customerEmail
                );


                localStorage.setItem(
                    "deletedcustomers",
                    JSON.stringify(
                        deletedCustomers
                    )
                );
            }
        }
    );
}


// =====================================================
// PROJECTS PAGE
// =====================================================

const addProjectBtn =
    document.getElementById(
        "addProjectBtn"
    );

const newProjectModalElement =
    document.getElementById(
        "newProjectModal"
    );

const projectForm =
    document.getElementById(
        "projectForm"
    );

const projectsContainer =
    document.getElementById(
        "projectsContainer"
    );

let savedProjectsPage =
    JSON.parse(
        localStorage.getItem(
            "projectsPage"
        )
    ) || [];


// =====================================================
// OPEN PROJECT MODAL
// =====================================================

if (
    addProjectBtn &&
    newProjectModalElement
) {

    const newProjectModal =
        new bootstrap.Modal(
            newProjectModalElement
        );


    addProjectBtn.addEventListener(
        "click",
        function () {

            newProjectModal.show();
        }
    );
}


// =====================================================
// CREATE PROJECT
// =====================================================

if (
    projectForm &&
    projectsContainer
) {

    projectForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "projectName"
                ).value;


            const client =
                document.getElementById(
                    "projectClient"
                ).value;


            const progress =
                document.getElementById(
                    "projectProgress"
                ).value;


            const status =
                document.getElementById(
                    "projectStatus"
                ).value;


            const newProject =
                document.createElement("div");


            newProject.className =
                "col-md-6 col-lg-4";


            newProject.innerHTML = `
                <div class="card border-0 p-4 h-100 project-card">

                    <div class="d-flex justify-content-between align-items-start mb-2">

                        <h5 class="fw-bold text-white m-0">
                            ${name}
                        </h5>

                        <span class="badge project-status-badge">
                            ${status}
                        </span>

                    </div>


                    <p class="project-client">
                        Client: ${client}
                    </p>


                    <div class="mt-4">

                        <div class="d-flex justify-content-between text-white mb-2 project-progress-label">

                            <span class="project-secondary-text">
                                Progress
                            </span>

                            <span class="fw-bold">
                                ${progress}%
                            </span>

                        </div>


                        <div class="progress project-progress-container">

                            <div
                                class="progress-bar project-progress-main"
                                role="progressbar"
                                style="width: ${progress}%"
                            >
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
                JSON.stringify(
                    savedProjectsPage
                )
            );


            projectForm.reset();


            const modalElement =
                document.getElementById(
                    "newProjectModal"
                );


            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                );


            if (modal) {
                modal.hide();
            }
        }
    );
}


// =====================================================
// DISPLAY SAVED PROJECTS
// =====================================================

if (projectsContainer) {

    savedProjectsPage.forEach(
        function (project) {

            const newProject =
                document.createElement("div");


            newProject.className =
                "col-md-6 col-lg-4";


            newProject.innerHTML = `
                <div class="card border-0 p-4 h-100 project-card">

                    <div class="d-flex justify-content-between align-items-start mb-2">

                        <h5 class="fw-bold text-white m-0">
                            ${project.name}
                        </h5>

                        <span class="badge project-status-badge">
                            ${project.status}
                        </span>

                    </div>


                    <p class="project-client">
                        Client: ${project.client}
                    </p>


                    <div class="mt-4">

                        <div class="d-flex justify-content-between text-white mb-2 project-progress-label">

                            <span class="project-secondary-text">
                                Progress
                            </span>

                            <span class="fw-bold">
                                ${project.progress}%
                            </span>

                        </div>


                        <div class="progress project-progress-container">

                            <div
                                class="progress-bar project-progress-main"
                                role="progressbar"
                                style="width: ${project.progress}%"
                            >
                            </div>

                        </div>

                    </div>

                </div>
            `;


            projectsContainer.appendChild(
                newProject
            );
        }
    );
}


// =====================================================
// TASKS
// =====================================================

const createTaskBtn =
    document.getElementById(
        "createTaskBtn"
    );

const createTaskModalElement =
    document.getElementById(
        "createTaskModal"
    );

const taskForm =
    document.getElementById(
        "taskForm"
    );

const tasksContainer =
    document.getElementById(
        "tasksContainer"
    );

let savedTasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];


// =====================================================
// OPEN TASK MODAL
// =====================================================

if (
    createTaskBtn &&
    createTaskModalElement
) {

    const createTaskModal =
        new bootstrap.Modal(
            createTaskModalElement
        );


    createTaskBtn.addEventListener(
        "click",
        function () {

            createTaskModal.show();
        }
    );
}


// =====================================================
// ADD TASK
// =====================================================

if (
    taskForm &&
    tasksContainer
) {

    taskForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const taskName =
                document.getElementById(
                    "taskName"
                ).value;


            const taskAssigned =
                document.getElementById(
                    "taskAssigned"
                ).value;


            const newTask =
                document.createElement("div");


            newTask.className =
                "task-item";


            newTask.innerHTML = `
                <input
                    type="checkbox"
                    class="form-check-input bg-dark border-secondary m-0 task-checkbox"
                >

                <div>

                    <h6 class="fw-bold text-white m-0">
                        ${taskName}
                    </h6>

                    <small class="task-secondary-text">
                        Assigned to: ${taskAssigned}
                    </small>

                </div>
            `;


            tasksContainer.appendChild(
                newTask
            );


            savedTasks.push({
                name: taskName,
                assignedTo: taskAssigned
            });


            localStorage.setItem(
                "tasks",
                JSON.stringify(savedTasks)
            );


            taskForm.reset();


            const modalElement =
                document.getElementById(
                    "createTaskModal"
                );


            const modal =
                bootstrap.Modal.getInstance(
                    modalElement
                );


            if (modal) {
                modal.hide();
            }
        }
    );
}


// =====================================================
// DISPLAY SAVED TASKS
// =====================================================

if (tasksContainer) {

    savedTasks.forEach(
        function (task) {

            const newTask =
                document.createElement("div");


            newTask.className =
                "task-item";


            newTask.innerHTML = `
                <input
                    type="checkbox"
                    class="form-check-input bg-dark border-secondary m-0 task-checkbox"
                >

                <div>

                    <h6 class="fw-bold text-white m-0">
                        ${task.name}
                    </h6>

                    <small class="task-secondary-text">
                        Assigned to: ${task.assignedTo}
                    </small>

                </div>
            `;


            tasksContainer.appendChild(
                newTask
            );
        }
    );
}


// =====================================================
// DARK MODE
// =====================================================

const darkModeToggle =
    document.getElementById(
        "darkModeToggle"
    );


if (darkModeToggle) {

    darkModeToggle.addEventListener(
        "change",
        function () {

            if (this.checked) {

                document.body.classList.remove(
                    "light-mode"
                );

                localStorage.setItem(
                    "theme",
                    "dark"
                );

            } else {

                document.body.classList.add(
                    "light-mode"
                );

                localStorage.setItem(
                    "theme",
                    "light"
                );
            }
        }
    );
}


// =====================================================
// LOAD SAVED THEME
// =====================================================

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "light") {

    document.body.classList.add(
        "light-mode"
    );


    if (darkModeToggle) {
        darkModeToggle.checked = false;
    }

} else {

    document.body.classList.remove(
        "light-mode"
    );


    if (darkModeToggle) {
        darkModeToggle.checked = true;
    }
}


// =====================================================
// GLOBAL SEARCH
// =====================================================

const searchForm =
    document.getElementById(
        "searchForm"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );


if (
    searchForm &&
    searchInput
) {

    searchForm.addEventListener(
        "submit",
        function (e) {

            e.preventDefault();


            const searchTerm =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!searchTerm) {
                return;
            }


            const searchSources = [

                {
                    key: "employees",
                    type: "Employees",
                    page: "pages/empoloyees.html"
                },

                {
                    key: "customers",
                    type: "Customers",
                    page: "pages/customers.html"
                },

                {
                    key: "projects",
                    type: "Projects",
                    page: "pages/projects.html"
                },

                {
                    key: "tasks",
                    type: "Tasks",
                    page: "pages/tasks.html"
                }

            ];


            const results = [];


            searchSources.forEach(
                source => {

                    let data =
                        JSON.parse(
                            localStorage.getItem(
                                source.key
                            )
                        ) || [];


                    if (
                        source.key === "customers"
                    ) {

                        const deletedCustomers =
                            JSON.parse(
                                localStorage.getItem(
                                    "deletedcustomers"
                                )
                            ) || [];


                        data =
                            data.filter(
                                customer => {

                                    return !deletedCustomers.some(
                                        deleted => {

                                            const deletedName =
                                                typeof deleted ===
                                                "string"
                                                    ? deleted
                                                    : deleted.name;


                                            return (
                                                deletedName &&
                                                customer.name &&
                                                deletedName
                                                    .toLowerCase() ===
                                                    customer.name
                                                        .toLowerCase()
                                            );
                                        }
                                    );
                                }
                            );
                    }


                    data.forEach(
                        item => {

                            const searchableText =
                                Object.values(item)
                                    .join(" ")
                                    .toLowerCase();


                            if (
                                searchableText.includes(
                                    searchTerm
                                )
                            ) {

                                results.push({
                                    type:
                                        source.type,

                                    data:
                                        item,

                                    page:
                                        source.page
                                });
                            }
                        }
                    );
                }
            );


            // =================================================
            // SEARCH RESULTS
            // =================================================

            let searchResults =
                document.getElementById(
                    "searchResults"
                );


            if (!searchResults) {

                searchResults =
                    document.createElement(
                        "div"
                    );


                searchResults.id =
                    "searchResults";


                searchResults.className =
                    "search-results";


                searchForm.parentElement.appendChild(
                    searchResults
                );
            }


            searchResults.innerHTML = "";


            if (results.length === 0) {

                searchResults.innerHTML =
                    "<p>No results found.</p>";

            } else {

                results.forEach(
                    result => {

                        const resultItem =
                            document.createElement(
                                "div"
                            );


                        resultItem.className =
                            "search-result-item";


                        resultItem.innerHTML = `
                            <strong>
                                ${result.type}
                            </strong>
                            <br>

                            ${Object.values(
                                result.data
                            ).join(" - ")}
                        `;


                        resultItem.addEventListener(
                            "click",
                            function () {

                                window.location.href =
                                    result.page;
                            }
                        );


                        searchResults.appendChild(
                            resultItem
                        );
                    }
                );
            }
        }
    );
}



// ================================
// Dashboard Totals
// ================================

const employeesTotal = document.getElementById("employeesTotal");
const customersTotal = document.getElementById("customersTotal");
const projectsTotal = document.getElementById("projectsTotal");
const tasksTotal = document.getElementById("tasksTotal");

const employeesData =
    JSON.parse(localStorage.getItem("employees")) || [];

const customersData =
    JSON.parse(localStorage.getItem("customers")) || [];

const projectsData =
    JSON.parse(localStorage.getItem("projectsPage")) || [];

const tasksData =
    JSON.parse(localStorage.getItem("tasks")) || [];

if (employeesTotal) {
    employeesTotal.textContent = employeesData.length;
}

if (customersTotal) {
    customersTotal.textContent = customersData.length;
}

if (projectsTotal) {
    projectsTotal.textContent = projectsData.length;
}

if (tasksTotal) {
    tasksTotal.textContent = tasksData.length;
}


// ================================
// Projects Report
// ================================

const reportTotalProjects =
    document.getElementById("reportTotalProjects");

const reportCompletedProjects =
    document.getElementById("reportCompletedProjects");

const reportInProgressProjects =
    document.getElementById("reportInProgressProjects");

const reportAverageProgress =
    document.getElementById("reportAverageProgress");


if (
    reportTotalProjects &&
    reportCompletedProjects &&
    reportInProgressProjects &&
    reportAverageProgress
) {

    const projectsReportData =
        JSON.parse(localStorage.getItem("projectsPage")) || [];


    const totalProjects =
        projectsReportData.length;


    const completedProjects =
        projectsReportData.filter(function (project) {

            return (
                project.status === "Completed" ||
                Number(project.progress) === 100
            );

        }).length;


    const inProgressProjects =
        projectsReportData.filter(function (project) {

            return (
                project.status === "In Progress" ||
                project.status === "In progress"
            );

        }).length;


    let totalProgress = 0;

    projectsReportData.forEach(function (project) {

        totalProgress += Number(project.progress) || 0;

    });


    const averageProgress =
        totalProjects > 0
            ? Math.round(totalProgress / totalProjects)
            : 0;


    reportTotalProjects.textContent =
        totalProjects;

    reportCompletedProjects.textContent =
        completedProjects;

    reportInProgressProjects.textContent =
        inProgressProjects;

    reportAverageProgress.textContent =
        averageProgress + "%";
}


// ================================
// Tasks Report
// ================================

const reportTotalTasks =
    document.getElementById("reportTotalTasks");

const reportAssignedTasks =
    document.getElementById("reportAssignedTasks");


if (reportTotalTasks && reportAssignedTasks) {

    const tasksReportData =
        JSON.parse(localStorage.getItem("tasks")) || [];


    const totalTasks =
        tasksReportData.length;


    const assignedTasks =
        tasksReportData.filter(function (task) {

            return task.assignedTo &&
                   task.assignedTo.trim() !== "";

        }).length;


    reportTotalTasks.textContent =
        totalTasks;

    reportAssignedTasks.textContent =
        assignedTasks;
}


// ================================
// Team Activity Report
// ================================

const teamActivityReport =
    document.getElementById("teamActivityReport");

if (teamActivityReport) {

    const employeesReportData =
        JSON.parse(localStorage.getItem("employees")) || [];

    const tasksReportData =
        JSON.parse(localStorage.getItem("tasks")) || [];

    teamActivityReport.innerHTML = "";

    employeesReportData.forEach(function (employee) {

        const employeeTasks =
            tasksReportData.filter(function (task) {

                return (
                    task.assignedTo &&
                    task.assignedTo.trim().toLowerCase() ===
                    employee.name.trim().toLowerCase()
                );

            }).length;

        const row =
            document.createElement("div");

        row.className =
            "team-activity-row";

        row.innerHTML = `
            <span class="team-employee-name">
                ${employee.name}
            </span>

            <span class="team-task-count">
                ${employeeTasks} Tasks
            </span>
        `;

        teamActivityReport.appendChild(row);
    });
}