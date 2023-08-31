const errorFirstName = document.getElementById("error-firstName");
const errorLastName = document.getElementById("error-lastName");
const errorStandard = document.getElementById("error-standard");

//validating input feilds
const validateInputs = function (firstName, lastName, standard) {
  if (firstName.trim() === "") {
    errorFirstName.innerHTML = "first name is required!";
    return false;
  } else {
    errorFirstName.innerHTML = "";
  }

  if (lastName.trim() === "") {
    errorLastName.innerHTML = "last name is reuired!";
    return false;
  } else {
    errorLastName.innerHTML = "";
  }

  if (standard === "") {
    errorStandard.innerHTML = "standard is required!";
    return false;
  } else {
    errorStandard.innerHTML = "";
  }

  return true;
};

export default validateInputs;
