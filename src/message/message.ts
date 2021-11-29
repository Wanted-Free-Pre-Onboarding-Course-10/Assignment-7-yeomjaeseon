// == 200 == //
export const SIGNUP_SUCCESS_MSG = '회원가입 성공';
export const TIRE_SAVE_SUCCESS_MSG = '타이어 저장 성공';

// == 400 == //
export const DTO_NOT_EMPTY_MSG = '빈값은 유효하지 않습니다.';
export const DTO_PWD_REGEX_MSG =
  '비밀번호는 최소 8자, 최소 하나의 문자 및 하나의 숫자여야 합니다.';
export const DTO_SAVE_TIRE_ARRAY_MSG =
  '입력은 배열 형태이고 배열의 길이는 1부터 5까지 입니다.';
export const DTO_SAVE_TIRE_INTACT_MSG =
  '입력값 id, trimId는 비어있을 수 없습니다.';
export const DTO_SAVE_TIRE_TYPE_MSG =
  'id는 string, trimId는 number여야 합니다.';

// == 401 == //
export const USER_PWD_INCORRECT_EXCEPTION_MSG = '비밀번호가 다릅니다.';
export const LOGIN_NECESSARY_EXCEPTION_MSG = '로그인이 필요합니다.';

// == 404 == //
export const USER_NOT_FOUND_EXCEPTION_MSG = (username: string) =>
  `${username}의 유저가 존재하지 않습니다.`;

// == 409 == //
export const USER_DUPLICATE_EXCEPTION_MSG =
  '같은 이름의 회원이 이미 존재합니다.';

//== 500 == //
export const NOT_NORMAL_TIRE_DATA_EXCEPTION_MSG = (id) =>
  `${id} trim의 타이어 데이터가 정상이 아닙니다.`;
export const REQUEST_FAIL_EXCEPTION_MSG = (id) =>
  `${id} trim에 대한 데이터가 없어 요청 실패`;
