import staticData from "./data.js";
import showToast from "./toast.js";
import validateInputs from "./validation.js";
import { showSpinner, hideSpinner } from "./spinner.js";

document.addEventListener("DOMContentLoaded", async function () {
  const studentFormModal = document.getElementById("studentFormModal");
  const tableContainer = document.getElementById("tableContainer");
  const studentTableBody = document.getElementById("studentTableBody");
  const studentModal = new bootstrap.Modal(document.getElementById("studentModal"));
  const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
  const addNewStudentButton = document.getElementById("addNewStudent-Button");
  const submitButton = document.getElementById("submit-button");
  const deleteButton = document.getElementById("delete-button");
  const pagination = document.querySelector("#pagination");
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  let students = staticData;
  let studentIndex = -1;
  const itemsPerPage = 7; // Number of items to display per page
  let currentPage = 1;
  let sortDirection = 1; // 1 for ascending, -1 for descending

  //add & update function
  studentFormModal.addEventListener("submit", function (event) {
    event.preventDefault();

    const firstName = document.getElementById("firstNameModal").value;
    const lastName = document.getElementById("lastNameModal").value;
    const standard = document.getElementById("standardModal").value;

    if (!validateInputs(firstName, lastName, standard)) {
      return;
    }

    const student = {
      id: students.length + 1,
      firstName: firstName,
      lastName: lastName,
      standard: standard,
    };

    if (studentIndex === -1) {
      students.push(student);
      showToast(`${student.firstName} ${student.lastName} added successfully!👌`, "success");
    } else {
      students[studentIndex] = student;
      showToast(`${student.firstName} ${student.lastName} updated successfully!👌`, "info");
    }
    renderStudents(currentPage);
    studentModal.hide();
    studentFormModal.reset();
  });

  //when clicking on add new student this will reset the form
  addNewStudentButton.addEventListener("click", function () {
    studentFormModal.reset();
    submitButton.textContent = "Add";
  });

  // Function to open the modal for Editing the student
  window.editStudent = function (index) {
    const student = students[index];
    document.getElementById("firstNameModal").value = student.firstName;
    document.getElementById("lastNameModal").value = student.lastName;
    document.getElementById("standardModal").value = student.standard;
    studentIndex = index;
    submitButton.textContent = "Update";
    studentModal.show();
  };

  // Function to open the modal for Deleting the student
  window.showDeleteModal = function (index) {
    studentIndex = index;
    deleteModal.show();
  };

  // Function to Delete student
  deleteButton.addEventListener("click", function () {
    const deletedStudent = students.splice(studentIndex, 1);
    currentPage = 1;
    renderStudents(currentPage);
    deleteModal.hide();
    showToast(
      `${deletedStudent[0].firstName} ${deletedStudent[0].lastName} has been deleted!👌`,
      "danger"
    );
  });

  function renderStudents(page) {
    showSpinner();
    setTimeout(() => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      studentTableBody.innerHTML = "";

      if (students.length === 0) {
        showToast(`No results found❗`, "warning");
        studentTableBody.innerHTML = `<tr><td colspan="5" class="h6 text-center text-danger">No results found.</td> </tr>`;
        return;
      }

      for (let i = startIndex; i < endIndex && i < students.length; i++) {
        const row = `
              <tr>
                <td>${students[i].id}</td>
                <td>${students[i].firstName}</td>
                <td>${students[i].lastName}</td>
                <td>${students[i].standard}</td>
                <td>
                    <button class="btn btn-success btn-sm rounded m-1" onclick="editStudent(${i})"><i class="bi bi-pencil-square"></i></button>
                    <button class="btn btn-danger btn-sm rounded m-1"  onclick="showDeleteModal(${i})"><i class="bi bi-trash3-fill"></i></button>
                </td>
              </tr>
            `;
        studentTableBody.innerHTML += row;
      }

      // Toggle the visibility of the table based on students' presence
      // tableContainer.style.display = students.length > 0 ? "block" : "none";
      hideSpinner();
    }, 1000);
  }

  // Function to update pagination links
  function updatePagination() {
    const totalPages = Math.ceil(students.length / itemsPerPage);
    pagination.innerHTML = "";

    // Add "Previous" button
    const prevLi = document.createElement("li");
    prevLi.classList.add("page-item");
    prevLi.innerHTML = `
    <a class="page-link" onclick="prevPage()" href="javascript:void()" data-page="prev">
      <span aria-hidden="true">&laquo;</span>
    </a>
  `;
    pagination.appendChild(prevLi);

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement("li");
      li.classList.add("page-item");
      li.innerHTML = `
        <a class="page-link" href="javascript:void()" data-page="${i}">${i}</a>
      `;
      pagination.appendChild(li);
    }

    // Add "Next" button
    const nextLi = document.createElement("li");
    nextLi.classList.add("page-item");
    nextLi.innerHTML = `
    <a class="page-link" onclick="nextPage()" href="javascript:void()" data-page="next">
      <span aria-hidden="true">&raquo;</span>
    </a>
  `;
    pagination.appendChild(nextLi);

    // Highlight the current page
    const currentPageLink = document.querySelector(`[data-page="${currentPage}"]`);
    currentPageLink.parentElement.classList.add("active");
  }

  // Function to handle the "Previous"
  window.prevPage = function () {
    console.log("previous");
    if (currentPage > 1) {
      currentPage--;
      renderStudents(currentPage);
      updatePagination();
    }
  };

  // Function to handle the "Next"
  window.nextPage = function () {
    console.log("next");
    if (currentPage < Math.ceil(students.length / itemsPerPage)) {
      currentPage++;
      renderStudents(currentPage);
      updatePagination();
    }
  };

  // Event listener for pagination links and buttons
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("page-link")) {
      event.preventDefault();

      if (event.target.classList.contains("prev-link")) {
        prevPage();
      } else if (event.target.classList.contains("next-link")) {
        nextPage();
      } else {
        const newPage = parseInt(event.target.textContent); // Assuming page numbers are text content
        if (!isNaN(newPage) && newPage !== currentPage) {
          currentPage = newPage;
          renderStudents(currentPage);
          updatePagination();
        }
      }
    }
  });

  function hideAndShowPagination() {
    if (students.length < itemsPerPage) {
      pagination.style.display = "none";
    } else {
      pagination.style.display = "flex";
    }
  }

  // Function to sort data based on student ID
  function sortData() {
    if (sortDirection === -1) {
      students.sort((a, b) => b.id - a.id);
    } else {
      students.sort((a, b) => a.id - b.id);
    }
    toggleSortingButtons();
  }

  // Event listener for sorting buttons
  document.querySelector("#sort-asc").addEventListener("click", () => {
    sortDirection = 1;
    sortData();
    renderStudents(currentPage);
  });

  document.querySelector("#sort-desc").addEventListener("click", () => {
    sortDirection = -1;
    sortData();
    renderStudents(currentPage);
  });

  // Function to toggle sorting buttons based on sort direction
  function toggleSortingButtons() {
    const ascIcon = document.querySelector("#sort-asc");
    const descIcon = document.querySelector("#sort-desc");

    if (sortDirection === 1) {
      ascIcon.style.display = "none";
      descIcon.style.display = "block";
    } else {
      ascIcon.style.display = "block";
      descIcon.style.display = "none";
    }
  }

  // Function to search based on name or standard
  // searchButton.addEventListener("click", () => {
  //   const query = searchInput.value.toLowerCase();
  //   const filteredStudents = students.filter((student) => {
  //     const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
  //     const standard = student.standard.toString();
  //     return fullName.includes(query) || standard.includes(query);
  //   });
  //   students = filteredStudents;
  //   searchInput.value = "";
  //   showToast(`${filteredStudents.length} students found❕👍`, "success");
  //   hideAndShowPagination();
  //   renderStudents(currentPage);
  //   updatePagination();
  // });

  searchInput.addEventListener("input", (e) => {
    const searchQuery = searchInput.value.toLowerCase().trim();
    studentTableBody.innerHTML = "";

    if (searchQuery === "") {
      renderStudents(currentPage);
      return;
    }

    const filteredStudents = students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`;
      const standard = student.standard.toString();
      return fullName.toLowerCase().includes(searchQuery) || standard.includes(searchQuery);
    });

    filteredStudents.forEach((student, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${student.id}</td>
      <td>${student.firstName}</td>
      <td>${student.lastName}</td>
      <td>${student.standard}</td>
      <td>
          <button class="btn btn-success btn-sm rounded m-1" onclick="editStudent(${index})"><i class="bi bi-pencil-square"></i></button>
          <button class="btn btn-danger btn-sm rounded m-1"  onclick="showDeleteModal(${index})"><i class="bi bi-trash3-fill"></i></button>
      </td>`;
      studentTableBody.appendChild(row);
    });
  });

  hideAndShowPagination();
  toggleSortingButtons();
  renderStudents(currentPage);
  updatePagination();
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
