# Minimal Legal update — release gate remains closed

This PR extends the existing Spanish work. No main merge, Pages deployment, app change/build, or Play declaration edit is authorized by this update.

## Selected changes
New Privacy v1.4 and Terms v1.2 are narrow amendments built from the existing KO/EN policies and their Spanish translations, not adoption of the previous comprehensive candidates. Existing 15 numbered headings, rights, provider/contact, eligibility, acceptable-use, warranty, liability, governing-law and regional-rights clauses remain. Privacy changes cover actual permissions, durable profiles, platform storage, withdrawal/deletion and OS backup limits, transport security, and version-scoped QR handling. Terms retains the service list and replaces obsolete post-End backlog and universal group-album claims. Existing no-payment terms are retained with a short free/cap clarification.

Confirmed direction: Android Host accepts Android and iPhone Members; iPhone Host accepts only iPhone Members. The earlier user statement denying both cross-platform directions was corrected explicitly. No app behavior changed.

The 12 new pages remain clearly marked as not effective. Existing policy version URLs and effective-date history remain in place. Existing Privacy/Terms entry points still select the prior versions until the approved transition. `/release-preview/` provides all new language/region links for review. Release policy links remain in the same URL structure, using the shared CSS. Old comprehensive candidates remain local audit history and are not the publication source.

## Licenses
`public/licenses/releases/android-1.1.0-13/` reuses the final AAB audit: 235 records with original license/NOTICE text, exact source manifest and MPL source archive. The inventory explicitly distinguishes development and other-platform entries from Android shipment. ZXing-C++ Android 3.1.1 is included; removed ML Kit, DataTransport and Firebase encoder dependencies are absent from this version's list. Existing license tables remain labeled as earlier-version notices and link to the new three-language inventory. Original audit materials remain untouched in the source Legal repository. Final iOS IPA verification remains a pre-iOS-release item.

AAB identity: `lemera-1.1.0-13-zxing-release-20261026.aab`, SHA-256 `8eb951f93def80e72b3178ad9dbb89682517431f862329eae4e87d0b08eec7a0`. No build repeated.

## Play observation and transition
Console checked again on 2026-10-26: production 11 fully distributed; open test 2 fully distributed; production draft 12; highest uploaded bundle 12. Earlier audited production 11 contains ML Kit. Exact open-test 2 binary is not established. Do not remove SDK-only disclosures on the assumption that preparing AAB13 retires either track.

No new legal investigation is needed for the removed decoder. Retain the short older-version Google metrics notice while older versions remain in use; it does not assert a fixed Google retention period, transfer country or new lawful basis. Existing Google links are preserved. The previous prepared Data safety worksheet remains applicable: do not claim blanket no collection just because QR processing is local; local photo/profile transfers still occur. This task did not change the actual store form.

Before merge/publication:
1. Approve the production/open-test transition to the verified ZXing13 artifact, or retire the old open test; separately preserve existing draft12 history.
2. Coordinate Data safety with every active distributed version; reduce SDK-only categories only when the actual track inventory supports it. Keep the legacy installed-version explanation.
3. Set actual publication/effective dates without backdating and retain existing notice commitments. No arbitrary 7/30-day notice period is introduced.
4. At approval, switch Privacy/Terms language entry points to v1.4/v1.2 and the latest-license link to the versioned inventory. Retain historical URLs. Remove draft labels only with the effective-date decision. Recheck links and HTTPS after the separately approved main merge/Pages publication. Managed publishing was previously OFF; confirm/enable it before review submission to preserve the publication hold.

## Validation
- Original Legal working tree: all 299 recorded source inputs unchanged; app source untouched.
- Local combined regression suite before packaging: 111 passed, including prior candidate/audit checks. Exact staged PR tree: 79 tests passed, including source/NOTICE hash verification; CI repeats this suite.
- Browser matrix: KO/EN/ES Privacy global/EEA/California, Terms, Licenses, Join and Download at 320, 390, 768 and 1280px; plus three 200% text/dark-mode policy cases. 87 cases, no document overflow or wrong document language. License tables scroll within a labeled keyboard-focusable region.
- All 1418 static internal references resolve; new-document language/region destinations tested. Existing Join/Download and app-link implementation are excluded from this commit.
- No actual mobile hardware/screen-reader manual test claimed; browser viewport and DOM checks are recorded in `minimal-validation/ui-results.json`.
