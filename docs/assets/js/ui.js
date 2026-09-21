// 페이지들이 함께 쓰는 조각.
import { ISSUES_URL, REPO_URL } from './config.js?v=ed14db29';

export function $(id) {
  const el = document.getElementById(id);
  if (!el) {
    // 대개 브라우저가 옛 js 를 캐시한 채 새 HTML 을 받은 경우다.
    throw new Error(`화면 요소 '${id}' 를 찾지 못했습니다. ` +
                    '강력 새로고침(Ctrl+Shift+R) 후 다시 시도해주세요.');
  }
  return el;
}

/** 문자열을 HTML 에 넣기 전 반드시 통과. */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[ch]));
}

const KIND = { valid: 'ok', soon: 'warn', expired: 'off', revoked: 'crit' };

/** 상태 표시. 색만으로 읽히지 않도록 글자를 함께 낸다. */
export function state(row) {
  return `<span class="state ${KIND[row.status] ?? 'off'}">${esc(row.statusLabel)}</span>`;
}

export function autoMark(row) {
  if (row.autoRenew === null) return '';
  const text = row.renewingSoon ? `갱신 예정 +${row.autoRenew}일` : `자동 ${row.autoRenew}일`;
  return ` <span class="auto">${esc(text)}</span>`;
}

/** 유효기간 막대 — 발급 구간 중 남은 만큼. */
export function span(row) {
  if (row.inactive || row.remaining === null) return '<div class="span done"></div>';
  const pct = Math.max(2, Math.round(row.remaining * 100));
  return `<div class="span${row.status === 'soon' ? ' warn' : ''}" style="--left:${pct}%"
               role="img" aria-label="유효기간 ${pct}% 남음"></div>`;
}

export function mountTopbar(current) {
  const pages = [['index.html', '현황'], ['guide.html', '안내']];
  const links = pages.map(([href, label]) =>
    `<a href="${href}"${href === current ? ' aria-current="page"' : ''}>${label}</a>`).join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <header class="topbar">
      <div class="wrap">
        <a class="brand" href="index.html">KTX/SRT 예약 · 라이선스</a>
        <nav class="nav">
          ${links}
          <a href="${ISSUES_URL}" target="_blank" rel="noopener noreferrer">요청함</a>
          <a href="${REPO_URL}" target="_blank" rel="noopener noreferrer">저장소</a>
        </nav>
      </div>
    </header>`);
}

export function showError(container, err) {
  container.innerHTML = `<div class="none">
    <h3>불러오기 실패</h3><p>${esc(err.message)}</p></div>`;
}
