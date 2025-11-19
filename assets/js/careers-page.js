const STORAGE_KEY = "internalytics_selected_companies";

function getSelectedCompanyIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSelectedCompanyIds(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("company-list");
  const statusEl = document.getElementById("save-status");
  const selectedIds = new Set(getSelectedCompanyIds());

  // Group companies by category (Finance / Consulting / Tech, etc.)
  const byCategory = {};
  INTERNALYTICS_COMPANIES.forEach((c) => {
    if (!byCategory[c.category]) byCategory[c.category] = [];
    byCategory[c.category].push(c);
  });

  Object.keys(byCategory)
    .sort()
    .forEach((category) => {
      const section = document.createElement("section");
      section.className = "company-category";

      const heading = document.createElement("h2");
      heading.textContent = category;
      section.appendChild(heading);

      const list = document.createElement("div");
      list.className = "company-category-list";

      byCategory[category].forEach((company) => {
        const row = document.createElement("label");
        row.className = "company-row";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = company.id;
        checkbox.checked = selectedIds.has(company.id);

        const info = document.createElement("div");
        info.className = "company-info";

        const title = document.createElement("div");
        title.className = "company-name";
        title.textContent = company.name;

        const meta = document.createElement("div");
        meta.className = "company-meta";
        meta.textContent = `${company.category} • ${company.locationTag || ""}`;

        info.appendChild(title);
        info.appendChild(meta);

        const link = document.createElement("a");
        link.href = company.careersUrl;
        link.target = "_blank";
        link.rel = "noopener";
        link.className = "company-link";
        link.textContent = "Open careers site";

        row.appendChild(checkbox);
        row.appendChild(info);
        row.appendChild(link);
        list.appendChild(row);

        checkbox.addEventListener("change", () => {
          const current = new Set(getSelectedCompanyIds());
          if (checkbox.checked) {
            current.add(company.id);
          } else {
            current.delete(company.id);
          }
          saveSelectedCompanyIds([...current]);
          statusEl.textContent = "Dashboard preferences updated.";
          setTimeout(() => (statusEl.textContent = ""), 2000);
        });
      });

      section.appendChild(list);
      container.appendChild(section);
    });
});