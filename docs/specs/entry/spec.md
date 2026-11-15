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

### Requirement: Consistent Library Naming
논문 목록 탭 SHALL 홈 버튼·뒤로 가기 버튼과 같은 이름("라이브러리")으로 표시해서, 같은 화면을 한 가지 이름으로 부른다.

#### Scenario: 탭 이름 확인
- GIVEN 사용자가 홈에서 "라이브러리 둘러보기" 버튼을 본 상태다
- WHEN 하단 또는 사이드 탭에서 두 번째 탭을 본다
- THEN 탭 이름이 "라이브러리"로 표시되어 버튼과 같은 화면임을 알 수 있다

### Requirement: Discoverable Usage Guide
처음 들어온 사용자 SHALL 별도 URL을 몰라도 사용 가이드(`/guide`)를 쉽게 찾을 수 있어야 한다.

#### Scenario: 첫 방문 사용자의 가이드 발견
- GIVEN 처음 Folio에 들어온 사용자가 로그인 화면이나 홈에 있다
- WHEN 무엇을 할 수 있는지 알아보려고 화면을 훑는다
- THEN 사용 가이드로 가는 진입점이 눈에 띄는 위치에 있다

### Requirement: Local Verification Login
개발자 SHALL Zotero 로그인 화면(사람 확인 절차 포함)을 거치지 않고 로컬 서버에서 기존 계정으로 로그인해 로그인 후 화면을 검증할 수 있어야 하며, 이 경로는 실제 서비스 도메인에서는 열리지 않아야 한다.

#### Scenario: 로컬에서 관리자 로그인
- GIVEN 서버 설정에 검증용 토큰과 계정 이름이 있고, 그 계정이 OAuth로 한 번 로그인한 적이 있다
- WHEN 개발자가 localhost 주소로 토큰을 붙여 검증용 로그인 주소를 연다
- THEN 그 계정으로 로그인된 홈 화면이 열린다

#### Scenario: 실제 서비스 도메인에서 접근
- GIVEN 같은 서버가 실제 서비스 도메인으로도 공개되어 있다
- WHEN 누군가 실제 서비스 도메인이나 틀린 토큰으로 검증용 로그인 주소를 연다
- THEN 페이지가 없는 것처럼 응답하고 로그인되지 않는다

### Requirement: Consistent Hover Feedback
버튼과 카드 SHALL 마우스를 올렸을 때 같은 방식(살짝 떠오름, 테두리·색 강조)으로 반응하고, 움직임 줄이기 설정을 켠 사용자에게는 움직이지 않아야 한다.

#### Scenario: 홈 버튼에 마우스 올리기
- GIVEN 사용자가 홈 화면에 있다
- WHEN 주요 버튼이나 보조 버튼에 마우스를 올린다
- THEN 두 버튼 모두 살짝 떠오르며 반응하고, 보조 버튼은 테두리가 강조색으로 바뀐다

### Requirement: Staggered Entrance Motion
홈·라이브러리·컬렉션·검색 화면 SHALL 열릴 때 위에서부터 차례로 짧게 나타나되, 긴 목록 때문에 마지막 항목을 오래 기다리지 않게 해야 한다.

#### Scenario: 라이브러리 화면 열기
- GIVEN 라이브러리에 문서가 여러 개 있다
- WHEN 사용자가 라이브러리 탭을 연다
- THEN 앞쪽 카드부터 차례로 나타나고, 8번째 이후 카드는 함께 나타나며, 1초 안에 모두 보인다

#### Scenario: 움직임 줄이기 설정
- GIVEN 사용자가 기기에서 움직임 줄이기를 켰다
- WHEN 같은 화면을 연다
- THEN 애니메이션 없이 바로 모든 내용이 보인다

### Requirement: Distinctive Home Hero
홈 첫 화면 SHALL 문서를 읽고 메모하는 차분한 분위기를 유지하면서, 글자 배치·대비 등으로 다른 서비스와 구별되는 인상을 줘야 한다.

#### Scenario: 홈 첫 화면 보기
- GIVEN 사용자가 로그인 후 홈에 들어왔다
- WHEN 첫 화면을 본다
- THEN 과한 움직임 없이도 Folio만의 시각적 특징이 드러난다

### Requirement: Remembered Login After Logout
로그인한 사용자 SHALL 로그아웃한 뒤에도 마지막 로그인으로부터 30일 안에는 Zotero 인증 화면 없이 로그인 버튼만으로 다시 들어올 수 있어야 한다.

#### Scenario: 로그아웃 후 다시 로그인
- GIVEN 사용자가 30일 안에 Zotero로 로그인한 적이 있고 방금 로그아웃했다
- WHEN 같은 브라우저에서 로그인 버튼을 누른다
- THEN Zotero 인증 화면 없이 바로 로그인된 홈으로 돌아온다

#### Scenario: 기간이 지났거나 변조된 기억 정보
- GIVEN 브라우저의 기억 정보가 30일이 지났거나 값이 바뀌었다
- WHEN 로그인 버튼을 누른다
- THEN 평소처럼 Zotero 인증 화면으로 이동한다

### Requirement: Consistent Editorial Page Style
읽기·메모 화면을 뺀 모든 화면(홈 통계·섹션, 라이브러리, 컬렉션, 검색, 사용 가이드, 안내 카드) SHALL 홈 첫 화면과 같은 잡지형 디자인 언어(굵은 윗줄, 강조색 마침표가 붙은 큰 제목, 상자 대신 가는 구분선)를 써서 화면을 옮겨도 같은 서비스로 느껴지게 한다.

#### Scenario: 홈에서 라이브러리로 이동
- GIVEN 사용자가 잡지형 머리글이 있는 홈을 보고 있다
- WHEN 라이브러리·컬렉션·검색 탭이나 사용 가이드로 이동한다
- THEN 제목 영역과 목록이 같은 선·글자 규칙으로 보이고, 목록 항목은 둥근 상자 대신 번호와 가는 줄로 구분된다

#### Scenario: 읽기 화면은 그대로
- GIVEN 사용자가 문서를 열어 원문과 메모를 나란히 보고 있다
- WHEN 화면을 본다
- THEN 잡지형 장식 없이 기존 읽기·메모 배치가 그대로 유지된다
