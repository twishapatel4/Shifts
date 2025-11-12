document.addEventListener("click", function (e) {
  const isDropdownBtn = e.target.closest("[data-dropdown] .dropdown-btn");

  if (isDropdownBtn) {
    const dropdown = isDropdownBtn.closest("[data-dropdown]");

    // Close all other dropdowns first
    document.querySelectorAll("[data-dropdown].show").forEach((drop) => {
      if (drop !== dropdown) drop.classList.remove("show");
    });

    // Toggle the clicked dropdown
    dropdown.classList.toggle("show");

    e.stopPropagation();
    return;
  }

  // If clicked outside → close all dropdowns
  document
    .querySelectorAll("[data-dropdown].show")
    .forEach((drop) => drop.classList.remove("show"));
});

document
  .querySelectorAll("[data-dropdown] input[type='checkbox']")
  .forEach((cb) => cb.addEventListener("change", handleSelection));
function handleSelection() {
  // Get all checked values
  console.log("handle Select");
  const checkboxes = document.querySelectorAll(
    "[data-dropdown] .dropdown-content input[type='checkbox']"
  );

  const selected = Array.from(checkboxes)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  document.getElementById("cal1").style.display = "block";
  document.getElementById("cal2").style.display = "block";
  document.getElementById("cal3").style.display = "block";

  // Hide based on selection
  if (!selected.includes("Clinic Service Officer")) {
    document.getElementById("cal1").style.display = "none";
  }

  if (!selected.includes("Audiometrist")) {
    document.getElementById("cal2").style.display = "none";
  }

  if (!selected.includes("Audiologist")) {
    document.getElementById("cal3").style.display = "none";
  }
  if (selected.length === 0) {
    document.getElementById("cal1").style.display = "block";
    document.getElementById("cal2").style.display = "block";
    document.getElementById("cal3").style.display = "block";
  }
}

// Prevent closing when clicking inside dropdown content
document
  .querySelectorAll("[data-dropdown] .dropdown-content")
  .forEach((content) => {
    content.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

const calendarBtn = document.getElementById("calendar-btn");
const rangeInput = document.getElementById("calendarRange");
const btnText = document.getElementById("calendar-btn-text");

const fp = flatpickr(rangeInput, {
  mode: "range",
  dateFormat: "d M Y",
  numberofMonths: 2,
  showMonths: 2,
  appendTo: document.querySelector(".left-filter"),
  positionElement: calendarBtn,
  // maxDate: new Date().fp_incr(365),
  onReady: function (selectedDates, dateStr, instance) {
    addCustomButtons(instance);
  },
  onOpen: function (selectedDates, dateStr, instance) {
    if (!instance.calendarContainer.querySelector(".fp-custom-btns")) {
      addCustomButtons(instance);
    }
  },
  onClose: function (selectedDates) {
    if (selectedDates.length === 2) {
      const start = selectedDates[0];
      const end = selectedDates[1];

      const options = { day: "2-digit", month: "short", year: "numeric" };

      document.getElementById("startDate").textContent =
        start.toLocaleDateString("en-US", options);

      document.getElementById("endDate").textContent = end.toLocaleDateString(
        "en-US",
        options
      );
    }
  },
});

function addCustomButtons(instance) {
  const calendar = instance.calendarContainer;

  const btnContainer = document.createElement("div");
  btnContainer.className = "fp-custom-btns";
  btnContainer.style.cssText = `
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 8px 12px;
    border-top: 1px solid #ddd;
  `;

  // Clear Button
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Cancel";
  clearBtn.style.cssText = `
    background: #c0c0c0;
    border:none;
    font-size:14px;
    font-weight:700;
    color:#1d1d1d;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
  `;
  clearBtn.onclick = () => {
    instance.close();
  };

  const applyBtn = document.createElement("button");
  applyBtn.textContent = "Apply";
  applyBtn.style.cssText = `
    background: #007bff;
    color: white;
    border: none;
    padding: 5px 12px;
    border-radius: 4px;
    cursor: pointer;
  `;

  applyBtn.onclick = () => {
    const selectedDates = instance.selectedDates;
    if (selectedDates.length === 2) {
      updateButtonText(selectedDates[0], selectedDates[1]);
    }
    instance.close();
    // You can also trigger your logic here, like updating button text
  };

  btnContainer.appendChild(clearBtn);
  btnContainer.appendChild(applyBtn);

  calendar.appendChild(btnContainer);
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
calendarBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  fp.open();
});

calPrev.addEventListener("click", (e) => {
  e.stopPropagation();
  calendar.prev();
});

calNext.addEventListener("click", (e) => {
  e.stopPropagation();
  calendar.next();
});
