# Lemera Legal Site

Static legal pages for Lemera.

Public domain:
https://lemera.meroviq.com

Primary URLs:
- Terms of Service: https://lemera.meroviq.com/terms
- Privacy Policy: https://lemera.meroviq.com/privacy
- Open Source Licenses: https://lemera.meroviq.com/licenses
- Group join fallback: https://lemera.meroviq.com/join

## Join landing + App Links

`public/join/` is the install fallback for the unchanged Host QR:
`https://lemera.meroviq.com/join#<payload>`. It never reads the fragment,
uses storage/analytics/network APIs, or forwards credentials to a store.
The page uses `no-referrer` and a restrictive CSP. No automatic redirects.
After installing, users scan the Host QR again **inside the app**; there is
no deferred-install payload recovery.

- Android: install Google Play button; an already verified installed app may
  receive the OS link directly. Link-opening preferences can still keep it on web.
- iPhone/iPad: Coming Soon, with no App Store href before public release.
- Desktop/unknown: supported-device guidance and manual Google Play choice.
- KO uses 공카; EN uses Lemera. Language can be switched without changing the URL.
- `/download` remains the independent app-install QR destination.

### Single store availability setting

Both `/join` and `/download` use `public/download/config.js`. When the App Store
listing is publicly available and verified, set its `appStoreUrl` there to
`https://apps.apple.com/app/id6815128720`. No app update is needed for web copy.
Do not enable it while review is pending.

### Association preparation

`config/app-links.json` holds the **Google Play App Signing** SHA-256 supplied by
the user on 2026-10-19. It is deliberately different from the upload certificate.
The iOS App ID `R6FXDSF43S.com.meroviq.lemera` was read from existing local Lemera
provisioning profiles. These are public identifiers, not credentials.

Run `node scripts/prepare-app-links.cjs` after changing association settings.
Generated files are `public/.well-known/assetlinks.json` and
`public/.well-known/apple-app-site-association`. Universal Links are enabled for
`R6FXDSF43S.com.meroviq.lemera` on exactly `/join` and `/join/`, matching the app's
validated link entry. Other routes, including `/download` and Legal documents,
stay on the web. QR payloads remain in the URL fragment and must not be sent to
servers, store links, analytics, or diagnostic logs.

Installed-app association is independent of public App Store availability.
Keep the existing Coming Soon fallback until the store listing is confirmed.
Do not add Debug or upload certificate fingerprints to the production Android
association. A Debug install may use the OS supported-links user selection for
local testing; this is not proof of Play App Signing verification.

Review these files before deployment, then verify the public endpoints:

1. Confirm both association endpoints return HTTP 200 over HTTPS **without
   redirect** and appropriate JSON content types. The workflow uploads `public`,
   including `.well-known`; verify the actual host response, not just files.
2. On an app installed **from Google Play**, use `adb shell pm verify-app-links
   --re-verify com.meroviq.lemera`, then `adb shell pm get-app-links
   com.meroviq.lemera`. Require `lemera.meroviq.com: verified`.
3. Scan a fresh Host QR using the Android camera, tap the link, confirm existing
   join/registration and bidirectional photo sharing. Also test an uninstalled
   Android and iPhone in a browser. Do not put real QR credentials in shell logs.
4. Test iOS Universal Links after enabling and deploying AASA, including Apple
   CDN propagation, associated-domain capability and installed/absent app cases.

Before enabling Universal Links in production, verify origin and Apple CDN
responses. CDN and device association caches can delay activation. Existing
app data must be preserved when refreshing the test installation. A browser
fallback alone does not establish whether QR decoding or session join failed.

Local checks: `node --test tests/*.test.cjs`. No commands here deploy the site.

Current English privacy version: 1.2 (effective October 5, 2026)
Current Korean privacy version: 1.3 (brand display only; October 13, 2026)
Current English terms version: 1.0
Current Korean terms version: 1.1 (brand display only; October 13, 2026)

Korean consumer-facing name: 공카 (Gongka); English name: Lemera.
Legacy versioned legal documents are preserved.

Contact: lemera@meroviq.com

## Spanish legal localization
Spanish policy translations track EN Privacy v1.2 (2026-10-05) and Terms
v1.0 (2026-08-17), including EEA/UK/Swiss and California notices.
Routes: /privacy/es/v1.2/, /terms/es/v1.0/, /licenses/es/.
The browser's es-* language selects Spanish at canonical landing routes.
Other unsupported languages default to English. Use ?choose=1 at
/privacy/ or /terms/ to inspect all language options. On /licenses/,
?lang=en bypasses automatic Spanish selection.
Before release, verify legal terminology and the site's consistency
with the current shipped app, especially purchase/entitlement claims.
