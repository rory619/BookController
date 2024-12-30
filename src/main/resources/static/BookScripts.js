let currentService = null;
let currentData = null;


function setCorsHeaders() {
    return {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        mode: "cors",
    };
}


async function fetchData(serviceType) {
    currentService = serviceType;
    currentData = null;


    document.getElementById("selectedService").innerText = `You have selected: ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}`;


    document.getElementById("crud-operations").style.display = 'block';
    document.getElementById("create-form-section").style.display = 'none';

    const url = getServiceUrl(serviceType);

    try {
        const response = await fetch(url, setCorsHeaders());
        if (!response.ok) {
            throw new Error(`Error fetching ${serviceType}`);
        }
        const data = await response.json();
        displayData(serviceType, data);
    } catch (error) {
        console.error(error);
        alert('Failed to fetch data. Please try again.');
    }
}


function getServiceUrl(serviceType) {
    if (serviceType === 'orders') return 'http://localhost:8083/orders';
    if (serviceType === 'customers') return 'http://localhost:8082/customers';
    if (serviceType === 'books') return 'http://localhost:8081/books';
    return '';
}


function getServiceUrl(serviceType) {
    if (serviceType === 'orders') return 'http://localhost:8083/orders';
    if (serviceType === 'customers') return 'http://localhost:8082/customers';
    if (serviceType === 'books') return 'http://localhost:8081/books';
    return '';
}


function displayData(serviceType, data) {
    const tableBody = document.getElementById("data-body");
    const tableHead = document.querySelector("#data-table thead");
    tableBody.innerHTML = '';
    tableHead.innerHTML = '';

    let headers = [];
    if (serviceType === 'orders') {
        headers = ['ID', 'Book ID', 'Customer ID', 'Quantity', 'Actions'];
    } else if (serviceType === 'customers') {
        headers = ['ID', 'Email', 'Name', 'Actions'];
    } else if (serviceType === 'books') {
        headers = ['ID', 'Author', 'Price', 'Title', 'Actions'];
    }


    const headerRow = document.createElement("tr");
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);


    data.forEach(item => {
        const row = document.createElement("tr");
        let htmlContent = '';

        if (serviceType === 'orders') {
            htmlContent = `
                <td>${item.id}</td>
                <td>${item.bookId}</td>
                <td>${item.customerId}</td>
                <td>${item.quantity}</td>
                <td><button onclick="editData('orders', ${item.id})">Edit</button> <button onclick="deleteData('orders', ${item.id})">Delete</button></td>
            `;
        } else if (serviceType === 'customers') {
            htmlContent = `
                <td>${item.id}</td>
                <td>${item.email}</td>
                <td>${item.name}</td>
                <td><button onclick="editData('customers', ${item.id})">Edit</button> <button onclick="deleteData('customers', ${item.id})">Delete</button></td>
            `;
        } else if (serviceType === 'books') {
            htmlContent = `
                <td>${item.id}</td>
                <td>${item.author}</td>
                <td>${item.price}</td>
                <td>${item.title}</td>
                <td><button onclick="editData('books', ${item.id})">Edit</button> <button onclick="deleteData('books', ${item.id})">Delete</button></td>
            `;
        }

        row.innerHTML = htmlContent;
        tableBody.appendChild(row);
    });
}


function showCreateForm() {
    createFormFields(currentService);
    document.getElementById("create-form-section").style.display = 'block';
    document.getElementById("crud-operations").style.display = 'none';
}

async function submitData(event) {
    event.preventDefault();

    const createForm = document.getElementById("createForm");
    const formData = new FormData(createForm);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    if (!Object.keys(data).length) {
        alert("Please fill out all required fields.");
        return;
    }

    let url = getServiceUrl(currentService);
    let method = "POST";
    if (currentData && currentData.id) {
        url += `/${currentData.id}`;
        method = "PUT";
    } else {
        url += "/create";
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(method === "POST" ? "Error creating data" : "Error updating data");

        alert(`${method === "POST" ? "Created" : "Updated"} data successfully!`);
        fetchData(currentService);
        currentData = null;
        document.getElementById("create-form-section").style.display = 'none';
        document.getElementById("crud-operations").style.display = 'block';
    } catch (error) {
        console.error("Error handling data:", error);
        alert("Failed to submit data. Please try again.");
    }
}


function editData(serviceType, id) {
    currentData = { serviceType, id };


    fetch(`${getServiceUrl(serviceType)}/${id}`)
        .then(response => response.json())
        .then(data => {
            createFormFields(serviceType, data);
            document.getElementById("create-form-section").style.display = 'block';
            document.getElementById("crud-operations").style.display = 'none';
        })
        .catch(err => alert("Error fetching data for edit"));
}


function deleteData(serviceType, id) {
    if (confirm("Are you sure you want to delete this item?")) {
        fetch(`${getServiceUrl(serviceType)}/${id}`, {
            method: "DELETE",
        })
            .then(response => {
                if (response.ok) {
                    alert("Item deleted successfully!");
                    fetchData(serviceType);
                } else {
                    alert("Failed to delete item.");
                }
            })
            .catch(err => alert("Error deleting item" + err.message));
    }
}


function createFormFields(serviceType, data = {}) {
    const form = document.getElementById("createForm");
    form.innerHTML = '';

    const fields = {
        orders: [
            {label: "Book ID", name: "bookId", type: "text", value: data.bookId || ''},
            {label: "Customer ID", name: "customerId", type: "text", value: data.customerId || ''},
            {label: "Quantity", name: "quantity", type: "number", value: data.quantity || ''},
        ],
        customers: [
            {label: "Name", name: "name", type: "text", value: data.name || ''},
            {label: "Email", name: "email", type: "email", value: data.email || ''},
        ],
        books: [
            {label: "Author", name: "author", type: "text", value: data.author || ''},
            {label: "Price", name: "price", type: "number", value: data.price || ''},
            {label: "Title", name: "title", type: "text", value: data.title || ''},
        ],
    };

    const selectedFields = fields[serviceType] || [];
    selectedFields.forEach((field) => {
        const fieldElement = document.createElement("div");
        fieldElement.innerHTML = `
        <label for="${field.name}">${field.label}:</label>
        <input type="${field.type}" id="${field.name}" name="${field.name}" value="${field.value}" required>
    `;
        form.appendChild(fieldElement);
    });


    document.getElementById("create-form-section").style.display = 'block';
    document.getElementById("crud-operations").style.display = 'none';
}


