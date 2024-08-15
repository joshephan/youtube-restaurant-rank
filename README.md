# 유튜브 먹방 맛집의 랭킹을 보여주는 웹서비스

## 적용할 스택

- zustand
- supabase
- 배포: vercel, netlify, amplify, gcp ...

## 작동 방식

가정: 성시경, 육식맨, 수저, 김짬뽕, 백종원, 홍석천 이원일 셰프...

1. 성시경님 먹을텐데 채널에 올라온 맛집이 있다.
2. 포인트를 부여(성시경님 먹을텐데: +5점, 유튜버별 가중치: 구독자 숫자를 기준으로)
3. 여러 유튜버 분들이 추천한 맛집 점수와 목록
4. 지역별, 종류(한식, 양식, 중식, 일식...)별 분류해서 보고 싶음.

### 어떻게 맛집 위치 정보만 저장할 것인가?

- 사람들이 올릴 수 있도록 함
- 소셜 회원가입
- 직접 업로드 할 수 있도록
- 작성자가 잘못된 정보를 기입하는 경우에는 어떻게 할 것인가? 나무위키 스타일로 누구나 다 오버라이드
- 최초로 등록한 분들은 점수를 얻어서 랭킹에 올라가는

## 페이지 구성

- main: 랭킹 순으로 식당을 표기
- /auth: 로그인 콜백 페이지
- /login: 로그인 UI 
- [protected] profile: 닉네임 수정
- /r/{id}: 각 식당별 페이지
- /y/{id}: 유튜버 별 페이지
- /create: 신규 식당을 업로드
- /edit: 식당 정보 업데이트(히스토리 추가)
