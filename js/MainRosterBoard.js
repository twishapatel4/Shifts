var X = parent.Xrm;

async function fetchUniqueTerritoryTypes() {
  try {
    const results = await X.WebApi.online.retrieveMultipleRecords(
      "GlobalOptionSetDefinitions"
      // "?$select=sog_territorytypetypecode"
    );
    console.log(results);
    const labels = results.entities.map((item) => ({
      id: item.territoryid,
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
  }
}

async function fetchUniqueSiteTypes() {
  try {
    const results = await X.WebApi.online.retrieveMultipleRecords(
      "bookableresource",
      "?$select=bookableresourceid,name&$filter=statecode eq 0 and resourcetype eq 7 and sog_sitetypetypecode ne null"
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
  }
}

async function fetchUniqueCategoryTypes() {
  try {
    const results = await X.WebApi.online.retrieveMultipleRecords(
      "bookableresourcecategory",
      "?$select=bookableresourcecategoryid,name"
    );
    console.log(results);
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
  }
}

function renderDropdown(groups, containerId) {
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
  initDropdownLogic(containerId);
}

function initDropdownLogic(containerId) {
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

async function initTerritoryDropdown() {
  const territories = await fetchUniqueTerritoryTypes();
  renderDropdown(territories, "TerritoryDropdownContent");
}

async function initSiteDropdown() {
  const sites = await fetchUniqueSiteTypes();
  console.log(sites);
  renderDropdown(sites, "SiteDropdownContent");
}

async function initCategoryDropdown() {
  const category = await fetchUniqueCategoryTypes();
  console.log(category);
  renderDropdown(category, "CategoryDropdownContent");
}

initTerritoryDropdown();
initSiteDropdown();
initCategoryDropdown();
