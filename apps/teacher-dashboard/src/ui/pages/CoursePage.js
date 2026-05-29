import { createCourse } from "../services/courseService.js";

export function renderCoursePage(container) {
  container.innerHTML = `
    <h1>Teacher Dashboard</h1>

    <input id="courseTitle" placeholder="Enter course title" />
    <button id="createBtn">Create Course</button>

    <pre id="output"></pre>
  `;

  const input = container.querySelector("#courseTitle");
  const button = container.querySelector("#createBtn");
  const output = container.querySelector("#output");

  button.addEventListener("click", async () => {
    output.textContent = "Processing...";

    try {
      const result = await createCourse(input.value);

      output.textContent = JSON.stringify(result, null, 2);
    } catch (error) {
      output.textContent = "Error: " + error.message;
    }
  });
}