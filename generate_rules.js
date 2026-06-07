const fs = require('fs');
const https = require('https');

const BLOCKLIST_URL = 'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=nohtml';

https.get(BLOCKLIST_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const domains = data.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));

    const rules = domains.map((domain, index) => {
      return {
        id: index + 1,
        priority: 1,
        action: { type: "block" },
        condition: {
          urlFilter: "||" + domain,
          resourceTypes: ["script", "image", "xmlhttprequest", "sub_frame", "ping", "media", "websocket"]
        }
      };
    });

    // Add some of our original ones if not present
    const extras = [
      "google-analytics.com",
      "googletagmanager.com",
      "facebook.net",
      "hotjar.com",
      "clarity.ms"
    ];

    let currentId = rules.length + 1;
    for (const extra of extras) {
      if (!domains.includes(extra)) {
        rules.push({
          id: currentId++,
          priority: 1,
          action: { type: "block" },
          condition: {
            urlFilter: "||" + extra,
            resourceTypes: ["script", "image", "xmlhttprequest", "sub_frame", "ping", "media", "websocket"]
          }
        });
      }
    }

    fs.writeFileSync('extension/rules.json', JSON.stringify(rules, null, 2));
    console.log(`Successfully generated rules.json with ${rules.length} rules.`);
  });
}).on('error', (err) => {
  console.error('Error fetching blocklist:', err.message);
});
