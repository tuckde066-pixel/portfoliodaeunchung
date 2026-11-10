/*
  사이트 기본 정보 — 이름, 연락처, 왼쪽 메뉴 설정
*/
const SITE = {
  name: "DAEUN CHUNG",               // 영문 표기
  name: "",              
  email: "tuckde066@naver.com",            // 이메일 주소로 바꾸세요
  instagram: "https://www.instagram.com/choroknaraa/"  // 인스타그램 주소로 바꾸세요 (안 쓰면 "" 로 비우기)
};

/*
  왼쪽 메뉴에서 각 항목 아래에 세부 목록(작품 제목, 전시 제목, 글 제목)을 보여줄지
  true = 보여주기 / false = Works · Exhibition · Text · CV 네 줄만 보여주기
*/
const SIDEBAR_SUBLIST = {
  works: false,
  exhibitions: false,
  texts: false
};
