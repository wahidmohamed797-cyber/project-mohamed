(async function () {
    const client = window.supabaseClient;
    const session = window.appAuthReady
        ? await window.appAuthReady
        : null;

    if (!client || !session) {
        return;
    }

    const user = session.user;
    const pageError = document.createElement("div");
    pageError.className = "app-data-error";
    pageError.setAttribute("role", "alert");
    pageError.hidden = true;
    document.body.prepend(pageError);

    function showError(error, fallback) {
        console.error(fallback, error);
        pageError.textContent = fallback + " " + (error.message || "");
        pageError.hidden = false;
    }

    function showMessage(message) {
        pageError.classList.add("app-data-success");
        pageError.textContent = message;
        pageError.hidden = false;
        window.setTimeout(function () {
            pageError.hidden = true;
            pageError.classList.remove("app-data-success");
        }, 5000);
    }

    function node(tag, text, className) {
        const element = document.createElement(tag);
        if (text !== undefined && text !== null) {
            element.textContent = String(text);
        }
        if (className) {
            element.className = className;
        }
        return element;
    }

    function cell(row, text, className) {
        const element = node("td", text, className);
        row.appendChild(element);
        return element;
    }

    function displayStatus(status) {
        return {
            pending: "Pending",
            in_progress: "In Progress",
            completed: "Completed",
            active: "Active",
            inactive: "Inactive",
            in_meeting: "In Meeting"
        }[status] || status;
    }

    function normalizeProjectStatus(value) {
        return String(value).trim().toLowerCase().replace(/\s+/g, "_");
    }

    function normalizeEmployeeStatus(value) {
        return String(value).trim().toLowerCase().replace(/\s+/g, "_");
    }

    function setBusy(form, busy) {
        const button = form.querySelector('[type="submit"]');
        if (button) {
            button.disabled = busy;
        }
    }

    function closeModal(id) {
        const element = document.getElementById(id);
        const modal = element && window.bootstrap
            ? window.bootstrap.Modal.getInstance(element)
            : null;
        if (modal) {
            modal.hide();
        }
    }

    async function submitForm(form, action) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            setBusy(form, true);
            pageError.hidden = true;
            try {
                await action();
                if (!form.classList.contains("auth-profile-form")) {
                    form.reset();
                }
            } catch (error) {
                showError(error, "تعذر حفظ التغييرات.");
            } finally {
                setBusy(form, false);
            }
        });
    }

    function openModal(buttonId, modalId) {
        const button = document.getElementById(buttonId);
        const modalElement = document.getElementById(modalId);
        if (!button || !modalElement || !window.bootstrap) {
            return;
        }
        const modal = new window.bootstrap.Modal(modalElement);
        button.addEventListener("click", function () {
            modal.show();
        });
    }

    async function runQuery(query) {
        const result = await query;
        if (result.error) {
            throw result.error;
        }
        return result.data || [];
    }

    async function loadData() {
        const results = await Promise.all([
            runQuery(client.from("profiles")
                .select("id, display_name")
                .eq("id", user.id)
                .single()),
            runQuery(client.from("customers").select("*").order("created_at")),
            runQuery(client.from("employees").select("*").order("created_at")),
            runQuery(client.from("projects").select("*").order("created_at", { ascending: false })),
            runQuery(client.from("tasks").select("*").order("created_at", { ascending: false }))
        ]);

        return {
            profile: results[0],
            customers: results[1],
            employees: results[2],
            projects: results[3],
            tasks: results[4]
        };
    }

    let data;
    try {
        data = await loadData();
    } catch (error) {
        document.documentElement.classList.remove("app-loading");
        showError(
            error,
            "تعذر تحميل بيانات قاعدة البيانات. تحقق من اتصال الإنترنت ومن تشغيل مخطط Supabase."
        );
        return;
    }

    const customersById = new Map(
        data.customers.map(function (customer) {
            return [customer.id, customer];
        })
    );
    const employeesById = new Map(
        data.employees.map(function (employee) {
            return [employee.id, employee];
        })
    );

    function updateSelect(selectId, records, label, includeEmpty) {
        const select = document.getElementById(selectId);
        if (!select) {
            return;
        }
        const first = includeEmpty
            ? [new Option("غير محدد", "")]
            : [];
        select.replaceChildren.apply(select, first.concat(
            records.map(function (record) {
                return new Option(record[label], record.id);
            })
        ));
    }

    function renderCustomers() {
        const tbody = document.getElementById("customersTableBody");
        if (!tbody) {
            return;
        }
        tbody.replaceChildren();
        if (!data.customers.length) {
            const row = document.createElement("tr");
            const empty = cell(row, "No customers yet.", "py-3 text-center");
            empty.colSpan = 5;
            tbody.appendChild(row);
            return;
        }
        data.customers.forEach(function (customer) {
            const row = document.createElement("tr");
            row.dataset.id = customer.id;
            cell(row, customer.name, "py-3 align-middle");
            cell(row, customer.company, "py-3 align-middle");
            cell(row, customer.email, "py-3 align-middle");
            const projectCount = data.projects.filter(function (project) {
                return project.customer_id === customer.id;
            }).length;
            cell(row, projectCount + (projectCount === 1 ? " Project" : " Projects"), "py-3 align-middle");
            const actions = cell(row, null, "py-3 align-middle");
            const button = node("button", null, "delete-customer-btn btn btn-sm text-danger");
            button.type = "button";
            button.title = "Delete Customer";
            button.appendChild(node("i", null, "bi bi-trash"));
            actions.appendChild(button);
            tbody.appendChild(row);
        });
    }

    function renderEmployees() {
        const tbody = document.getElementById("employeesTableBody");
        if (!tbody) {
            return;
        }
        tbody.replaceChildren();
        if (!data.employees.length) {
            const row = document.createElement("tr");
            const empty = cell(row, "No employees yet.", "py-3 text-center");
            empty.colSpan = 5;
            tbody.appendChild(row);
            return;
        }
        data.employees.forEach(function (employee) {
            const row = document.createElement("tr");
            row.dataset.id = employee.id;
            cell(row, employee.name, "py-3 align-middle");
            cell(row, employee.role, "py-3 align-middle employee-secondary-text");
            cell(row, employee.department, "py-3 align-middle employee-secondary-text");
            const statusCell = cell(row, null, "py-3 align-middle");
            const badge = node("span", displayStatus(employee.status),
                "badge employee-status " +
                (employee.status === "active"
                    ? "employee-status-active"
                    : "employee-status-inactive"));
            statusCell.appendChild(badge);
            const actions = cell(row, null, "py-3 align-middle");
            const button = node("button", null, "delete-employee-btn btn btn-sm text-danger");
            button.type = "button";
            button.title = "Delete Employee";
            button.appendChild(node("i", null, "bi bi-trash"));
            actions.appendChild(button);
            tbody.appendChild(row);
        });
    }

    function renderProjectCard(project) {
        const wrapper = node("div", null, "col-md-6 col-lg-4");
        const card = node("div", null, "card border-0 p-4 h-100 project-card");
        const heading = node("div", null, "d-flex justify-content-between align-items-start mb-2");
        heading.append(
            node("h5", project.name, "fw-bold text-white m-0"),
            node("span", displayStatus(project.status), "badge project-status-badge")
        );
        const customer = customersById.get(project.customer_id);
        card.append(
            heading,
            node("p", "Client: " + (customer ? customer.name : "Not assigned"), "project-client")
        );
        const progressSection = node("div", null, "mt-4");
        const labels = node("div", null, "d-flex justify-content-between text-white mb-2 project-progress-label");
        labels.append(
            node("span", "Progress", "project-secondary-text"),
            node("span", project.progress + "%", "fw-bold")
        );
        const progress = node("div", null, "progress project-progress-container");
        const bar = node("div", null, "progress-bar project-progress-main");
        bar.setAttribute("role", "progressbar");
        bar.setAttribute("aria-valuenow", String(project.progress));
        bar.setAttribute("aria-valuemin", "0");
        bar.setAttribute("aria-valuemax", "100");
        bar.style.width = project.progress + "%";
        progress.appendChild(bar);
        progressSection.append(labels, progress);
        card.appendChild(progressSection);
        wrapper.appendChild(card);
        return wrapper;
    }

    function renderProjects() {
        const container = document.getElementById("projectsContainer");
        if (container) {
            container.replaceChildren();
            if (!data.projects.length) {
                container.appendChild(node("div", "No projects yet.", "col-12 text-center text-muted py-4"));
            }
            data.projects.forEach(function (project) {
                container.appendChild(renderProjectCard(project));
            });
        }

        const tbody = document.getElementById("projects-tbody");
        if (tbody) {
            tbody.replaceChildren();
            if (!data.projects.length) {
                const row = document.createElement("tr");
                const empty = cell(row, "No projects yet.", "text-center py-3");
                empty.colSpan = 4;
                tbody.appendChild(row);
            }
            data.projects.slice(0, 8).forEach(function (project) {
                const row = document.createElement("tr");
                const customer = customersById.get(project.customer_id);
                cell(row, project.name);
                cell(row, customer ? customer.name : "Not assigned");
                const status = cell(row, null);
                const badge = node("span", displayStatus(project.status),
                    "badge " + (project.status === "completed"
                        ? "bg-success"
                        : project.status === "pending"
                            ? "bg-danger"
                            : "bg-warning text-dark"));
                status.appendChild(badge);
                const progressCell = cell(row, project.progress + "%");
                if (project.progress < 100) {
                    const track = node("div", null, "progress");
                    track.style.height = "8px";
                    const bar = node("div", null, "progress-bar bg-warning");
                    bar.style.width = project.progress + "%";
                    track.appendChild(bar);
                    progressCell.appendChild(track);
                }
                tbody.appendChild(row);
            });
        }
    }

    function renderTasks() {
        const container = document.getElementById("tasksContainer");
        if (!container) {
            return;
        }
        container.replaceChildren();
        if (!data.tasks.length) {
            container.appendChild(node("p", "No tasks yet.", "text-center text-muted py-3"));
            return;
        }
        data.tasks.forEach(function (task) {
            const item = node("div", null, "task-item");
            const checkbox = node("input", null, "form-check-input bg-dark border-secondary m-0 task-checkbox");
            checkbox.type = "checkbox";
            checkbox.checked = task.is_completed;
            checkbox.setAttribute("aria-label", "Mark task completed");
            const title = node("h6", task.name, "fw-bold text-white m-0");
            if (task.is_completed) {
                title.classList.add("text-decoration-line-through");
            }
            checkbox.addEventListener("change", async function () {
                checkbox.disabled = true;
                try {
                    const result = await client.from("tasks")
                        .update({ is_completed: checkbox.checked })
                        .eq("id", task.id)
                        .select()
                        .single();
                    if (result.error) {
                        throw result.error;
                    }
                    task.is_completed = result.data.is_completed;
                    title.classList.toggle("text-decoration-line-through", task.is_completed);
                    checkbox.disabled = false;
                    renderReports();
                } catch (error) {
                    checkbox.checked = !checkbox.checked;
                    checkbox.disabled = false;
                    showError(error, "تعذر تحديث حالة المهمة.");
                }
            });
            const details = document.createElement("div");
            const employee = employeesById.get(task.assigned_employee_id);
            details.append(
                title,
                node("small", "Assigned to: " + (employee ? employee.name : "Unassigned"), "task-secondary-text")
            );
            item.append(checkbox, details);
            container.appendChild(item);
        });
    }

    function renderDashboard() {
        const totals = [
            ["employeesTotal", data.employees.length],
            ["customersTotal", data.customers.length],
            ["projectsTotal", data.projects.length],
            ["tasksTotal", data.tasks.length]
        ];
        totals.forEach(function (entry) {
            const element = document.getElementById(entry[0]);
            if (element) {
                element.textContent = String(entry[1]);
            }
        });
    }

    function renderReports() {
        const totalProjects = data.projects.length;
        const completedProjects = data.projects.filter(function (project) {
            return project.status === "completed";
        }).length;
        const inProgressProjects = data.projects.filter(function (project) {
            return project.status === "in_progress";
        }).length;
        const averageProgress = totalProjects
            ? Math.round(data.projects.reduce(function (sum, project) {
                return sum + Number(project.progress);
            }, 0) / totalProjects)
            : 0;

        [
            ["reportTotalProjects", totalProjects],
            ["reportCompletedProjects", completedProjects],
            ["reportInProgressProjects", inProgressProjects],
            ["reportAverageProgress", averageProgress + "%"],
            ["reportTotalTasks", data.tasks.length],
            ["reportAssignedTasks", data.tasks.filter(function (task) {
                return Boolean(task.assigned_employee_id);
            }).length]
        ].forEach(function (entry) {
            const element = document.getElementById(entry[0]);
            if (element) {
                element.textContent = String(entry[1]);
            }
        });

        const activity = document.getElementById("teamActivityReport");
        if (activity) {
            activity.replaceChildren();
            if (!data.employees.length) {
                activity.appendChild(node("p", "No employees yet.", "text-center text-muted py-3"));
            }
            data.employees.forEach(function (employee) {
                const count = data.tasks.filter(function (task) {
                    return task.assigned_employee_id === employee.id;
                }).length;
                const row = node("div", null, "team-activity-row");
                row.append(
                    node("span", employee.name, "team-employee-name"),
                    node("span", count + " Tasks", "team-task-count")
                );
                activity.appendChild(row);
            });
        }
    }

    renderCustomers();
    renderEmployees();
    renderProjects();
    renderTasks();
    renderDashboard();
    renderReports();
    const salesChartCanvas = document.getElementById("salesChart");
    if (salesChartCanvas && typeof window.Chart !== "undefined") {
        new window.Chart(salesChartCanvas, {
            type: "bar",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
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
    updateSelect("projectClient", data.customers, "name", true);
    updateSelect("taskAssigned", data.employees, "name", true);
    updateSelect("taskProject", data.projects, "name", true);

    const addEmployeeButton = document.getElementById("addEmployeeBtn");
    const employeeForm = document.getElementById("employeeForm");
    if (addEmployeeButton && employeeForm) {
        openModal("addEmployeeBtn", "addEmployeeModal");
        await submitForm(employeeForm, async function () {
            const result = await client.from("employees").insert({
                name: document.getElementById("employeeName").value.trim(),
                role: document.getElementById("employeeRole").value.trim(),
                department: document.getElementById("employeeDepartment").value.trim(),
                status: normalizeEmployeeStatus(document.getElementById("employeeStatus").value)
            }).select().single();
            if (result.error) {
                throw result.error;
            }
            data.employees.push(result.data);
            employeesById.set(result.data.id, result.data);
            renderEmployees();
            renderDashboard();
            renderReports();
            updateSelect("taskAssigned", data.employees, "name", true);
            closeModal("addEmployeeModal");
        });
    }

    const employeeTable = document.getElementById("employeesTableBody");
    if (employeeTable) {
        employeeTable.addEventListener("click", async function (event) {
            const button = event.target.closest(".delete-employee-btn");
            const row = button && button.closest("tr");
            const employee = row && data.employees.find(function (entry) {
                return entry.id === row.dataset.id;
            });
            if (!employee || !window.confirm("Delete " + employee.name + "?")) {
                return;
            }
            try {
                const result = await client.from("employees").delete().eq("id", employee.id);
                if (result.error) {
                    throw result.error;
                }
            } catch (error) {
                showError(error, "تعذر حذف الموظف. قد تكون هناك مهام مرتبطة به.");
                return;
            }
            data.employees = data.employees.filter(function (entry) {
                return entry.id !== employee.id;
            });
            employeesById.delete(employee.id);
            data.tasks.forEach(function (task) {
                if (task.assigned_employee_id === employee.id) {
                    task.assigned_employee_id = null;
                }
            });
            renderEmployees();
            renderTasks();
            renderDashboard();
            renderReports();
            updateSelect("taskAssigned", data.employees, "name", true);
        });
    }

    const addCustomerButton = document.getElementById("addCustomerBtn");
    const customerForm = document.getElementById("customerForm");
    if (addCustomerButton && customerForm) {
        openModal("addCustomerBtn", "addCustomerModal");
        await submitForm(customerForm, async function () {
            const result = await client.from("customers").insert({
                name: document.getElementById("customerName").value.trim(),
                company: document.getElementById("customerCompany").value.trim(),
                email: document.getElementById("customerEmail").value.trim()
            }).select().single();
            if (result.error) {
                throw result.error;
            }
            data.customers.push(result.data);
            customersById.set(result.data.id, result.data);
            renderCustomers();
            renderDashboard();
            updateSelect("projectClient", data.customers, "name", true);
            closeModal("addCustomerModal");
        });
    }

    const customerTable = document.getElementById("customersTableBody");
    if (customerTable) {
        customerTable.addEventListener("click", async function (event) {
            const button = event.target.closest(".delete-customer-btn");
            const row = button && button.closest("tr");
            const customer = row && data.customers.find(function (entry) {
                return entry.id === row.dataset.id;
            });
            if (!customer || !window.confirm("Delete " + customer.name + "?")) {
                return;
            }
            try {
                const result = await client.from("customers").delete().eq("id", customer.id);
                if (result.error) {
                    throw result.error;
                }
            } catch (error) {
                showError(error, "تعذر حذف العميل. قد تكون هناك مشاريع مرتبطة به.");
                return;
            }
            data.customers = data.customers.filter(function (entry) {
                return entry.id !== customer.id;
            });
            customersById.delete(customer.id);
            renderCustomers();
            renderProjects();
            renderDashboard();
            updateSelect("projectClient", data.customers, "name", true);
        });
    }

    const addProjectButton = document.getElementById("addProjectBtn");
    const projectForm = document.getElementById("projectForm");
    if (addProjectButton && projectForm) {
        openModal("addProjectBtn", "newProjectModal");
        await submitForm(projectForm, async function () {
            const result = await client.from("projects").insert({
                name: document.getElementById("projectName").value.trim(),
                customer_id: document.getElementById("projectClient").value || null,
                progress: Number(document.getElementById("projectProgress").value),
                status: normalizeProjectStatus(document.getElementById("projectStatus").value)
            }).select().single();
            if (result.error) {
                throw result.error;
            }
            data.projects.unshift(result.data);
            renderProjects();
            renderCustomers();
            renderDashboard();
            renderReports();
            closeModal("newProjectModal");
            updateSelect("taskProject", data.projects, "name", true);
        });
    }

    const dashboardAddProject = document.getElementById("add-project-btn");
    if (dashboardAddProject) {
        dashboardAddProject.addEventListener("click", async function () {
            const name = window.prompt("Project name:");
            if (!name || !name.trim()) {
                return;
            }
            const clientName = window.prompt("Client name (optional):") || "";
            const customer = data.customers.find(function (entry) {
                return entry.name.toLowerCase() === clientName.trim().toLowerCase();
            });
            if (clientName.trim() && !customer) {
                showError(new Error("Add the customer on the Customers page first."), "Client not found.");
                return;
            }
            try {
                const result = await client.from("projects").insert({
                    name: name.trim(),
                    customer_id: customer ? customer.id : null,
                    progress: 0,
                    status: "in_progress"
                }).select().single();
                if (result.error) {
                    throw result.error;
                }
                data.projects.unshift(result.data);
            } catch (error) {
                showError(error, "Unable to create project.");
                return;
            }
            renderProjects();
            renderCustomers();
            renderDashboard();
            renderReports();
            updateSelect("taskProject", data.projects, "name", true);
        });
    }

    const taskForm = document.getElementById("taskForm");
    if (taskForm) {
        openModal("createTaskBtn", "createTaskModal");
        await submitForm(taskForm, async function () {
            const employeeId = document.getElementById("taskAssigned").value || null;
            const result = await client.from("tasks").insert({
                name: document.getElementById("taskName").value.trim(),
                assigned_employee_id: employeeId,
                project_id: document.getElementById("taskProject").value || null
            }).select().single();
            if (result.error) {
                throw result.error;
            }
            data.tasks.unshift(result.data);
            renderTasks();
            renderDashboard();
            renderReports();
            closeModal("createTaskModal");
        });
    }

    const profileForm = document.querySelector(".auth-profile-form");
    if (profileForm) {
        const nameInput = document.getElementById("profileDisplayName");
        const emailInput = document.getElementById("profileEmail");
        if (nameInput) {
            nameInput.value = data.profile.display_name;
        }
        if (emailInput) {
            emailInput.value = user.email || "";
        }
        await submitForm(profileForm, async function () {
            const result = await client.from("profiles")
                .update({ display_name: nameInput.value.trim() })
                .eq("id", user.id)
                .select()
                .single();
            if (result.error) {
                throw result.error;
            }
            data.profile = result.data;
            showMessage("تم حفظ بيانات الملف الشخصي.");
        });
    }

    const darkModeToggle = document.getElementById("darkModeToggle");
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
    }
    if (darkModeToggle) {
        darkModeToggle.checked = savedTheme !== "light";
        darkModeToggle.addEventListener("change", function () {
            document.body.classList.toggle("light-mode", !darkModeToggle.checked);
            localStorage.setItem("theme", darkModeToggle.checked ? "dark" : "light");
        });
    }

    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    if (searchForm && searchInput) {
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const term = searchInput.value.trim().toLowerCase();
            if (!term) {
                return;
            }
            const matches = [];
            [
                ["Customers", "pages/customers.html", data.customers],
                ["Employees", "pages/empolyees.html", data.employees],
                ["Projects", "pages/projects.html", data.projects],
                ["Tasks", "pages/tasks.html", data.tasks]
            ].forEach(function (group) {
                group[2].forEach(function (record) {
                    if (Object.values(record).join(" ").toLowerCase().includes(term)) {
                        matches.push({ type: group[0], page: group[1], record: record });
                    }
                });
            });
            let results = document.getElementById("searchResults");
            if (!results) {
                results = node("div", null, "search-results");
                results.id = "searchResults";
                searchForm.parentElement.appendChild(results);
            }
            results.replaceChildren();
            if (!matches.length) {
                results.appendChild(node("p", "No results found."));
                return;
            }
            matches.forEach(function (match) {
                const link = node("a", match.type + ": " + Object.values(match.record).join(" - "));
                link.className = "search-result-item d-block text-decoration-none";
                link.href = window.location.pathname.includes("/pages/")
                    ? match.page.split("/").pop()
                    : match.page;
                results.appendChild(link);
            });
        });
    }

    document.documentElement.classList.remove("app-loading");
})();
