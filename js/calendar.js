let cal1Instance; // store calendar instance
let cal1Resources; // store resources for cal1 toggle
let cal1Collapsed = false; // track collapsed state

async function loadShifts() {
  const res = await fetch("./js/data/shifts.json");
  const data = await res.json();

  // Split data into 3 groups
  const clinicManagerGroup = {
    resources: data.resources.filter((r) => r.id === "CLINIC_MANAGER"),
    events: data.events.filter(
      (e) =>
        e.resourceId === "CLINIC_MANAGER" || [1, 2, 8].includes(e.resourceId)
    ),
  };

  const audiometristGroup = {
    resources: data.resources.filter((r) => r.id === "AUDIOMETRIST"),
    events: data.events.filter(
      (e) =>
        e.resourceId === "AUDIOMETRIST" ||
        [3, 4, 5, 6, 9].includes(e.resourceId)
    ),
  };

  const audiologistGroup = {
    resources: data.resources.filter((r) => r.id === "AUDIOLOGIST"),
    events: data.events.filter(
      (e) => e.resourceId === "AUDIOLOGIST" || [7, 10].includes(e.resourceId)
    ),
  };

  // Store cal1 resources for toggling
  cal1Resources = clinicManagerGroup.resources;

  // Initialize calendars
  cal1Instance = initCalendar(
    "cal1",
    cal1Resources,
    clinicManagerGroup.events,
    true
  ); // custom header
  initCalendar("cal2", audiometristGroup.resources, audiometristGroup.events);
  initCalendar("cal3", audiologistGroup.resources, audiologistGroup.events);
}

function initCalendar(containerId, resources, events, useCustomHeader = false) {
  const today = new Date();
  const format = (date) => date.toISOString().split("T")[0];

  const formattedEvents = events.map((ev) => {
    let dateStart = new Date();
    let dateEnd = null;

    if (ev.start === "SUN") {
      const dayOfWeek = today.getDay();
      dateStart.setDate(today.getDate() - dayOfWeek);
    } else if (ev.start === "TODAY") {
      dateStart = new Date();
    } else if (ev.start && ev.start.startsWith("DAY+")) {
      const days = parseInt(ev.start.replace("DAY+", ""));
      dateStart.setDate(today.getDate() + days);
    }

    if (ev.end === "SUN+1W") {
      const dayOfWeek = today.getDay();
      dateEnd = new Date(today);
      dateEnd.setDate(today.getDate() - dayOfWeek + 7);
    }

    return {
      ...ev,
      start: format(dateStart),
      end: dateEnd ? format(dateEnd) : ev.end,
    };
  });

  const calendarOptions = {
    view: "resourceTimelineWeek",
    initialDate: new Date(),
    slotDuration: { days: 1 },
    headerToolbar: false,
    editable: false,
    droppable: false,
    draggable: false,
    eventResourceEditable: false, // prevent dragging to other resources
    slotWidth: 220,
    resources,
    events: formattedEvents,
    resourceLabelContent: renderResources,
    eventContent: renderEventDetails,
    viewDidMount() {
      const calendarEl = document.getElementById(containerId);

      // Sidebar custom title
      const titleEl = calendarEl.querySelector(".ec-sidebar-title");
      if (
        titleEl &&
        useCustomHeader &&
        !titleEl.querySelector(".custom-sidebar-div")
      ) {
        const customDiv = document.createElement("div");
        customDiv.className = "custom-sidebar-div";
        customDiv.innerHTML = `
          <div class="sidebar-title">
            <div class="sidebar-title-main">November 2025</div>
            <div class="sidebar-title-sub">Day 0 HRS</div>
          </div>
        `;
        titleEl.appendChild(customDiv);
      }

      // Hide default day headers if not using custom header
      if (!useCustomHeader) {
        const dayHeaders = calendarEl.querySelectorAll(".ec-header");
        dayHeaders.forEach((dh) => (dh.style.display = "none"));
      }

      // Hide day cells for parent resources
      const parentRows = calendarEl.querySelectorAll(".ec-resource-row");
      parentRows.forEach((row) => {
        const resourceId = row.dataset.resourceId;
        const resource = resources.find((r) => r.id == resourceId);
        if (resource?.extendedProps?.isParent) {
          const dayCells = row.querySelectorAll(".ec-content");
          dayCells.forEach((cell) => (cell.style.display = "none"));
        }
      });
    },
  };

  if (useCustomHeader) {
    calendarOptions.dayHeaderFormat = CustomHeader;
  }

  return EventCalendar.create(
    document.getElementById(containerId),
    calendarOptions
  );
}

// Toggle children visibility
document.getElementById("cal1-toggle").addEventListener("click", () => {
  if (!cal1Instance || !cal1Resources) return;

  cal1Collapsed = !cal1Collapsed;

  const updatedResources = cal1Resources.map((r) => {
    if (r.extendedProps?.isParent && r.children) {
      return {
        ...r,
        children: cal1Collapsed ? [] : r.children,
      };
    }
    return r;
  });

  cal1Instance.setOption("resources", updatedResources);
});

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

  if (parent) return {}; // parent: only sidebar, no day cells

  return {
    html: `
      <div class="resource-user">
        ${
          img
            ? `<img src="${img}" style="border-radius:50%;" />`
            : open
            ? `<div style="width:40px; height:40px; border-radius:50%; background-color:#d9d9d9; display:flex; align-items:center; justify-content:center; font-weight:600; color:#fff; font-size:14px;">${"."}</div>`
            : ""
        }
        <div class="title-shift">
          <span class="resource-name">${resource.title}</span>
          <div class="shift">${shift} Shift</div>
        </div>
      </div>
    `,
  };
}

function renderEventDetails(arg) {
  const event = arg.event;
  if (event.title === "shift-red") {
    return {
      html: `
       <div class="events-red">
         <div>
           FT-North Sydney Cl...
           <div class="icons">
             <img src="./Assets/icons/CupRed.svg" height="20" width="20" />
             <img src="./Assets/icons/TimeRed.svg" height="20" width="20" />
           </div>
         </div>
         <div>X3</div>
       </div>
      `,
    };
  }

  return {
    html: `
    <div class="events-blue">
      <div>
        <div>FT-Sydney CBD</div>
        <div class="icons">
          <img src="./Assets/icons/Cup.svg" height="20" width="20" />
          <img src="./Assets/icons/Time.svg" height="20" width="20" />
        </div>
      </div>
      <div>X3</div>
    </div>
    `,
  };
}

loadShifts();
