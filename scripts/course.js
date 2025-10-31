// ============================
// COURSE DATA
// ============================
const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to Programming",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.",
    technology: ["Python"],
    completed: true 
  },
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course introduces students to the World Wide Web and to careers in web site design and development.",
    technology: ["HTML", "CSS"],
    completed: true
  },
  {
    subject: "CSE",
    number: 111,
    title: "Programming with Functions",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others.",
    technology: ["Python"],
    completed: true
  },
  {
    subject: "CSE",
    number: 210,
    title: "Programming with Classes",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level.",
    technology: ["C#"],
    completed: false
  },
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience in Web Fundamentals and programming.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: true
  },
  {
    subject: "WDD",
    number: 231,
    title: "Frontend Web Development I",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience with Dynamic Web Fundamentals and programming.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: false
  }
];

// ============================
// DOM ELEMENTS
// ============================
const courseContainer = document.getElementById("courses");
const totalCreditsEl = document.getElementById("totalCredits");

const allBtn = document.getElementById("all");
const wddBtn = document.getElementById("wdd");
const cseBtn = document.getElementById("cse");

// ============================
// FUNCTIONS
// ============================

// Display courses dynamically
function displayCourses(list) {
  courseContainer.innerHTML = ""; // Clear previous content

  list.forEach(course => {
    const card = document.createElement("div");
    card.classList.add("course-card");
    if (course.completed) {
      card.classList.add("completed"); // visually mark completed
    }

    card.innerHTML = `
      <h3>${course.subject} ${course.number}</h3>
      <h4>${course.title}</h4>
      <p><strong>Credits:</strong> ${course.credits}</p>
      <p><strong>Description:</strong> ${course.description}</p>
      <p><strong>Technologies:</strong> ${course.technology.join(", ")}</p>
    `;

    courseContainer.appendChild(card);
  });

  // Calculate total credits dynamically
  const total = list.reduce((sum, course) => sum + course.credits, 0);
  totalCreditsEl.textContent = `Total Credits: ${total}`;
}

// ============================
// EVENT LISTENERS
// ============================
allBtn.addEventListener("click", () => displayCourses(courses));
wddBtn.addEventListener("click", () =>
  displayCourses(courses.filter(c => c.subject === "WDD"))
);
cseBtn.addEventListener("click", () =>
  displayCourses(courses.filter(c => c.subject === "CSE"))
);

// ============================
// INITIAL LOAD
// ============================
displayCourses(courses);
