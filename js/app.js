document.addEventListener("click", function (e) {
  const isDropdownBtn = e.target.closest("[data-dropdown] .dropdown-btn");

  if (isDropdownBtn) {
    const dropdown = isDropdownBtn.closest("[data-dropdown]");

    document.querySelectorAll("[data-dropdown].show").forEach((drop) => {
      if (drop !== dropdown) drop.classList.remove("show");
    });

    dropdown.classList.toggle("show");
    e.stopPropagation();
    return;
  }

  document
    .querySelectorAll("[data-dropdown].show")
    .forEach((drop) => drop.classList.remove("show"));
});

// Initialize all dropdown checkboxes
document.querySelectorAll("[data-dropdown]").forEach((dropdown) => {
  const selectAll = dropdown.querySelector(".select-all");
  const checkboxes = dropdown.querySelectorAll(
    ".dropdown-content input[type='checkbox']:not(.select-all)"
  );

  // Mark all selected on load
  selectAll.checked = true;
  checkboxes.forEach((cb) => (cb.checked = true));

  // SELECT ALL
  selectAll.addEventListener("change", () => {
    checkboxes.forEach((cb) => (cb.checked = selectAll.checked));
    handleSelection();
  });

  // Individual checkboxes
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const allChecked = [...checkboxes].every((c) => c.checked);
      selectAll.checked = allChecked;
      handleSelection();
    });
  });
});

// Prevent dropdown from closing when clicking inside
document
  .querySelectorAll("[data-dropdown] .dropdown-content")
  .forEach((content) =>
    content.addEventListener("click", (e) => e.stopPropagation())
  );

function handleSelection() {
  const checkboxes = document.querySelectorAll(
    "[data-dropdown] .dropdown-content input[type='checkbox']"
  );

  const selected = [...checkboxes]
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  const c1 = document.getElementById("cal1");
  const c2 = document.getElementById("cal2");
  const c3 = document.getElementById("cal3");

  c1.style.display = selected.includes("Clinic Service Officer")
    ? "block"
    : "none";
  c2.style.display = selected.includes("Audiometrist") ? "block" : "none";
  c3.style.display = selected.includes("Audiologist") ? "block" : "none";

  // If nothing selected → show all
  if (selected.length === 0) {
    c1.style.display = "block";
    c2.style.display = "block";
    c3.style.display = "block";
  }
}

/* =============================
   DATE UTILITIES
============================= */

function getDefaultRange() {
  const today = new Date();
  const prevSunday = new Date(today);
  prevSunday.setDate(today.getDate() - today.getDay());

  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + (6 - today.getDay()));

  return {
    prevSundayObj: prevSunday,
    nextSaturdayObj: nextSaturday,
  };
}

const { prevSundayObj, nextSaturdayObj } = getDefaultRange();

/* =============================
   FLATPICKR SETUP
============================= */

const calendarBtn = document.getElementById("calendar-btn");
const rangeInput = document.getElementById("calendarRange");

const fp = flatpickr(rangeInput, {
  mode: "range",
  dateFormat: "d M Y",
  numberOfMonths: 2,
  showMonths: 2,
  appendTo: document.querySelector(".left-filter"),
  positionElement: calendarBtn,
  defaultDate: [prevSundayObj, nextSaturdayObj],

  onReady(_, __, instance) {
    addCustomButtons(instance);
  },

  onChange(selectedDates, _, instance) {
    if (selectedDates.length === 1) {
      setWeek(instance, selectedDates[0]);
    }
  },

  onOpen(_, __, instance) {
    if (!instance.calendarContainer.querySelector(".fp-custom-btns")) {
      addCustomButtons(instance);
    }
  },

  onClose(selectedDates) {
    if (selectedDates.length !== 2) return;

    const options = { day: "2-digit", month: "short", year: "numeric" };

    document.getElementById("startDate").textContent =
      selectedDates[0].toLocaleDateString("en-US", options);

    document.getElementById("endDate").textContent =
      selectedDates[1].toLocaleDateString("en-US", options);

    window.dispatchEvent(
      new CustomEvent("dateRangeChanged", {
        detail: { start: selectedDates[0], end: selectedDates[1] },
      })
    );
  },
});

/* =============================
   WEEK SELECTION LOGIC
============================= */

function freezeMonths(instance) {
  return {
    month: instance.currentMonth,
    year: instance.currentYear,
  };
}

function restoreMonths(instance, saved) {
  instance.currentMonth = saved.month;
  instance.currentYear = saved.year;
  instance.redraw();
}

function getWeekRange(date) {
  const d = new Date(date);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());

  const end = new Date(d);
  end.setDate(d.getDate() + (6 - d.getDay()));

  return [start, end];
}

function setWeek(instance, date) {
  const savedMonths = freezeMonths(instance);
  const [start, end] = getWeekRange(date);

  const originalJump = instance.jumpToDate;
  instance.jumpToDate = () => {}; // disable auto-jumps

  instance.setDate([start, end], true);

  restoreMonths(instance, savedMonths);
  instance.jumpToDate = originalJump;
}

/* =============================
   CUSTOM FOOTER BUTTONS
============================= */

function addCustomButtons(instance) {
  const calendar = instance.calendarContainer;

  const container = document.createElement("div");
  container.className = "fp-custom-btns";
  container.style.cssText = `
    display:flex; justify-content:flex-end; gap:10px;
    padding:8px 12px; border-top:1px solid #ddd;
  `;

  const cancel = document.createElement("button");
  cancel.textContent = "Cancel";
  cancel.style.cssText = `
    background:#c0c0c0; font-weight:700;
    padding:8px 12px; border-radius:4px; cursor:pointer;
  `;
  cancel.onclick = () => {
    // Read dates from HTML
    const startText = document.getElementById("startDate").textContent.trim();
    const endText = document.getElementById("endDate").textContent.trim();

    // Convert to Date objects
    const start = new Date(startText);
    const end = new Date(endText);

    if (isNaN(start) || isNaN(end)) {
      console.error("Invalid dates in startDate/endDate elements");
      instance.close();
      return;
    }

    // Update flatpickr selection
    instance.setDate([start, end], true);

    // Update button text
    updateButtonText(start, end);

    // Dispatch calendar update event
    window.dispatchEvent(
      new CustomEvent("dateRangeChanged", {
        detail: { start, end },
      })
    );

    instance.close();
  };

  const apply = document.createElement("button");
  apply.textContent = "Apply";
  apply.style.cssText = `
    background:#007bff; color:white;
    padding:8px 12px; border-radius:4px; cursor:pointer;
  `;
  apply.onclick = () => {
    const sd = instance.selectedDates;
    if (sd.length === 2) updateButtonText(sd[0], sd[1]);
    instance.close();
  };

  container.append(cancel, apply);
  calendar.appendChild(container);
}

function updateButtonText(start, end) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  document.getElementById("startDate").textContent = start.toLocaleDateString(
    "en-US",
    options
  );
  document.getElementById("endDate").textContent = end.toLocaleDateString(
    "en-US",
    options
  );
}

/* =============================
   BUTTON EVENTS
============================= */

calendarBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fp.open();
});

const Todaybtn = document.getElementById("today-btn");

Todaybtn.addEventListener("click", (e) => {
  e.stopPropagation();

  const today = new Date();
  const [start, end] = getWeekRange(today);

  fp.setDate([start, end], true); // update selection
  // fp.jumpToDate(today); // move calendar view
  // fp.open();
  updateButtonText(start, end);
  window.dispatchEvent(
    new CustomEvent("dateRangeChanged", {
      detail: { start: start, end: end },
    })
  );
});

calPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  // calendar.prev();
});

calNext.addEventListener("click", (e) => {
  e.stopPropagation();
  // calendar.next();
});

const FilterBtn = document.getElementById("filter-btn");
filterDropdown = document.getElementById("filter-dropdown");
FilterBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  viewDropdown.classList.remove("show");
  filterDropdown.classList.toggle("show");
});

const viewBtn = document.getElementById("view-btn");
viewDropdown = document.getElementById("view-dropdown");
viewBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  filterDropdown.classList.remove("show");
  viewDropdown.classList.toggle("show");
});

// Ensure dropdowns fit inside the viewport when opened
function fitDropdownIntoView(dropdown, anchor) {
  if (!dropdown) return;

  // reset any inline positioning first
  dropdown.style.left = "";
  dropdown.style.right = "";
  dropdown.style.top = "";
  dropdown.style.bottom = "";

  const rect = dropdown.getBoundingClientRect();
  const anchorRect = anchor ? anchor.getBoundingClientRect() : null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Horizontal overflow: prefer anchoring to right edge of anchor
  // Horizontal overflow: prefer anchoring to right edge of anchor
  if (rect.right > vw) {
    // Align dropdown's right edge with anchor's right edge
    dropdown.style.left = "auto";
    dropdown.style.right = "0px";
  } else {
    // default: align left edge
    dropdown.style.left = "0px";
    dropdown.style.right = "";
  }

  // Vertical overflow: if dropdown extends beyond viewport bottom, show above anchor
  if (rect.bottom > vh && anchorRect) {
    dropdown.style.top = "auto";
    dropdown.style.bottom = "100%";
  } else {
    dropdown.style.top = "";
    dropdown.style.bottom = "";
  }
}

// Call fit when filter/view toggle and when any left dropdown toggles
FilterBtn.addEventListener("click", (e) => {
  setTimeout(() => fitDropdownIntoView(filterDropdown, FilterBtn), 0);
});
viewBtn.addEventListener("click", (e) => {
  setTimeout(() => fitDropdownIntoView(viewDropdown, viewBtn), 0);
});

// Also handle left dropdowns (territory/site/category)
document.querySelectorAll("[data-dropdown]").forEach((dd) => {
  const btn = dd.querySelector(".dropdown-btn");
  const content = dd.querySelector(".dropdown-content");
  if (!btn || !content) return;
  btn.addEventListener("click", () => {
    setTimeout(() => fitDropdownIntoView(content, dd), 0);
  });
});

// Reposition open dropdowns on resize/scroll
window.addEventListener("resize", () => {
  document
    .querySelectorAll(
      ".filter-dropdown.show, .view-dropdown.show, [data-dropdown].show .dropdown-content"
    )
    .forEach((d) => {
      // determine anchor: parent .filter-wrapper/.view-wrapper or closest [data-dropdown]
      const parent =
        d.closest(".filter-wrapper") ||
        d.closest(".view-wrapper") ||
        d.closest("[data-dropdown]");
      fitDropdownIntoView(d, parent);
    });
});
window.addEventListener("scroll", () => {
  document
    .querySelectorAll(
      ".filter-dropdown.show, .view-dropdown.show, [data-dropdown].show .dropdown-content"
    )
    .forEach((d) => {
      const parent =
        d.closest(".filter-wrapper") ||
        d.closest(".view-wrapper") ||
        d.closest("[data-dropdown]");
      fitDropdownIntoView(d, parent);
    });
});

document.addEventListener("click", (e) => {
  if (!filterDropdown.contains(e.target) && !FilterBtn.contains(e.target)) {
    filterDropdown.classList.remove("show");
  }
  if (!viewDropdown.contains(e.target) && !viewBtn.contains(e.target)) {
    viewDropdown.classList.remove("show");
  }
});

document.addEventListener("click", (e) => {
  const item = e.target.closest(".dropdown-item");
  if (!item) return;

  // toggle selection
  item.classList.toggle("selected");
});

document.getElementById("Shifts").addEventListener("click", (e) => {
  const section = e.target.closest(".section1");
  section.classList.toggle("collapsed");
});

document.getElementById("Groups").addEventListener("click", (e) => {
  const section = e.target.closest(".section2");
  section.classList.toggle("collapsed");
});
// document.getElementById("QuickAccess").addEventListener("click", (e) => {
//   const section = e.target.closest(".section1");
//   section.classList.toggle("collapsed");
// });

// document.getElementById("Show").addEventListener("click", (e) => {
//   const section = e.target.closest(".section2");
//   section.classList.toggle("collapsed");
// });
