# KTX/SRT 열차 예약 — 배포

> **개인 사용 전용. 재배포·상업적 이용 금지**
>
> 소스/실행 파일의 재배포와 영리 목적 이용은 저작권자의 사전 서면 허가가 필요합니다.
> 자세한 조건은 [LICENSE](LICENSE) 를 보세요.

코레일 계정 하나로 KTX 와 SRT 를 함께 조회·예약하는 Windows 앱입니다.
**이 저장소는 배포와 라이선스 관리만 담당합니다.** 앱 소스는 비공개입니다.

---

## 받기

[**Releases**](https://github.com/ohjn96/train-reservation/releases) 에서
`TrainReservationApp-v<버전>.exe` 를 받아 더블클릭하면 끝입니다.
Python 설치가 필요 없고 브라우저가 자동으로 열립니다.
(검은 콘솔 창은 서버라 켜둬야 하고, 종료는 그 창에서 `Ctrl+C`)

## 라이선스 받기

앱은 **허가받은 PC 에서만** 동작할 수 있습니다.

```
1. 앱 실행 → [라이선스 요청하기] 클릭
   머신 ID 가 채워진 요청 폼이 열립니다
2. 이름과 용도를 적고 제출
3. 승인되면 앱이 알아서 활성화됩니다 (최대 5분)
```

복붙할 것이 없습니다. 라이선스 화면을 켜둔 채 기다리시면 됩니다.

- 라이선스는 **그 PC 에서만** 유효합니다. 다른 PC 로 옮기거나 남에게 넘겨줄 수 없습니다.
- 운영체제를 다시 설치하면 머신 ID 가 바뀌어 재발급이 필요합니다.
- 활성화된 뒤에는 인터넷 연결만 있으면 됩니다.

[요청 열기](https://github.com/ohjn96/train-reservation/issues/new?template=license-request.yml)
· [현황판](https://ohjn96.github.io/train-reservation/)
· [사용 안내](https://ohjn96.github.io/train-reservation/guide.html)

---

## 이 저장소에 들어있는 것

| | |
|---|---|
| `licenses/` | 발급된 라이선스. 머신에 묶여 있어 공개돼도 남이 쓸 수 없습니다 |
| `license-policy.json` | 라이선스 검사 ON/OFF 스위치 (서명됨) |
| `revoked.json` | 철회 목록 (서명됨) |
| `docs/` | 현황판 (GitHub Pages) |
| `scripts/`, `.github/` | 발급 자동화 |

발급자용 운영 문서는 [docs/LICENSING.md](docs/LICENSING.md) 에 있습니다.

## 예약 성공 후

이 앱은 **예약만** 합니다. 확인과 결제는 **코레일톡**에서 하세요
(마이 → 예약내역). 결제 기한(20분~1시간) 내에 결제하지 않으면 자동 취소됩니다.

## 면책

이 프로젝트는 한국철도공사(코레일) 및 에스알(SR)과 무관하며 승인받지 않았습니다.
이용자는 각 서비스의 이용약관과 관계 법령을 준수할 책임이 있고, 사용으로 발생한
모든 결과에 대한 책임은 이용자 본인에게 있습니다.
