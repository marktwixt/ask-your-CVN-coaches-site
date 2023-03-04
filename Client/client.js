const axios = require("axios");

// Client-side code to submit a new question to the database
document
  .querySelector("#submit-question")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const nameInput = document.querySelector("#name").value;
    const questionInput = document.querySelector("#question").value;
    const categoryInput = document.querySelector("#category").value;

    // Get the JWT token from localStorage
    const token = localStorage.getItem("token");

    // Add the JWT token to the headers
    const headers = { Authorization: `Bearer ${token}` };

    // Making a post request to the server to submit the new question to the database
    axios
      .post(
        "/submitQuestion",
        {
          name: nameInput,
          question: questionInput,
          category: categoryInput,
        },
        { headers }
      )
      .then((response) => {
        console.log(response.data);
        // Clearing the form fields after successful submission
        document.querySelector("#name").value = "";
        document.querySelector("#question").value = "";
        document.querySelector("#category").value = "";
      })
      .catch((error) => {
        console.log(error);
      });
  });
