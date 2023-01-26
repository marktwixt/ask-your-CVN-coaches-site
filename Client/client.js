const form = document.getElementById("question_form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const question = formData.get("question");
  const name = formData.get("name");
  fetch("/submit_question", {
    method: "POST",
    body: formData
  })
  .then(response => response.text())
  .then(responseText => {
    alert(responseText);
  });
});