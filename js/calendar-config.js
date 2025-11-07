async function loadShifts() {
  const res = await fetch("./js/data/shifts.json");
  const data = await res.json();

  const today = new Date();
  const format = (date) => date.toISOString().split("T")[0];

  const events = data.events
    .map((ev) => {
      let date = new Date();
      if (ev.start.includes("DAY+")) {
        const days = parseInt(ev.start.replace("DAY+", ""));
        date.setDate(today.getDate() + days);
      }
      return {
        ...ev,
        start: ev.start === "TODAY" ? format(today) : format(date),
      };
    })
    .filter((ev) => {
      const resource = data.resources.find((r) => r.id === ev.resourceId);
      return !resource?.extendedProps?.isParent;
    });
  // const filteredResources = data.resources.filter(
  //   (r) => r.id !== ("CLINIC_MANAGER" || "AUDIOMETRIST" || "AUDIOLOGIST")
  // );
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
      <div style="height:60px; color: ${color}; display:flex; justify-content:space-between; align-items:center; padding:4px 4px; border-radius:4px; width:100%;">
        <div style="display:flex; flex-direction:column; align-items:flex-start;">
          <div style="font-size:18px; font-weight:600;">${d}</div>
          <div>${weekday}</div> 
        </div>
        <div style="display:flex; flex-direction:column; align-items:center;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" height="20" width="20">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
</svg>

          <div style="margin-top:2px;">9 Hrs</div>
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

  if (parent)
    return {
      html: `<div class="parent-resource"><div class="parent-title">${resource.title}</div>
      6 hrs <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" height="20" width="20">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
</svg> 2</div>`,
    };

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
        <span style="">${resource.title} </span>
          <div class="shift">${shift} Shift </div>
        </div>
      </div>
    `,
  };
}

function renderEventDetails(arg) {
  const event = arg.event;
  return {
    html: `
    <div class="events">
      <div>
        <div>
        ${"FT-Sydney CBD"} ${event.title}
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
