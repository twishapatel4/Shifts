let cal0Instance;
let cal1Instance;
let cal1Resources;
let cal1Collapsed = false;
let cal2Instance;
let cal2Resources;
let cal2Collapsed = false;
let cal3Instance;
let cal3Resources;
let cal3Collapsed = false;
// currently shown popup target (used by repositionPopup)
let activePopupEvent = null;
async function loadShifts() {
  const res = await fetch("./js/data/shifts.json");
  const data = await res.json();

  // Build groups (resources array still contains parent objects)
  const clinicManagerGroup = {
    resources: data.resources.filter((r) => r.id === "CLINIC_MANAGER"),
    events: data.events.filter((e) => [1, 2, 8].includes(Number(e.resourceId))),
  };

  const audiometristGroup = {
    resources: data.resources.filter((r) => r.id === "AUDIOMETRIST"),
    events: data.events.filter((e) =>
      [3, 4, 5, 6, 9].includes(Number(e.resourceId))
    ),
  };

  const audiologistGroup = {
    resources: data.resources.filter((r) => r.id === "AUDIOLOGIST"),
    events: data.events.filter((e) => [7, 10].includes(Number(e.resourceId))),
  };

  // Store original resources (including parents) for toggling UI
  cal1Resources = clinicManagerGroup.resources;
  cal2Resources = audiometristGroup.resources;
  cal3Resources = audiologistGroup.resources;
  // Initialize calendars. For calendar resources we pass a flattened list WITHOUT parent rows
  rendercalendars(clinicManagerGroup, audiometristGroup, audiologistGroup);
}

function rendercalendars(
  clinicManagerGroup,
  audiometristGroup,
  audiologistGroup
) {
  cal0Instance = initCalendar("cal0", [], [], true, null);
  cal1Instance = initCalendar(
    "cal1",
    flattenResources(clinicManagerGroup.resources),
    clinicManagerGroup.events,
    false, // use custom header for cal1
    clinicManagerGroup
  );

  cal2Instance = initCalendar(
    "cal2",
    flattenResources(audiometristGroup.resources),
    audiometristGroup.events,
    false,
    audiometristGroup
  );

  cal3Instance = initCalendar(
    "cal3",
    flattenResources(audiologistGroup.resources),
    audiologistGroup.events,
    false,
    audiologistGroup
  );
}

// Helper: flatten resource arrays by replacing parent entries with their children
function flattenResources(resources) {
  const out = [];
  resources.forEach((r) => {
    if (r.extendedProps?.isParent && Array.isArray(r.children)) {
      // keep group metadata by attaching a _groupId on each child so you can still know the parent
      r.children.forEach((c) => out.push({ ...c, _groupId: r.id }));
    } else if (!r.extendedProps?.isParent) {
      out.push(r);
    }
  });
  return out;
}

function initCalendar(
  containerId,
  resources,
  events,
  useCustomHeader = false,
  groupMeta = null
) {
  const allEvents = events.map((ev) => {
    let dateStart = null;
    let dateEnd = null;

    // Helper to parse "MM/DD/YYYY" format safely
    function parseDate(str) {
      const parts = str.split("/");
      if (parts.length === 3) {
        const month = parseInt(parts[0], 10) - 1;
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      return null;
    }

    // Determine start date
    if (ev.start) {
      if (isIsoDate(ev.start)) {
        dateStart = new Date(ev.start);
      } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(ev.start)) {
        dateStart = parseDate(ev.start);
      }
    }

    // Determine end date
    if (ev.end) {
      if (isIsoDate(ev.end)) {
        dateEnd = new Date(ev.end);
      } else if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(ev.end)) {
        dateEnd = parseDate(ev.end);
      }
    }

    function format(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      // return `${y}-${m}-${day}T00:00:00`;
      return `${y}-${m}-${day}T00:00:00Z`;
    }

    return {
      ...ev,
      start: dateStart ? format(dateStart) : ev.start,
      end: dateEnd ? format(dateEnd) : ev.end,
    };
  });

  if (!resources || resources.length === 0) {
    const calendarEl = document.getElementById(containerId);
    calendarEl.classList.add("no-resources");
  }

  const calendarOptions = {
    view: "resourceTimelineWeek",
    initialDate: new Date(),
    slotDuration: { days: 1 },
    headerToolbar: false,
    editable: false,
    eventStartEditable: false,
    eventDurationEditable: false,
    eventResourceEditable: false,
    resources,
    events: allEvents,
    resourceLabelContent: renderResources,
    eventContent: renderEventDetails,
    viewDidMount(info) {
      // quick debug - inspect resources and events passed to each calendar

      const calendarEl = document.getElementById(containerId);
      setTimeout(() => {
        document.querySelectorAll(".ec-events").forEach((cell) => {
          const hasEvent = cell.querySelector(".ec-event");
          if (!hasEvent) {
            cell.classList.add("ec-empty-cell");
            if (!cell.querySelector(".empty-event")) {
              cell.insertAdjacentHTML(
                "beforeend",
                `
    <div class="empty-event">
      <div class="right-empty">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
          height="14"
          width="14"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
        </div>
        <div class="dots">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6" height="14"
          width="14"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </div>
      </div>
    </div>
              `
              );
            }
          }
        });
      });
      // Add group header if provided
      if (groupMeta) {
        ensureGroupHeader(calendarEl, groupMeta);
      }

      const titleEl = calendarEl.querySelector(".ec-sidebar-title");

      if (useCustomHeader) {
        // CAL0 → Show Custom Sidebar + Keep Day Header
        if (titleEl && !titleEl.querySelector(".custom-sidebar-div")) {
          const customDiv = document.createElement("div");
          customDiv.className = "custom-sidebar-div";
          customDiv.innerHTML = `
            <div class="custom-sidebar-title">
              <div class="sidebar-title-main">November 2025</div>
              <div class="sidebar-title-sub">Day 0 HRS</div>
            </div>
          `;
          titleEl.appendChild(customDiv);
        }
      } else {
        // OTHER CALENDARS → Hide Sidebar Title + Hide Day Header
        if (titleEl) titleEl.style.display = "none";
        const dayHeaders = calendarEl.querySelectorAll(".ec-header");
        dayHeaders.forEach((dh) => (dh.style.display = "none"));
      }

      // Hide content of parent rows (unchanged)
      const parentRows = calendarEl.querySelectorAll(".ec-resource-row");
      parentRows.forEach((row) => {
        const resourceId = row.dataset.resourceId;
        const resource = resources.find(
          (r) => String(r.id) === String(resourceId)
        );
        if (resource?.extendedProps?.isParent) {
          const dayCells = row.querySelectorAll(".ec-content");
          dayCells.forEach((cell) => (cell.style.display = "none"));
        }
      });
    },
    datesSet(info) {
      const start = new Date(info.start);
      const end = new Date(info.end);
      end.setDate(end.getDate() - 1); // fix: FullCalendar end is exclusive

      // Format: "Nov 22 2025"
      function formatMMMDDYYYY(d) {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
      }

      document.getElementById("startDate").textContent = formatMMMDDYYYY(start);
      document.getElementById("endDate").textContent = formatMMMDDYYYY(end);
      const calendarEl = document.getElementById(containerId);
      const titleMain = calendarEl.querySelector(
        ".custom-sidebar-title .sidebar-title-main"
      );

      if (titleMain) {
        const startDate = info.start; // start of current view range
        const endDate = info.end; // end of current view range
        const startMonth = startDate.toLocaleString("default", {
          month: "long",
        });
        const startYear = startDate.getFullYear();
        const endMonth = endDate.toLocaleString("default", { month: "long" });
        const endYear = endDate.getFullYear();

        // Handle cases where the week spans two months
        let displayText;
        if (startMonth === endMonth && startYear === endYear) {
          displayText = `${startMonth} ${startYear}`;
        } else if (startYear === endYear) {
          const startMonth = startDate.toLocaleString("default", {
            month: "short",
          });
          const endMonth = endDate.toLocaleString("default", {
            month: "short",
          });
          displayText = `${startMonth} - ${endMonth} ${startYear}`;
        } else {
          const startMonth = startDate.toLocaleString("default", {
            month: "short",
          });
          const endMonth = endDate.toLocaleString("default", {
            month: "short",
          });
          displayText = `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
        }

        titleMain.textContent = displayText;
      }
    },
  };
  if (useCustomHeader) {
    calendarOptions.dayHeaderFormat = CustomHeader;
  }
  const calendarEl = document.getElementById(containerId);
  const calendar = EventCalendar.create(calendarEl, calendarOptions);
  return calendar;
}

document.getElementById("calPrev").addEventListener("click", () => {
  cal0Instance?.prev();
  cal1Instance?.prev();
  cal2Instance?.prev();
  cal3Instance?.prev();
});

document.getElementById("calNext").addEventListener("click", () => {
  cal0Instance?.next();
  cal1Instance?.next();
  cal2Instance?.next();
  cal3Instance?.next();
});

window.addEventListener("dateRangeChanged", (e) => {
  const { start, end } = e.detail;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const newDate = new Date(start);
  cal0Instance.setOption("date", newDate);
  cal1Instance.setOption("date", newDate);
  cal2Instance.setOption("date", newDate);
  cal3Instance.setOption("date", newDate);
});

function isIsoDate(str) {
  return typeof str === "string" && /^\d{4}-\d{2}-\d{2}/.test(str);
}

function ensureGroupHeader(calendarEl, groupMeta) {
  if (calendarEl.querySelector(".group-header")) return;

  const header = document.createElement("div");
  header.className = "group-header";
  const parent = groupMeta.resources.find((r) => r.extendedProps?.isParent);
  const title = parent ? parent.title : "Group";
  const hours = parent.extendedProps.hours;

  header.innerHTML = `
    <div class="group-header-inner">
  <div class="left-header">
    <button type="button" class="group-collapse-btn">
      <!-- DOWN icon (default) -->
      <svg
        class="icon-down"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        width="18"
        height="18"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
 
      <!-- UP icon (shown when collapsed) -->
      <svg
        class="icon-up"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        width="18"
        height="18"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m4.5 15.75 7.5-7.5 7.5 7.5"
        />
      </svg>
    </button>
    <div class="group-title">${escapeHtml(title)}</div>
    <div>${escapeHtml(hours)} Hrs</div>
    <div class="users">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="size-6"
        height="20"
        width="20"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
      </svg>
      <div>2</div>
    </div>
  </div>
  <div class="right-header">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="size-6"
      height="24"
      width="24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
      />
    </svg>
    <div>Add People</div>
  </div>
</div>
 
  `;
  calendarEl.insertBefore(header, calendarEl.firstChild);
  const btn = header.querySelector(".group-collapse-btn");

  btn.addEventListener("click", () => {
    const calId = calendarEl.id;
    function toggleGroup(collapsed, instance, resourceStore, calendarEl) {
      const updated = collapsed ? [] : flattenResources(resourceStore);
      instance.setOption("resources", updated);

      if (collapsed) {
        calendarEl.classList.add("no-resources");
      } else {
        calendarEl.classList.remove("no-resources");
      }

      // Toggle icon state
      btn.classList.toggle("collapsed", collapsed);
    }

    if (calId === "cal1" && cal1Instance && cal1Resources) {
      cal1Collapsed = !cal1Collapsed;
      toggleGroup(cal1Collapsed, cal1Instance, cal1Resources, calendarEl);
    } else if (calId === "cal2" && cal2Instance && cal2Resources) {
      cal2Collapsed = !cal2Collapsed;
      toggleGroup(cal2Collapsed, cal2Instance, cal2Resources, calendarEl);
    } else if (calId === "cal3" && cal3Instance && cal3Resources) {
      cal3Collapsed = !cal3Collapsed;
      toggleGroup(cal3Collapsed, cal3Instance, cal3Resources, calendarEl);
    }
  });
}

function CustomHeader(date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
  const d = String(date.getDate()).padStart(2, "0");

  return {
    html: `
<div class="header">
  <div class="day-week">
    <div class="date">${d}</div>
    <div class="weekday">${weekday}</div>
  </div>
  <div class="user-hrs">
    <div class="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="20" width="20">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
      </svg>
      <span>3</span>
    </div>
    <div class="hrs">9 Hrs</div>
  </div>
</div>
    `,
  };
}

function renderResources(arg) {
  const resource = arg.resource || arg;
  const img = resource.image || resource.extendedProps?.imgUrl;
  const shift = resource.extendedProps?.shift || 0;
  const parent = resource.extendedProps?.isParent;
  const open = resource.extendedProps?.isOpen;

  // We do not render parent as a calendar row; parents were removed from resources list.
  if (parent) return {};

  return {
    html: `
      <div class="resource-user">
        ${
          img
            ? `<img src="${img}" style="border-radius:50%; width:40px; height:40px; object-fit:cover;"/>`
            : open
            ? `<div style="width:40px; height:40px; border-radius:50%; background-color:#d9d9d9; display:flex; align-items:center; justify-content:center; font-weight:600; color:#fff; font-size:14px;">.</div>`
            : ""
        }
        <div class="title-shift">
          <span class="resource-name">${escapeHtml(resource.title)}</span>
          <div class="shift">${shift} Shift</div>
        </div>
      </div>
    `,
  };
}

function renderEventDetails(arg) {
  const event = arg.event;
  const title = (event.title || "").toLowerCase();
  const resourceId = event.resourceIds[0];
  // Detect red vs blue from title (user requested event title detection)
  const isRed = title.includes("red") || title.includes("shift-red");
  const isBlue = title.includes("blue") || title.includes("shift-blue");
  if (isRed) {
    return {
      html: `
       <div class="events-red" data-resource-id="${resourceId}">
         <div class="left-event">
           FT-North Sydney
           <div class="icons">
             <img src="./Assets/icons/CupRed.svg" height="20" width="20" />
             <img src="./Assets/icons/TimeRed.svg" height="20" width="20" />
           </div>
         </div>
         <div class="right-event">X3</div>
          <div class="right-event-x">
         <div class="">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" height="14" width="14">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <div class="dots"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
</svg>
</div>
        </div>
      </div>
         <div>
       </div>
      `,
    };
  }

  // default -> blue style
  if (isBlue) {
    return {
      html: `
    <div class="events-blue" data-resource-id="${resourceId}">
      <div class="left-event">
        PT-Sydney CBD
        <div class="icons">
          <img src="./Assets/icons/Cup.svg" height="20" width="20" />
          <img src="./Assets/icons/Time.svg" height="20" width="20" />
        </div>
      </div>
       <div class="right-event">X3</div>
         <div class="right-event-x">
         <div class="">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" height="14" width="14">
            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <div class="dots"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
</svg>
</div>
        </div>
    </div>
    `,
    };
  }
}

// Simple helper to escape HTML content when injecting into templates
function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[&<>"'`]/g, function (s) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "`": "&#96;",
    }[s];
  });
}

// Toggle buttons (if you still want the old toggle buttons in DOM)
document.getElementById("cal1-toggle")?.addEventListener("click", () => {
  if (!cal1Instance || !cal1Resources) return;

  cal1Collapsed = !cal1Collapsed;
  const updatedResources = cal1Collapsed ? [] : flattenResources(cal1Resources);
  cal1Instance.setOption("resources", updatedResources);
});

document.getElementById("cal2-toggle")?.addEventListener("click", () => {
  if (!cal2Instance || !cal2Resources) return;

  cal2Collapsed = !cal2Collapsed;
  const updatedResources = cal2Collapsed ? [] : flattenResources(cal2Resources);
  cal2Instance.setOption("resources", updatedResources);
});

document.getElementById("cal3-toggle")?.addEventListener("click", () => {
  if (!cal3Instance || !cal3Resources) return;

  cal3Collapsed = !cal3Collapsed;
  const updatedResources = cal3Collapsed ? [] : flattenResources(cal3Resources);
  cal3Instance.setOption("resources", updatedResources);
});

// kick off data load
loadShifts();

document.addEventListener("DOMContentLoaded", () => {
  const eventPopup = document.getElementById("event-popup");
  const resourcePopup = document.getElementById("resource-shift-popup");
  const emptyPopup = document.getElementById("empty-popup");

  let activeEvent = null;

  document.addEventListener("click", function (e) {
    const dot = e.target.closest(
      ".events-blue .dots, .events-red .dots,.ec-empty-cell .dots"
    );
    if (dot) {
      e.stopPropagation();

      // 1. REAL EVENT?
      let eventBox = dot.closest(".events-blue, .events-red");
      let isEmptyCell = false;

      // 2. EMPTY CELL?
      if (!eventBox) {
        // Prefer the inner `.empty-event` element for correct positioning
        const tinyBox =
          dot.closest(".empty-event") || dot.closest(".ec-empty-cell");
        eventBox = tinyBox;
        isEmptyCell = true;
      }

      if (!eventBox) return;
      activeEvent = eventBox;
      // keep repositionPopup in sync
      activePopupEvent = eventBox;

      let resId = null;
      if (!isEmptyCell) {
        resId = eventBox.getAttribute("data-resource-id");
      }

      eventPopup.style.display = "none";
      resourcePopup.style.display = "none";
      emptyPopup.style.display = "none";

      let popupToShow;

      if (isEmptyCell) {
        popupToShow = emptyPopup;
      } else {
        const eventPopupIDs = [8, 9, 10];
        popupToShow = eventPopupIDs.includes(Number(resId))
          ? eventPopup
          : resourcePopup;
      }

      const rect = eventBox.getBoundingClientRect();
      popupToShow.style.display = "block";
      popupToShow.style.width = rect.width + "px";

      // compute numeric left so we can adjust for viewport overflow
      let left = rect.left + window.scrollX;
      popupToShow.style.left = left + "px";
      // popupToShow.style.top = rect.bottom + window.scrollY + 4 + "px";
      let offset = 0; // base offset for all popups

      if (isEmptyCell) {
        // Adjust for extra padding/margin inside empty cell
        const style = getComputedStyle(eventBox);
        offset = -6;
        const paddingTop = parseFloat(style.paddingTop) || 0;
        offset -= paddingTop; // reduce offset if cell has top padding
      }

      popupToShow.style.top = rect.bottom + window.scrollY + offset + "px";

      // Prevent leaving screen
      const vpWidth = document.documentElement.clientWidth;
      const vpHeight = document.documentElement.clientHeight;
      const popupRect = popupToShow.getBoundingClientRect();

      if (popupRect.right > vpWidth - 8) {
        left = left - (popupRect.right - (vpWidth - 8));
        popupToShow.style.left = Math.max(8, left) + "px";
      }

      if (popupRect.bottom > vpHeight - 8) {
        const aboveTop = rect.top + window.scrollY - popupRect.height - 19;
        popupToShow.style.top = Math.max(4, aboveTop) + "px";
      }
      return;
    }

    // CLICK INSIDE POPUP → do nothing
    if (
      e.target.closest("#event-popup") ||
      e.target.closest("#resource-shift-popup") ||
      e.target.closest("#empty-popup")
    )
      return;

    // CLICK OUTSIDE → close all
    disablePopup();
    activeEvent = null;
    activePopupEvent = null;
  });

  function disablePopup() {
    eventPopup.style.display = "none";
    resourcePopup.style.display = "none";
    emptyPopup.style.display = "none";
  }
  window.addEventListener("scroll", disablePopup, true);
  window.addEventListener("resize", disablePopup);
  // HOVER HANDLING
  document.addEventListener("mouseover", function (e) {
    const eventBox = e.target.closest(".events-blue, .events-red");
    if (
      e.target.closest("#event-popup") ||
      e.target.closest("#resource-shift-popup")
    )
      return;

    if (
      eventBox &&
      (eventPopup.style.display === "block" ||
        resourcePopup.style.display === "block")
    ) {
      if (activeEvent && eventBox !== activeEvent) {
        eventPopup.style.display = "none";
        resourcePopup.style.display = "none";
        activeEvent = null;
        activePopupEvent = null;
      }
    }
  });
});

document.addEventListener("click", function () {
  const popup = document.getElementById("event-popup");
  popup.style.display = "none";
  activePopupEvent = null;
});

/* ---------- Sync utilities for 4 stacked calendars ---------- */
function injectMasterScrollbar() {
  let master = document.getElementById("master-scrollbar");

  if (!master) {
    master = document.createElement("div");
    master.id = "master-scrollbar";
    master.style.cssText = `
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      height: 16px;
      margin-top: 6px;
    `;

    const inner = document.createElement("div");
    inner.id = "master-scrollbar-inner";
    inner.style.height = "1px";

    master.appendChild(inner);

    const container = document.querySelector(".calendar-container");
    container.after(master);
  }

  return master;
}

function setupCalendarSync() {
  const master = injectMasterScrollbar();

  const scrollAreas = [];
  document.querySelectorAll("#cal0, #cal1, #cal2, #cal3").forEach((cal) => {
    const header = cal.querySelector(".ec-header");
    const main = cal.querySelector(".ec-main");
    if (header && main) {
      scrollAreas.push(header, main);
    }
  });

  // Resize master inner width based on first calendar
  function updateMasterWidth() {
    const firstMain = scrollAreas.find((el) =>
      el.classList.contains("ec-main")
    );
    if (firstMain) {
      document.getElementById("master-scrollbar-inner").style.width =
        firstMain.scrollWidth + "px";
    }
  }

  updateMasterWidth();
  window.addEventListener("resize", updateMasterWidth);

  let lock = false;

  function syncFrom(source) {
    if (lock) return;
    lock = true;

    const left = source.scrollLeft;

    // sync to all calendar parts
    scrollAreas.forEach((el) => {
      if (el !== source) el.scrollLeft = left;
    });

    // sync to master
    if (master !== source) master.scrollLeft = left;

    lock = false;
  }

  // Calendar scroll → sync
  scrollAreas.forEach((el) => {
    el.addEventListener("scroll", () => syncFrom(el), { passive: true });
  });

  // Master scroll → sync
  master.addEventListener("scroll", () => syncFrom(master), { passive: true });
}

setTimeout(setupCalendarSync, 400); // wait for EventCalendar render
