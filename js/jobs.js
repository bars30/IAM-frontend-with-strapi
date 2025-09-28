import { convertBlocksToHtml } from "./lang-handler.js";

async function loadJobs() {
  const res = await fetch("http://localhost:1337/api/jobs");
  const data = await res.json();

  const jobs = data.data;
  const container = document.getElementById("jobs-container");
  container.innerHTML = "";

  jobs.forEach(job => {
    const attrs = job;
    const jobDiv = document.createElement("div");
    jobDiv.classList.add("job-item");

    jobDiv.innerHTML = `
      <h4 class="job-item_title">${attrs.title}</h4>
      <p class="job-item_location">${attrs.location}</p>
      <p class="job-item_position">${attrs.position}</p>
      <button class="view-more" data-doc="${job.documentId}">View More</button>
    `;

    container.appendChild(jobDiv);
  });

  // ✅ event listener–ները դնում ենք հենց այստեղ
  document.querySelectorAll(".view-more").forEach(btn => {
    btn.addEventListener("click", () => openJobModal(btn.dataset.doc));
  });
}

loadJobs();

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

  let html = `
    <h2>${job.title}</h2>
    <p><strong>Location:</strong> ${job.location}</p>
    <p><strong>Position:</strong> ${job.position}</p>
    <hr>
    ${convertBlocksToHtml(job.content)}
  `;

  body.innerHTML = html;
  modal.classList.add("show");

  // X կոճակը
  document.getElementById("modal-close").onclick = () => {
    modal.classList.remove("show");
  };

  // 👇 overlay-ի վրա click
  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
    }
  };
}
