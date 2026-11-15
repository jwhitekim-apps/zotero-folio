# entry

로그인 화면과 로그인 후 첫 화면(홈). 4개 capability로 들어가는 입구라서
별도 기능을 늘리지 않고 로그인 흐름과 안내 문구만 다룬다.

## Requirements

### Requirement: Login Without Leaving Folio Domain
로그인 흐름 SHALL 가능한 한 Folio 도메인 안에서 시작하고 끝나서, 사용자가 다른 사이트로 넘어간다고 느끼지 않게 한다.

#### Scenario: 로그인 버튼 클릭
- GIVEN 로그인하지 않은 사용자가 로그인 화면에 있다
- WHEN Zotero 로그인 버튼을 누른다
- THEN Zotero 인증은 팝업 창 등으로 처리되고, 원래 Folio 화면은 그대로 유지된 채 로그인 상태로 바뀐다

### Requirement: Document-Centered Copy
로그인 화면과 홈의 소개 문구 SHALL "연구"보다 PDF 등 문서를 읽고 메모하는 용도를 중심으로 표현한다.

#### Scenario: 소개 문구 확인
- GIVEN 논문이 아닌 일반 PDF 문서를 주로 보관하는 사용자가 있다
- WHEN 로그인 화면이나 홈 화면의 소개 문구를 읽는다
- THEN 문구에 연구 전용 도구로 오해할 표현이 없고, 문서 읽기와 메모라는 용도가 드러난다

### Requirement: Understated Home Greeting
홈 인사 영역 SHALL 사용자 아이디보다 서재 제목과 안내 문구가 먼저 눈에 들어오도록 아이디를 덜 강조한다.

#### Scenario: 긴 아이디로 홈 진입
- GIVEN Zotero 아이디가 긴 사용자(예: kim0102483)가 로그인했다
- WHEN 홈 화면을 연다
- THEN 아이디는 제목보다 작거나 약한 글씨로 표시되고, 화면에서 가장 큰 요소가 되지 않는다
