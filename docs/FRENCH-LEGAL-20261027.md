# French Legal support — 2026-10-27

French (fr) is added alongside KO/EN/ES in the existing Draft PR #5. Regional French browser locales share the French copy. Unsupported locales retain the English fallback. No new law, contractual obligation, feature, processing purpose or effective date is introduced by this translation.

## Content and navigation
- Privacy v1.4: general, EEA/UK/Swiss and California variants; existing 15 numbered sections plus equivalent regional supplements.
- Terms v1.2: equivalent 15 sections. End/Leave/Remove, photo withdrawal, system-photo deletion, profile retention and backup limits remain distinct.
- Exact platform direction retained: Android Host admits Android/iPhone Members; iPhone Host admits iPhone Members only.
- New ZXing13 and legacy ML Kit explanations remain version-scoped. This translation does not redo or expand the legacy legal investigation.
- `/licenses/fr/` selects the French ZXing13 inventory and links preserved older-version notices. 235 component/version records, original license links, NOTICE and MPL source/hash links are identical to English. No original license text is translated or replaced.
- Home, Privacy/Terms selectors, release-preview, Join and Download support French. New-version KO/EN/ES policies gain French navigation only; their bodies remain byte-identical after removing navigation markup.
- Existing QR fragment handling, app/store links, CSP, disabled App Store behavior and download configuration are preserved. French Download accessibility labeling is included.

## Validation
- 86 Node tests passed, including existing KO/EN/ES regressions and new French processing, regional routing, license identity and link checks.
- 90 browser cases: nine French surfaces at 320/390/768/1280px, light/dark; manual switching among four languages on Home/Join/Download; three large-text cases; three automatic French document entry points. No JS errors, page overflow, wrong locale or route failures.
- 1,789 static internal references resolve. The existing inventory and 12 KO/EN/ES policy bodies are preserved. Evidence is in `docs/french-validation/`.
- Browser screenshots reviewed for French policy, license inventory and Download. No physical screen-reader or mobile hardware validation is claimed.

## Publication hold
The French policies have the same draft status as the minimal KO/EN/ES v1.4/v1.2 release candidates. Selecting French opens those clearly marked drafts; it does not make them effective. Translation does not create another substantive version increment. No date is backdated.

Main merge/Pages publication remains held for the separately approved Play transition, Data safety alignment and actual publication/effective-date decision. Existing KO/EN/ES default versions and all historical version URLs remain unchanged. No app code/build, Play declaration, production deployment or merge was performed.
