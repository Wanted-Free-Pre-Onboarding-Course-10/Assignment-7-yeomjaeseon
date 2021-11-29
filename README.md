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

| 이름   | github                                          | 회고록             |
| ------ | ----------------------------------------------- |------------------|         
| 염재선 | [Yeom Jae Seon](https://github.com/YeomJaeSeon)| [회고록](https://yjs3819.tistory.com/72) |

# 구현 방법
- 타이어를 저장할 때, 매번 카닥에 서버 내부에서 api를 요청하는 것보단, 이미 내 서버의 데이터베이스에 타이어가 있으면 요청할 필요가 없다 생각했다.
   - 그래서 데이터베이스에 trim이라는 테이블을 만들었다.
   - 클라이언트가 요청한 trimId중 이미 우리 데이터베이스에 해당 데이터가 있으면 카닥으로 api를 요청하지 않는다.
   - trimId에 대한 타이어 정보가 변경되지 않는다고 생각했다. 왜냐면 어떠한 버전에 출시된 차는 고유한 타이어 정보를 가지고 있기 떄문이다.
- DB에서 타이어, trim의 중복을 피하기 위해 연결테이블을 이용했다.
   - 한 사용자는 같은 종의 차도 여러개 가지고 있을 수 있고, 다른 종류의 차도 여러개 가질 수 있다.
   - 차도 한 차종을 여러명의 소유자가 소유할 수 있다 생각했다.
   - 연결테이블을 통해 trim 데이터의 중복을 피했다.
   - 연결테이블은 커스텀하게 만들었다. 왜냐면 한 사용자가 같은 종의 차를 여러대 가질 수 있기 때문이다.
- 조회는 소유자가 가지고 있는 차의 모든 타이어 정보를 응답해야 한다 생각했다.
   - 같은 종의 차를 여러대 가지고 있는 경우 하나의 타이어 정보만 응답해도 된다 생각하지만 고객 입장에선 자신이 소유한 차 대수만큼의 타이어 정보를 응답하는 것이 적절하다 생각하여 그렇게 구현했다.

## 프로젝트 구조
<img width="721" alt="스크린샷 2021-11-29 오전 10 49 27" src="https://user-images.githubusercontent.com/67785334/143796706-791032e5-b5bb-452d-a49c-7e2d3576b207.png">

- user, tire, trim, user-trim의 모듈은 각각 자신과 관련된 컨트롤러, 서비스 리파지토리, 엔티티, 디티오 등이 존재한다.
- user와 tire에는 컨트롤러와 서비스가 존재한다.
- tire서비스는 user repository, tire repository, trim repository, user-trim repository를 의존한다.

