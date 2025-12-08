// window.RosterLoader = {
//   pendingTasks: 0,

//   show() {
//     if (this.pendingTasks === 0) {
//       document.getElementById("roster-loader").style.display = "block";
//     }
//     this.pendingTasks++;
//     console.log(this.pendingTasks);
//   },

//   hide() {
//     this.pendingTasks--;
//     if (this.pendingTasks <= 0) {
//       document.getElementById("roster-loader").style.display = "block";
//       this.pendingTasks = 0;
//     }
//   },
// };

var X = parent.Xrm;

async function FetchUniqueTerritoryTypes() {
  X.Utility.showProgressIndicator("Loading...");
  try {
    const url =
      X.Utility.getGlobalContext().getClientUrl() +
      "/api/data/v9.1/GlobalOptionSetDefinitions(Name='sog_territorytypetypecode')";

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "OData-MaxVersion": "4.0",
        "OData-Version": "4.0",
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const result = await response.json();

    // Convert Options to array of { id, label }
    const labels = result.Options.map((option) => ({
      id: option.Value, // FIXED
      label: option.Label?.UserLocalizedLabel?.Label, // FIXED
    }));

    // Unique filter
    const uniqueMap = new Map();
    labels.forEach((item) => {
      if (!uniqueMap.has(item.label)) {
        uniqueMap.set(item.label, item.id);
      }
    });

    return Array.from(uniqueMap, ([label, id]) => ({ id, label }));
  } catch (error) {
    X.Navigation.openAlertDialog({ text: error.message });
    return [];
  } finally {
    X.Utility.closeProgressIndicator();
  }
}

async function FetchUniqueSiteTypes() {
  X.Utility.showProgressIndicator("Loading...");
  try {
    const results = await X.WebApi.online.retrieveMultipleRecords(
      "bookableresource",
      "?$select=bookableresourceid,name&$filter=statecode eq 0 and resourcetype eq 7 and sog_sitetypetypecode eq null"
    );
    const labels = results.entities.map((item) => ({
      id: item.bookableresourceid,
      label: item["name"],
    }));

    const uniqueMap = new Map();
    labels.forEach((item) => {
      if (!uniqueMap.has(item.label)) {
        uniqueMap.set(item.label, item.id);
      }
    });

    return Array.from(uniqueMap, ([label, id]) => ({ id, label }));
  } catch (error) {
    X.Navigation.openAlertDialog(error.message);
    return [];
  } finally {
    X.Utility.closeProgressIndicator();
  }
}

async function FetchUniqueCategoryTypes() {
  X.Utility.showProgressIndicator("Loading...");
  try {
    const results = await X.WebApi.online.retrieveMultipleRecords(
      "bookableresourcecategory",
      "?$select=bookableresourcecategoryid,name&$filter=statecode eq 0"
    );
    const labels = results.entities.map((item) => ({
      id: item.bookableresourcecategoryid,
      label: item["name"],
    }));

    const uniqueMap = new Map();
    labels.forEach((item) => {
      if (!uniqueMap.has(item.label)) {
        uniqueMap.set(item.label, item.id);
      }
    });

    return Array.from(uniqueMap, ([label, id]) => ({ id, label }));
  } catch (error) {
    X.Navigation.openAlertDialog(error.message);
    return [];
  } finally {
    X.Utility.closeProgressIndicator();
  }
}

async function FetchSitesBySelectedTerritories(selectedTerritoryTypeValue) {
  X.Utility.showProgressIndicator("Loading...");
  try {
    const valuesXML = selectedTerritoryTypeValue
      .map((v) => `<value>${v}</value>`)
      .join("");
    const fetchXML = `
      <fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>
        <entity name='bookableresource'>
          <attribute name='name' />
          <attribute name='bookableresourceid' />
          <filter type='and'>
            <condition attribute='statecode' operator='eq' value='0' />
            <condition attribute='resourcetype' operator='eq' value='7' />
            <condition attribute='sog_sitetypetypecode' operator='null' />
          </filter>
          <link-entity name='msdyn_resourceterritory' from='msdyn_resource'
              to='bookableresourceid' link-type='inner' alias='resourceterritory'>
            <link-entity name='territory' from='territoryid' to='msdyn_territory'
                link-type='inner' alias='territory'>
              <filter type='and'>
                <condition attribute='sog_territorytypetypecode' operator='null'>
                  ${valuesXML}
                </condition>
              </filter>
            </link-entity>
          </link-entity>
        </entity>
      </fetch>
    `;

    const encoded = encodeURIComponent(fetchXML);
    const results = await X.WebApi.online.retrieveMultipleRecords(
      "bookableresource",
      `?fetchXml=${encoded}`
    );
    const labels = results.entities.map((item) => ({
      id: item.bookableresourceid,
      label: item["name"],
    }));

    const unique = Array.from(
      new Map(labels.map((i) => [i.label, i])).values()
    );
    return unique;
  } catch (err) {
    X.Navigation.openAlertDialog(err.message);
    return [];
  } finally {
    X.Utility.closeProgressIndicator();
  }
}

function RenderDropdown(groups, containerId) {
  const dropdown = document.getElementById(containerId);
  dropdown.innerHTML = "";

  // Select all
  dropdown.innerHTML += `
    <label>
      <input type="checkbox" class="select-all" />
      <span>Select All</span>
    </label>
  `;

  // Add group values
  groups.forEach((group) => {
    dropdown.innerHTML += `
      <label>
        <input type="checkbox" value="${group.label}" data-group-id="${group.id}" />
        <span>${group.label}</span>
      </label>
    `;
  });

  // Activate checkbox logic
  InitDropdownLogic(containerId);
}

function FilterCategoryUpdate(groups, containerId) {
  const filterContainer = document.getElementById(containerId);
  filterContainer.innerHTML = "";
  console.log(groups);
  // filterContainer.innerHTML +=
  groups.forEach((group) => {
    filterContainer.innerHTML += `
    <p class="dropdown-item" data-category-id="${group.id}">
      ${group.label}
    </p>`;
  });
}

function AttachTerritoryChangeListener(containerId) {
  const container = document.getElementById(containerId);
  const checkboxes = container.querySelectorAll(
    "input[type='checkbox']:not(.select-all)"
  );
  const selectAll = container.parentElement.querySelector(".select-all");

  async function handleTerritoryChange() {
    const selected = getSelectedValues(containerId);
    if (!selected || selected.length === 0) {
      return;
    }
    const codes = selected.map((item) => Number(item.id)); // [3, 7, 9]

    const sites = await FetchSitesBySelectedTerritories(codes);
    RenderDropdown(sites, "SiteDropdownContent");
    InitDropdownLogic("SiteDropdownContent");
  }

  // Listen to individual checkboxes
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", handleTerritoryChange);
  });

  // Listen to "Select All"
  if (selectAll) {
    selectAll.addEventListener("change", handleTerritoryChange);
  }
}

function getSelectedValues(containerId) {
  const container = document.getElementById(containerId);
  const checkboxes = container.querySelectorAll(
    "input[type='checkbox']:not(.select-all)"
  );

  return [...checkboxes]
    .filter((cb) => cb.checked)
    .map((cb) => ({
      id: cb.dataset.groupId,
      // label: cb.value,
    }));
}

function InitDropdownLogic(containerId) {
  const wrapper = document
    .getElementById(containerId)
    .closest("[data-dropdown]");

  const selectAll = wrapper.querySelector(".select-all");
  const checkboxes = wrapper.querySelectorAll(
    "input[type='checkbox']:not(.select-all)"
  );

  // Default: everything selected
  selectAll.checked = true;
  checkboxes.forEach((cb) => (cb.checked = true));

  // Select All behavior
  selectAll.addEventListener("change", () => {
    checkboxes.forEach((cb) => (cb.checked = selectAll.checked));
  });

  // Individual checkbox behavior
  checkboxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      selectAll.checked = [...checkboxes].every((c) => c.checked);
    });
  });
}

async function InitTerritoryDropdown() {
  const territories = await FetchUniqueTerritoryTypes();
  RenderDropdown(territories, "TerritoryDropdownContent");
  AttachTerritoryChangeListener("TerritoryDropdownContent");
}

async function InitSiteDropdown() {
  const sites = await FetchUniqueSiteTypes();
  RenderDropdown(sites, "SiteDropdownContent");
}

async function InitCategoryDropdown() {
  const category = await FetchUniqueCategoryTypes();
  RenderDropdown(category, "CategoryDropdownContent");
  FilterCategoryUpdate(category, "Categories-group");
}

InitTerritoryDropdown();
InitSiteDropdown();
InitCategoryDropdown();
