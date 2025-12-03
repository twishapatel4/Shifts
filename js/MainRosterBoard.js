var X = parent.Xrm;

async function FetchUniqueTerritoryTypes() {
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
      id: option.Value, // FIXED: correct property
      label: option.Label?.UserLocalizedLabel?.Label, // FIXED
    }));

    // Unique filter (same as your site function)
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
  }
}

async function FetchUniqueSiteTypes() {
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

async function FetchUniqueCategoryTypes() {
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

async function FetchSitesBySelectedTerritories(selectedTerritoryTypeValues) {
  try {
    if (!selectedTerritoryTypeValues.length) {
      console.warn("No territory types selected");
      return [];
    }

    // Build dynamic <value> tags based on selected values
    const valuesXML = selectedTerritoryTypeValues
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
            <condition attribute='sog_sitetypetypecode' operator='not-null' />
          </filter>
          <link-entity name='msdyn_resourceterritory' from='msdyn_resource'
              to='bookableresourceid' link-type='inner' alias='resourceterritory'>
            <link-entity name='territory' from='territoryid' to='msdyn_territory'
                link-type='inner' alias='territory'>
              <filter type='and'>
                <condition attribute='sog_territorytypetypecode' operator='in'>
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

    // Return unique values
    const unique = Array.from(
      new Map(labels.map((i) => [i.label, i])).values()
    );
    return unique;
  } catch (err) {
    X.Navigation.openAlertDialog(err.message);
    return [];
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
}

async function InitSiteDropdown() {
  const sites = await FetchUniqueSiteTypes();
  console.log(sites);
  RenderDropdown(sites, "SiteDropdownContent");
}

async function InitCategoryDropdown() {
  const category = await FetchUniqueCategoryTypes();
  console.log(category);
  RenderDropdown(category, "CategoryDropdownContent");
}

function SetupTerritoryChangeListener() {
  const container = document.getElementById("#TerritoryDropdownContent");
  container.addEventListener("change", async () => {
    const selectedValues = [
      ...container.querySelectorAll("input[type='checkbox']:checked"),
    ]
      .filter((cb) => cb.value !== "Select All") // ignore select-all
      .map((cb) => cb.dataset.groupId);

    console.log("Selected Territory Types:", selectedValues);

    // Fetch Sites filtered by Territories
    const filteredSites = await FetchSitesBySelectedTerritories(selectedValues);

    // Re-render Site dropdown
    RenderDropdown(filteredSites, "SiteDropdownContent");
  });
}

InitTerritoryDropdown();
// initTerritoryDropdown().then(() => {
//   setupTerritoryChangeListener();
// });
InitSiteDropdown();
InitCategoryDropdown();
