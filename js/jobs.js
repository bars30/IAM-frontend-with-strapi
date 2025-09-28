import { convertBlocksToHtml } from "./lang-handler.js";

const JOBS_PER_PAGE = 8;
let allJobs = [];
let filteredJobs = [];
let currentIndex = 0;

const container = document.getElementById("jobs-container");
const searchInput = document.getElementById("search-input");

// Load jobs from API
async function loadJobs() {
  const res = await fetch("http://localhost:1337/api/jobs");
  const data = await res.json();
  allJobs = data.data;
  filteredJobs = [...allJobs];
  currentIndex = 0;
  renderJobs();
}

// Render jobs based on current index
function renderJobs() {
  container.innerHTML = "";

  const jobsToShow = filteredJobs.slice(0, currentIndex + JOBS_PER_PAGE);
  if (jobsToShow.length === 0) {
    container.innerHTML = `
      <p>Sadly no openings match your current search criteria. Please try adjusting your search terms or send us your CV so we can help you discover other opportunities that fit your background.</p>
    `;
    return;
  }

  jobsToShow.forEach(job => {
    const jobDiv = document.createElement("div");
    jobDiv.classList.add("job-item");

    jobDiv.innerHTML = `
      <div>
        <h4 class="job-item_title">${job.title}</h4>
        <div>
          <p class="job-item_location">${job.location}</p>
          <p class="job-item_position">${job.position}</p>
        </div>
      </div>
      <button class="view-more" data-doc="${job.documentId}">View More</button>
    `;
    container.appendChild(jobDiv);
  });

  // Add "More Jobs" button if there are more jobs
  if (currentIndex + JOBS_PER_PAGE < filteredJobs.length) {
    const moreBtn = document.createElement("button");
    moreBtn.textContent = "More jobs";
    moreBtn.classList.add("more-jobs-btn");
    moreBtn.style.marginTop = "16px";
    moreBtn.style.width = "100%";
    moreBtn.style.padding = "12px";
    moreBtn.style.cursor = "pointer";
    moreBtn.style.borderRadius = "50px";
    moreBtn.style.border = "1px solid #007bff";
    moreBtn.style.background = "#fff";
    moreBtn.style.color = "#007bff";
    moreBtn.style.fontWeight = "600";
    moreBtn.onclick = () => {
      currentIndex += JOBS_PER_PAGE;
      renderJobs();
    };
    container.appendChild(moreBtn);
  } else if (currentIndex + JOBS_PER_PAGE >= filteredJobs.length) {
    const endMsg = document.createElement("p");
    endMsg.style.marginTop = "16px";
    endMsg.textContent =
      "This is the end of the list, there are no more openings that match your current search criteria. Please try adjusting your search terms or send us your CV so we can help you discover other opportunities that fit your background.";
    container.appendChild(endMsg);
  }

  // Add event listeners for "View More" buttons
  document.querySelectorAll(".view-more").forEach(btn => {
    btn.addEventListener("click", () => openJobModal(btn.dataset.doc));
  });
}

// Search functionality
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase();
  filteredJobs = allJobs.filter(job =>
    job.title.toLowerCase().includes(term) ||
    job.position.toLowerCase().includes(term) ||
    job.location.toLowerCase().includes(term)
  );
  currentIndex = 0;
  renderJobs();
});

// Modal functionality
async function openJobModal(documentId) {
  const res = await fetch(`http://localhost:1337/api/jobs/${documentId}`);
  const data = await res.json();
  const job = data.data;

  if (!job) {
    console.error("❌ Job not found", data);
    return;
  }

  const modal = document.getElementById("job-modal");
  const body = document.getElementById("modal-body");

  body.innerHTML = `
    <h2>${job.title}</h2>
    <div>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Position:</strong> ${job.position}</p>
    </div>
    <hr>
    ${convertBlocksToHtml(job.content)}
  `;

  modal.classList.add("show");

  document.getElementById("modal-close").onclick = () => {
    modal.classList.remove("show");
  };

  modal.onclick = e => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  };
}

loadJobs();
