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

## API 테스트
1. 우측 링크를 클릭해서 postman으로 들어갑니다.[링크](https://web.postman.co/workspace/My-Workspace~9bdeda64-e679-40de-81a0-42c1c80bbf0a/collection/18448217-e8992032-d106-459c-add0-bf7ad3400551) 
2. 정의된 server가 올바른지 확인 합니다.(13.125.79.160:3000)

<img width="1059" alt="스크린샷 2021-11-22 오후 1 24 34" src="https://user-images.githubusercontent.com/81801012/142801119-449d758f-edd6-4fc6-b774-32fc2cbe76fd.png">


3. 이후, API 테스트를 시도해 주세요.

## 설치 및 실행 방법

### 프로젝트 설치

```
git clone https://github.com/Wanted-Free-Pre-Onboarding-Course-10/Assignment6.git

```

 ### 환경 구축 및 실행
```
//.env파일 존재해야 실행가능합니다.
npm install

docker-compose up

npm run start:dev
```

## 팀원

| 이름   | github                                          | 담당 역할                  | 회고록             |
| ------ | ----------------------------------------------- | -------------------------- |------------------|
| 박지율 | [earthkingman](https://github.com/earthkingman) |  할인규칙  |            |
| 염재선 | [Yeom Jae Seon](https://github.com/YeomJaeSeon) |  기본요금  | [회고록](https://yjs3819.tistory.com/72) |
| 김태희 | [김태희](https://github.com/godtaehee)           | 로그인기능, 벌금규칙  |             |
| 박상엽 | [큰형](  https://github.com/lotus0204)           |  벌금규칙  |            |


## 개발 과정

### 도메인 설계
- 변경에 유연한 설계를 위해선 '구현'(내부)와 '인터페이스'(외부)가 **분리**되어야 한다 생각했습니다.
- 그렇기 위해선 객체가 외부에 **꼭** 드러날 정보만 드러나야 한다 생각했습니다.
- 객체가 다른 객체에게 **요청할 메시지**만 외부에 드러나야 한다 생각했습니다.
- 그렇게 하기 위해선 시스템의 **구조**를 먼저 생각하고 기능은 구조에 종속되게 설계해야 한다 생각했습니다.


우리의 시스템을 바라보는 사용자의 멘탈모델인 **도메인 모델**부터 설계를 하였습니다.
<img width="1065" alt="스크린샷 2021-11-21 오후 5 16 54" src="https://user-images.githubusercontent.com/67785334/142754845-742c2c02-4202-4faa-9dd8-f439b783605c.png">

위 도메인 설계를 만드는 과정

1. 필요한 객체들이 무엇이 있는지 생각한다.
2. 객체가 책임을 실행할 때, 다른 객체에 요청할 메시지가 무엇인지 생각한다.
3. 해당 메시지를 요청받을 수 있는 객체를 생각한다.

- 메시지가 객체를 선택하게 하는 방법은 객체가 외부에 드러낼 인터페이스 수를 최소화 하는데 도와준다 생각합니다.
- 객체의 상태부터 생각하고 메시지를 고르면, 불필요한 정보가 외부에 드러날 수 있습니다.


### 인터페이스를 통한 역할과 구현의 분리
할인규칙과 벌금규칙은 미래에 수정될 수도, 추가될 수도 있습니다.
변경에 대비한 설계를 위해선, 벌금규칙, 할인규칙의 역할만 의존해야 한다 생각했습니다.

#### DIP
- 할인규칙과, 벌금규칙을 사용하는 클라이언트 코드는 추상화에만 의존하고, 구체화에는 의존하지 않아 DIP를 지키는 설계를 했습니다.

- 벌금 규칙 인터페이스
```typescript
export interface FineRuleService {
  applyFine(
    basicPayment: number,
    createChargeDto: CreateChargeDto,
  ): Promise<number>;
}
```
- 할인 규칙 인터페이스
```typescript
export interface DiscountRuleService {
  discount(
    user: User,
    createChargeDto: CreateChargeDto,
    finedMoneyResult,
    basic_fee,
  ): Promise<number>;
}
```

- 두 추상화에만 의존하는 클랑이언트 코드
```typescript
@Injectable()
export class ChargeService {
  constructor(
    private areaService: AreaService,
    @Inject('FineRuleService')
    private fineRuleService: FineRuleService,
    @Inject('DiscountRuleService')
    private discountRuleService: DiscountRuleService,
  ) {}
  async createCharge(
    @GetUser() user,
    createChargeDto: CreateChargeDto,
  ): Promise<number> {
    const basicPayment = await this.areaService.createBasicFee(createChargeDto); // 지역에따른 기본요금 생성

    const finedMoneyResult = await this.fineRuleService.applyFine(
      basicPayment.payment,
      createChargeDto,
    ); // 벌금규칙 적용

    const finalPayment = await this.discountRuleService.discount(
      user,
      createChargeDto,
      finedMoneyResult,
      basicPayment.basic_fee,
    ); //할인규칙 적용

    return finalPayment;
  }
}

```

- ChargeService객체는 할인규칙과, 벌금규칙의 추상화(인터페이스)에만 의존하고 있으므로 벌금규칙과 할인규칙의 현체(인터페이스를 구현한 클래스)가 추가 되었을 때, 클라이언트 코드인 ChargeService에는 변경의 여파가 없습니다.

#### OCP
- 확장에는 열려있지만 변경에는 닫혀있어야 합니다.
   - nestJS는 모듈 파일에서, 임포트할 구현체를 적어주면 클라이언트 코드의 생성자에선 자동으로 해당 구현체를 넣어주기에, 클라이언트 코드는 변경하지 않아도 됩니다. 즉, 확장에는 열려있고 수정에는 닫혀있는 설계가 되었습니다.

```typescript
@Injectable()
export class ChargeService {
  constructor(
    private areaService: AreaService,
    @Inject('FineRuleService')
    private fineRuleService: FineRuleService,
    @Inject('DiscountRuleService')
    private discountRuleService: DiscountRuleService,
  ) {}
```
- 생성자에 변경된 구현체를 주입해주지 않아도 변경할 구현체를 모듈파일에 임포트하기에, 확장은 되어도 변경은 없습니다.

### 공간 데이터 타입
- 지역은 polygon, 금지구역도 polygon, 파킹존은 point와 반지름의 원, 그리고 킥보드 반납지역은 point등으로 나타내어야 한다.
- 데이터베이스의 공간데이터 타입 필드를 이용했다.
- point가 polygon 내에 존재하는지 안하는지의 SQL
```typescript
    const foundArea = await this.manager.query(` 
    select * from area where ST_Contains(area.area_boundary, ST_GeomFromText('POINT(${parseFloat(
      lat,
    )} ${parseFloat(lng)})'));
    `);
```
- ST_Contains함수를 통해 area의 polygon(boundary)에 point가 포함이 되어있는지를 알 수 있다.

- 원인 파킹존에 킥보드를 반납했는 지를 알수 있는 쿼리
```typescript
    const foundArea = await this.manager.query(` 
        select * from parkingzone where ST_Contains((SELECT ST_BUFFER(parkingzone.parkingzone_center, parkingzone.parkingzone_radius)), ST_GeomFromText('POINT(${parseFloat(
          lat,
        )} ${parseFloat(lng)})'));
        `);
```

### 기본 데이터 생성

#### 지도 생성
- 기본 데이터가 제공되어있지 않았기에, 저희는 직접 지도를 만들고, 지도의 위도와 경도를 스스로 설정해 지역을 만들고, 금지구역, 파킹존 모두 설정하였습니다.
- 지도
<img width="273" alt="스크린샷 2021-11-21 오후 4 08 38" src="https://user-images.githubusercontent.com/67785334/142753067-225794e0-0bf7-4e3c-82d2-2944511cc557.png">
(빨간 구역은 금지구역, 동그라미는 파킹존)

#### 퀵보드 생성
- 퀵보드의 개수도 지역마다 정하여 설정하였습니다.

## 기능 시나리오

1. 로그인을 합니다.
   - 회원이면 로그인을 합니다.
   - 회원이 아니면 회원가입을 합니다.
2. 퀵보드를 모두 탄다음 퀵보드 이용정보(퀵보드의 이름, 퀵보드 반납 위도 경도, 퀵보드 시작시간과 종료시간)를 요청합니다.
   - 예외 규칙에 적용되는지 판단합니다.
      - 예외 규칙에 적용되면 예외 금액을 반납합니다.
      - 그렇지 않으면 기본 요금을 계산합니다.
   - 반납한 퀵보드의 지역에 따른 기본요금을 계산합니다.
   - 벌금 규칙에 적용되는지 확인합니다.
      - 벌금 규칙에 적용되면 기본금액에서 벌금 금액을 추가한다.
      - 그렇지 않으면 할인 규칙에 적용되는지 확인합니다.
   - 할인규칙이 적용되는지 확인합니다.
      - 할인 규칙에 적용되면 기본요금에서 할인 금액을 감소시킵니다.
      - 그렇지 않으면 기본 금액을 반환합니다. 

## 협업 방식

[잡초 협업하기](https://github.com/Wanted-Free-Pre-Onboarding-Course-10/Assignment2/wiki/%ED%98%91%EC%97%85-%EB%B0%A9%EC%8B%9D)
