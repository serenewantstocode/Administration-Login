// ==========================================
// SAHAYSETU ADMINISTRATION DASHBOARD
// ==========================================


// BACKEND URL

const API_URL = "http://192.168.1.36:8000";


// DATA

let users = [];

let complaints = [];



// ==========================================
// PAGE START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkLogin();

        loadUsers();

        loadComplaints();

    }
);



// ==========================================
// CHECK LOGIN
// ==========================================

function checkLogin() {

    const token =
        localStorage.getItem("access_token");


    if (!token) {

        window.location.href =
            "administration-login.html";

        return;

    }


    const adminLogin =
        localStorage.getItem("admin_login");


    if (adminLogin) {

        document.getElementById(
            "adminName"
        ).textContent = adminLogin;

    }

}



// ==========================================
// API HEADERS
// ==========================================

function getHeaders() {

    const token =
        localStorage.getItem("access_token");


    return {

        "Authorization":
            "Bearer " + token,

        "Content-Type":
            "application/json"

    };

}



// ==========================================
// LOAD USERS
// GET /admin/users
// ==========================================

async function loadUsers() {

    const table =
        document.getElementById(
            "usersTable"
        );


    table.innerHTML = `
        <tr>
            <td colspan="5">
                Loading users...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                API_URL + "/admin/users",
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );


        if (response.status === 401) {

            logout();

            return;

        }


        const data =
            await response.json();


        console.log(
            "Users:",
            data
        );


        if (Array.isArray(data)) {

            users = data;

        }

        else if (
            Array.isArray(data.users)
        ) {

            users = data.users;

        }

        else if (
            Array.isArray(data.data)
        ) {

            users = data.data;

        }

        else {

            users = [];

        }


        document.getElementById(
            "totalUsers"
        ).textContent =
            users.length;


        displayUsers(users);

    }


    catch (error) {

        console.error(
            "Users error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to connect to backend.
                </td>
            </tr>
        `;

    }

}



// ==========================================
// DISPLAY USERS
// ==========================================

function displayUsers(list) {

    const table =
        document.getElementById(
            "usersTable"
        );


    if (!list.length) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No users found.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML = "";


    list.forEach(
        function (user) {

            const id =
                user.id ??
                user.user_id ??
                "-";


            const name =
                user.name ??
                user.full_name ??
                user.username ??
                "—";


            const contact =
                user.email ??
                user.phone ??
                "—";


            const role =
                user.role ??
                user.user_role ??
                "—";


            const active =
                user.is_active ??
                user.active ??
                true;


            const status =
                active
                    ? "Active"
                    : "Inactive";


            table.innerHTML += `

                <tr>

                    <td>
                        ${id}
                    </td>

                    <td>
                        ${name}
                    </td>

                    <td>
                        ${contact}
                    </td>

                    <td>
                        ${role}
                    </td>

                    <td>

                        <span class="status ${
                            active
                                ? "resolved"
                                : "pending"
                        }">

                            ${status}

                        </span>

                    </td>

                </tr>

            `;

        }
    );

}



// ==========================================
// FILTER USERS
// ==========================================

function filterUsers() {

    const search =
        document
            .getElementById(
                "userSearch"
            )
            .value
            .toLowerCase();


    const filtered =
        users.filter(
            function (user) {

                return JSON.stringify(user)
                    .toLowerCase()
                    .includes(search);

            }
        );


    displayUsers(filtered);

}



// ==========================================
// LOAD COMPLAINTS
// GET /admin/complaints
// ==========================================

async function loadComplaints() {

    const table =
        document.getElementById(
            "complaintsTable"
        );


    table.innerHTML = `
        <tr>
            <td colspan="5">
                Loading complaints...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch(
                API_URL + "/admin/complaints",
                {
                    method: "GET",
                    headers: getHeaders()
                }
            );


        if (response.status === 401) {

            logout();

            return;

        }


        const data =
            await response.json();


        console.log(
            "Complaints:",
            data
        );


        if (Array.isArray(data)) {

            complaints = data;

        }

        else if (
            Array.isArray(data.complaints)
        ) {

            complaints =
                data.complaints;

        }

        else if (
            Array.isArray(data.data)
        ) {

            complaints =
                data.data;

        }

        else if (
            Array.isArray(data.results)
        ) {

            complaints =
                data.results;

        }

        else {

            complaints = [];

        }


        document.getElementById(
            "totalComplaints"
        ).textContent =
            complaints.length;


        calculateStatistics();

        displayComplaints(
            complaints
        );

        displayRecentComplaints();

    }


    catch (error) {

        console.error(
            "Complaints error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to connect to backend.
                </td>
            </tr>
        `;

    }

}



// ==========================================
// COMPLAINT STATUS
// ==========================================

function getStatus(complaint) {

    return (
        complaint.status ??
        complaint.complaint_status ??
        "Pending"
    );

}



// ==========================================
// DISPLAY COMPLAINTS
// ==========================================

function displayComplaints(list) {

    const table =
        document.getElementById(
            "complaintsTable"
        );


    if (!list.length) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No complaints found.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML = "";


    list.forEach(
        function (complaint) {

            const id =
                complaint.id ??
                complaint.complaint_id ??
                "-";


            const description =
                complaint.description ??
                complaint.title ??
                complaint.complaint ??
                "No description";


            const location =
                complaint.location ??
                complaint.address ??
                "Not available";


            const priority =
                complaint.priority ??
                complaint.severity ??
                "Normal";


            const status =
                getStatus(complaint);


            const statusLower =
                status.toLowerCase();


            let statusClass =
                "pending";


            if (
                statusLower.includes(
                    "resolve"
                )
            ) {

                statusClass =
                    "resolved";

            }

            else if (
                statusLower.includes(
                    "progress"
                )
            ) {

                statusClass =
                    "progress";

            }


            table.innerHTML += `

                <tr>

                    <td>
                        ${id}
                    </td>

                    <td>
                        ${description}
                    </td>

                    <td>
                        ${location}
                    </td>

                    <td>
                        ${priority}
                    </td>

                    <td>

                        <span class="status ${statusClass}">

                            ${status}

                        </span>

                    </td>

                </tr>

            `;

        }
    );

}



// ==========================================
// FILTER COMPLAINTS
// ==========================================

function filterComplaints() {

    const search =
        document
            .getElementById(
                "complaintSearch"
            )
            .value
            .toLowerCase();


    const selected =
        document
            .getElementById(
                "statusFilter"
            )
            .value;


    const filtered =
        complaints.filter(
            function (complaint) {

                const text =
                    JSON.stringify(
                        complaint
                    ).toLowerCase();


                const status =
                    getStatus(
                        complaint
                    ).toLowerCase();


                const matchesSearch =
                    text.includes(search);


                let matchesStatus =
                    true;


                if (
                    selected === "pending"
                ) {

                    matchesStatus =
                        status.includes(
                            "pending"
                        );

                }


                if (
                    selected === "progress"
                ) {

                    matchesStatus =
                        status.includes(
                            "progress"
                        );

                }


                if (
                    selected === "resolved"
                ) {

                    matchesStatus =
                        status.includes(
                            "resolve"
                        );

                }


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    displayComplaints(
        filtered
    );

}



// ==========================================
// RECENT COMPLAINTS
// ==========================================

function displayRecentComplaints() {

    const table =
        document.getElementById(
            "recentComplaints"
        );


    const recent =
        complaints.slice(0, 5);


    if (!recent.length) {

        table.innerHTML = `
            <tr>
                <td colspan="3">
                    No complaints available.
                </td>
            </tr>
        `;

        return;

    }


    table.innerHTML = "";


    recent.forEach(
        function (complaint) {

            const id =
                complaint.id ??
                complaint.complaint_id ??
                "-";


            const description =
                complaint.description ??
                complaint.title ??
                complaint.complaint ??
                "Complaint";


            const status =
                getStatus(
                    complaint
                );


            const lower =
                status.toLowerCase();


            let className =
                "pending";


            if (
                lower.includes("resolve")
            ) {

                className =
                    "resolved";

            }

            else if (
                lower.includes("progress")
            ) {

                className =
                    "progress";

            }


            table.innerHTML += `

                <tr>

                    <td>
                        #${id}
                    </td>

                    <td>
                        ${description}
                    </td>

                    <td>

                        <span class="status ${className}">
                            ${status}
                        </span>

                    </td>

                </tr>

            `;

        }
    );

}



// ==========================================
// STATISTICS
// ==========================================

function calculateStatistics() {

    let resolved = 0;

    let pending = 0;


    complaints.forEach(
        function (complaint) {

            const status =
                getStatus(
                    complaint
                ).toLowerCase();


            if (
                status.includes(
                    "resolve"
                )
            ) {

                resolved++;

            }

            else {

                pending++;

            }

        }
    );


    document.getElementById(
        "resolvedComplaints"
    ).textContent =
        resolved;


    document.getElementById(
        "pendingComplaints"
    ).textContent =
        pending;

}



// ==========================================
// NAVIGATION
// ==========================================

function showSection(
    sectionId,
    button
) {

    document
        .querySelectorAll(".section")
        .forEach(
            function (section) {

                section.classList.remove(
                    "active"
                );

            }
        );


    document
        .querySelectorAll(".menu-item")
        .forEach(
            function (item) {

                item.classList.remove(
                    "active"
                );

            }
        );


    document
        .getElementById(
            sectionId
        )
        .classList.add(
            "active"
        );


    if (button) {

        button.classList.add(
            "active"
        );

    }


    const titles = {

        dashboard:
            "Administration Dashboard",

        users:
            "User Management",

        complaints:
            "Complaint Management",

        system:
            "System Information"

    };


    document.getElementById(
        "pageTitle"
    ).textContent =
        titles[sectionId];

}



// ==========================================
// OPEN COMPLAINTS
// ==========================================

function openComplaints() {

    const button =
        document.querySelectorAll(
            ".menu-item"
        )[2];


    showSection(
        "complaints",
        button
    );

}



// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem(
        "access_token"
    );


    localStorage.removeItem(
        "admin_login"
    );


    window.location.href =
        "administration-login.html";

}