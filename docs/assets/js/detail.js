// 상세 (detail.html?id=MACHINE-ID)
import { loadAll } from './api.js';
import { AUTORENEW_TRIGGER_DAYS, ISSUES_URL } from './config.js';
import { describe } from './model.js';
import { $, autoMark, esc, mountTopbar, showError, span, state } from './ui.js';

mountTopbar('index.html');

const machineId = (new URLSearchParams(location.search).get('id') || '').toUpperCase();

function notFound() {
  $('body').innerHTML = `<div class="none">
    <h3>내역 없음</h3>
    <p><code>${esc(machineId || '머신 ID 없음')}</code> 앞으로 발급된 기록이 없음.
       발급된 적이 없거나 파일이 삭제됨.</p>
  </div>`;
}

function render(row) {
  document.title = `${row.machine_id} · 라이선스`;
  $('head').textContent = row.name || '이름 없음';

  const auto = row.autoRenew === null
    ? '꺼짐 · 만료 시 이슈로 알림'
    : `켜짐 · 만료 ${AUTORENEW_TRIGGER_DAYS}일 전에 ${row.autoRenew}일씩 연장`;

  const q = encodeURIComponent(`is:issue ${row.machine_id} in:title`);

  $('body').innerHTML = `
    <dl class="rows">
      <div><dt>상태</dt><dd>${state(row)}${autoMark(row)}</dd></div>
      <div><dt>머신 ID</dt><dd class="mid">${esc(row.machine_id)}</dd></div>
      <div><dt>유효기간</dt><dd style="flex:1">${span(row)}</dd></div>
      <div><dt>만료</dt><dd><span class="when">${esc(row.expiresOn)}</span>${
        row.inactive ? '' : ` <span style="color:var(--ink-3)">· ${row.daysLeft}일 남음</span>`}</dd></div>
      ${row.issuedOn ? `<div><dt>발급</dt><dd><span class="when">${esc(row.issuedOn)}</span></dd></div>` : ''}
      <div><dt>라이선스 ID</dt><dd class="mid">${esc(row.license_id)}</dd></div>
      <div><dt>자동 갱신</dt><dd>${esc(auto)}</dd></div>
    </dl>

    <h2>이 머신에 쓸 명령</h2>
    <p class="lede">해당 이슈에 댓글로. 알림 메일 답장도 동일.</p>
    <pre><b>/approve 30</b>      30일 연장
<b>/autorenew 30</b>    만료 ${AUTORENEW_TRIGGER_DAYS}일 전마다 30일씩 자동 연장
<b>/autorenew off</b>   자동 갱신 끄기
<b>/revoke</b>          이 PC 차단</pre>
    <a class="btn" target="_blank" rel="noopener noreferrer"
       href="${ISSUES_URL}?q=${q}">이 머신의 이슈 찾기</a>`;
}

async function load() {
  try {
    const data = await loadAll();
    const found = data.licenses.find((item) => item.machine_id === machineId);
    if (!found) { notFound(); return; }
    render(describe(found, { revoked: data.revoked, autorenew: data.autorenew }));
  } catch (err) {
    showError($('body'), err);
  }
}

load();
