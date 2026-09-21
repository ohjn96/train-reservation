// 저장소 좌표 한 곳. 포크했다면 여기만 고치면 된다.
export const OWNER = 'ohjn96';
export const REPO = 'train-reservation';
export const BRANCH = 'release';

export const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const ISSUES_URL = `${REPO_URL}/issues`;
export const NEW_REQUEST_URL = `${REPO_URL}/issues/new?template=license-request.yml`;
// 검사 ON/OFF 는 서명이 필요해 브라우저에서 못 한다. Actions 에서 클릭으로 바꾼다.
export const POLICY_RUN_URL = `${REPO_URL}/actions/workflows/license-policy.yml`;

// 만료가 이 일수 이하로 남으면 '곧 만료'로 본다 (자동 갱신 임계값 3일보다 넉넉하게)
export const SOON_DAYS = 7;
// license-renew.yml 이 실제로 갱신을 거는 기준
export const AUTORENEW_TRIGGER_DAYS = 3;
