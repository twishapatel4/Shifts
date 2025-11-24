let calInstances = []; // store calendar instances (cal1, cal2, cal3...)
let calResources = {}; // store resources for each group
let calCollapsed = {}; // store collapse state of each calendar section
let activePopupEvent = null;

async function loadShifts() {
  const data = {
    resources: [
      {
        id: "CLENT_SERVICE",
        title: "Client Service Officer/Representative",
        extendedProps: { isParent: true, hours: 6 },
        children: [
          {
            id: 8,
            title: "Open Shift",
            extendedProps: { isOpen: true, shift: 2 },
          },
          {
            id: 1,
            title: "Sarah Brown",
            extendedProps: { shift: 2, imgUrl: "./Assets/images/Sarah.png" },
          },
          {
            id: 2,
            title: "Luke Harris",
            extendedProps: { shift: 2, imgUrl: "./Assets/images/Jack.png" },
          },
        ],
      },
      {
        id: "AUDIOMETRIST",
        title: "Audiometrist",
        extendedProps: { isParent: true, hours: 117 },
        children: [
          { id: 9, title: "Open Shift", extendedProps: { isOpen: true } },
          {
            id: 3,
            title: "Leo Martin",
            extendedProps: { shift: 2, imgUrl: "./Assets/images/Jack.png" },
          },
          {
            id: 4,
            title: "Ben Dravis",
            extendedProps: { shift: 2, imgUrl: "./Assets/images/Ethan.png" },
          },
          {
            id: 5,
            title: "Eli Walker",
            extendedProps: { shift: 2, imgUrl: "./Assets/images/Mia.png" },
          },
          {
            id: 6,
            title: "Claire David",
            extendedProps: { shift: 2, imgUrl: "./Assets/images/Liam.png" },
          },
        ],
      },
      {
        id: "AUDIOLOGIST",
        title: "Audiologist",
        extendedProps: { isParent: true, hours: 11 },
        children: [
          { id: 10, title: "Open Shift", extendedProps: { isOpen: true } },
          {
            id: 7,
            title: "James Wilson",
            extendedProps: { shift: 2, imgUrl: "./Assets/images/Ethan.png" },
          },
        ],
      },
      {
        id: "Extraa",
        title: "Extraa",
        extendedProps: { isParent: true, hours: 11 },
        children: [
          { id: 11, title: "Open Shift", extendedProps: { isOpen: true } },
          {
            id: 12,
            title: "James Wilson",
            extendedProps: { shift: 2, imgUrl: "./Assets/images/Ethan.png" },
          },
        ],
      },
    ],
    events: [
      {
        start: "11/24/2025",
        end: "11/24/2025",
        resourceId: 1,
        title: "shift-red",
      },
      {
        start: "11/23/2025",
        end: "11/23/2025",
        resourceId: 2,
        title: "shift-red",
      },
      {
        start: "11/23/2025",
        end: "11/23/2025",
        resourceId: 6,
        title: "shift-blue",
      },
      {
        start: "11/27/2025",
        end: "11/27/2025",
        resourceId: 4,
        title: "shift-red",
      },
      {
        start: "11/25/2025",
        end: "11/25/2025",
        resourceId: 7,
        title: "shift-blue",
      },
      {
        start: "10/25/2025",
        end: "10/25/2025",
        resourceId: 3,
        title: "shift-blue",
      },
      { start: "11/06/2025", resourceId: 6, title: "shift-red" },
      {
        start: "11/07/2025",
        end: "11/07/2025",
        resourceId: 5,
        title: "shift-blue",
      },
      {
        start: "11/15/2025",
        end: "11/15/2025",
        resourceId: 9,
        title: "shift-blue",
      },
      {
        start: "11/15/2025",
        end: "11/15/2025",
        resourceId: 1,
        title: "shift-blue",
      },
      {
        start: "11/28/2025",
        end: "11/28/2025",
        resourceId: 2,
        title: "shift-red",
      },
      {
        start: "11/14/2025",
        end: "11/14/2025",
        resourceId: 4,
        title: "shift-red",
      },
      {
        start: "11/29/2025",
        resourceId: 7,
        title: "shift-blue",
      },
      {
        start: "11/23/2025",
        resourceId: 11,
        title: "shift-blue",
      },
      {
        start: "11/09/2025",
        end: "11/09/2025",
        resourceId: 9,
        title: "shift-red",
      },
      {
        start: "11/26/2025",
        end: "11/26/2025",
        resourceId: 12,
        title: "shift-blue",
      },
      {
        start: "11/01/2025",
        end: "11/01/2025",
        resourceId: 1,
        title: "shift-blue",
      },
      {
        start: "11/16/2025",
        end: "11/16/2025",
        resourceId: 3,
        title: "shift-blue",
      },
      {
        start: "11/17/2025",
        end: "11/17/2025",
        resourceId: 2,
        title: "shift-blue",
      },
      {
        start: "11/18/2025",
        end: "11/18/2025",
        resourceId: 5,
        title: "shift-blue",
      },
      {
        start: "11/19/2025",
        end: "11/19/2025",
        resourceId: 6,
        title: "shift-red",
      },
      {
        start: "11/25/2025",
        end: "11/25/2025",
        resourceId: 9,
        title: "shift-red",
      },
      {
        start: "11/19/2025",
        end: "11/19/2025",
        resourceId: 1,
        title: "shift-blue",
      },
      {
        start: "11/20/2025",
        end: "11/20/2025",
        resourceId: 2,
        title: "shift-red",
      },
    ],
  };
  // -------------------------------
  //  DYNAMIC GROUPING
  // -------------------------------
  const groups = data.resources
    .filter((r) => r.extendedProps?.isParent) // detect parent groups
    .map((parent) => {
      const childIds = parent.children.map((c) => Number(c.id));
      return {
        id: parent.id,
        title: parent.title,
        hours: parent.extendedProps?.hours,
        resources: parent.children, // children only
        parentResource: parent,
        events: data.events.filter((e) =>
          childIds.includes(Number(e.resourceId))
        ),
      };
    });

  // Store resources in a flexible object
  groups.forEach((group, index) => {
    calResources[group.id] = group.resources;
    calCollapsed[group.id] = false;
  });

  // INITIALIZE CALENDARS DYNAMICALLY
  renderCalendars(groups);
}

function renderCalendars(groups) {
  const wrapper = document.getElementById("calendar-container");
  wrapper.innerHTML = ""; // clear previous calendars

  // ----------------------------------------------------
  // 1. Create CAL0 (header-only)
  // ----------------------------------------------------
  createCalendarContainer(0, wrapper);

  calInstances[0] = initCalendar(
    "cal0",
    [],
    [],
    true, // custom header ONLY for cal0
    { title: "Header", id: "header" }
  );

  // ----------------------------------------------------
  // 2. Create all calendars for the groups
  // ----------------------------------------------------
  groups.forEach((group, index) => {
    const calIndex = index + 1; // cal1, cal2, cal3...
    createCalendarContainer(calIndex, wrapper);
    calInstances[calIndex] = initCalendar(
      `cal${calIndex}`,
      group.resources,
      group.events,
      false, // no custom header for group calendars
      {
        title: group.title,
        id: group.id,
        hours: group.hours,
      }
    );
  });
}

// function getResourceFromId(id, data) {
//   for (const parent of data.resources) {
//     if (String(parent.id) === String(id)) return parent;

//     if (parent.children) {
//       for (const child of parent.children) {
//         if (String(child.id) === String(id)) return child;
//       }
//     }
//   }
//   return null;
// }
function createCalendarContainer(index, wrapper) {
  const div = document.createElement("div");
  div.id = `cal${index}`;
  div.className = "calendar-item";
  wrapper.appendChild(div);
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
        const emptyEvents = document.querySelectorAll(".empty-event");

        emptyEvents.forEach((cell) => {
          const rid = getResourceIdFromCell(cell);
          cell.dataset.resourceId = rid;
        });
      });
      // Add group header if provided
      if (!useCustomHeader && groupMeta) {
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

  function getResourceIdFromCell(cell) {
    // find the row (ec-days)
    const row = cell.closest(".ec-days");
    if (!row) return null;

    // find index of the row among all rows
    const rows = [
      ...document.querySelectorAll(".ec-main .ec-body .ec-content .ec-days"),
    ];
    const index = rows.indexOf(row);
    if (index === -1) return null;

    // match to resource at same index
    const resources = [
      ...document.querySelectorAll(".ec-sidebar .ec-resource"),
    ];

    const res = resources[index];
    if (!res) return null;

    // get the id from span
    const span = res.querySelector("span .resource-user");
    return span?.dataset.resourceId || null;
  }

  if (useCustomHeader) {
    calendarOptions.dayHeaderFormat = CustomHeader;
  }
  const calendarEl = document.getElementById(containerId);
  const calendar = EventCalendar.create(calendarEl, calendarOptions);
  return calendar;
}

document.getElementById("calPrev").addEventListener("click", () => {
  calInstances.forEach((cal) => cal?.prev());
});

document.getElementById("calNext").addEventListener("click", () => {
  calInstances.forEach((cal) => cal?.next());
});

window.addEventListener("dateRangeChanged", (e) => {
  const { start, end } = e.detail;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const newDate = new Date(start);
  calInstances.forEach((cal) => {
    if (cal) cal.setOption("date", newDate);
  });
});

function isIsoDate(str) {
  return typeof str === "string" && /^\d{4}-\d{2}-\d{2}/.test(str);
}

function ensureGroupHeader(calendarEl, groupMeta) {
  if (calendarEl.querySelector(".group-header")) return;

  const header = document.createElement("div");
  header.className = "group-header";

  // const parent = groupMeta.resources.find((r) => r.extendedProps?.isParent);
  const parent = groupMeta.parentResource;
  // const title = parent ? parent.title : "Group";
  const title = groupMeta.title;
  console.log(groupMeta);
  const hours = groupMeta.hours;

  header.innerHTML = `
    <div class="group-header-inner">
      <div class="left-header">
        <button type="button" class="group-collapse-btn">
          <svg class="icon-down" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"/>
          </svg>
          <svg class="icon-up" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m4.5 15.75 7.5-7.5 7.5 7.5"/>
          </svg>
        </button>

        <div class="group-title">${escapeHtml(title)}</div>
        <div>${escapeHtml(hours)} Hrs</div>

        <div class="users">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            height="20" width="20">
            <path stroke-linecap="round" stroke-linejoin="round"
               d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
        />
          </svg>
          <div>2</div>
        </div>
      </div>

      <div class="right-header">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          height="24" width="24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"/>
        </svg>
        <div>Add People</div>
      </div>
    </div>
  `;

  calendarEl.insertBefore(header, calendarEl.firstChild);

  // --------------------------------------------
  // DYNAMIC COLLAPSE BUTTON LOGIC (NO HARDCODE)
  // --------------------------------------------
  const btn = header.querySelector(".group-collapse-btn");
  const calId = calendarEl.id; // "cal0", "cal1", ...
  const index = Number(calId.replace("cal", "")); // convert to 0,1,2,...

  const groupId = groupMeta.id; // store collapse state by group id

  btn.addEventListener("click", () => {
    // Toggle collapse
    calCollapsed[groupId] = !calCollapsed[groupId];

    const instance = calInstances[index]; // the calendar instance
    const resourceStore = calResources[groupId]; // original children list

    const collapsed = calCollapsed[groupId];

    // Update resources
    const updatedResources = collapsed ? [] : flattenResources(resourceStore);
    instance.setOption("resources", updatedResources);

    // Toggle visual states
    if (collapsed) {
      calendarEl.classList.add("no-resources");
    } else {
      calendarEl.classList.remove("no-resources");
    }

    btn.classList.toggle("collapsed", collapsed);
  });
}

window.addEventListener("click", (e) => {
  const btn = e.target.closest(".cal-collapse-btn");
  if (!btn) return;

  const groupId = btn.dataset.groupId;
  const index = btn.dataset.calIndex;

  const instance = calInstances[index];
  const resourceStore = calResources[groupId];
  const collapsedState = calCollapsed[groupId];
  const calendarEl = document.getElementById(`cal${index}`);

  if (!instance) return;

  // Toggle collapse
  calCollapsed[groupId] = !collapsedState;

  applyCollapseState({
    collapsed: calCollapsed[groupId],
    instance,
    resourceStore,
    calendarEl,
    btn,
  });
});

function applyCollapseState({
  collapsed,
  instance,
  resourceStore,
  calendarEl,
  btn,
}) {
  const updated = collapsed ? [] : flattenResources(resourceStore);

  instance.setOption("resources", updated);

  // Toggle UI state
  if (collapsed) {
    calendarEl.classList.add("no-resources");
  } else {
    calendarEl.classList.remove("no-resources");
  }

  // Icon effect
  btn.classList.toggle("collapsed", collapsed);
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
  const id = resource.id;
  // We do not render parent as a calendar row; parents were removed from resources list.
  if (parent) return {};

  return {
    html: `
      <div class="resource-user" data-resource-id=${id}>
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

// kick off data load
loadShifts();

document.addEventListener("DOMContentLoaded", () => {
  const eventPopup = document.getElementById("event-popup");
  const resourcePopup = document.getElementById("resource-shift-popup");
  const emptyPopup = document.getElementById("empty-popup");
  const emptyOpenPopup = document.getElementById("empty-open-popup");

  let activeEvent = null;
  console.log(calResources);
  const openShiftResourceIds = [];

  Object.values(calResources).forEach((childrenArray) => {
    childrenArray.forEach((child) => {
      if (child.extendedProps?.isOpen === true) {
        openShiftResourceIds.push(child.id);
      }
    });
  });

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
      resId = eventBox.getAttribute("data-resource-id");
      if (!isEmptyCell) {
        resId = eventBox.getAttribute("data-resource-id");
      }
      eventPopup.style.display = "none";
      resourcePopup.style.display = "none";
      emptyPopup.style.display = "none";
      emptyOpenPopup.style.display = "none";

      let popupToShow;
      const isOpen = openShiftResourceIds.includes(Number(resId));

      if (isEmptyCell) {
        popupToShow = isOpen ? emptyOpenPopup : emptyPopup;
      } else {
        popupToShow = popupToShow = isOpen ? eventPopup : resourcePopup;
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
      e.target.closest("#empty-popup") ||
      e.target.closest("#empty-open-popup")
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
    emptyOpenPopup.style.display = "none";
  }
  window.addEventListener("scroll", disablePopup, true);
  window.addEventListener("resize", disablePopup);
  // HOVER HANDLING
  document.addEventListener("mouseover", function (e) {
    const eventBox = e.target.closest(
      ".events-blue, .events-red, .ec-empty-cell, .empty-event"
    );
    if (
      e.target.closest("#event-popup") ||
      e.target.closest("#resource-shift-popup") ||
      e.target.closest("#empty-popup") ||
      e.target.closest("#empty-open-popup")
    )
      return;

    const box = e.target.closest(
      ".events-blue, .events-red, .ec-empty-cell, .empty-event"
    );

    // If mouse moved onto a different box while popup is open → CLOSE them
    if (
      box &&
      activeEvent &&
      box !== activeEvent &&
      (eventPopup.style.display === "block" ||
        resourcePopup.style.display === "block" ||
        emptyPopup.style.display === "block" ||
        emptyOpenPopup.style.display === "block")
    ) {
      disablePopup();
      activeEvent = null;
      activePopupEvent = null;
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
  document.querySelectorAll("[id^='cal']").forEach((cal) => {
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
