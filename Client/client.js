const axios = require("axios");

// Client-side code to submit a new question to the database
document.querySelector("#submit-question").addEventListener("click", function(event) {
  event.preventDefault();
  
  const nameInput = document.querySelector("#name").value;
  const questionInput = document.querySelector("#question").value;
  const categoryInput = document.querySelector("#category").value;

  // Making a post request to the server to submit the new question to the database
  axios
    .post("/submitQuestion", {
      name: nameInput,
      question: questionInput,
      category: categoryInput
    })
    .then(response => {
      console.log(response.data);
      // Clearing the form fields after successful submission
      document.querySelector("#name").value = "";
      document.querySelector("#question").value = "";
      document.querySelector("#category").value = "";
    })
    .catch(error => {
      console.log(error);
    });
});

// Client-side code to handle user authentication
document.querySelector("#login-form").addEventListener("submit", function(event) {
  event.preventDefault();
  
  const usernameInput = document.querySelector("#username").value;
  const passwordInput = document.querySelector("#password").value;

  // Making a post request to the server to authenticate the user
  axios
    .post("/login", {
      username: usernameInput,
      password: passwordInput
    })
    .then(response => {
      console.log(response.data);
      // Storing the user ID and access token in localStorage
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("accessToken", response.data.accessToken);
      // Redirecting to the dashboard page after successful login
      window.location.href = "/dashboard";
    })
    .catch(error => {
      console.log(error);
    });
});

// Client-side code to retrieve and display questions and answers
axios
  .get("/getQuestions")
  .then(response => {
    const questions = response.data;
    // Loop through the questions and display them in the appropriate areas
    questions.forEach(question => {
      const { category, question: questionText, answer } = question;
      if (category === "Ski Technique") {
        const skiTechniqueQuestions = document.querySelector("#ski-technique-questions");
        const newQuestion = document.createElement("p");
        newQuestion.textContent = questionText;
        skiTechniqueQuestions.appendChild(newQuestion);
        if (answer) {
          const newAnswer = document.createElement("p");
          newAnswer.textContent = answer;
          skiTechniqueQuestions.appendChild(newAnswer);
        }
      } else if (category === "Waxing") {
        const waxingQuestions = document.querySelector("#waxing-questions");
        const newQuestion = document.createElement("p");
        newQuestion.textContent = questionText;
        waxingQuestions.appendChild(newQuestion);
        if (answer) {
          const newAnswer = document.createElement("p");
          newAnswer.textContent = answer;
          waxingQuestions.appendChild(newAnswer);
        }
      } else {
        const miscellaneousQuestions = document.querySelector("#miscellaneous-questions");
        const newQuestion = document.createElement("p");
        newQuestion.textContent = questionText;
        miscellaneousQuestions.appendChild(newQuestion);
        if (answer) {
          const newAnswer = document.createElement("p");
          newAnswer.textContent = answer;
          miscellaneousQuestions.appendChild(newAnswer);
        }
      }
    });
  })
  .catch(error => {
    console.log(error);
  });
