/* =============================
   DROPDOWN HANDLING
============================= */

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

/* =============================
   SELECTION HANDLER
============================= */

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

function formatDDMMYYYY(date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function getDefaultRange() {
  const today = new Date();
  const prevSunday = new Date(today);
  prevSunday.setDate(today.getDate() - today.getDay());

  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + (6 - today.getDay()));

  return {
    prevSundayObj: prevSunday,
    nextSaturdayObj: nextSaturday,
    prevSundayStr: formatDDMMYYYY(prevSunday),
    nextSaturdayStr: formatDDMMYYYY(nextSaturday),
  };
}

const { prevSundayObj, nextSaturdayObj, prevSundayStr, nextSaturdayStr } =
  getDefaultRange();

document.getElementById("startDate").textContent = prevSundayStr;
document.getElementById("endDate").textContent = nextSaturdayStr;

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
  cancel.onclick = () => instance.close();

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
  fp.jumpToDate(today); // move calendar view
  fp.open();
});
