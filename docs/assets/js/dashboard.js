// 현황 (index.html)
import { loadAll, openRequests } from './api.js?v=ed14db29';
import { AUTORENEW_TRIGGER_DAYS, NEW_REQUEST_URL, POLICY_RUN_URL } from './config.js?v=ed14db29';
import { describe, describePolicy, sortForDisplay, summarize } from './model.js?v=ed14db29';
import { $, autoMark, esc, mountTopbar, showError, span, state } from './ui.js?v=ed14db29';

mountTopbar('index.html');

const POLICY = {
  open:     { cls: '',        text: '검사 <b>꺼짐</b> · 누구나 사용 가능' },
  licensed: { cls: 'is-on',   text: '검사 <b>켜짐</b> · 허가된 PC 에서만 동작' },
  blocked:  { cls: 'is-stop', text: '<b>전면 차단</b> · 라이선스가 있어도 막힘' },
};

function renderPolicy(policy) {
  const view = describePolicy(policy);
  const shape = POLICY[view.mode] ?? POLICY.open;
  const box = $('policy');
  box.className = `statusline ${shape.cls}`;
  box.innerHTML = [
    '<span class="mark"></span>',
    `<span>${shape.text}</span>`,
    view.seq === null ? '' : `<span style="color:var(--ink-3);font-size:12.5px">seq ${view.seq}</span>`,
    `<a class="hint" href="${POLICY_RUN_URL}" target="_blank" rel="noopener noreferrer">Actions 에서 바꾸기 →</a>`,
    view.message ? `<span class="say">${esc(view.message)}</span>` : '',
  ].join('');
}

function renderRequests(list) {
  const box = $('requests');
  if (!list.length) { box.hidden = true; return; }

  box.hidden = false;
  box.innerHTML = `
    <h2>대기 중인 요청 <span style="color:var(--warn)">${list.length}</span></h2>
    <p class="lede">이슈를 열고 <code>/approve 30</code> 댓글. 휴대폰 GitHub 앱에서도 됨.</p>
    <ul class="queue">${list.map((r) => `
      <li><a href="${r.url}" target="_blank" rel="noopener noreferrer">
        <span class="no">#${r.number}</span>
        <span class="what">${esc(r.title)}</span>
        <span class="who">${esc(r.who)}</span>
      </a></li>`).join('')}</ul>`;
}

function renderTally(c) {
  const sep = '<span class="sep">·</span>';
  const auto = c.auto
    ? `${sep}자동 갱신 <b>${c.auto}</b>`
    : '';
  $('tally').innerHTML =
    `전체 <b>${c.total}</b>${sep}유효 <b>${c.valid}</b>${sep}` +
    `곧 만료 <b>${c.soon}</b>${sep}만료·철회 <b>${c.inactive}</b>${auto}`;
}

function nothingYet() {
  return `<div class="none">
    <h3>발급 내역 없음</h3>
    <p>승인된 라이선스가 여기에 쌓입니다.</p>
    <ol class="steps">
      <li><b>사용자가 요청</b> <span>— 앱의 [라이선스 요청하기]. 머신 ID 가 채워진 이슈가 열림</span></li>
      <li><b>승인</b> <span>— 알림 메일에 <code>/approve 30</code> 답장. 끝</span></li>
      <li><b>앱이 자동 활성화</b> <span>— 복붙 없음. 반영까지 최대 5분</span></li>
    </ol>
    <a class="btn" href="${NEW_REQUEST_URL}" target="_blank" rel="noopener noreferrer">요청 이슈 열기</a>
  </div>`;
}

function renderRows(rows) {
  const table = $('roster');
  const empty = $('rosterEmpty');

  if (!rows.length) {
    table.hidden = true;
    empty.innerHTML = nothingYet();
    empty.hidden = false;
    return;
  }

  table.hidden = false;
  empty.hidden = true;

  $('rows').innerHTML = sortForDisplay(rows).map((row) => `
    <tr class="${row.inactive ? 'is-done' : ''}">
      <td data-label="상태">${state(row)}${autoMark(row)}</td>
      <td data-label="머신 ID"><a class="mid"
          href="detail.html?id=${encodeURIComponent(row.machine_id)}">${esc(row.machine_id)}</a></td>
      <td data-label="대상">${esc(row.name || '—')}</td>
      <td data-label="유효기간">${span(row)}</td>
      <td data-label="만료"><span class="when">${esc(row.expiresOn)}</span></td>
      <td data-label="남음" class="r num">${row.inactive ? '—' : `${row.daysLeft}일`}</td>
    </tr>`).join('');
}

export async function refresh() {
  const btn = $('refresh');
  btn.disabled = true;

  try {
    const [data, requests] = await Promise.all([loadAll(), openRequests()]);
    const rows = data.licenses.map((item) =>
      describe(item, { revoked: data.revoked, autorenew: data.autorenew }));

    renderRequests(requests);
    renderPolicy(data.policy);
    renderRows(rows);
    renderTally(summarize(rows));
    $('updated').textContent = new Date().toLocaleString('ko-KR',
      { dateStyle: 'medium', timeStyle: 'short' });
    $('autoNote').textContent = summarize(rows).auto
      ? `자동 갱신 대상은 만료 ${AUTORENEW_TRIGGER_DAYS}일 전에 연장됨.`
      : '';
  } catch (err) {
    showError($('rosterEmpty'), err);
    $('rosterEmpty').hidden = false;
    $('roster').hidden = true;
  } finally {
    btn.disabled = false;
  }
}

$('refresh').addEventListener('click', refresh);
refresh();
