// 저장소 좌표 한 곳. 포크했다면 여기만 고치면 된다.
export const OWNER = 'ohjn96';
export const REPO = 'train-reservation';
export const BRANCH = 'release';

export const RAW_BASE = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}`;
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const ISSUES_URL = `${REPO_URL}/issues`;
export const NEW_REQUEST_URL = `${REPO_URL}/issues/new?template=license-request.yml`;
// 조작은 전부 GitHub 에서 한다 — 이 페이지에는 키도 인증도 없다.
// 검사 ON/OFF 워크플로는 비공개 저장소에 있다 (주인만 접근 가능).
export const ADMIN_REPO = 'ohjn96/private_train';
export const POLICY_RUN_URL =
  `https://github.com/${ADMIN_REPO}/actions/workflows/license-policy.yml`;

// 공개 저장소의 이슈는 인증 없이 읽힌다 (시간당 60회 제한)
export const OPEN_REQUESTS_API =
  `https://api.github.com/repos/${OWNER}/${REPO}/issues` +
  '?state=open&labels=license-request&per_page=20';

// 만료가 이 일수 이하로 남으면 '곧 만료'로 본다 (자동 갱신 임계값 3일보다 넉넉하게)
export const SOON_DAYS = 7;
// license-renew.yml 이 실제로 갱신을 거는 기준
export const AUTORENEW_TRIGGER_DAYS = 3;
