const authorizedRoles = ["president", "vice-president", "secretary", "vice-secretary", "staff"];
const storageKeys = {
  users: "vecoders_users",
  news: "vecoders_news",
  gallery: "vecoders_gallery",
  events: "vecoders_events",
  ideas: "vecoders_ideas",
};

const elements = {
  introScreen: document.getElementById("introScreen"),
  logoCircle: document.getElementById("logoCircle"),
  enterButton: document.getElementById("enterButton"),
  loginBtn: document.getElementById("loginBtn"),
  registerBtn: document.getElementById("registerBtn"),
  openLogin: document.getElementById("openLogin"),
  openRegister: document.getElementById("openRegister"),
  loginModal: document.getElementById("loginModal"),
  registerModal: document.getElementById("registerModal"),
  newsModal: document.getElementById("newsModal"),
  photoModal: document.getElementById("photoModal"),
  ideaModal: document.getElementById("ideaModal"),
  addNewsBtn: document.getElementById("addNewsBtn"),
  addPhotoBtn: document.getElementById("addPhotoBtn"),
  submitIdeaBtn: document.getElementById("submitIdeaBtn"),
  newsFeed: document.getElementById("newsFeed"),
  latestUpdate: document.getElementById("latestUpdate"),
  eventsList: document.getElementById("eventsList"),
  galleryGrid: document.getElementById("galleryGrid"),
  statusBar: document.getElementById("statusBar"),
};

let currentUser = null;

const initialUsers = [
  {
    regNo: "123456789012",
    name: "Club Head",
    year: "Staff",
    role: "staff",
    skills: "Leadership, Mentoring",
    about: "Oversees the club and approves new leadership activity.",
    password: "clubhead123",
  },
  {
    regNo: "111111111111",
    name: "Ashwin Patel",
    year: "4th Year",
    role: "president",
    skills: "Web dev, event planning",
    about: "President managing club strategy and releases.",
    password: "president",
  },
];

const initialNews = [
  {
    title: "Annual Hackathon Announced",
    body: "The club is organizing a weekend hackathon. Open to students, volunteers, and coordinators.",
    author: "Club Head",
    date: "May 17, 2026",
  },
  {
    title: "New Robotics Workshop",
    body: "Sign up for our robotics workshop and learn Arduino, sensors, and practical automation.",
    author: "Secretary",
    date: "May 10, 2026",
  },
];

const initialGallery = [
  {
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?fit=crop&w=900&q=80",
    desc: "Workshop day collaboration.",
  },
  {
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?fit=crop&w=900&q=80",
    desc: "Project planning session.",
  },
];

const initialEvents = [
  {
    name: "Code Sprint",
    description: "A weekend sprint for developing mini-projects in teams.",
    date: "April 2026",
  },
  {
    name: "AI Meet",
    description: "A session on AI tools, datasets, and building a smart campus assistant.",
    date: "March 2026",
  },
];

const initialIdeas = [
  {
    title: "Campus App Showcase",
    description: "Build a showcase of campus apps with maps, syllabus tracker, and event alerts.",
    submittedBy: "Volunteer Team",
    date: "May 2026",
  },
];

function loadData(key, fallback) {
  const stored = localStorage.getItem(key);
  if (stored) {
    try { return JSON.parse(stored); } catch { return fallback; }
  }
  localStorage.setItem(key, JSON.stringify(fallback));
  return fallback;
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() {
  return loadData(storageKeys.users, initialUsers);
}

function getNews() {
  return loadData(storageKeys.news, initialNews);
}

function getGallery() {
  return loadData(storageKeys.gallery, initialGallery);
}

function getEvents() {
  return loadData(storageKeys.events, initialEvents);
}

function getIdeas() {
  return loadData(storageKeys.ideas, initialIdeas);
}

function showModal(modal) {
  document.getElementById(modal).classList.remove("hidden");
}

function hideModal(modal) {
  document.getElementById(modal).classList.add("hidden");
}

function setStatus(message) {
  elements.statusBar.textContent = message;
  elements.statusBar.classList.remove("hidden");
  clearTimeout(setStatus.timeout);
  setStatus.timeout = setTimeout(() => elements.statusBar.classList.add("hidden"), 3800);
}

function renderNews() {
  const news = getNews();
  elements.newsFeed.innerHTML = news.map(item => `
    <article class="card">
      <h3>${item.title}</h3>
      <p>${item.body}</p>
      <small>${item.author} · ${item.date}</small>
    </article>
  `).join("");
  elements.latestUpdate.textContent = news[0]?.body || "No updates yet.";
}

function renderEvents() {
  const events = getEvents();
  elements.eventsList.innerHTML = events.map(event => `
    <div class="event-card card">
      <h3>${event.name}</h3>
      <p>${event.description}</p>
      <small>${event.date}</small>
    </div>
  `).join("");
}

function renderGallery() {
  const gallery = getGallery();
  elements.galleryGrid.innerHTML = gallery.map(photo => `
    <div class="gallery-card card">
      <img src="${photo.url}" alt="${photo.desc}" loading="lazy" />
      <p>${photo.desc}</p>
    </div>
  `).join("");
}

function renderAuthenticatedActions() {
  const canEdit = currentUser && authorizedRoles.includes(currentUser.role);
  elements.addNewsBtn.style.display = canEdit ? "inline-flex" : "none";
  elements.addPhotoBtn.style.display = canEdit ? "inline-flex" : "none";
  elements.submitIdeaBtn.style.display = currentUser ? "inline-flex" : "none";
}

function updateHeaderAfterLogin() {
  if (!currentUser) return;
  elements.loginBtn.textContent = "Logout";
  elements.registerBtn.textContent = currentUser.name;
  elements.registerBtn.disabled = true;
}

function clearLoginState() {
  currentUser = null;
  localStorage.removeItem("vecoders_session");
  elements.loginBtn.textContent = "Login";
  elements.registerBtn.textContent = "Register";
  elements.registerBtn.disabled = false;
  renderAuthenticatedActions();
}

function saveSession() {
  if (currentUser) localStorage.setItem("vecoders_session", JSON.stringify(currentUser));
}

function loadSession() {
  const stored = localStorage.getItem("vecoders_session");
  if (stored) {
    try { currentUser = JSON.parse(stored); updateHeaderAfterLogin(); } catch { currentUser = null; }
  }
}

function init() {
  renderNews();
  renderEvents();
  renderGallery();
  loadSession();
  renderAuthenticatedActions();
}

function handleRegistration(event) {
  event.preventDefault();
  const regNo = document.getElementById("regNumber").value.trim();
  const name = document.getElementById("regName").value.trim();
  const year = document.getElementById("regYear").value;
  const role = document.getElementById("regRole").value;
  const skills = document.getElementById("regSkills").value.trim();
  const about = document.getElementById("regAbout").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!/^\d{12}$/.test(regNo)) {
    setStatus("Please enter a valid 12-digit registration number.");
    return;
  }
  if (!name || !role || !year || !password) {
    setStatus("Complete all required fields before submitting.");
    return;
  }
  const users = getUsers();
  if (users.some(user => user.regNo === regNo)) {
    setStatus("A user with this registration number already exists.");
    return;
  }
  const newUser = { regNo, name, year, role, skills, about, password };
  users.unshift(newUser);
  saveData(storageKeys.users, users);
  currentUser = newUser;
  saveSession();
  updateHeaderAfterLogin();
  hideModal("registerModal");
  setStatus(`Welcome, ${name}! Registered successfully.`);
  renderAuthenticatedActions();
}

function handleLogin(event) {
  event.preventDefault();
  const regNo = document.getElementById("loginRegNo").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const users = getUsers();
  const found = users.find(user => user.regNo === regNo && user.password === password);
  if (!found) {
    setStatus("Login failed. Check your registration number and password.");
    return;
  }
  currentUser = found;
  saveSession();
  updateHeaderAfterLogin();
  hideModal("loginModal");
  setStatus(`Hi ${found.name}, you are now logged in.`);
  renderAuthenticatedActions();
}

function handleNewsPost(event) {
  event.preventDefault();
  if (!currentUser || !authorizedRoles.includes(currentUser.role)) {
    setStatus("Only authorized leaders may post news.");
    return;
  }
  const title = document.getElementById("newsTitle").value.trim();
  const body = document.getElementById("newsBody").value.trim();
  if (!title || !body) { setStatus("Add title and details."); return; }
  const news = getNews();
  news.unshift({ title, body, author: currentUser.name, date: new Date().toLocaleDateString() });
  saveData(storageKeys.news, news);
  renderNews();
  hideModal("newsModal");
  setStatus("News update published.");
  event.target.reset();
}

function handlePhotoSubmit(event) {
  event.preventDefault();
  if (!currentUser || !authorizedRoles.includes(currentUser.role)) {
    setStatus("Only authorized members may add gallery images.");
    return;
  }
  const url = document.getElementById("photoUrl").value.trim();
  const desc = document.getElementById("photoDesc").value.trim();
  if (!url || !desc) { setStatus("Provide image URL and description."); return; }
  const gallery = getGallery();
  gallery.unshift({ url, desc });
  saveData(storageKeys.gallery, gallery);
  renderGallery();
  hideModal("photoModal");
  setStatus("Gallery photo added.");
  event.target.reset();
}

function handleIdeaSubmit(event) {
  event.preventDefault();
  if (!currentUser) {
    setStatus("Please login to submit an idea.");
    return;
  }
  const title = document.getElementById("ideaTitle").value.trim();
  const description = document.getElementById("ideaDesc").value.trim();
  if (!title || !description) { setStatus("Add title and description."); return; }
  const ideas = getIdeas();
  ideas.unshift({ title, description, submittedBy: currentUser.name, date: new Date().toLocaleDateString() });
  saveData(storageKeys.ideas, ideas);
  hideModal("ideaModal");
  setStatus("Your event idea has been submitted.");
  event.target.reset();
}

function exportUserData() {
  const users = getUsers();
  if (!currentUser || !authorizedRoles.includes(currentUser.role)) {
    setStatus("Only authorized members may download registration data.");
    return;
  }
  const sheetData = [
    ["Register Number", "Name", "Year", "Role", "Skills", "About"],
    ...users.map(u => [u.regNo, u.name, u.year, u.role, u.skills, u.about]),
  ];
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
  const workbookBlob = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([workbookBlob], { type: "application/octet-stream" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "vecoders-registration-data.xlsx";
  link.click();
  setStatus("Registration data exported to Excel.");
}

function wireEvents() {
  elements.enterButton.addEventListener("click", () => {
    elements.introScreen.style.animation = "spin 1.3s ease forwards";
    elements.logoCircle.style.animation = "logo-spin 1.3s ease forwards";
    setTimeout(() => elements.introScreen.classList.add("hidden"), 1200);
  });

  document.querySelectorAll("[data-close]").forEach(button => {
    button.addEventListener("click", () => hideModal(button.dataset.close));
  });

  elements.openLogin.addEventListener("click", () => showModal("loginModal"));
  elements.loginBtn.addEventListener("click", () => {
    if (currentUser) {
      clearLoginState();
      setStatus("Logged out successfully.");
    } else {
      showModal("loginModal");
    }
  });

  [elements.registerBtn, elements.openRegister].forEach(button => {
    button.addEventListener("click", () => showModal("registerModal"));
  });

  document.getElementById("switchToRegister").addEventListener("click", () => {
    hideModal("loginModal");
    showModal("registerModal");
  });

  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("registerForm").addEventListener("submit", handleRegistration);
  document.getElementById("newsForm").addEventListener("submit", handleNewsPost);
  document.getElementById("photoForm").addEventListener("submit", handlePhotoSubmit);
  document.getElementById("ideaForm").addEventListener("submit", handleIdeaSubmit);

  elements.addNewsBtn.addEventListener("click", () => showModal("newsModal"));
  elements.addPhotoBtn.addEventListener("click", () => showModal("photoModal"));
  elements.submitIdeaBtn.addEventListener("click", () => showModal("ideaModal"));

  elements.loginBtn.addEventListener("click", () => {
    if (currentUser) {
      clearLoginState();
      setStatus("Logged out successfully.");
    }
  });

  const exportButton = document.createElement("button");
  exportButton.className = "btn btn-small";
  exportButton.textContent = "Download Registrations";
  exportButton.style.marginLeft = "12px";
  exportButton.addEventListener("click", exportUserData);
  document.querySelector(".section#members .section-header")?.appendChild(exportButton);
}

init();
wireEvents();
