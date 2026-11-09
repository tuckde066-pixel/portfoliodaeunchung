/*
  전시 목록 — 전시를 추가할 때는 이 파일만 고치면 됩니다.

  1) exhibitions/ 폴더 안에 전시별 폴더를 만들고 전시 전경 사진을 넣으세요.
     (예: exhibitions/2026-solo/01.jpg)
  2) 아래 { ... } 블록 하나를 복사해서 내용을 바꾸세요.
     - slug   : 주소에 쓰일 영문 이름 (띄어쓰기 대신 -)
     - type   : "Solo" 또는 "Group"  → 왼쪽 메뉴에서 이 이름으로 묶입니다
     - year   : 연도 (숫자). 최신 연도가 위로 갑니다.
     - images : 첫 번째 이미지가 전시 목록 화면의 대표 이미지가 됩니다.
     - text   : 전시 서문이나 설명. 문단 사이는 \n\n 으로 띄웁니다. 비워도 됩니다.
  3) 블록 사이에는 쉼표(,)를 꼭 넣으세요.
*/

const EXHIBITIONS = [
  {
    slug: "sample-solo",
    type: "Solo",
    year: 2026,
    title: "개인전 제목",
    titleEn: "Solo Exhibition Title",
    venue: "전시 공간, 서울",
    date: "2026.03.01 – 03.21",
    images: [
      { src: "exhibitions/sample-solo/01.jpg", caption: "전시 전경" },
      { src: "exhibitions/sample-solo/02.jpg", caption: "전시 전경" }
    ],
    text: "전시 서문을 여기에 씁니다.\n\n두 번째 문단입니다."
  },
  {
    slug: "sample-group",
    type: "Group",
    year: 2025,
    title: "단체전 제목",
    titleEn: "Group Exhibition Title",
    venue: "전시 공간, 서울",
    date: "2025.10.01 – 10.14",
    images: [
      { src: "exhibitions/sample-group/01.jpg", caption: "전시 전경" }
    ],
    text: ""
  }
];
