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
    instance.clear();
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
    instance.close();
    // You can also trigger your logic here, like updating button text
  };

  btnContainer.appendChild(clearBtn);
  btnContainer.appendChild(applyBtn);

  calendar.appendChild(btnContainer);
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
