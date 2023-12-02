const INVALID_MONGO_ID = {
  STATUS_CODE: 401,
  MESSAGE: 'Id 형식이 일치하지 않습니다.',
};

const INVALID_JSON = {
  STATUS_CODE: 400,
  MESSAGE: '요청한 JSON 형식이 유효하지 않습니다.',
};

const USER_NOT_FOUND = {
  STATUS_CODE: 404,
  MESSAGE: '유저 정보가 존재하지 않습니다.',
};

const DUPLICATE_NICKNAME = {
  STATUS_CODE: 400,
  MESSAGE: '중복된 닉네임입니다.',
};

const SAME_NICKNAME = {
  STATUS_CODE: 400,
  MESSAGE: '이전과 같은 닉네임으로 변경할 수 없습니다.',
};

const MISSING_NICKNAME = {
  STATUS_CODE: 400,
  MESSAGE: '닉네임은 필수 입력 항목입니다. 공백으로 설정할 수 없습니다.',
};

const MISSING_PARAMETERS = {
  STATUS_CODE: 400,
  MESSAGE: '조회에 필요한 파라미터가 부족합니다.',
};

const POST_NOT_FOUND = {
  STATUS_CODE: 404,
  MESSAGE: '해당 포스트를 찾을 수 없습니다.',
};

const SIGNED_URL_CREATION_ERROR = {
  STATUS_CODE: '500',
  MESSAGE: 'signed URL 생성 오류입니다.',
};

const FILE_NOT_FOUND = {
  STATUS_CODE: 400,
  MESSAGE: '요청에서 파일을 찾을 수 없습니다.',
};

const USER_NOT_LOGGED_IN = {
  STATUS_CODE: 401,
  MESSAGE: '해당 포스트의 작성자일 경우 로그인 후 이용 가능합니다.',
};

const COMMENT_USER_NOT_LOGGED_IN = {
  STATUS_CODE: 401,
  MESSAGE: '해당 댓글의 작성자일 경우 로그인 후 이용 가능합니다.',
};

const NOT_POST_AUTHOR = {
  STATUS_CODE: 403,
  MESSAGE: '포스트의 작성자가 아닙니다.',
};

const NOT_COMMENT_AUTHOR = {
  STATUS_CODE: 403,
  MESSAGE: '댓글의 작성자가 아닙니다.',
};

const UNAUTHORIZED_USER = {
  STATUS_CODE: 403,
  MESSAGE: '자신의 프로필만 조회할 수 있습니다.',
};

const MISSING_POST_FIELDS = {
  STATUS_CODE: 404,
  MESSAGE: '포스트 내용이 없습니다.',
};

const MONGODB_URI_NOT_FOUND =
  'Please define the MONGODB_URI environment variable inside .env';

const POST_LOADING_ERROR = '포스트를 불러오는 중 문제가 발생하였습니다.';

const TITLE_CONTENT_REQUIRED = '제목과 내용을 모두 작성해주세요.';

const EDITOR_EDIT_FAILED = '수정에 실패하였습니다. 다시 시도해주세요.';

const EDITOR_SAVE_FAILED = '저장에 실패하였습니다. 다시 시도해주세요.';

const PROFILE_LOADING_ERROR = '프로필을 불러오는 중 문제가 발생했습니다.';

const UNKNOWN_ERROR = '알 수 없는 오류가 발생했습니다.';

const LOGIN_REQUIRED = '로그인이 필요합니다.';

export const ERRORS = {
  INVALID_MONGO_ID,
  INVALID_JSON,
  USER_NOT_FOUND,
  DUPLICATE_NICKNAME,
  SAME_NICKNAME,
  MISSING_NICKNAME,
  MISSING_PARAMETERS,
  POST_NOT_FOUND,
  SIGNED_URL_CREATION_ERROR,
  FILE_NOT_FOUND,
  USER_NOT_LOGGED_IN,
  NOT_POST_AUTHOR,
  NOT_COMMENT_AUTHOR,
  UNAUTHORIZED_USER,
  COMMENT_USER_NOT_LOGGED_IN,
  MONGODB_URI_NOT_FOUND,
  POST_LOADING_ERROR,
  TITLE_CONTENT_REQUIRED,
  EDITOR_EDIT_FAILED,
  EDITOR_SAVE_FAILED,
  PROFILE_LOADING_ERROR,
  UNKNOWN_ERROR,
  LOGIN_REQUIRED,
  MISSING_POST_FIELDS,
};
