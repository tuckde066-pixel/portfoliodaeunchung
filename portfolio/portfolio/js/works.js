/*
  작품 목록 — 작품을 추가할 때는 이 파일만 고치면 됩니다.

  1) works/ 폴더 안에 작품별 폴더를 만들고 이미지를 넣으세요. (예: works/jute-01/01.jpg)
  2) 아래 목록에 { ... } 블록 하나를 복사해서 내용을 바꾸세요.
     - slug   : 주소에 쓰일 영문 이름 (띄어쓰기 대신 -)  → /work?id=slug
     - year   : 연도 (숫자). 같은 연도끼리 자동으로 묶이고, 최신 연도가 위로 갑니다.
     - images : 첫 번째 이미지가 목록 화면의 대표 이미지가 됩니다.
                caption은 비워둬도 됩니다. (예: "앞면", "뒷면", "부분")
  3) 블록 사이에는 쉼표(,)를 꼭 넣으세요.
*/

const WORKS = [
  {
    slug: "sample-double",
    year: 2026,
    title: "작품 제목 (양면회화 예시)",
    titleEn: "Untitled (Double-sided)",
    medium: "황마에 아크릴, 양면",
    mediumEn: "Acrylic on jute, double-sided",
    size: "130 × 162 cm",
    images: [
      { src: "works/sample-double/01.jpg", caption: "앞면" },
      { src: "works/sample-double/02.jpg", caption: "뒷면" },
      { src: "works/sample-double/03.jpg", caption: "부분" }
    ],
    text: "작품 설명을 여기에 씁니다. 비워두면 표시되지 않습니다."
  },
  {
    slug: "sample-layer",
    year: 2026,
    title: "작품 제목 (확대중첩회화 예시)",
    titleEn: "Untitled (Enlarged layering)",
    medium: "황마에 유채",
    mediumEn: "Oil on jute",
    size: "100 × 80 cm",
    images: [
      { src: "works/sample-layer/01.jpg", caption: "" }
    ],
    text: ""
  },
  {
    slug: "sample-2025",
    year: 2025,
    title: "작품 제목",
    titleEn: "Untitled",
    medium: "혼합재료",
    mediumEn: "Mixed media",
    size: "가변크기",
    images: [
      { src: "works/sample-2025/01.jpg", caption: "" }
    ],
    text: ""
  }
];
