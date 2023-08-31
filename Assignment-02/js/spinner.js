const spinnerContainer = document.getElementById("spinnerContainer");
const tableContainer = document.getElementById("tableContainer");

// Function to display the spinner
export function showSpinner() {
  spinnerContainer.classList.remove("d-none");
  tableContainer.style.display = "none";
}

// Function to hide the spinner
export function hideSpinner() {
  spinnerContainer.classList.add("d-none");
  tableContainer.style.display = "block";
}
