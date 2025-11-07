async function loadShifts() {
  const res = await fetch("./js/data/shifts.json");
  const data = await res.json();

  const today = new Date();
  const format = (date) => date.toISOString().split("T")[0];

  const events = data.events.map((ev) => {
    let dateStart = new Date();
    let dateEnd = null;

    // Handle start date
    if (ev.start === "SUN") {
      const dayOfWeek = today.getDay(); // 0 = Sunday
      dateStart.setDate(today.getDate() - dayOfWeek);
    } else if (ev.start === "TODAY") {
      dateStart = new Date();
    } else if (ev.start.startsWith("DAY+")) {
      const days = parseInt(ev.start.replace("DAY+", ""));
      dateStart.setDate(today.getDate() + days);
    }

    // Handle end date
    if (ev.end === "SUN+1W") {
      const dayOfWeek = today.getDay();
      dateEnd = new Date(today);
      dateEnd.setDate(today.getDate() - dayOfWeek + 70);
    }

    return {
      ...ev,
      start: format(dateStart),
      end: dateEnd ? format(dateEnd) : ev.end,
    };
  });

  initCalendar(data.resources, events);
}

function initCalendar(resources, events) {
  const calendar = EventCalendar.create(document.getElementById("calendar"), {
    view: "resourceTimelineWeek",
    initialDate: new Date(),
    slotDuration: { days: 1 },
    headerToolbar: false,
    editable: false,
    droppable: false,
    draggable: false,
    eventResourceEditable: false,
    slotWidth: 220,
    resources,
    events,
    eventContent: renderEventDetails,
    dayHeaderFormat: CustomHeader,
    resourceLabelContent: renderResources,
  });

  document
    .getElementById("calPrev")
    .addEventListener("click", () => calendar.prev());
  document
    .getElementById("calNext")
    .addEventListener("click", () => calendar.next());
}

function CustomHeader(date) {
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue
  const d = String(date.getDate()).padStart(2, "0"); // 04
  const color = "#605E5C";

  return {
    html: `
<div
  style="height:60px; color: ${color}; display:flex; justify-content:space-between; align-items:center; padding:1px 12px; border-radius:4px; width:100%;"
>
  <div style="display: flex; flex-direction: column; align-items: flex-start;">
    <div style="font-size: 18px; font-weight: 600">${d}</div>
    <div>${weekday}</div>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center; margin-right:20px;">
    <div style="display:flex; align-items:center; gap:4px;"><svg
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
    </svg> 3
    </div>
    <div style="margin-top: 4px;">9 Hrs</div>
  </div>
</div>

    `,
  };
}

function renderResources(arg) {
  const resource = arg.resource || arg;
  const img = resource.image || resource.extendedProps?.imgUrl;
  const shift = resource.extendedProps?.shift || 0;
  const open = resource.extendedProps?.isOpen;
  const parent = resource.extendedProps?.isParent;
  const hours = resource.extendedProps?.hours;
  if (parent) {
    // console.log("Parent");
    return {
      html: `        
          <div class="parent-resource">
          <div style="display:flex;justify-content:space-between; align-items:center; gap:4px;">
            <div style="font-size:22px;">${resource.title}</div>
            <div>${hours} hrs</div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" height="16" width="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"/>
            </svg>
          </div>
        </div>`,
    };
  }
  return {
    html: `
      <div class="resource-user" >
        ${
          img
            ? `<img src="${img}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;" />`
            : open
            ? `<div style="width:40px; height:40px; border-radius:50%; background-color:#d9d9d9; display:flex; align-items:center; justify-content:center; font-weight:600; color:#fff; font-size:14px;">${"."}</div>`
            : ""
        }
        <div class="title-shift">
        <span class="resource-name">${resource.title} </span>
          <div class="shift">${shift} Shift </div>
        </div>
      </div>
    `,
  };
}

function renderEventDetails(arg) {
  const event = arg.event;
  console.log(event);

  if (event.title === "shift-full") {
    console.log("parent");
    return {
      html: `
        <div class="parent-event" style="
          width:100%; 
          height:60px; 
          background-color:#f3f2f1; 
          color:#72706F; 
          display:flex; 
          align-items:center; 
          justify-content:right;
          margin:0px;
          font-weight:400;
          font-size:18px;
          padding:0px;
          gap:2px;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" height="24" width="24">
  <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
</svg>${"Add People"}

        </div>
      `,
    };
  }
  if (event.title === "shift-red") {
    return {
      html: `
       <div class="events-red">
       <div>
          ${"FT-North Sydney Cl..."}
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
        <div>
        ${"FT-Sydney CBD"} 
        </div>
        <div class="icons">
        <img src="./Assets/icons/Cup.svg" height="20" width="20" />
        <img src="./Assets/icons/Time.svg" height="20" width="20" />
        </div>
      </div>
      <div>
          X3
      </div>
    </div>
    `,
  };
}

loadShifts();
