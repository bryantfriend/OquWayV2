import { locationLoginSettingsService } from "../services/locationLoginSettingsService.js?v=1.1.133-course-archive-pending";

export class LocationLoginSettingsPage {
  constructor() {
    this.locations = [];
    this.isLoading = false;
    this.statusMessage = "";
    this.errorMessage = "";
  }

  render() {
    return '<div class="min-h-screen bg-gray-50">'
      + '<nav class="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">'
      + '<div class="flex items-center gap-3">'
      + '<span class="text-blue-600 font-bold text-xl tracking-tight">OquWay</span>'
      + '<span class="text-gray-500 text-sm font-semibold">Location Login Settings</span>'
      + '</div>'
      + '<a href="#dashboard" class="border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition shadow-sm text-sm">Back to Courses</a>'
      + '</nav>'
      + '<main class="max-w-5xl mx-auto px-6 py-8">'
      + '<section class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">'
      + '<p class="text-xs font-black uppercase tracking-widest text-blue-600 mb-2">Student Access</p>'
      + '<h1 class="text-3xl font-black text-gray-950 tracking-tight mb-2">Choose login mode by location</h1>'
      + '<p class="text-gray-500 text-sm max-w-2xl">Fruit login is best for young students on shared tablets. Standard login is best for older students on personal devices. Hybrid allows both.</p>'
      + '</section>'
      + '<div id="locationLoginStatus"></div>'
      + '<section id="locationLoginList" class="grid grid-cols-1 gap-4">'
      + buildLoadingRows()
      + '</section>'
      + '</main>'
      + '</div>';
  }

  attachEvents() {
    var self = this;
    var list = document.getElementById("locationLoginList");

    this.loadLocations();

    if (list) {
      list.addEventListener("click", function (event) {
        var saveButton = event.target.closest(".save-location-login-mode-btn");

        if (saveButton) {
          self.saveLoginMode(saveButton.getAttribute("data-location-id"));
        }
      });
    }
  }

  loadLocations() {
    var self = this;
    this.isLoading = true;
    this.renderList();
    this.renderStatus("loading", "Loading locations...");

    locationLoginSettingsService.listLocations().then(function (locations) {
      self.locations = locations;
      self.isLoading = false;
      self.renderStatus("success", "Locations loaded.");
      self.renderList();
    }).catch(function (error) {
      self.isLoading = false;
      self.renderStatus("error", error.message);
      self.renderList();
    });
  }

  saveLoginMode(locationId) {
    var self = this;
    var selectElement = document.querySelector('[data-login-mode-location-id="' + cssEscape(locationId) + '"]');
    var saveButton = document.querySelector('[data-location-id="' + cssEscape(locationId) + '"]');

    if (!selectElement) {
      return;
    }

    if (saveButton) {
      saveButton.disabled = true;
      saveButton.textContent = "Saving...";
    }

    this.renderStatus("loading", "Saving login mode...");

    locationLoginSettingsService.updateLocationLoginMode(locationId, selectElement.value).then(function () {
      self.renderStatus("success", "Login mode saved.");
      self.loadLocations();
    }).catch(function (error) {
      self.renderStatus("error", error.message);
      if (saveButton) {
        saveButton.disabled = false;
        saveButton.textContent = "Save";
      }
    });
  }

  renderList() {
    var list = document.getElementById("locationLoginList");

    if (!list) {
      return;
    }

    if (this.isLoading) {
      list.innerHTML = buildLoadingRows();
      return;
    }

    if (!this.locations || this.locations.length === 0) {
      list.innerHTML = '<div class="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500 font-semibold">No locations found yet.</div>';
      return;
    }

    list.innerHTML = this.locations.map(function (location) {
      return buildLocationRow(location);
    }).join("");
  }

  renderStatus(type, message) {
    var status = document.getElementById("locationLoginStatus");

    if (!status) {
      return;
    }

    status.className = "mb-4 rounded-xl border px-4 py-3 text-sm font-bold " + readStatusClass(type);
    status.textContent = message;
  }
}

function buildLocationRow(location) {
  var locationId = escapeHtml(location.id || "");
  var name = escapeHtml(readLocationName(location));
  var loginMode = readLoginMode(location.loginMode);

  return '<article class="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4">'
    + '<div class="min-w-0">'
    + '<h2 class="font-black text-gray-950 text-lg truncate">' + name + '</h2>'
    + '<p class="text-xs text-gray-400 font-semibold mt-1">ID: ' + locationId + '</p>'
    + '</div>'
    + '<div class="flex items-center gap-3">'
    + '<select data-login-mode-location-id="' + locationId + '" class="border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold text-gray-700">'
    + '<option value="fruit"' + selected(loginMode, "fruit") + '>Fruit</option>'
    + '<option value="standard"' + selected(loginMode, "standard") + '>Standard</option>'
    + '<option value="hybrid"' + selected(loginMode, "hybrid") + '>Hybrid</option>'
    + '</select>'
    + '<button data-location-id="' + locationId + '" class="save-location-login-mode-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-black">Save</button>'
    + '</div>'
    + '</article>';
}

function buildLoadingRows() {
  return '<div class="rounded-2xl border border-gray-100 bg-white p-5"><div class="oqu-skeleton-line" style="height:16px;width:40%;margin-bottom:12px"></div><div class="oqu-skeleton-line" style="height:12px;width:70%"></div></div>'
    + '<div class="rounded-2xl border border-gray-100 bg-white p-5"><div class="oqu-skeleton-line" style="height:16px;width:45%;margin-bottom:12px"></div><div class="oqu-skeleton-line" style="height:12px;width:60%"></div></div>';
}

function readLocationName(location) {
  if (location && typeof location.name === "string" && location.name.length > 0) {
    return location.name;
  }

  return location && location.id ? location.id : "Unnamed Location";
}

function readLoginMode(value) {
  if (value === "standard" || value === "hybrid") {
    return value;
  }

  return "fruit";
}

function selected(value, expectedValue) {
  return value === expectedValue ? " selected" : "";
}

function readStatusClass(type) {
  if (type === "error") {
    return "bg-red-50 border-red-100 text-red-700";
  }

  if (type === "success") {
    return "bg-green-50 border-green-100 text-green-700";
  }

  return "bg-blue-50 border-blue-100 text-blue-700";
}

function cssEscape(value) {
  if (window.CSS && window.CSS.escape) {
    return window.CSS.escape(value);
  }

  return value.replace(/"/g, '\\"');
}

function escapeHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
