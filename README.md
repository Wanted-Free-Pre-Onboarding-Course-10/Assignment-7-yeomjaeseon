# Assignment6
원티드 X 위코드 프리 온보딩 4주차 기업형 과제(카닥)

## 과제 구현사항

| 구현사항  | 구현 여부                                          |
|------- | ----------------------------------------------- |
| 회원가입 |  OK| 
| 로그인 |  OK| 
| 타이어 정보 저장 |  OK| 
| 타이어 정보 조회 |  OK| 


## 사용 스택

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white" />&nbsp;
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white" />&nbsp;
<img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white" />&nbsp;
<img src="https://img.shields.io/badge/TYPEORM-red?style=for-the-badge&logo=TYPEORM&logoColor=white" />&nbsp;
<img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=SQLite&logoColor=white" />&nbsp;
<img src="https://img.shields.io/badge/Amazon%20AWS-232F3E?style=for-the-badge&logo=Amazon%20AWS&logoColor=white" />&nbsp;
<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white" />&nbsp;



## DB 스키마
<img width="1022" alt="스크린샷 2021-11-29 오전 10 33 27" src="https://user-images.githubusercontent.com/67785334/143795659-62ab9bd8-c4e2-45f7-9ed0-69ce10ecd652.png">


## API
[API문서](https://documenter.getpostman.com/view/18448217/UVJcjwMt)
> 서버 주소 : 3.38.112.214:3000

## API 테스트
1. 우측 링크를 클릭해서 postman으로 들어갑니다.[링크](https://www.postman.com/navigation-operator-10694267/workspace/workspace/overview) 
2. 정의된 server가 올바른지 확인 합니다.(3.38.112.214:3000)
<img width="782" alt="스크린샷 2021-11-29 오전 11 26 30" src="https://user-images.githubusercontent.com/67785334/143799299-19e40f57-83c5-4696-93f4-2bc8a34e20da.png">


3. 이후, API 테스트를 시도해 주세요.
4. 만일 send버튼이 아래와 같이 비활성화되어 있을시 fork하여 테스트 해주시기 바랍니다.
<img width="473" alt="스크린샷 2021-11-29 오전 11 47 23" src="https://user-images.githubusercontent.com/67785334/143800886-5079c810-8c60-4c45-a3b2-1d89c726d3b4.png">
5. 타이어 저장과 조회는 인증이 필요하기에 테스트하기 위해선 아래 그림과 같이 Authorization 탭에 가서 Bearer Token을 선택해  로그인 성공 응답인 토큰을 입력하고 api실행하시면 됩니다.
<img width="1013" alt="스크린샷 2021-11-29 오전 11 48 50" src="https://user-images.githubusercontent.com/67785334/143801172-b5383816-d8c7-4f73-aa44-fa153fcc49df.png">


## 설치 및 실행 방법

### 프로젝트 설치

```
git clone https://github.com/Wanted-Free-Pre-Onboarding-Course-10/Assignment-7-yeomjaeseon
```

 ### 환경 구축 및 실행
```
npm install

npm run start
```
**.env파일 존재해야 로컬에서 실행가능합니다.**

- [env notion link](https://giant-warlock-7c1.notion.site/env-80191af806cb447abdb6fece2a84d02a)

## 팀원

| 이름   | github                                          |
| ------ | ----------------------------------------------- |       
| 염재선 | [Yeom Jae Seon](https://github.com/YeomJaeSeon)|

# 구현 방법
- 데이터베이스 설계
   - trim과 해당 trim의 타이어 정보는 DB내에서 중복이 없어야 한다 생각했다.
   - 그렇지만 유저는 여러 trim을 가질수 있고 trim도 여러 유저를 가질수 있으므로 다대다 관계를 생각했다.
   - 또한, 유저는 같은 trim종을 여러개 가질 수 있으므로 다대다 연결테이블을 커스텀하게 만들어, auto increment pk인 id필드를 추가했다. (외래키 두개를 pk로 이용한다면 유저는 같은 종류의 trim을 여러대 가질 수 없을 것이라 판단함)
- 회원가입
   - 유저는 아이디와 비밀번호 정보를 통해 회원가입 가능
   - 유저의 아이디는 unique해야한다. (아이디로 유저를 식별할수 있어야 하기에)
- 로그인
   - 유저의 아이디와 비밀번호를 통해 인증처리
   - 로그인 성공시, 바디에 jwt 토큰 응답
- 타이어 저장
   - jwt passport를 이용해 헤더에 인증 토큰을 넣어야만 요청 가능하다. (인증 처리)
   - 여러 유저의 타이어 저장 요청이 들어올시, 하나의 요청이라도 문제가 생기면 롤백을 해야한다 생각했다. 이는 트랜잭션을 이용했다. 또한, 타이어를 저장할 시, 연결테이블에도 trim에도, tire에도 insert가 나가는데, 도중 하나의 쿼리라도 문제가 생기면 해당 트랜잭션을 롤백처리해야 데이터 정합성 측면에서 적절하다 생각했다.
   - trimId에 매핑되는 타이어 정보는 변경되지 않는다고 생각했다. (타이어 정보를 저장하는 api입장에선 수정을 고려하면 안된다 생각했다. 추후에 수정이 필요하면 수정 api를 따로 만들어 수정 로직에서 변경을 판단해야 한다 생각했다.) 그래서 내 서버 DB에 trim정보가 있으면 카닥에게 api를 요청하지 않고 유저 - trim 연결테이블에 데이터만 저장했다. 반면 내 서버 DB에 trim정보가 없다면 카닥에게 api를 요청해 trim, tire정보를 insert하고 유저 - trim 연결테이블 데이터도 insert하였다.
- 타이어 조회
   - 헤더에 인증 토큰을 넣어야만 요청 가능하다. (인증 처리)
   - 같은 종의 차를 여러대 가지고 있는 경우 하나의 타이어 정보만 응답해도 된다 생각하지만 고객 입장에선 자신이 소유한 차 대수만큼의 타이어 정보를 응답하는 것이 적절하다 생각하여 그렇게 구현했다.

## 프로젝트 구조
<img width="721" alt="스크린샷 2021-11-29 오전 10 49 27" src="https://user-images.githubusercontent.com/67785334/143796706-791032e5-b5bb-452d-a49c-7e2d3576b207.png">

- user, tire, trim, user-trim의 모듈은 각각 자신과 관련된 컨트롤러, 서비스 리파지토리, 엔티티, 디티오 등이 존재한다.
- user와 tire에는 컨트롤러와 서비스가 존재한다.
- tire서비스는 user repository, tire repository, trim repository, user-trim repository를 의존한다.

## 회고내용 블로그 링크
[회고록]()
