const API_URL = "https://mgnrega-dashboard-1wxj.onrender.com/performance/fetch";

// Select main elements
const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");
const compareSelect = document.getElementById("compareSelect");
const updateBtn = document.getElementById("updateBtn");
const languageSelect = document.getElementById("languageSelect");
const chartTypeSelect = document.getElementById("chartType");
const darkToggle = document.getElementById("darkModeToggle");
const loadingContainer = document.getElementById("loadingContainer");
const insightsBox = document.getElementById("insightsBox");

// KPI section (if present)
const kpiBoxes = document.querySelectorAll(".kpi-box");
const detailsSection = document.getElementById("detailsSection");

let chart;

// Offline fallback
function saveDataToLocal(key, data) {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}

function loadDataFromLocal(key) {
  const saved = localStorage.getItem(key);
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    return parsed.data;
  } catch {
    return null;
  }
}

// Example fallback data
const districtsByState = {
  Maharashtra: ["Pune", "Nashik", "Nagpur", "Aurangabad", "Mumbai"],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubli", "Mangalore", "Belagavi"],
};

// ============================
// 🏙️ Load States
// ============================
function loadStates() {
  const states = Object.keys(districtsByState);
  stateSelect.innerHTML =
    `<option value="">Select</option>` +
    states.map((s) => `<option>${s}</option>`).join("");
}

// ============================
// 🏘️ Load Districts
// ============================
async function loadDistricts(state) {
  districtSelect.innerHTML = `<option>Loading...</option>`;
  compareSelect.innerHTML = `<option>Loading...</option>`;

  try {
    const res = await fetch(`${API_URL}?state=${state}`);
    const data = await res.json();

    let districts = [];
    if (Array.isArray(data) && data.length && data[0].district_name) {
      districts = [...new Set(data.map((d) => d.district_name))];
    } else if (districtsByState[state]) {
      districts = districtsByState[state];
    }

    districtSelect.innerHTML =
      `<option value="">Select District</option>` +
      districts.map((d) => `<option>${d}</option>`).join("");
    compareSelect.innerHTML = districtSelect.innerHTML;
  } catch {
    if (districtsByState[state]) {
      const districts = districtsByState[state];
      districtSelect.innerHTML =
        `<option value="">Select District</option>` +
        districts.map((d) => `<option>${d}</option>`).join("");
      compareSelect.innerHTML = districtSelect.innerHTML;
    }
  }
}

// ============================
// 📈 Fetch and Display Data (with Offline Fallback)
// ============================
async function updateData() {
  const state = stateSelect.value;
  const district = districtSelect.value;
  const compare = compareSelect.value;
  const chartType = chartTypeSelect ? chartTypeSelect.value : "bar";

  if (!state) return alert("Please select a state");

  const key = `MGNREGA_${state}_${district || "all"}`;
  const url = `${API_URL}?state=${state}${district ? `&district=${district}` : ""}`;

  if (loadingContainer) loadingContainer.classList.remove("hidden");
  if (insightsBox) insightsBox.classList.add("hidden");

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Server Error");
    const data = await res.json();
    if (loadingContainer) loadingContainer.classList.add("hidden");

    if (!Array.isArray(data) || !data.length) {
      showError("No data available from server.");
      return;
    }

    // Save to localStorage
    saveDataToLocal(key, data);

    renderChart(data, state, district, compare, chartType);
  } catch (err) {
    if (loadingContainer) loadingContainer.classList.add("hidden");

    // Try offline data
    const offlineData = loadDataFromLocal(key);
    if (offlineData) {
      showError("⚠️ Server not responding. Showing last saved data.");
      renderChart(offlineData, state, district, compare, chartType);
    } else {
      showError("❌ Unable to load data. Please try again later.");
    }
  }
}

// ============================
// 📊 Render Chart + Insights
// ============================
async function renderChart(data, state, district, compare, chartType) {
  const labels = data.map((d) => `${d.month}-${d.year}`);
  const values = data.map((d) => d.work_done || d.households_benefited || 0);

  const ctx = document.getElementById("performanceChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: chartType,
    data: {
      labels,
      datasets: [
        {
          label: district || state,
          data: values,
          backgroundColor: "rgba(99,102,241,0.7)",
          borderColor: "rgba(99,102,241,1)",
          borderWidth: 2,
          fill: chartType !== "bar",
        },
      ],
    },
    options: {
      responsive: true,
      animation: { duration: 900, easing: "easeOutQuart" },
      plugins: { legend: { labels: { color: "#333" } } },
    },
  });

  // Compare district
  if (compare && compare !== district) {
    try {
      const res2 = await fetch(`${API_URL}?state=${state}&district=${compare}`);
      const data2 = await res2.json();
      const values2 = data2.map((d) => d.work_done || d.households_benefited || 0);
      chart.data.datasets.push({
        label: compare,
        data: values2,
        backgroundColor: "rgba(239,68,68,0.7)",
        borderColor: "rgba(239,68,68,1)",
        borderWidth: 2,
      });
      chart.update();
    } catch {}
  }

  // Insights
  const avg = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  const trend = values[values.length - 1] - values[0];
  let insight = `Average performance: ${avg}. `;
  insight +=
    trend > 0
      ? `📈 Improvement observed in recent months.`
      : trend < 0
      ? `📉 Decline observed recently.`
      : `⚖️ Performance remains stable.`;
  if (insightsBox) {
    insightsBox.innerText = insight;
    insightsBox.classList.remove("hidden");
  }
}

// ============================
// ⚠️ Error / Info Message
// ============================
function showError(message) {
  if (insightsBox) {
    insightsBox.innerText = message;
    insightsBox.classList.remove("hidden");
    insightsBox.style.backgroundColor = "#fee2e2";
    insightsBox.style.borderLeft = "4px solid #ef4444";
  }
}

// ============================
// 🌐 Language Translation
// ============================
function applyTranslations(lang) {
  const t = translations[lang];
  Object.keys(t).forEach((k) => {
    const el = document.getElementById(k);
    if (el) el.innerText = t[k];
  });
}

// ============================
// 💡 Interactive KPI Boxes
// ============================
if (kpiBoxes.length && detailsSection) {
  kpiBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      kpiBoxes.forEach((b) =>
        b.classList.remove("border-blue-600", "bg-blue-50")
      );
      box.classList.add("border-blue-600", "bg-blue-50");

      const type = box.getAttribute("data-type");
      let content = "";

      if (type === "households") {
        content = `
          <h3 class="text-lg font-bold mt-4">Top Villages by Households Benefited</h3>
          <ul class="list-disc pl-5">
            <li>Village A - 120 families</li>
            <li>Village B - 110 families</li>
            <li>Village C - 98 families</li>
          </ul>`;
      } else if (type === "days") {
        content = `
          <h3 class="text-lg font-bold mt-4">Average Work Days</h3>
          <p>Most families worked around <strong>48–52 days</strong> this year.</p>`;
      } else if (type === "wages") {
        content = `
          <h3 class="text-lg font-bold mt-4">Total Wages Paid</h3>
          <p>₹3.2 crore distributed to workers this year across 12 villages.</p>`;
      }

      detailsSection.innerHTML = content;
    });
  });
}

// ============================
// 🚀 Initialize Everything
// ============================
document.addEventListener("DOMContentLoaded", () => {
  loadStates();
  applyTranslations("en");

  stateSelect.addEventListener("change", (e) => loadDistricts(e.target.value));
  updateBtn.addEventListener("click", updateData);
  languageSelect.addEventListener("change", (e) =>
    applyTranslations(e.target.value)
  );

  if (darkToggle) {
    darkToggle.addEventListener("click", () =>
      document.body.classList.toggle("dark-mode")
    );
  }

  if (chartTypeSelect) {
    chartTypeSelect.addEventListener("change", updateData);
  }
});
