document.addEventListener("click", function (e) {
  const isDropdownBtn = e.target.matches("[data-dropdown] .dropdown-btn");

  // Close all dropdowns if clicked outside
  if (!isDropdownBtn) {
    document
      .querySelectorAll("[data-dropdown].show")
      .forEach((drop) => drop.classList.remove("show"));
    return;
  }

  const currentDropdown = e.target.closest("[data-dropdown]");
  currentDropdown.classList.toggle("show");
});

window.onclick = function (event) {
  if (!event.target.closest(".dropdown")) {
    const dropdowns = document.getElementsByClassName("dropdown");
    // for (let i = 0; i < dropdowns.length; i++) {
    //   dropdowns[i].classList.remove("show");
    // }
    for (let i = 0; i < dropdowns.length; i++) {
      const dropdown = dropdowns[i];

      // If click is outside the dropdown, close it
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("show");
      }
    }
  }
};

const calendarBtn = document.getElementById("calendar-btn");
// const dateInput = document.getElementById("datefilter");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const btnText = document.getElementById("calendar-btn-text");

calendarBtn.addEventListener("click", () => {
  startInput.showPicker();
});

startInput.addEventListener("change", () => {
  endInput.showPicker();
});

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

endInput.addEventListener("change", (e) => {
  const start = formatDate(startInput.value);
  const end = formatDate(endInput.value);

  const options = { day: "2-digit", month: "short", year: "numeric" };
  // calendarBtn.childNodes.forEach((node) => {
  //   if (node.nodeType === Node.TEXT_NODE) {
  //     node.textContent = `${start} - ${end}`;
  //   }
  // });

  //   const selectedDate = new Date(e.target.value);
  //   const options = { day: "2-digit", month: "short", year: "numeric" };
  //   btnText.textContent = selectedDate.toLocaleDateString("en-US", options);
});
