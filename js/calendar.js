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
    viewDidMount() {
      // quick debug - inspect resources and events passed to each calendar
      console.log(`initCalendar ${containerId}`);
      console.log("events", allEvents);
      console.log("resources", resources);

      const calendarEl = document.getElementById(containerId);

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
          console.log(startMonth, endMonth);
          displayText = `${startMonth} ${startYear} - ${endMonth} ${endYear}`;
        }

        titleMain.textContent = displayText;
      }
      // calendar.setOption("events", allEvents);
    },
  };
  if (useCustomHeader) {
    calendarOptions.dayHeaderFormat = CustomHeader;
  }
  const calendarEl = document.getElementById(containerId);

  const calendar = EventCalendar.create(calendarEl, calendarOptions);
  console.log(calendar);
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

window.addEventListener("scroll", repositionPopup, true);
window.addEventListener("resize", repositionPopup);

// function filterEventsForRange(events, referenceDate) {
//   const weekStart = new Date(referenceDate);
//   const weekEnd = new Date(weekStart);
//   weekEnd.setDate(weekStart.getDate() + 7);
//   console.log("start", weekStart);
//   console.log(weekEnd);
//   return events.filter(
//     (ev) => ev._startDate >= weekStart && ev._startDate < weekEnd
//   );
// }

// function repositionPopup() {
//   const popup = document.getElementById("event-popup");
//   if (!popup || popup.style.display !== "block" || !activePopupEvent) return;

//   const rect = activePopupEvent.getBoundingClientRect();
//   const width = Math.min(rect.width - 8, window.innerWidth * 0.95);
//   popup.style.width = width - 28 + "px";
//   popup.style.top = rect.bottom + window.scrollY + 6 + "px";
//   popup.style.left = rect.left + window.scrollX + "px";
// }

// document.addEventListener("click", function (e) {
//   const popup = document.getElementById("event-popup");
//   if (
//     popup.style.display === "block" &&
//     !popup.contains(e.target) &&
//     !e.target.closest(".ec-event")
//   ) {
//     popup.style.display = "none";
//   }
// });
function repositionPopup() {
  const popup = document.getElementById("event-popup");
  if (!popup || popup.style.display !== "block" || !activePopupEvent) return;

  const rect = activePopupEvent.getBoundingClientRect();

  // Check viewport width
  if (window.innerWidth < 950) {
    // On small screens → let popup size naturally
    popup.style.width = "auto";
    popup.style.maxWidth = "95vw"; // optional safety limit
    popup.style.left = "10px"; // small margin from edge
    popup.style.right = "10px"; // keep centered if possible
  } else {
    // On larger screens → use your constrained width logic
    const width = Math.min(rect.width - 8, window.innerWidth * 0.95);
    popup.style.width = width - 28 + "px";
    popup.style.left = rect.left + window.scrollX + "px";
  }

  // Top position always follows the event
  popup.style.top = rect.bottom + window.scrollY + 6 + "px";
}

window.addEventListener("dateRangeChanged", (e) => {
  const { start, end } = e.detail;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const newDate = new Date(start);
  // filterEventsForRange(cal0Instance.events, newDate);
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

      // ✅ Toggle icon state
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
  // Detect red vs blue from title (user requested event title detection)
  const isRed = title.includes("red") || title.includes("shift-red");
  if (isRed) {
    return {
      html: `
       <div class="events-red">
         <div class="left-event">
           FT-North Sydney Cl...
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
  return {
    html: `
    <div class="events-blue">
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
  const popup = document.getElementById("event-popup");
  let activeEvent = null; // track which event the popup belongs to

  // Handle click on dots
  document.addEventListener("click", function (e) {
    const dot = e.target.closest(".events-blue .dots, .events-red .dots");

    if (dot) {
      e.stopPropagation();
      console.log("dots clicked");

      const eventBox = dot.closest(".events-blue, .events-red");
      if (!eventBox) return;

      activeEvent = eventBox; // remember which event opened the popup

      const rect = eventBox.getBoundingClientRect();
      const popupPadding = 4;

      popup.style.display = "block";
      popup.style.opacity = "1";
      popup.style.visibility = "visible";

      // same width as the event box
      popup.style.width = rect.width + "px";

      // position popup just below the event
      let left = rect.left + window.scrollX;
      let top = rect.bottom + window.scrollY + popupPadding;

      popup.style.left = left + "px";
      popup.style.top = top + "px";

      // keep inside viewport
      const vpWidth = document.documentElement.clientWidth;
      const vpHeight = document.documentElement.clientHeight;
      const popupRect = popup.getBoundingClientRect();

      if (popupRect.right > vpWidth - 8) {
        left -= popupRect.right - (vpWidth - 8);
        if (left < 8) left = 8;
        popup.style.left = left + "px";
      }

      if (popupRect.bottom > vpHeight - 8) {
        const aboveTop =
          rect.top + window.scrollY - popupRect.height - popupPadding;
        popup.style.top = Math.max(8, aboveTop) + "px";
      }

      return;
    }

    // don’t close if clicking inside popup
    if (e.target.closest("#event-popup")) return;

    // close if clicked outside
    popup.style.display = "none";
    activeEvent = null;
  });

  document.addEventListener("mouseover", function (e) {
    const eventBox = e.target.closest(".events-blue, .events-red");

    // ignore if hovering popup itself
    if (e.target.closest("#event-popup")) return;

    if (eventBox && popup.style.display === "block") {
      // only hide if hovering a different event
      if (activeEvent && eventBox !== activeEvent) {
        popup.style.display = "none";
        activeEvent = null;
      }
    }
  });
});

document.addEventListener("click", function () {
  const popup = document.getElementById("event-popup");
  popup.style.display = "none";
});

/* ---------- Sync utilities for 4 stacked calendars ---------- */

function syncAllCalendarsSetup() {
  // ids of calendar containers
  const calIds = ["cal0", "cal1", "cal2", "cal3"];

  // gather elements for each calendar
  const cals = calIds
    .map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      // try several likely selectors for the timeline scrollable area
      const scrollEl =
        el.querySelector(".ec-content") ||
        el.querySelector(".ec-timeline") ||
        el.querySelector(".ec-body") ||
        el.querySelector(".ec-scroll") ||
        el;
      const sidebar = el.querySelector(".ec-sidebar") || null;
      return { id, el, scrollEl, sidebar };
    })
    .filter(Boolean);

  if (cals.length < 2) return; // nothing to sync

  // 1) set a common sidebar width based on the widest sidebar
  function syncSidebarWidths() {
    let maxW = 0;
    cals.forEach((c) => {
      if (c.sidebar) {
        const w = c.sidebar.getBoundingClientRect().width;
        if (w > maxW) maxW = w;
      }
    });
    // apply a clamped width and store in CSS variable for fallback
    if (maxW === 0) maxW = 200;
    maxW = Math.min(Math.max(maxW, 160), 420); // clamp between 160 and 420px
    cals.forEach((c) => {
      if (c.sidebar) {
        c.sidebar.style.width = `${maxW}px`;
        c.sidebar.style.minWidth = `${maxW}px`;
        c.sidebar.style.maxWidth = `${maxW}px`;
      }
    });
    // also store as CSS var for rules that use it
    document.documentElement.style.setProperty(
      "--ec-sidebar-width",
      `${maxW}px`
    );
  }

  // 2) set slot width CSS var to match your slotWidth option (if you change slotWidth, update var)
  function syncSlotWidth(widthPx) {
    document.documentElement.style.setProperty(
      "--ec-slot-width",
      `${widthPx}px`
    );
  }

  // 3) Sync scroll (horizontal and vertical) without feedback loops
  let isSyncing = false;
  cals.forEach((source, idx) => {
    if (!source.scrollEl) return;
    source.scrollEl.addEventListener(
      "scroll",
      (e) => {
        if (isSyncing) return;
        isSyncing = true;
        const left = source.scrollEl.scrollLeft;
        const top = source.scrollEl.scrollTop;
        // apply to others
        cals.forEach((target, j) => {
          if (j === idx || !target.scrollEl) return;
          target.scrollEl.scrollLeft = left;
          target.scrollEl.scrollTop = top;
        });
        // small debounce to avoid chattiness
        window.requestAnimationFrame(() => {
          isSyncing = false;
        });
      },
      { passive: true }
    );

    // wheel sync: when user uses mouse wheel horizontally on one, move others
    source.scrollEl.addEventListener(
      "wheel",
      (ev) => {
        // only care horizontal wheel (shift+wheel or trackpad horizontal)
        if (
          Math.abs(ev.deltaX) < 1 &&
          Math.abs(ev.deltaY) > Math.abs(ev.deltaX)
        ) {
          // vertical wheel — sync vertical scroll of resource lists if present
          // map to other calendars resource row scroll (if sidebars have their own scroll)
          const top = source.scrollEl.scrollTop + ev.deltaY;
          cals.forEach((target) => {
            if (!target.scrollEl || target === source) return;
            target.scrollEl.scrollTop = top;
          });
        } else {
          // horizontal movement
          const left = source.scrollEl.scrollLeft + ev.deltaX;
          cals.forEach((target) => {
            if (!target.scrollEl || target === source) return;
            target.scrollEl.scrollLeft = left;
          });
        }
        // let default behavior continue
      },
      { passive: true }
    );
  });

  // 4) re-sync widths on resize / font load / collapse actions
  let resizeTimer;
  function handleResize() {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      syncSidebarWidths();
      // optionally re-set slot width if your slotWidth changes dynamically
      // syncSlotWidth(220);
    }, 120);
  }
  window.addEventListener("resize", handleResize);

  // 5) call once to initialize
  syncSidebarWidths();
  syncSlotWidth(220); /* keep this same as your slotWidth: 220 */
}

/* Call syncAllCalendarsSetup once after calendars are created.
   Place this call at the end of your loadShifts() (or directly after you instantiate all 4 calendar instances).
*/
syncAllCalendarsSetup();
