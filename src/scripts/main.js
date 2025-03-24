document.addEventListener("DOMContentLoaded", function () {
  const defaultData = {
    ip: "172.64.155.133",
    success: true,
    type: "IPv4",
    continent: "North America",
    continent_code: "NA",
    country: "United States",
    country_code: "US",
    country_flag: "https://cdn.ipwhois.io/flags/us.svg",
    country_capital: "Washington D.C.",
    country_phone: "+1",
    country_neighbours: "CA,MX",
    region: "California",
    city: "San Francisco",
    latitude: 37.718128,
    longitude: -122.4343849,
    asn: "AS13335",
    org: "Cloudflare, Inc.",
    isp: "Cloudflare, Inc.",
    timezone: "America/Los_Angeles",
    timezone_name: "PDT",
    timezone_dstOffset: 3600,
    timezone_gmtOffset: -25200,
    timezone_gmt: "-07:00",
    currency: "US Dollar",
    currency_code: "USD",
    currency_symbol: "$",
    currency_rates: 1,
    currency_plural: "US dollars",
  };

  let map;

  function updatePage(data) {
    const infoDiv = document.getElementById("info");
    infoDiv.innerHTML = `
      <div class="info-item"><i class="fas fa-network-wired"></i> <strong>IP:</strong> ${data.ip}</div>
      <div class="info-item"><i class="fas fa-server"></i> <strong>Type:</strong> ${data.type}</div>
      <div class="info-item"><i class="fas fa-flag"></i> <strong>Country:</strong> ${data.country} <img src="${data.country_flag}" alt="Flag" width="20"/></div>
      <div class="info-item"><i class="fas fa-map-marker-alt"></i> <strong>Region:</strong> ${data.region}</div>
      <div class="info-item"><i class="fas fa-city"></i> <strong>City:</strong> ${data.city}</div>
      <div class="info-item"><i class="fas fa-wifi"></i> <strong>ISP:</strong> ${data.isp}</div>
      <div class="info-item"><i class="fas fa-building"></i> <strong>Organization:</strong> ${data.org}</div>
      <div class="info-item"><i class="fas fa-hashtag"></i> <strong>AS Number:</strong> ${data.asn}</div>
    `;

    if (map) {
      map.remove();
    }

    map = L.map("map").setView([data.latitude, data.longitude], 5);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);
    L.marker([data.latitude, data.longitude])
      .addTo(map)
      .bindPopup(`<b>${data.city}</b><br>${data.region}, ${data.country}`)
      .openPopup();
  }

  updatePage(defaultData);

  document.getElementById("search-btn").addEventListener("click", function () {
    const ip = document.getElementById("ip-input").value;
    fetch(`https://ipwhois.app/json/${ip}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          updatePage(data);
        } else {
          alert(`Failed to retrieve data: ${data.message}`);
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data. Please try again later.");
      });
  });
});
