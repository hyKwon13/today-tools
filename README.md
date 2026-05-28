# 오늘도구

서버리스/정적 배포를 전제로 만든 무료 생활 계산기 MVP입니다. 브라우저에서만 계산하므로 초기 버전에는 서버, DB, 로그인, 공인 IP, 인증서 관리가 필요 없습니다.

## 포함된 계산기

- 대출 월 상환액
- 목표 저축액
- 단가 비교
- 자동차 월 유지비
- 구독료 합산
- 결혼 예산 합산
- D-day 계산

## 실행

로컬 파일로 `index.html`을 열어도 동작합니다. 로컬 서버로 확인하려면:

```bash
python3 -m http.server 4173
```

그 다음 `http://localhost:4173`에서 확인합니다.

## 배포

Cloudflare Pages, Vercel, Netlify, GitHub Pages 같은 정적 호스팅에 그대로 올릴 수 있습니다.

권장 초기 운영:

1. GitHub 저장소에 push
2. Cloudflare Pages에서 저장소 연결
3. 기본 `*.pages.dev` 주소로 테스트
4. 트래픽이 생기면 도메인 연결

## 콘텐츠 아이디어 생성

```bash
node scripts/generate_content.mjs
```

결과는 `content/calculator-ideas-YYYY-MM-DD.json`, `content/calculator-briefs-YYYY-MM-DD.md`에 저장됩니다.

## 운영 원칙

- 개인정보 입력을 요구하지 않습니다.
- 입력값을 서버로 전송하거나 저장하지 않습니다.
- 금융/세금/노동법처럼 공식 기준이 필요한 계산기는 최신 기관 자료 확인 후 별도 구현합니다.
