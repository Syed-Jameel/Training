import staticData from "./data.js";
document.addEventListener("DOMContentLoaded", async function () {
  const studentFormModal = document.getElementById("studentFormModal");
  const studentTable = document.getElementById("studentTable");
  const studentTableBody = document.getElementById("studentTableBody");
  const studentModal = new bootstrap.Modal(document.getElementById("studentModal"));
  const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  const addNewStudentButton = document.getElementById("addNewStudent-Button");
  const submitButton = document.getElementById("submit-button");
  const deleteButton = document.getElementById("delete-button");

  let students = staticData;

  let studentIndex = -1;

  studentFormModal.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstNameModal").value;
    const lastName = document.getElementById("lastNameModal").value;
    const standard = document.getElementById("standardModal").value;

    if (!validateInput(firstName, lastName, standard)) {
      return;
    }

    const student = {
      firstName: firstName,
      lastName: lastName,
      standard: standard,
    };
    if (studentIndex === -1) {
      students.push(student);
    } else {
      students[studentIndex] = student;
    }
    renderStudents();
    studentModal.hide();
    studentFormModal.reset();
  });

  addNewStudentButton.addEventListener("click", function () {
    studentFormModal.reset();
    submitButton.textContent = "Add";
  });

  function validateInput(firstName, lastName, standard) {
    if (!firstName || !lastName || !standard) {
      alert("Please fill out all fields.");
      return false;
    }
    return true;
  }

  function renderStudents() {
    console.log(staticData);
    studentTableBody.innerHTML = "";
    students.forEach(function (student, index) {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td>${student.standard}</td>
                <td>
                    <button class="btn btn-primary btn-sm rounded" onclick="editStudent(${index})"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-danger btn-sm rounded"  onclick="showDeleteModal(${index})"><i class="bi bi-trash3-fill"></i></button>
                </td>
            `;
      studentTableBody.appendChild(row);
    });

    // Toggle the visibility of the table based on students' presence
    studentTable.style.display = students.length > 0 ? "block" : "none";
  }

  // Function to open the modal for editing a student
  window.editStudent = function (index) {
    const student = students[index];
    document.getElementById("firstNameModal").value = student.firstName;
    document.getElementById("lastNameModal").value = student.lastName;
    document.getElementById("standardModal").value = student.standard;
    studentIndex = index;
    submitButton.textContent = "Update";
    studentModal.show();
  };

  // Function to open the modal for editing a student
  window.showDeleteModal = function (index) {
    studentIndex = index;
    deleteModal.show();
  };

  deleteButton.addEventListener("click", function () {
    students.splice(studentIndex, 1);
    renderStudents();
    deleteModal.hide();
  });

  renderStudents();
});

/*
By wrapping your JavaScript code inside the DOMContentLoaded event listener,
you ensure that your code runs only when the HTML structure has been fully loaded,
avoiding potential issues with accessing elements that haven't been created yet.
*/

/* 
By adding the hidden.bs.modal event listener to the studentModal, 
you ensure that the form fields are reset every time the modal is closed,
*/
