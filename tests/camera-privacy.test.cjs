const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '../public');
const load = relative => fs.readFileSync(path.join(root, relative), 'utf8');
const landing = load('camera/privacy/index.html');
const script = landing.match(/<script>([\s\S]*?)<\/script>/)[1];
function destination(language, search = '') {
  let destination = '';
  const location = { search, replace(url) { destination = url; } };
  vm.runInNewContext(script, { navigator: { language }, location, window: { location }, URLSearchParams });
  return destination;
}

test('camera privacy selects Korean or English fallback and pins Camera v1.1', () => {
  for (const language of ['ko', 'ko-KR', 'KO-kr'])
    assert.equal(destination(language), '/privacy/ko/v1.1/ko.html');
  for (const language of ['en', 'en-US', 'es-ES', 'fr-FR', '', undefined])
    assert.equal(destination(language), '/privacy/en/v1.1/en.html');
  for (const language of ['en-US', 'ko-KR'])
    assert.equal(destination(language, '?choose=1'), '');
});

test('camera privacy works without scripts and original policies switch EN/KO', () => {
  for (const [lang, other] of [['en', 'ko'], ['ko', 'en']]) {
    const url = `/privacy/${lang}/v1.1/${lang}.html`;
    assert.ok(landing.includes(`href="${url}"`));
    const policy = load(url.slice(1));
    assert.ok(policy.includes(`<html lang="${lang}">`));
    assert.ok(policy.includes(`href="/privacy/${other}/v1.1/${other}.html"`));
    assert.equal((policy.match(/<h2>\d+\./g) || []).length, 13);
    assert.doesNotMatch(policy, /QR|nearby participants|host\/member|임시 그룹|근거리 공유/);
  }
  assert.match(load('privacy/en/v1.1/en.html'), /camera app that captures and saves photos on your device/);
  assert.match(load('privacy/ko/v1.1/ko.html'), /기기에서 사진을 촬영하고 저장하는 카메라 앱/);
});

test('camera landing reuses responsive legal surface with no policy duplication', () => {
  assert.match(landing, /name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(landing, /href="\/assets\/legal.css"/);
  assert.match(landing, /lang="ko">한국어/);
  assert.doesNotMatch(landing, /<iframe|<table|<h2>/);
  const css = load('assets/legal.css');
  assert.match(css, /main\{max-width:880px;margin:0 auto;padding:32px 20px 56px/);
  assert.match(css, /flex-wrap:wrap/);
  assert.deepEqual(fs.readdirSync(path.join(root, 'camera/privacy')), ['index.html']);
});
