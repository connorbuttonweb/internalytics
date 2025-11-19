const STORAGE_KEY = "internalytics_selected_companies";

function getSelectedCompanyIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("dashboard-companies");
  const emptyMsg = document.getElementById("dashboard-empty");

  const selectedIds = new Set(getSelectedCompanyIds());
  const activeCompanies = INTERNALYTICS_COMPANIES.filter((c) =>
    selectedIds.has(c.id)
  );

  if (!activeCompanies.length) {
    emptyMsg.style.display = "block";
    return;
  }

  activeCompanies.forEach((company) => {
    const card = document.createElement("article");
    card.className = "company-card";

    const title = document.createElement("h2");
    title.textContent = company.name;

    const meta = document.createElement("p");
    meta.className = "company-meta";
    meta.textContent = `${company.category} • ${company.locationTag || ""}`;

    const actions = document.createElement("div");
    actions.className = "company-actions";

    const careersBtn = document.createElement("a");
    careersBtn.href = company.careersUrl;
    careersBtn.target = "_blank";
    careersBtn.rel = "noopener";
    careersBtn.className = "btn primary";
    careersBtn.textContent = "Open careers site";

    const editBtn = document.createElement("a");
    editBtn.href = "careers.html";
    editBtn.className = "btn ghost";
    editBtn.textContent = "Edit tracked companies";

    actions.appendChild(careersBtn);
    actions.appendChild(editBtn);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(actions);

    grid.appendChild(card);
  });
});