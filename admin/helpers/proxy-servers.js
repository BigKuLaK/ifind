require('colors');
const { JSDOM } = require('jsdom');
const got = require('got');

const serversPromise = (async () => {
  const servers = [];

  await Promise.all([

    // ProxyNova
    (async () => {
      const response = await got(`https://www.proxynova.com/proxy-server-list/country-de/`);
      const dom = new JSDOM(response.body);
      const [...rows] = dom.window.document.querySelectorAll('tr[data-proxy-id]');
      // Filter only servers with highest uptimes
      const upServers = rows.filter(row => row.querySelector('.uptime-high, .uptime-medium'));
      const proxyServers = upServers.map(row => {
        const [ hostCell, portCell, lastCheck, speed, uptimeCell ] = [...row.children];
        const [ host ] = hostCell.textContent.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/);
        const port = portCell.textContent.trim();
        const uptime = uptimeCell.textContent.match(/\d+%/);
        return { host, port, uptime };
      });
      servers.push(...proxyServers);
    })(),

      // Geonode
    (async () => {
      const { data } = await got(`https://proxylist.geonode.com/api/proxy-list?limit=50&page=1&sort_by=lastChecked&sort_type=desc&country=DE`).json();
      const highUptimes = data.filter(({ upTime }) => upTime >= 50);
      const withUptimePercent = highUptimes.map(({ ip, upTime, port }) => ({
        host: ip,
        port,
        uptime: `${upTime}%`
      }));

      servers.push(...withUptimePercent);
    })(),

    // Proxy Scan
    // (async () => {
    //   const { body } = await got('https://www.proxyscan.io/Home/FilterResult?selectedCountry=DE&status=1&sortUptime=true');
    //   const dom = new JSDOM(`<html><head></head><body><table><tbody>${body}</tbody></table></body></html>`);
    //   const [...rows] = dom.window.document.querySelectorAll('tr');
    //   const serversList = rows.map(({ children }) => {
    //     const [ hostCell, portCell, ...otherCells ] = children;
    //     const uptimeCell = otherCells[4];
    //     return {
    //       host: hostCell.textContent.trim(),
    //       port: portCell.textContent.trim(),
    //       uptime: uptimeCell.firstChild.textContent.trim(),
    //     }
    //   });

    //   servers.push(...serversList);
    // })(),

    (async () => {
      const { body } = await got('https://hidemy.name/en/proxy-list/?country=DE#list');
      const dom = new JSDOM(body);
      const [...rows] = dom.window.document.querySelectorAll('.table_block tbody tr');
      const serversList = rows.map(({ children }) => {
        const [ hostCell, portCell, ...otherCells ] = children;
        return {
          host: hostCell.textContent.trim(),
          port: portCell.textContent.trim(),
        }
      });

      servers.push(...serversList);
    })(),

  ]);

  return servers;
})();

// Gets a list of proxy servers
module.exports = async () => {
  const servers = await serversPromise;
  console.log(`Using proxied request using a total of ${servers.length} servers.`.cyan);
  return servers;
}
