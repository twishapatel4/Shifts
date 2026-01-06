let calInstances = []; // store calendar instances (cal1, cal2, cal3...)
let calResources = {}; // store resources for each group
let calCollapsed = {}; // store collapse state of each calendar section
const calendarMap = {};
let activePopupEvent = null;

async function loadShifts() {
  const data = {
    resources: [
      {
        categoryId: "ff2014946-babb-f011-bbd3-00224814b93c",
        title: "Client Service Officer/Representative",
        extendedProps: { isParent: true, hours: 6 },
        children: [
          {
            resourceId: "OpenShift",
            title: "Open Shift",
            extendedProps: { isOpen: true, shift: 2 },
          },
          {
            resourceId: "ResourceGUID",
            title: "Sarah Brown",
            extendedProps: { shift: 2, imgUrl: "Base64String" },
          },
          {
            resourceId: "ResourceGUID2",
            title: "Leo Martin",
            extendedProps: { shift: 2, imgUrl: "Base64String" },
          },
        ],
      },
      {
        categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
        title: "Audiometrist",
        extendedProps: { isParent: true, hours: 6 },
        children: [
          {
            resourceId: "OpenShift",
            title: "Open Shift",
            extendedProps: { isOpen: true, shift: 2 },
          },
          {
            resourceId: "ResourceGUID",
            title: "Sarah Brown",
            extendedProps: { shift: 2, imgUrl: "Base64String" },
          },
          {
            resourceId: "ResourceGUID2",
            title: "Leo Martin",
            extendedProps: { shift: 2, imgUrl: "Base64String" },
          },
        ],
      },
    ],
    events: [
      {
        start: "01/05/2026",
        end: "01/08/2026",
        resourceId: "ResourceGUID",
        title: "Sarah 2",
        backgroundColor: "#D1E3F5",
        extendedProps: {
          categoryId: "ff2014946-babb-f011-bbd3-00224814b93c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
          x: 6,
        },
      },
      {
        start: "01/06/2026",
        end: "01/09/2026",
        resourceId: "ResourceGUID2",
        title: "Sarah 2",
        backgroundColor: "#D1E3F5",
        extendedProps: {
          categoryId: "ff2014946-babb-f011-bbd3-00224814b93c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
          x: 6,
        },
      },
      {
        start: "01/09/2026",
        end: "01/09/2026",
        resourceId: "ResourceGUID2",
        title: "FT-Sydney CBD",
        backgroundColor: "#D1E3F5",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
          x: 6,
        },
      },
      {
        start: "01/08/2026",
        end: "01/10/2026",
        resourceId: "ResourceGUID",
        title: "FT-Sydney CBD",
        backgroundColor: "#D1E3F5",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
          x: 6,
        },
      },
      {
        start: "01/05/2026",
        end: "01/10/2026",
        resourceId: "OpenShift",
        title: "FT-Sydney CBD",
        backgroundColor: "#D1E3F5",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
          x: 6,
        },
      },
      {
        start: "01/04/2026",
        end: "01/05/2026",
        resourceId: "ResourceGUID2",
        title: "Leo Shift",
        backgroundColor: "#f9dada",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
      },
      {
        start: "12/18/2025",
        end: "12/18/2025",
        resourceId: "ResourceGUID2",
        title: "Leo Shift 2",
        backgroundColor: "#f9dada",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
      },
      {
        start: "12/19/2025",
        end: "12/19/2025",
        resourceId: "OpenShift",
        title: "North Clan",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
        backgroundColor: "#E6E4F6",
      },
      {
        start: "12/19/2025",
        end: "12/19/2025",
        resourceId: "OpenShift",
        title: "North Clan-Sarah",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
        backgroundColor: "#E6E4F6",
      },
      {
        start: "12/19/2025",
        end: "12/19/2025",
        resourceId: "OpenShift",
        title: "North Clan-Sarah",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
        backgroundColor: "#E6E4F6",
      },
      {
        start: "12/19/2025",
        end: "12/19/2025",
        resourceId: "OpenShift",
        title: "North Clan-Sarah",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
        backgroundColor: "#E6E4F6",
      },
      {
        start: "12/19/2025",
        end: "12/19/2025",
        resourceId: "OpenShift",
        title: "North Clan-Sarah",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
        backgroundColor: "#E6E4F6",
      },
      {
        start: "12/19/2025",
        end: "12/19/2025",
        resourceId: "OpenShift",
        title: "North Clan-Sarah",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
        backgroundColor: "#E6E4F6",
      },
      {
        start: "12/19/2025",
        end: "12/19/2025",
        resourceId: "OpenShift",
        title: "North Clan-Sarah",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
        backgroundColor: "#E6E4F6",
      },
      {
        start: "12/18/2025",
        end: "12/18/2025",
        resourceId: "OpenShift",
        title: "North Clan",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
        backgroundColor: "#DFF1E3",
      },
      {
        start: "12/16/2025",
        end: "12/16/2025",
        resourceId: "OpenShift",
        title: "North Clan",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
        backgroundColor: "#E3F0F4",
      },
      {
        start: "12/15/2025",
        end: "12/15/2025",
        resourceId: "ResourceGUID",
        title: "North Clan",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
        backgroundColor: "#F2E5F0",
      },
      {
        start: "12/15/2025",
        end: "12/15/2025",
        resourceId: "ResourceGUID",
        title: "North Clan",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
        backgroundColor: "#F2E5F0",
      },
      {
        start: "12/15/2025",
        end: "12/15/2025",
        resourceId: "ResourceGUID",
        title: "North Clan",
        extendedProps: {
          categoryId: "f2014946-babb-f011-bbd3-00224814b94c",
          shiftAssignmentId: "ShiftAssignmentGUID",
          shiftId: "ShiftGUID",
        },
        backgroundColor: "#F2E5F0",
      },
    ],
  };
  function makeResourceKey(categoryId, resourceId) {
    return `${categoryId}_${resourceId}`;
  }

  const groups = data.resources
    .filter((r) => r.extendedProps?.isParent)
    .map((parent) => {
      const resources = parent.children.map((c) => {
        const id = makeResourceKey(parent.categoryId, c.resourceId);
        return {
          id,
          title: c.title,
          extendedProps: {
            ...c.extendedProps,
            resourceId: c.resourceId,
            categoryId: parent.categoryId,
          },
        };
      });

      // Collect resource keys for this group
      const childKeys = resources.map((r) => r.id);

      // Filter events that belong to this group only
      const events = data.events
        .map((e) => ({
          ...e,
          resourceIdWithCategory: makeResourceKey(
            e.extendedProps.categoryId,
            e.resourceId
          ),
        }))
        .filter((e) => childKeys.includes(e.resourceIdWithCategory))
        .map((e) => ({
          ...e,
          resourceId: e.resourceIdWithCategory,
        }));

      return {
        id: parent.categoryId,
        title: parent.title,
        hours: parent.extendedProps?.hours,
        resources,
        parentResource: parent,
        events,
      };
    });

  // Store resources in a flexible object
  groups.forEach((group) => {
    calResources[group.id] = group.resources;
    calCollapsed[group.id] = false;
  });

  // Then render dropdown and calendars
  renderCalendars(groups);
  renderCategoryDropdown(groups);
  initCategoryDropdown();
  handleSelection();
}
function ensureMultiDayLayer(resourceRow) {
  if (!resourceRow) return null;
  // Prefer attaching to the .ec-days area so left offsets align with day cells
  const daysContainer = resourceRow.querySelector(".ec-days");
  const host = daysContainer || resourceRow;

  if (getComputedStyle(host).position === "static") {
    host.style.position = "relative";
  }

  let layer = host.querySelector(".multi-day-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "multi-day-layer";
    layer.style.position = "absolute";
    layer.style.top = "0";
    layer.style.left = "0";
    layer.style.width = "100%";
    layer.style.height = "100%";
    layer.style.pointerEvents = "none";
    host.appendChild(layer);
  }
  return layer;
}

// function getSpanWidth(startDayEl, daysSpan) {
//   let width = 0;
//   let current = startDayEl;

//   for (let i = 0; i < daysSpan && current; i++) {
//     width += current.offsetWidth;
//     // current = current.nextElementSibling; // next ec-day
//     let next = current.nextElementSibling;
//     while (next && !next.classList.contains("ec-day")) {
//       next = next.nextElementSibling;
//     }
//     current = next;
//   }
//   // console.log(width);
//   return width;
// }

function renderMultiDayBars() {
  // Show events on every day they span (no single spanning continuation).
  // Clean any old continuation visuals and exit — per-day copies remain as rendered by the calendar.
  // remove any old continuation visuals
  // document
  //   .querySelectorAll(".ec-multiday-event, .ec-multiday-clone")
  //   .forEach((el) => el.remove());

  // For each multi-day event create per-day clones so the event appears on all days
  // document.querySelectorAll(".events-box[data-days-span]").forEach((box) => {
  //   const daysSpan = Number(box.dataset.daysSpan);
  //   const startStr = box.dataset.start;
  //   const endStr = box.dataset.end;
  //   const startDate = new Date(startStr);
  //   const endDate = endStr ? new Date(endStr) : new Date(startStr);
  //   // compute span from actual dates (end is exclusive in our normalization)
  //   const spanFromDates = Math.max(
  //     1,
  //     Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))
  //   );

  //   if (spanFromDates <= 1) return;

  //   if (spanFromDates !== daysSpan) {
  //     console.warn(
  //       "renderMultiDayBars: daysSpan mismatch, using spanFromDates",
  //       {
  //         startStr,
  //         daysSpan,
  //         spanFromDates,
  //       }
  //     );
  //   }

  //   const resourceId = box.dataset.resourceId;
  //   const key = `${resourceId}_${startStr}`;

  //   // find start day cell
  //   let day = box.closest(".ec-day");

  //   // compute how many visible day cells are available starting at `day`
  //   let availableDays = 0;
  //   let tmp = day;
  //   while (tmp) {
  //     availableDays++;
  //     let n = tmp.nextElementSibling;
  //     while (n && !n.classList.contains("ec-day")) n = n.nextElementSibling;
  //     tmp = n;
  //   }

  //   const spanToUse = Math.min(spanFromDates, availableDays);

  //   for (let i = 0; i < spanToUse && day; i++) {
  //     const eventsContainer = day.querySelector(".ec-events");
  //     if (eventsContainer) {
  //       // Skip adding clone on the first day if original exists
  //       const exists = eventsContainer.querySelector(
  //         `.events-box[data-start="${startStr}"][data-resource-id="${resourceId}"]`
  //       );
  //       if (i === 0 && exists) {
  //         // already rendered by the calendar
  //       } else if (!exists) {
  //         const clone = document.createElement("div");
  //         clone.className = "ec-event ec-multiday-clone";
  //         // Mark whether this clone is the first or last day of the span
  //         if (i === 0) clone.classList.add("ec-multiday-clone-first");
  //         if (i === spanToUse - 1)
  //           clone.classList.add("ec-multiday-clone-last");
  //         clone.dataset.multidayKey = key;
  //         clone.dataset.multidayDayIndex = i;
  //         clone.style.position = "absolute";
  //         clone.style.pointerEvents = "none";

  //         const inner = box.cloneNode(true);
  //         inner.style.width = "100%";
  //         // make clone visually transparent so the spanning bar shows through
  //         const innerBox = inner.querySelector(".events-box");
  //         if (innerBox) {
  //           innerBox.style.background = "transparent";
  //           innerBox.style.border = "none";
  //           innerBox.style.color = "transparent";
  //         }

  //         clone.appendChild(inner);

  //         eventsContainer.appendChild(clone);
  //       }
  //     }

  //     // move to next day cell
  //     let next = day.nextElementSibling;
  //     while (next && !next.classList.contains("ec-day"))
  //       next = next.nextElementSibling;
  //     day = next;
  //   }
  // });

  // Re-layout events
  // requestAnimationFrame(handleMultiple);

  const handled = new Set();

  document.querySelectorAll(".events-box[data-days-span]").forEach((box) => {
    const daysSpan = Number(box.dataset.daysSpan);
    const startStr = box.dataset.start;
    const endStr = box.dataset.end;
    const resourceId = box.dataset.resourceId;

    const startDate = new Date(startStr);
    let endDate = endStr ? new Date(endStr) : new Date(startStr);
    const msPerDay = 1000 * 60 * 60 * 24;
    const spanFromDates = Math.max(
      1,
      Math.round((endDate - startDate) / msPerDay)
    );

    if (spanFromDates !== daysSpan) {
      console.warn(
        "renderMultiDayBars: daysSpan mismatch, using spanFromDates",
        {
          startStr,
          resourceId,
          daysSpan,
          spanFromDates,
        }
      );
    }

    let daysToUse = spanFromDates;

    // console.log("renderMultiDayBars: found box", {
    //   title: box.textContent.trim().slice(0, 40),
    //   startStr,
    //   resourceId,
    //   daysSpan,
    //   daysToUse,
    // });

    if (daysToUse <= 1) {
      return; // only multi-day events
    }

    const key = `${resourceId}_${startStr}`;
    if (handled.has(key)) {
      // console.log("renderMultiDayBars: already handled", key);
      return;
    }
    handled.add(key);

    // Find the correct resource row (robustly)
    let resourceRow = box.closest(".ec-resource-row");
    if (!resourceRow) {
      const daysRow = box.closest(".ec-days");
      resourceRow = daysRow ? daysRow.closest(".ec-resource-row") : null;
    }

    // FALLBACK: try to find resource row by matching resource id on rows
    if (!resourceRow) {
      resourceRow = document.querySelector(
        `.ec-resource-row[data-resource-id="${resourceId}"]`
      );
    }

    // FALLBACK 2: match sidebar list and map by index to days rows
    if (!resourceRow) {
      const sidebarResources = Array.from(
        document.querySelectorAll(".ec-sidebar .ec-resource")
      );
      const idx = sidebarResources.findIndex((res) => {
        const span = res.querySelector(".resource-user");
        return span?.dataset?.resourceId === resourceId;
      });
      if (idx !== -1) {
        // Try mapping to the list of resource rows by index (reliable)
        let resourceRows = Array.from(
          document.querySelectorAll(
            ".ec-main .ec-body .ec-content .ec-resource-row"
          )
        );
        if (resourceRows[idx]) {
          resourceRow = resourceRows[idx];
        } else {
          // Try a more global selector if nested path didn't match
          resourceRows = Array.from(
            document.querySelectorAll(".ec-resource-row")
          );
          if (resourceRows[idx]) {
            resourceRow = resourceRows[idx];
            console.log(
              "renderMultiDayBars: found resourceRow by global resourceRows index",
              { resourceId, idx }
            );
          } else {
            // fallback: check daysRows mapping
            const daysRows = Array.from(
              document.querySelectorAll(
                ".ec-main .ec-body .ec-content .ec-days"
              )
            );
            const daysRow = daysRows[idx];
            if (daysRow) {
              // Use the daysRow directly as the host when closest('.ec-resource-row') fails
              resourceRow = daysRow; // daysRow acts as the row content area
              console.log(
                "renderMultiDayBars: mapped via daysRows (using daysRow as host)",
                { resourceId, idx, resourceRowFound: !!resourceRow }
              );
            }
          }
        }
      }
    }

    if (!resourceRow) {
      // Last-resort heuristic: find sidebar element and pick nearest resource-row by vertical position
      const sidebarEl = document.querySelector(
        `.ec-sidebar .resource-user[data-resource-id="${resourceId}"]`
      );
      if (sidebarEl) {
        const sidebarTop = sidebarEl.getBoundingClientRect().top;
        const allRows = Array.from(
          document.querySelectorAll(".ec-resource-row")
        );
        let best = null;
        let bestDist = Infinity;
        allRows.forEach((r) => {
          const t = r.getBoundingClientRect().top;
          const d = Math.abs(t - sidebarTop);
          if (d < bestDist) {
            bestDist = d;
            best = r;
          }
        });
        if (best && bestDist < 40) {
          resourceRow = best;
          console.log(
            "renderMultiDayBars: mapped by nearest resource-row via sidebar top",
            { resourceId, bestDist }
          );
        }
      }

      // Diagnostics: print sidebar resource ids and days rows to diagnose mapping
      const sidebarResources = Array.from(
        document.querySelectorAll(".ec-sidebar .ec-resource .resource-user")
      ).map((el) => el.dataset.resourceId);
      const daysRows = Array.from(
        document.querySelectorAll(".ec-main .ec-body .ec-content .ec-days")
      );
      const daysRowSamples = daysRows.map((r, idx) => ({
        idx,
        html: r.innerHTML.slice(0, 80),
      }));
      const resourceRows = Array.from(
        document.querySelectorAll(
          ".ec-main .ec-body .ec-content .ec-resource-row"
        )
      );
      const resourceRowSamples = resourceRows.map((r, idx) => ({
        idx,
        html: r.innerHTML.slice(0, 80),
      }));

      let ancestor = box.parentElement;
      const chain = [];
      for (let i = 0; i < 8 && ancestor; i++) {
        chain.push({ tag: ancestor.tagName, classes: ancestor.className });
        ancestor = ancestor.parentElement;
      }

      console.warn("renderMultiDayBars: no resourceRow for", {
        startStr,
        resourceId,
        sidebarResourceIds: sidebarResources,
        daysRowsCount: daysRows.length,
        daysRowSamples,
        ancestorChain: chain,
      });
      return;
    }

    const layer = ensureMultiDayLayer(resourceRow);
    if (!layer) {
      console.warn("renderMultiDayBars: no layer for", {
        startStr,
        resourceId,
      });
      return;
    }

    const startDayEl = box.closest(".ec-day");
    if (!startDayEl) {
      console.warn("renderMultiDayBars: no startDay for", {
        startStr,
        resourceId,
      });
      return;
    }

    // Get the calendar view's endDate by finding the last visible day cell
    // Clamp event span to not exceed the visible calendar range
    const daysRow = startDayEl.closest(".ec-days");
    if (daysRow) {
      const allDays = Array.from(daysRow.querySelectorAll(".ec-day"));
      if (allDays.length > 0) {
        const lastDay = allDays[allDays.length - 1];
        // Try multiple ways to get the date
        let lastDayDateStr = lastDay.getAttribute("data-date");
        if (!lastDayDateStr && lastDay.dataset) {
          lastDayDateStr = lastDay.dataset.date;
        }
        if (lastDayDateStr) {
          try {
            // Parse the date from data-date attribute (format: YYYY-MM-DD)
            const viewEndDate = new Date(lastDayDateStr + "T23:59:59");
            // Clamp event endDate to not exceed calendar view's endDate
            if (endDate > viewEndDate) {
              endDate = new Date(viewEndDate);
              // Recalculate daysToUse based on clamped endDate
              daysToUse = Math.max(
                1,
                Math.round((endDate - startDate) / msPerDay)
              );
            }
          } catch (e) {
            // If date parsing fails, fall back to using available day count
            console.warn(
              "renderMultiDayBars: failed to parse lastDayDateStr",
              lastDayDateStr
            );
          }
        }
      }
    }

    // Clamp to number of visible day cells available starting at startDayEl
    let available = 0;
    let tmp = startDayEl;
    while (tmp) {
      available++;
      let n = tmp.nextElementSibling;
      while (n && !n.classList.contains("ec-day")) n = n.nextElementSibling;
      tmp = n;
    }
    const clampedDays = Math.min(daysToUse, available);
    if (clampedDays !== daysToUse) {
      console.warn("renderMultiDayBars: clamped daysToUse to available cells", {
        startStr,
        resourceId,
        daysToUse,
        available,
        clampedDays,
      });
    }

    // Effective span: additionally ensure we don't exceed the daysSpan attribute or the spanFromDates
    const effectiveDays = Math.min(clampedDays, daysSpan, spanFromDates);

    // Diagnostic: compute per-day widths to validate totalWidth
    const dayWidths = [];
    let debugCur = startDayEl;
    // Include the width for each visible day in the effective span (start day + subsequent days)
    for (let i = 0; i < effectiveDays && debugCur; i++) {
      const r = debugCur.getBoundingClientRect();
      dayWidths.push(Math.round(r.width));
      let next = debugCur.nextElementSibling;
      while (next && !next.classList.contains("ec-day"))
        next = next.nextElementSibling;
      debugCur = next;
    }

    // use effectiveDays for measurement and bar width
    const daysForBar = effectiveDays;

    // Remove duplicate instances rendered in other day cells (keep only the one in the start day)
    const matches = document.querySelectorAll(
      `.events-box[data-start="${startStr}"][data-resource-id="${resourceId}"]`
    );

    let keptEvent = null;
    matches.forEach((m) => {
      const ev = m.closest(".ec-event");
      if (!ev) return;
      const day = m.closest(".ec-day");
      if (day === startDayEl && !keptEvent) {
        keptEvent = ev;
      } else {
        console.log(
          "renderMultiDayBars: removing duplicate event on non-start-day",
          {
            text: m.textContent.trim().slice(0, 30),
            dayDate: day?.dataset?.date || null,
            isClone: ev.classList.contains("ec-multiday-clone"),
          }
        );
        ev.remove();
      }
    });

    // Diagnostic: list instances after dedupe
    const afterMatches = document.querySelectorAll(
      `.events-box[data-start="${startStr}"][data-resource-id="${resourceId}"]`
    );
    const originalEvent = keptEvent || box.closest(".ec-event");
    if (!originalEvent) {
      console.warn("renderMultiDayBars: originalEvent not found", {
        startStr,
        resourceId,
      });
      return;
    }

    // Measure total width and left offset using bounding rects for pixel accuracy
    let totalWidth = 0;
    const layerRect = layer.getBoundingClientRect();
    const startRect = startDayEl.getBoundingClientRect();

    const leftPx = Math.max(0, startRect.left - layerRect.left);

    // Preferred method: find the last inclusive day cell that corresponds to the event end date
    const endDateLookup = endStr ? new Date(endStr) : new Date(startStr);
    const lastInclusive = new Date(endDateLookup);
    lastInclusive.setDate(lastInclusive.getDate() - 1);
    const lastDateStr = formatDateYYYYMMDD(lastInclusive);

    // Look up the last day cell within this row (resourceRow) first
    let lastDayEl = null;
    let finalWidth2 = 0;
    try {
      lastDayEl = resourceRow.querySelector(
        `.ec-day[data-date="${lastDateStr}"]`
      );
    } catch (e) {
      lastDayEl = null;
    }

    if (lastDayEl) {
      const lastRect = lastDayEl.getBoundingClientRect();
      const rightPx = Math.min(
        layerRect.width,
        Math.max(0, Math.round(lastRect.right - layerRect.left))
      );
      totalWidth = Math.max(0, rightPx - leftPx);
      finalWidth2 = Math.max(
        0,
        Math.min(totalWidth, Math.max(0, layerRect.width - leftPx))
      );
    } else {
      // Fallback: sum consecutive day widths starting from startDay for daysForBar
      let cur = startDayEl;
      for (let i = 0; i < daysForBar && cur; i++) {
        const r = cur.getBoundingClientRect();
        totalWidth += r.width;
        let next = cur.nextElementSibling;
        while (next && !next.classList.contains("ec-day"))
          next = next.nextElementSibling;
        cur = next;
      }
    }

    // Clone and position the continuation bar (visual only)
    const bar = originalEvent.cloneNode(true);
    bar.classList.add("ec-multiday-event", "continuation");

    // Tag by key to make append idempotent and prevent duplicates when this function runs multiple times
    bar.dataset.multidayKey = key;
    const prevBar = layer.querySelector(
      `.ec-multiday-event[data-multiday-key="${key}"]`
    );
    if (prevBar) prevBar.remove();

    // Use offsets relative to the layer
    const top = originalEvent.offsetTop;
    console.log(totalWidth);
    console.log(layerRect.width - leftPx);
    // Limit final width to remaining layer space and ensure non-negative
    const finalWidth = Math.max(
      0,
      Math.min(totalWidth, Math.max(0, layerRect.width - leftPx))
    );
    if (finalWidth <= 0) return; // nothing to render

    Object.assign(bar.style, {
      position: "absolute",
      top: `${top}px`,
      left: `${leftPx}px`,
      width: `${finalWidth}px`,
      height: `${originalEvent.offsetHeight}px`,
      pointerEvents: "none",
      boxSizing: "border-box",
    });

    // Ensure children scale
    const inner = bar.querySelector(".events-box");
    if (inner) {
      inner.style.width = `${finalWidth}px`;
    }
    layer.appendChild(bar);
    // Keep the original first-day event interactive and mark it
    originalEvent.classList.add("ec-multiday-first");
    // requestAnimationFrame(handleMultiple);
    // console.log("continuation appended", { startStr, resourceId });
  });
}

// function positionMultiDayEvents() {
//   const handled = new Map();

//   document.querySelectorAll(".ec-event").forEach((eventEl) => {
//     // Skip our visual continuation bars and per-day clone placeholders so later layout doesn't overwrite them
//     if (
//       eventEl.classList.contains("ec-multiday-event") ||
//       eventEl.classList.contains("ec-multiday-clone")
//     )
//       return;

//     const box = eventEl.querySelector(".events-box");
//     if (!box) return;

//     const startStr = box.dataset.start;
//     const daysSpan = Number(box.dataset.daysSpan);
//     const endStr = box.dataset.end;
//     const resourceId = box.dataset.resourceId;

//     const startDate = new Date(startStr);
//     const endDate = endStr ? new Date(endStr) : new Date(startStr);
//     const msPerDay = 1000 * 60 * 60 * 24;
//     const daysToUse = Math.max(1, Math.round((endDate - startDate) / msPerDay));

//     if (!startStr || daysToUse <= 1) return;

//     const key = `${resourceId}_${startStr}`;

//     // keep only first occurrence
//     if (handled.has(key)) {
//       // Diagnostic: list all candidate occurrences for this key before removal
//       const candidates = Array.from(
//         document.querySelectorAll(
//           `.events-box[data-start="${startStr}"][data-resource-id="${resourceId}"]`
//         )
//       ).map((m) => {
//         const ev = m.closest(".ec-event");
//         const day = m.closest(".ec-day");
//         return {
//           dayDate: day?.dataset?.date || null,
//           isClone: ev?.classList?.contains("ec-multiday-clone") || false,
//           classes: ev?.className || "",
//           text: m.textContent.trim().slice(0, 30),
//         };
//       });
//       eventEl.remove();
//       return;
//     }
//     handled.set(key, eventEl);

//     const startBox = document.querySelector(
//       `.events-box[data-start="${startStr}"][data-resource-id="${resourceId}"]`
//     );
//     if (!startBox) return;

//     const startDay = startBox.closest(".ec-day");

//     if (!startDay) return;
//     const spanWidth = getSpanWidth(startDay, daysToUse);
//     const container = startBox.closest(".ec-events");
//     const dayCell = startBox.closest(".ec-day");
//     if (!container || !dayCell) return;

//     const dayWidth = dayCell.offsetWidth;
//     if (!dayWidth) return;
//     container.appendChild(eventEl);

//     const prevWidth = eventEl.style.width || null;
//     eventEl.style.position = "absolute";
//     eventEl.style.left = "0";
//     eventEl.style.top = eventEl.offsetTop + "px";
//     eventEl.style.width = `${spanWidth}px`;

//     eventEl.classList.add("multi-day-event");
//   });
// }

// Helper: format Date as 'YYYY-MM-DD' to match data-date attributes
function formatDateYYYYMMDD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function adjustMultiDayEvents() {
  document.querySelectorAll(".ec-event").forEach((eventEl) => {
    // Skip spanning bars and clones
    if (
      eventEl.classList.contains("ec-multiday-event") ||
      eventEl.classList.contains("ec-multiday-clone")
    )
      return;

    const box = eventEl.querySelector(".events-box");
    if (!box) return;
    const startStr = box.dataset.start;
    const endStr = box.dataset.end;
    const startDate = new Date(startStr);
    const endDate = endStr ? new Date(endStr) : new Date(startStr);
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysToUse = Math.max(1, Math.round((endDate - startDate) / msPerDay));

    // Use the width of a single day cell (start day) instead of the full row
    const startDay = box.closest(".ec-day");
    console.log(startDay?.offsetWidth);
    const dayWidth = startDay?.offsetWidth || 100;
    const newWidth = `${daysToUse * dayWidth}px`;
    // const prevWidth = eventEl.style.width || null;
    // Set width of .ec-event to span N day columns
    eventEl.style.width = newWidth;
  });
}

const EVENT_OFFSET_REM = 4.2;
const EVENT_HEIGHT_REM = 3.8;
function handleMultiple() {
  document.querySelectorAll(".ec-days").forEach((row) => {
    let maxEventsInRow = 0;

    // 1️⃣ find max events count in this row (REAL events only)
    row.querySelectorAll(".ec-events").forEach((eventsContainer) => {
      const count = eventsContainer.querySelectorAll(
        ".ec-event:not(.ec-empty-cell):not(.ec-event-range)"
      ).length;
      maxEventsInRow = Math.max(maxEventsInRow, count);
    });
    // 2️⃣ calculate required height
    const totalHeightRem =
      (maxEventsInRow - 1) * EVENT_OFFSET_REM + EVENT_HEIGHT_REM + 0.4;

    // 3️⃣ LOCK ROW HEIGHT
    row.style.height = `${totalHeightRem}rem`;
    row.style.minHeight = `${totalHeightRem}rem`;
    row.style.maxHeight = `${totalHeightRem}rem`;
    row.querySelectorAll(".ec-events").forEach((eventsContainer) => {
      let events = eventsContainer.querySelectorAll(
        ".ec-event:not(.ec-empty-cell)"
      );
      // ✅ get already existing empty placeholders (DO NOT REMOVE THEM)
      const existingEmptyEvents = eventsContainer.querySelectorAll(
        ".ec-event.ec-empty-cell:not(.added-events)"
      );
      const extraOffset =
        events.length > 0 && events.length < maxEventsInRow ? 0.4 : 0;
      // 🎯 position real events
      events.forEach((event, index) => {
        // event.style.tranform = `translateX(${index * EVENT_OFFSET_REM}rem)`;
        event.style.top = `${index * EVENT_OFFSET_REM}rem`;
        event.style.height = `3.8rem`;
        // event.style.width = `100%`;
        requestAnimationFrame(() => {
          document.querySelectorAll(".ec-event").forEach((event) => {
            if (event.classList.contains("ec-event-range")) {
              // event.style.width = "200%";
              return;
            }
            event.style.width = "100%";
          });
        });
      });

      // 🎯 position existing empty events below real events
      existingEmptyEvents.forEach((empty, index) => {
        empty.style.tranform = `translateY(${
          (events.length + index) * EVENT_OFFSET_REM
        }rem)`;
        // `${
        //   (events.length + index) * EVENT_OFFSET_REM
        // }rem`;
        empty.style.width = `100%`;
      });

      // ➕ add empty slots ONLY if required
      const totalExisting = events.length + existingEmptyEvents.length;
      const missing = maxEventsInRow - totalExisting;

      for (let i = 0; i < missing; i++) {
        const empty = document.createElement("div");
        empty.className = "ec-event added-events ec-empty-cell";
        empty.style.position = "absolute";
        // const top =
        //   (events.length + existingEmptyEvents.length + i) * EVENT_OFFSET_REM +
        //   extraOffset;
        const slotIndex = events.length + existingEmptyEvents.length + i;
        const top = slotIndex * EVENT_OFFSET_REM + extraOffset;
        // empty.style.transform = `${top}rem`;
        empty.style.transform = `translateY(${top}rem)`;
        empty.style.height = `3.8rem`;
        // empty.style.width = `10%`;
        eventsContainer.appendChild(empty);
      }
    });
  });
}
function renderCategoryDropdown(groups) {
  const dropdown = document.getElementById("CategorydropdownContent");
  dropdown.innerHTML = ""; // clear old content

  // --- Select All ---
  dropdown.innerHTML += `
    <label>
      <input type="checkbox" class="select-all" />
      <span>Select All</span>
    </label>
  `;

  // --- Dynamic group titles ---
  groups.forEach((group) => {
    dropdown.innerHTML += `
      <label>
        <input type="checkbox" value="${group.title}" data-group-id="${group.id}" />
        <span>${group.title}</span>
      </label>
    `;
  });
}
document
  .querySelectorAll("[data-dropdown] .dropdown-content")
  .forEach((content) =>
    content.addEventListener("click", (e) => e.stopPropagation())
  );

function renderCalendars(groups) {
  const wrapper = document.getElementById("calendar-container");
  wrapper.innerHTML = ""; // clear previous calendars

  createCalendarContainer(0, wrapper);

  calInstances[0] = initCalendar(
    "cal0",
    [],
    [],
    true, // custom header ONLY for cal0
    { title: "Header", id: "header" }
  );

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
    calendarMap[group.title] = `cal${calIndex}`;
  });
}

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

function initCategoryDropdown() {
  const dropdown = document
    .querySelector("#CategorydropdownContent")
    .closest("[data-dropdown]");
  const selectAll = dropdown.querySelector(".select-all");
  const checkboxes = dropdown.querySelectorAll(
    "input[type='checkbox']:not(.select-all)"
  );

  // Mark all selected on load
  selectAll.checked = true;
  checkboxes.forEach((cb) => (cb.checked = true));

  // Select All logic
  selectAll.addEventListener("change", () => {
    checkboxes.forEach((cb) => (cb.checked = selectAll.checked));
    handleSelection();
  });

  // Individual checkbox logic
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      selectAll.checked = [...checkboxes].every((c) => c.checked);
      handleSelection();
    });
  });
}

// Selection in Category Dropdown
function handleSelection() {
  const categoryCheckboxes = document.querySelectorAll(
    "#CategorydropdownContent input[type='checkbox']:not(.select-all)"
  );

  const selectedTitles = [...categoryCheckboxes]
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);

  // Loop through calendarMap
  Object.entries(calendarMap).forEach(([title, calId]) => {
    const el = document.getElementById(calId);
    if (!el) return;

    el.style.display = selectedTitles.includes(title) ? "block" : "none";
  });

  // If nothing selected → show ALL calendars
  if (selectedTitles.length === 0) {
    Object.values(calendarMap).forEach((calId) => {
      const el = document.getElementById(calId);
      if (el) el.style.display = "block";
    });
  }
}

function initCalendar(
  containerId,
  resources,
  events,
  useCustomHeader = false,
  groupMeta = null
) {
  const calendarEvents = events.map(normalizeEvent);
  const allEvents = calendarEvents.map((ev) => {
    const parse = (str) => {
      const [mm, dd, yyyy] = str.split("/");
      return new Date(yyyy, mm - 1, dd);
    };

    // let start = parse(ev.start);
    // let end = ev.end ? parse(ev.end) : null;
    let start = ev.start;
    let end = ev.end;
    console.log(ev.daysSpan);
    let daysSpan = ev.daysSpan;
    // 🔑 ALWAYS make end exclusive
    // if (end) {
    //   end.setDate(end.getDate() + 1);
    // }

    // const fmt = (d) =>
    //   `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    //     d.getDate()
    //   ).padStart(2, "0")}`;
    // events.forEach((e) => {
    //   console.log(
    //     e.title,
    //     new Date(e.start),
    //     new Date(e.end)
    //     // new Date(e.end) - new Date(e.start)
    //   );
    // });
    // console.log(ev);
    return {
      ...ev,
      start: start,
      end: end ? end : undefined,
      allDay: end && new Date(end) > new Date(start),
      daysSpan,
    };
  });
  // console.log(allEvents);
  console.table(
    allEvents.map((e) => ({
      title: e.title,
      start: e.start,
      allDay: e.allDay,
      end: e.end,
      daysSpan: e.daysSpan,
    }))
  );
  function normalizeEvent(ev) {
    // const hasEnd = ev.end && new Date(ev.end) > new Date(ev.start);

    // return {
    //   ...ev,
    //   allDay: hasEnd, // 🔑 auto-detect multi-day
    // };
    let start = new Date(ev.start);
    let end = ev.end ? new Date(ev.end) : null;

    if (end && end > start) {
      // ✅ Make end exclusive: EventCalendar needs this
      end.setDate(end.getDate() + 1);
    }
    const span = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    // Debug: log computed span for each event
    // console.log("normalizeEvent:", {
    //     title: ev.title,
    //     start: start.toDateString(),
    //     end: end ? end.toDateString() : null,
    //     daysSpan: span,
    //   });
    return {
      ...ev,
      start,
      end: end || start,
      allDay: true, // treat as all-day for multi-day
      daysSpan: span,
      extendedProps: {
        ...ev.extendedProps,
        daysSpan: span, // ✅ propagate to extendedProps too
      },
    };
  }

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
    durationEditable: false,
    eventStartEditable: false,
    eventDurationEditable: false,
    eventResourceEditable: false,
    resources,
    events: allEvents,
    allDay: true,
    slotLabelInterval: { days: 1 },
    dayMaxEvents: true,
    resourceLabelContent: renderResources,
    eventContent: renderEventDetails,
    slotEventOverlap: true,
    // eventDidMount(info) {
    //   // wait for ALL events to mount
    //   requestAnimationFrame(async () => {
    //     await handleMultiple();
    //   });
    // },
    viewDidMount(info) {
      // quick debug - inspect resources and events passed to each calendar
      const calendarEl = document.getElementById(containerId);
      setTimeout(() => {
        document.querySelectorAll(".ec-events").forEach((cell) => {
          const hasEvent = cell.querySelector(
            ".ec-event:not(.ec-empty):not(.ec-empty-cell)"
          );
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
    eventDidMount: () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          renderMultiDayBars();
        });
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
      requestAnimationFrame(() => {
        renderMultiDayBars();
        handleMultiple();
        // adjustMultiDayEvents();
        // positionMultiDayEvents();
        // renderMultiDayBars();
      });
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

class CupIcon {
  constructor(color = "#ffffff", width = 20, height = 20) {
    this.color = color;
    this.width = width;
    this.height = height;
  }
  render() {
    return `<svg width=${this.width} height=${this.height} viewBox="0 0 16 15" fill=${this.color} xmlns="http://www.w3.org/2000/svg">
<path d="M4.33008 0.916981L4.2168 0.175585H4.2168L4.33008 0.916981ZM8.7269 0.916982L8.84017 0.175586L8.7269 0.916982ZM8.50036 14.0763L8.36926 13.3379L8.50036 14.0763ZM4.55662 14.0763L4.68771 13.3379L4.68771 13.3379L4.55662 14.0763ZM1.53667 11.4758L0.820027 11.6969L1.53667 11.4758ZM0.869626 4.20473L1.61456 4.2918L0.869626 4.20473ZM12.2418 4.67019L12.9867 4.58313L12.2418 4.67019ZM11.6585 11.0281L10.9418 10.8069V10.8069L11.6585 11.0281ZM0.896799 3.97225L0.151869 3.88518L0.896799 3.97225ZM3.75591 1.00471L3.86918 1.7461H3.86918L3.75591 1.00471ZM4.45606 14.0585L4.32497 14.7969H4.32497L4.45606 14.0585ZM11.5505 11.3779L12.2671 11.5991V11.5991L11.5505 11.3779ZM12.1792 4.13525L11.4343 4.22231L12.1792 4.13525ZM9.13927 0.979988L9.02599 1.72138L9.13927 0.979988ZM12.5811 10.3542V9.60424V10.3542ZM14.9357 7.34313L14.2023 7.50029L14.2023 7.5003L14.9357 7.34313ZM14.9439 7.38178L15.6773 7.22462V7.22461L14.9439 7.38178ZM14.9439 8.44012L14.2106 8.28296V8.28296L14.9439 8.44012ZM12.6205 5.46767V4.71766V5.46767ZM11.8498 10.3542L11.1239 10.1657L11.8498 10.3542ZM12.3141 5.46767L11.5657 5.51607L12.3141 5.46767ZM12.1792 4.13525L11.4343 4.22231L11.4968 4.75726L12.2418 4.67019L12.9867 4.58313L12.9242 4.04818L12.1792 4.13525ZM11.6585 11.0281L10.9418 10.8069L10.8339 11.1568L11.5505 11.3779L12.2671 11.5991L12.3751 11.2492L11.6585 11.0281ZM0.869626 4.20473L1.61456 4.2918L1.64173 4.05931L0.896799 3.97225L0.151869 3.88518L0.124697 4.11767L0.869626 4.20473ZM4.55662 14.0763L4.68771 13.3379L4.58716 13.32L4.45606 14.0585L4.32497 14.7969L4.42552 14.8148L4.55662 14.0763ZM3.75591 1.00471L3.86918 1.7461L4.44335 1.65838L4.33008 0.916981L4.2168 0.175585L3.64263 0.263311L3.75591 1.00471ZM8.7269 0.916982L8.61362 1.65838L9.02599 1.72138L9.13927 0.979988L9.25254 0.238591L8.84017 0.175586L8.7269 0.916982ZM4.33008 0.916981L4.44335 1.65838C5.82547 1.44721 7.23151 1.44721 8.61362 1.65838L8.7269 0.916982L8.84017 0.175586C7.3079 -0.0585284 5.74908 -0.0585286 4.2168 0.175585L4.33008 0.916981ZM8.50036 14.0763L8.36926 13.3379C7.15155 13.554 5.90543 13.554 4.68771 13.3379L4.55662 14.0763L4.42552 14.8148C5.81668 15.0617 7.2403 15.0617 8.63146 14.8148L8.50036 14.0763ZM1.53667 11.4758L2.25332 11.2546C1.55862 9.00372 1.34104 6.63202 1.61456 4.2918L0.869626 4.20473L0.124697 4.11767C-0.173033 6.66504 0.0638025 9.24671 0.820027 11.6969L1.53667 11.4758ZM0.896799 3.97225L1.64173 4.05931C1.78053 2.87171 2.6935 1.92573 3.86918 1.7461L3.75591 1.00471L3.64263 0.263311C1.7968 0.545331 0.368802 2.02911 0.151869 3.88518L0.896799 3.97225ZM1.53667 11.4758L0.820027 11.6969C1.31658 13.3058 2.66873 14.5029 4.32497 14.7969L4.45606 14.0585L4.58716 13.32C3.48591 13.1245 2.58462 12.328 2.25332 11.2546L1.53667 11.4758ZM11.5505 11.3779L10.8339 11.1568C10.484 12.2903 9.53226 13.1314 8.36926 13.3379L8.50036 14.0763L8.63146 14.8148C10.3494 14.5098 11.7521 13.2681 12.2671 11.5991L11.5505 11.3779ZM12.1792 4.13525L12.9242 4.04818C12.696 2.09584 11.1939 0.535214 9.25254 0.238591L9.13927 0.979988L9.02599 1.72138C10.2972 1.91562 11.2842 2.93844 11.4343 4.22231L12.1792 4.13525ZM12.5811 10.3542V9.60424H12.2144V10.3542V11.1042H12.5811V10.3542ZM14.9357 7.34313L14.2023 7.5003L14.2106 7.53895L14.9439 7.38178L15.6773 7.22461L15.669 7.18596L14.9357 7.34313ZM14.9439 7.38178L14.2106 7.53895C14.2631 7.78415 14.2631 8.03776 14.2106 8.28296L14.9439 8.44012L15.6773 8.59729C15.7742 8.14489 15.7742 7.67702 15.6773 7.22462L14.9439 7.38178ZM12.5811 10.3542V11.1042C14.0751 11.1042 15.3641 10.0584 15.6773 8.59729L14.9439 8.44012L14.2106 8.28296C14.0451 9.05507 13.3652 9.60424 12.5811 9.60424V10.3542ZM12.6205 5.46767V6.21767C13.3816 6.21767 14.0417 6.75072 14.2023 7.50029L14.9357 7.34313L15.669 7.18596C15.3607 5.74738 14.0916 4.71766 12.6205 4.71766V5.46767ZM11.8498 10.3542L11.1239 10.1657C11.0681 10.3806 11.0074 10.5943 10.9418 10.8069L11.6585 11.0281L12.3751 11.2492C12.4474 11.015 12.5143 10.7795 12.5758 10.5427L11.8498 10.3542ZM12.2144 10.3542V9.60424H11.8498V10.3542V11.1042H12.2144V10.3542ZM12.2418 4.67019L11.4968 4.75726C11.5263 5.00986 11.5493 5.26288 11.5657 5.51607L12.3141 5.46767L13.0625 5.41926C13.0445 5.14027 13.0192 4.86146 12.9867 4.58313L12.2418 4.67019ZM12.3141 5.46767L11.5657 5.51607C11.6668 7.07946 11.5177 8.64926 11.1239 10.1657L11.8498 10.3542L12.5758 10.5427C13.0097 8.87168 13.174 7.14192 13.0625 5.41926L12.3141 5.46767ZM12.6205 5.46767V4.71766H12.3141V5.46767V6.21767H12.6205V5.46767Z" fill=${this.color}/>
<path d="M3.375 7.125V7.69795C3.375 8.80083 3.63178 9.88856 4.125 10.875" stroke=${this.color} stroke-width="3" stroke-linecap="round"/>
</svg>`;
  }
}

class ClockIcon {
  constructor(color = "", width = 20, height = 20) {
    this.color = color;
    this.width = width;
    this.height = height;
  }
  render() {
    return `<svg width=${this.width} height=${this.height} viewBox="0 0 15 15" fill=${this.color} xmlns="http://www.w3.org/2000/svg">
<path d="M15 7.5C15 7.66576 14.9342 7.82473 14.8169 7.94194C14.6997 8.05915 14.5408 8.125 14.375 8.125C14.2092 8.125 14.0503 8.05915 13.9331 7.94194C13.8158 7.82473 13.75 7.66576 13.75 7.5C13.7482 5.84296 13.0891 4.2543 11.9174 3.08259C10.7457 1.91088 9.15704 1.25182 7.5 1.25C7.33424 1.25 7.17527 1.18415 7.05806 1.06694C6.94085 0.949732 6.875 0.79076 6.875 0.625C6.875 0.45924 6.94085 0.300269 7.05806 0.183058C7.17527 0.065848 7.33424 0 7.5 0C9.48846 0.00215068 11.3949 0.793018 12.8009 2.19907C14.207 3.60513 14.9978 5.51154 15 7.5ZM10 8.125C10.1658 8.125 10.3247 8.05915 10.4419 7.94194C10.5592 7.82473 10.625 7.66576 10.625 7.5C10.625 7.33424 10.5592 7.17527 10.4419 7.05806C10.3247 6.94085 10.1658 6.875 10 6.875H8.57687C8.46795 6.68777 8.31223 6.53205 8.125 6.42313V4.375C8.125 4.20924 8.05915 4.05027 7.94194 3.93306C7.82473 3.81585 7.66576 3.75 7.5 3.75C7.33424 3.75 7.17527 3.81585 7.05806 3.93306C6.94085 4.05027 6.875 4.20924 6.875 4.375V6.42313C6.70923 6.51857 6.56766 6.6509 6.46125 6.80985C6.35484 6.9688 6.28645 7.15012 6.26137 7.33975C6.23629 7.52938 6.2552 7.72224 6.31664 7.90339C6.37807 8.08453 6.48037 8.24911 6.61563 8.38437C6.75089 8.51963 6.91547 8.62193 7.09661 8.68336C7.27776 8.7448 7.47062 8.76371 7.66025 8.73863C7.84988 8.71355 8.0312 8.64516 8.19015 8.53875C8.3491 8.43234 8.48143 8.29077 8.57687 8.125H10ZM1.14188 4.24C1.01826 4.24 0.897425 4.27666 0.794644 4.34533C0.691863 4.41401 0.611755 4.51162 0.564451 4.62582C0.517146 4.74003 0.504769 4.86569 0.528884 4.98693C0.553 5.10817 0.612526 5.21953 0.699934 5.30694C0.787341 5.39435 0.898706 5.45387 1.01994 5.47799C1.14118 5.50211 1.26685 5.48973 1.38105 5.44242C1.49526 5.39512 1.59287 5.31501 1.66154 5.21223C1.73022 5.10945 1.76688 4.98861 1.76688 4.865C1.76688 4.69924 1.70103 4.54027 1.58382 4.42306C1.46661 4.30585 1.30764 4.24 1.14188 4.24ZM1.25 7.5C1.25 7.37639 1.21334 7.25555 1.14467 7.15277C1.07599 7.04999 0.978381 6.96988 0.864177 6.92257C0.749974 6.87527 0.624307 6.86289 0.503069 6.88701C0.381831 6.91112 0.270466 6.97065 0.183059 7.05806C0.0956507 7.14547 0.0361252 7.25683 0.0120095 7.37807C-0.0121063 7.49931 0.000270801 7.62497 0.0475756 7.73918C0.0948803 7.85338 0.174988 7.95099 0.277769 8.01967C0.38055 8.08834 0.501387 8.125 0.625 8.125C0.790761 8.125 0.949732 8.05915 1.06694 7.94194C1.18415 7.82473 1.25 7.66576 1.25 7.5ZM7.5 13.75C7.37639 13.75 7.25555 13.7867 7.15277 13.8553C7.04999 13.924 6.96988 14.0216 6.92257 14.1358C6.87527 14.25 6.86289 14.3757 6.88701 14.4969C6.91112 14.6182 6.97065 14.7295 7.05806 14.8169C7.14547 14.9044 7.25683 14.9639 7.37807 14.988C7.49931 15.0121 7.62497 14.9997 7.73918 14.9524C7.85338 14.9051 7.95099 14.825 8.01967 14.7222C8.08834 14.6195 8.125 14.4986 8.125 14.375C8.125 14.2092 8.05915 14.0503 7.94194 13.9331C7.82473 13.8158 7.66576 13.75 7.5 13.75ZM2.63813 2.00437C2.51451 2.00437 2.39367 2.04103 2.29089 2.10971C2.18811 2.17838 2.10801 2.27599 2.0607 2.3902C2.0134 2.5044 2.00102 2.63007 2.02513 2.75131C2.04925 2.87254 2.10878 2.98391 2.19618 3.07132C2.28359 3.15872 2.39496 3.21825 2.51619 3.24237C2.63743 3.26648 2.7631 3.2541 2.8773 3.2068C2.99151 3.15949 3.08912 3.07939 3.15779 2.97661C3.22647 2.87383 3.26313 2.75299 3.26313 2.62937C3.26313 2.46361 3.19728 2.30464 3.08007 2.18743C2.96286 2.07022 2.80389 2.00437 2.63813 2.00437ZM4.86188 0.525625C4.73826 0.525625 4.61742 0.562281 4.51464 0.630957C4.41186 0.699632 4.33176 0.797244 4.28445 0.911448C4.23715 1.02565 4.22477 1.15132 4.24888 1.27256C4.273 1.39379 4.33253 1.50516 4.41993 1.59257C4.50734 1.67997 4.61871 1.7395 4.73994 1.76362C4.86118 1.78773 4.98685 1.77535 5.10105 1.72805C5.21526 1.68074 5.31287 1.60064 5.38154 1.49786C5.45022 1.39508 5.48688 1.27424 5.48688 1.15062C5.48688 0.984865 5.42103 0.825894 5.30382 0.708683C5.18661 0.591473 5.02764 0.525625 4.86188 0.525625ZM1.14188 9.51C1.01826 9.51 0.897425 9.54666 0.794644 9.61533C0.691863 9.68401 0.611755 9.78162 0.564451 9.89582C0.517146 10.01 0.504769 10.1357 0.528884 10.2569C0.553 10.3782 0.612526 10.4895 0.699934 10.5769C0.787341 10.6643 0.898706 10.7239 1.01994 10.748C1.14118 10.7721 1.26685 10.7597 1.38105 10.7124C1.49526 10.6651 1.59287 10.585 1.66154 10.4822C1.73022 10.3795 1.76688 10.2586 1.76688 10.135C1.76688 9.96924 1.70103 9.81027 1.58382 9.69306C1.46661 9.57585 1.30764 9.51 1.14188 9.51ZM2.63813 11.7456C2.51451 11.7456 2.39367 11.7823 2.29089 11.851C2.18811 11.9196 2.10801 12.0172 2.0607 12.1314C2.0134 12.2457 2.00102 12.3713 2.02513 12.4926C2.04925 12.6138 2.10878 12.7252 2.19618 12.8126C2.28359 12.9 2.39496 12.9595 2.51619 12.9836C2.63743 13.0077 2.7631 12.9954 2.8773 12.948C2.99151 12.9007 3.08912 12.8206 3.15779 12.7179C3.22647 12.6151 3.26313 12.4942 3.26313 12.3706C3.26313 12.2049 3.19728 12.0459 3.08007 11.9287C2.96286 11.8115 2.80389 11.7456 2.63813 11.7456ZM4.86188 13.2244C4.73826 13.2244 4.61742 13.261 4.51464 13.3297C4.41186 13.3984 4.33176 13.496 4.28445 13.6102C4.23715 13.7244 4.22477 13.8501 4.24888 13.9713C4.273 14.0925 4.33253 14.2039 4.41993 14.2913C4.50734 14.3787 4.61871 14.4383 4.73994 14.4624C4.86118 14.4865 4.98685 14.4741 5.10105 14.4268C5.21526 14.3795 5.31287 14.2994 5.38154 14.1966C5.45022 14.0938 5.48688 13.973 5.48688 13.8494C5.48688 13.6836 5.42103 13.5246 5.30382 13.4074C5.18661 13.2902 5.02764 13.2244 4.86188 13.2244ZM13.8581 9.51C13.7345 9.51 13.6137 9.54666 13.5109 9.61533C13.4081 9.68401 13.328 9.78162 13.2807 9.89582C13.2334 10.01 13.221 10.1357 13.2451 10.2569C13.2692 10.3782 13.3288 10.4895 13.4162 10.5769C13.5036 10.6643 13.615 10.7239 13.7362 10.748C13.8574 10.7721 13.9831 10.7597 14.0973 10.7124C14.2115 10.6651 14.3091 10.585 14.3778 10.4822C14.4465 10.3795 14.4831 10.2586 14.4831 10.135C14.4831 10.0529 14.467 9.97165 14.4355 9.89582C14.4041 9.81999 14.3581 9.75109 14.3001 9.69306C14.242 9.63502 14.1731 9.58898 14.0973 9.55758C14.0215 9.52617 13.9402 9.51 13.8581 9.51ZM12.3619 11.7456C12.2383 11.7456 12.1174 11.7823 12.0146 11.851C11.9119 11.9196 11.8318 12.0172 11.7844 12.1314C11.7371 12.2457 11.7248 12.3713 11.7489 12.4926C11.773 12.6138 11.8325 12.7252 11.9199 12.8126C12.0073 12.9 12.1187 12.9595 12.2399 12.9836C12.3612 13.0077 12.4868 12.9954 12.6011 12.948C12.7153 12.9007 12.8129 12.8206 12.8815 12.7179C12.9502 12.6151 12.9869 12.4942 12.9869 12.3706C12.9869 12.2885 12.9707 12.2073 12.9393 12.1314C12.9079 12.0556 12.8619 11.9867 12.8038 11.9287C12.7458 11.8706 12.6769 11.8246 12.6011 11.7932C12.5252 11.7618 12.444 11.7456 12.3619 11.7456ZM10.1381 13.2244C10.0145 13.2244 9.89367 13.261 9.79089 13.3297C9.68811 13.3984 9.608 13.496 9.5607 13.6102C9.5134 13.7244 9.50102 13.8501 9.52513 13.9713C9.54925 14.0925 9.60878 14.2039 9.69618 14.2913C9.78359 14.3787 9.89496 14.4383 10.0162 14.4624C10.1374 14.4865 10.2631 14.4741 10.3773 14.4268C10.4915 14.3795 10.5891 14.2994 10.6578 14.1966C10.7265 14.0938 10.7631 13.973 10.7631 13.8494C10.7631 13.7673 10.747 13.686 10.7156 13.6102C10.6841 13.5344 10.6381 13.4655 10.5801 13.4074C10.522 13.3494 10.4531 13.3034 10.3773 13.272C10.3015 13.2405 10.2202 13.2244 10.1381 13.2244Z" fill=${this.color}/>
</svg>`;
  }
}

function renderEventDetails(arg) {
  const event = arg.event;
  const title = event.title || "";
  const resourceId = event.resourceIds[0];
  const color =
    event.extendedProps?.shiftColor || event.backgroundColor || "#000000";
  const props = event.extendedProps;
  const x = event.extendedProps?.x || 0;
  const borderColor = getBorderColor(color);
  const daysSpan = event.extendedProps.daysSpan || 1;
  const cupIcon = new CupIcon(borderColor, 20, 20);
  const clockIcon = new ClockIcon(borderColor, 20, 20);
  const start = formatDateYYYYMMDD(new Date(event.start));
  const end = formatDateYYYYMMDD(new Date(event.end));
  // if (daysSpan > 1) {
  //   return;
  // }

  return {
    html: `
       <div class="events-box" data-start="${start}" data-end="${end}" data-days-span="${daysSpan}" data-resource-id="${resourceId}" style="background-color: ${color}; border:2px solid ${borderColor}; color:${borderColor}; left: 0;">
         <div class="left-event">
           ${title}
           <div class="icons">
             ${cupIcon.render()}
             ${clockIcon.render()}
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

function getBorderColor(hex) {
  // Convert HEX to RGB
  let r = parseInt(hex.substr(1, 2), 16) / 255;
  let g = parseInt(hex.substr(3, 2), 16) / 255;
  let b = parseInt(hex.substr(5, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  // Darken lightness (~45%)
  l = Math.max(0, l * 0.55);

  // Convert HSL back to RGB
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }

  let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  let p = 2 * l - q;

  r = hue2rgb(p, q, h + 1 / 3);
  g = hue2rgb(p, q, h);
  b = hue2rgb(p, q, h - 1 / 3);

  const toHex = (v) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
  const openShiftResourceIds = [];

  Object.values(calResources).forEach((childrenArray) => {
    childrenArray.forEach((child) => {
      if (child.extendedProps?.isOpen === true) {
        openShiftResourceIds.push(child.id);
      }
    });
  });

  document.addEventListener("click", function (e) {
    const dot = e.target.closest(".events-box .dots,.ec-empty-cell .dots");
    if (dot) {
      e.stopPropagation();

      // 1. REAL EVENT?
      let eventBox = dot.closest(".events-box");
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
      const isOpen = openShiftResourceIds.includes(resId);

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

  // Debounced rerender of multi-day bars on resize to keep spans accurate
  let _multiDayResizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(_multiDayResizeTimer);
    _multiDayResizeTimer = setTimeout(() => {
      requestAnimationFrame(renderMultiDayBars);
    }, 120);
  });
  // HOVER HANDLING
  document.addEventListener("mouseover", function (e) {
    const eventBox = e.target.closest(
      ".events-box, .ec-empty-cell, .empty-event"
    );
    if (
      e.target.closest("#event-popup") ||
      e.target.closest("#resource-shift-popup") ||
      e.target.closest("#empty-popup") ||
      e.target.closest("#empty-open-popup")
    )
      return;

    const box = e.target.closest(".events-box, .ec-empty-cell, .empty-event");

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

/* ---------- Sync utilities for stacked calendars ---------- */
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

const calendarRoot = document.querySelector(".mbsc-eventcalendar");

if (calendarRoot) {
  const resizeObserver = new ResizeObserver(() => {
    // console.log("resize");
    requestAnimationFrame(handleMultiple);
  });

  resizeObserver.observe(calendarRoot);
}

window.addEventListener("resize", () => {
  // console.log("window resize / zoom");
  handleMultiple();
});
