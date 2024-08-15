/**
 * Type > RDS Table 구조가 될 것
 */

/**
 * 추천 받은 메뉴
 */
type TMenu = {
  name: string; // 메뉴의 이름
  price: number; // 가격
  imageSrc?: string; // 메뉴 이미지
  category: string; // 양식, 한식, 일식 ... 나중에 enum 변경
};

/**
 * 식당의 수정 가능한 정보
 */
export type RestorantEditableField = {
  name: string; // 식당의 이름
  menu: TMenu[]; // 해당 영상에서 추천된 메뉴들
  locationText: string; // 도로명 주소 텍스트
  category: string; // 식당 차원에서의 카테고리(한식, 일식...)
  kakaomapUrl?: string; // 카카오맵 주소
  navermapUrl?: string; // 네이버맵 주소
  homepageUrl?: string; // 식당의 url
  latitude?: string; // 위도, 카카오맵 API 위도 경도 콜백으로 수신
  longitube?: string; // 경도
  youtubers: TYoutuber[]; // 해당 식당을 추천한 유튜버 리스트
};

/**
 * 식당별 변경 기록
 */
export interface IRestorantHistory extends RestorantEditableField {
  id: string; // 구분 아이디
  authorId: string; // 작성자 아이디
}

/**
 * 식당 정보
 */
export interface IRestorant extends RestorantEditableField {
  id: string; // 프라이머리 키
  createdAt: Date; // 생성일
  updatedAt: Date; // 최근 수정일
  history: IRestorantHistory[]; // 변경된 레코드
}

/**
 * 등록된 유튜버
 * @description 성시경: 200만명, 백종원: 600만명, 김짬뽕, 육식맨, 홍석천, 이원일, ...
 */
export type TYoutuber = {
  id: string;
  channelName: string; // 채널 이름
  channelUrl: string; // 채널 URL 주소
  subscriber: number; // 스코어 파워
  profileImage: string; // 프로필 이미지
  createdAt: Date;
  updatedAt: Date;
};
