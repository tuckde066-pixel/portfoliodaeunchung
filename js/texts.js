/*
  글 목록 — 작가노트, 평론, 인터뷰 등을 추가할 때는 이 파일만 고치면 됩니다.

  아래 { ... } 블록 하나를 복사해서 내용을 바꾸세요.
    - slug   : 주소에 쓰일 영문 이름 (띄어쓰기 대신 -)
    - author : 글쓴이 (작가노트면 비워도 됩니다)
    - source : 출처 (전시 도록, 잡지 등. 비워도 됩니다)
    - body   : 본문. 백틱(`) 두 개 사이에 쓰면 엔터로 줄을 바꿔도 그대로 들어갑니다.
               본문 안에 백틱(`) 기호만 쓰지 마세요.
    - pdf    : PDF로 보여주고 싶으면 texts/ 폴더에 PDF를 올리고 경로를 적으세요. 없으면 "".
  블록 사이에는 쉼표(,)를 꼭 넣으세요.
*/

const TEXTS = [
  {
    slug: "artist-statement",
    year: 2026,
    title: "Statement",
    titleEn: "Artist Statement",
    author: "",
    source: "",
    body: `작가노트 첫 문단을 여기에 씁니다.

두 번째 문단입니다. 엔터를 두 번 치면 문단이 나뉩니다.`,
    pdf: ""
  },
  {
    slug: "sample-review",
    year: 2025,
    title: "평론 제목",
    titleEn: "",
    author: "필자 이름",
    source: "『전시 도록』",
    body: `평론 본문을 여기에 씁니다.`,
    pdf: ""
  }
];
