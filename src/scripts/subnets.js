document.getElementById("search-btn").addEventListener("click", function () {
  const input = document.getElementById("ip-input").value;
  const [ip, prefix] = input.split("/");
  const prefixLength = parseInt(prefix, 10);

  if (!ip || isNaN(prefixLength) || prefixLength < 0 || prefixLength > 32) {
    document.getElementById("info").innerText = "Missing or Invalid Prefix!";
    return;
  }

  const ipParts = ip.split(".");
  if (
    ipParts.length !== 4 ||
    ipParts.some((part) => isNaN(part) || part < 0 || part > 255)
  ) {
    document.getElementById("info").innerText = "Invalid IP Address!";
    return;
  }

  const subnetMask = calculateSubnetMask(prefixLength);
  const numberOfHosts = calculateNumberOfHosts(prefixLength);
  const subnets = calculateSubnets(ip, prefixLength);
  const ipClass = getClass(ip);

  document.getElementById("info").innerHTML = `
    <p>Subnet Mask: ${subnetMask}</p>
    <p>Number of Hosts: ${numberOfHosts}</p>
    <p>IP Class: ${ipClass}</p>
    <br />
    <p style="margin-bottom: 5px;">Subnets:</p>
    <ul style="list-style-type: none;">${subnets
      .map(
        (subnet) => `
      <li style="margin-bottom: 5px;">
        ${subnet.cidr} From: ${subnet.firstHost} To: ${subnet.lastHost} (${subnet.numberOfHosts} hosts)
      </li>`
      )
      .join("")}
    </ul>
  `;
});

function calculateSubnetMask(prefixLength) {
  return Array(4)
    .fill(0)
    .map((_, i) => {
      return prefixLength > i * 8
        ? 255
        : prefixLength > (i - 1) * 8
        ? 256 - Math.pow(2, 8 - (prefixLength % 8))
        : 0;
    })
    .join(".");
}

function calculateNumberOfHosts(prefixLength) {
  return Math.pow(2, 32 - prefixLength);
}

function calculateSubnets(ip, prefixLength) {
  const ipParts = ip.split(".").map((part) => parseInt(part, 10));
  const subnetMaskParts = calculateSubnetMask(prefixLength)
    .split(".")
    .map((part) => parseInt(part, 10));
  const networkAddressParts = ipParts.map(
    (part, i) => part & subnetMaskParts[i]
  );

  const subnets = [];
  for (
    let newPrefixLength = prefixLength;
    newPrefixLength <= 32;
    newPrefixLength++
  ) {
    const numberOfSubnets = Math.pow(2, newPrefixLength - prefixLength);
    const subnetSize = Math.pow(2, 32 - newPrefixLength);

    for (let i = 0; i < numberOfSubnets; i++) {
      const subnet = networkAddressParts.slice();
      subnet[3] += i * subnetSize;

      const firstHost = subnet.slice();
      firstHost[3] += 1;

      const lastHost = subnet.slice();
      lastHost[3] += subnetSize - 2;

      subnets.push({
        firstHost: firstHost.join("."),
        lastHost: lastHost.join("."),
        cidr: `${subnet.join(".")} / ${newPrefixLength}`,
        numberOfHosts: calculateNumberOfHosts(newPrefixLength),
      });
    }
  }

  return subnets;
}

function getClass(ip) {
  const firstOctet = parseInt(ip.split(".")[0], 10);
  if (firstOctet >= 1 && firstOctet <= 126) {
    return "A";
  } else if (firstOctet >= 128 && firstOctet <= 191) {
    return "B";
  } else if (firstOctet >= 192 && firstOctet <= 223) {
    return "C";
  } else if (firstOctet >= 224 && firstOctet <= 239) {
    return "D";
  } else {
    return "E";
  }
}
