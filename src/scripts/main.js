document.addEventListener("DOMContentLoaded", function () {
  // api call: https://ipwhois.app/json/172.64.155.133
  const data = {
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

  const infoDiv = document.getElementById("info");
  infoDiv.innerHTML = `
    <table class="info-table">
      <tr><th>IP</th><td>${data.ip}</td></tr>
      <tr><th>Type</th><td>${data.type}</td></tr>
      <tr><th>Country</th><td>${data.country} <img src="${data.country_flag}" alt="Flag" width="20"/></td></tr>
      <tr><th>Region</th><td>${data.region}</td></tr>
      <tr><th>City</th><td>${data.city}</td></tr>
      <tr><th>ISP</th><td>${data.isp}</td></tr>
      <tr><th>Organization</th><td>${data.org}</td></tr>
      <tr><th>AS Number</th><td>${data.asn}</td></tr>
    </table>
    `;

  const map = L.map("map").setView([data.latitude, data.longitude], 5);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }).addTo(map);
  L.marker([data.latitude, data.longitude])
    .addTo(map)
    .bindPopup(`<b>${data.city}</b><br>${data.region}, ${data.country}`)
    .openPopup();
});
