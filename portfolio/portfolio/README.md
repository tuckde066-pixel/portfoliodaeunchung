# 포트폴리오 웹사이트

순수 HTML/CSS/JS 사이트입니다. 데이터베이스, 로그인, 빌드 과정이 없고 Vercel에 무료로 올릴 수 있습니다.

## 파일 구조

```
index.html     작품 목록 (연도별, 1열)
work.html      작품 상세 (이미지 여러 장 + 설명 + 이전/다음)
about.html     소개·CV·연락처 ← 직접 수정
css/style.css  색·폰트·간격
js/works.js    작품 목록 ← 작품 추가할 때 이 파일만 수정
js/main.js     화면을 그리는 코드 (수정할 필요 없음)
works/         작품 이미지 (작품마다 폴더 하나)
```

## 작품 추가하기

1. `works/` 안에 새 폴더를 만들고 이미지를 넣습니다. 예: `works/jute-2026-01/01.jpg`
2. `js/works.js`에서 `{ ... }` 블록 하나를 복사해 붙여 넣고 내용을 바꿉니다.
3. 블록 사이에 쉼표(,)가 있는지 확인합니다.

**이미지 팁**: 긴 변 2000px, JPG 품질 80% 정도로 내보내세요(Photoshop → 내보내기 → 다른 이름으로 내보내기). 한 장에 1MB 이하면 사이트가 빨라집니다. 파일 이름은 영문과 숫자로만 지어주세요.

## 내 컴퓨터에서 미리보기

`index.html`을 더블클릭하면 브라우저에서 열립니다.

## 처음 배포하기 (한 번만)

1. **GitHub**: github.com → New repository → 이름(예: `portfolio`) → Create.
   생성된 페이지의 "uploading an existing file"을 눌러 이 폴더 안의 **모든 파일과 폴더**를 끌어다 놓고 Commit합니다.
2. **Vercel**: vercel.com → Add New → Project → 방금 만든 저장소 Import →
   Framework Preset은 **Other** → Deploy.
3. 1분쯤 지나면 `프로젝트명.vercel.app` 주소가 생깁니다.
   주소를 바꾸려면 Vercel 프로젝트 → Settings → Domains에서 수정합니다.

## 이후 업데이트

GitHub 저장소에서 파일을 고치거나 새 이미지를 올리고 Commit하면 Vercel이 자동으로 다시 배포합니다.
- 이미지 추가: 저장소에서 `works` 폴더 → Add file → Upload files
- 작품 정보 수정: `js/works.js` 클릭 → 연필 아이콘 → 수정 → Commit changes

## 디자인 바꾸기

`css/style.css` 맨 위 `:root` 부분에서 배경색, 글자색, 회색, 폰트, 이미지 최대 너비를 바꿀 수 있습니다.
