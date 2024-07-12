const permissions = require('./permissions');
const { name, description, version } = require('./app_info');

module.exports = {
  version,
  manifest_version: 3,
  name,
  description,
  permissions,
  minimum_chrome_version: '114',
  action: { default_title: 'Click to open panel' },
  side_panel: { default_path: 'assets/sidePanel.html' },
  icons: { 128: 'assets/images/sidellama.png' },
  background: { service_worker: 'background.js' },
  web_accessible_resources: [{
    resources: ['assets/**', 'content.js.map'],
    matches: ['<all_urls>']
  }],
  "host_permissions": ["<all_urls>"],
  content_security_policy: {
    extension_pages: `
      default-src 'self' 'unsafe-eval' http://localhost:* http://127.0.0.1:* https://api.groq.com https://html.duckduckgo.com https://generativelanguage.googleapis.com https://search.brave.com;
      script-src 'self'; 
      style-src 'self' 'unsafe-inline'
        https://fonts.googleapis.com
        https://fonts.gstatic.com;
      font-src 'self'
        https://fonts.googleapis.com
        https://fonts.gstatic.com;
      img-src 'unsafe-inline' 'self' data: https://upload.wikimedia.org;
    `
  }
};
