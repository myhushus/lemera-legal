// Local preparation only; never deploys. Use the Play APP SIGNING fingerprint,
// not the upload keystore. An empty list safely publishes no Android association.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const config = require('../config/app-links.json');
if (!config.playAppSigningSha256.every(value => /^(?:[A-F0-9]{2}:){31}[A-F0-9]{2}$/.test(value))) {
  throw new Error('Expected Google Play App Signing SHA-256 fingerprints.');
}
const android = config.playAppSigningSha256.length ? [{
  relation: ['delegate_permission/common.handle_all_urls'],
  target: { namespace: 'android_app', package_name: config.androidPackage,
    sha256_cert_fingerprints: config.playAppSigningSha256 },
}] : [];
const apple = { applinks: { apps: [], details: config.iosUniversalLinksEnabled ? [{
  appID: config.iosAppId, paths: ['/join', '/join/*'],
}] : [] } };
for (const [name, value] of [['assetlinks.json', android], ['apple-app-site-association', apple]]) {
  fs.writeFileSync(path.join(root, 'public/.well-known', name), JSON.stringify(value, null, 2) + '\n');
}
if (!android.length) console.warn('BLOCKED: Google Play App Signing SHA-256 is missing; Android association remains disabled.');
