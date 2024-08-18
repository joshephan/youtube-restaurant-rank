/**
 * Type > RDS Table 구조가 될 것
 */

/**
 * 추천 받은 메뉴
 */
export interface IMenu extends InsertedMenu {
  id: number; // 구분 아이디
}

export interface InsertedMenu {
  authorId: string; // 작성자 아이디
  name: string; // 메뉴의 이름
  price: number; // 가격
  restaurantId: number; // 참조할 식당 아이디
  description: string | null; // 설명
  imageSrc: string | null; // 메뉴 이미지
  category: string; // 양식, 한식, 일식 ... 나중에 enum 변경
}

/**
 * 식당의 수정 가능한 정보
 */
export type RestaurantEditableField = {
  name: string; // 식당의 이름
  heroBannerSrc?: string; // 식당 대표 이미지
  restaurant_menu?: IMenu[]; // 해당 영상에서 추천된 메뉴들
  locationText: string; // 도로명 주소 텍스트
  category: string; // 식당 차원에서의 카테고리(한식, 일식...)
  kakaomapUrl?: string; // 카카오맵 주소
  navermapUrl?: string; // 네이버맵 주소
  homepageUrl?: string; // 식당의 url
  latitude?: string; // 위도, 카카오맵 API 위도 경도 콜백으로 수신
  longitube?: string; // 경도
  youtubers?: TYoutuber[]; // 해당 식당을 추천한 유튜버 리스트
};

/**
 * 식당별 변경 기록
 */
export interface IRestaurantHistory extends RestaurantEditableField {
  id: number; // 구분 아이디
  authorId: string; // 작성자 아이디
}

/**
 * 식당 정보
 */
export interface IRestaurant extends RestaurantEditableField {
  id: number; // 프라이머리 키
  authorId: string; // 작성자 아이디
  createdAt?: Date; // 생성일
  updatedAt?: Date; // 최근 수정일
  history?: IRestaurantHistory[]; // 변경된 레코드
}

/**
 * 등록된 유튜버
 * @description 성시경: 200만명, 백종원: 600만명, 김짬뽕, 육식맨, 홍석천, 이원일, ...
 */
export type TYoutuber = {
  id: number; // int4, maximum value 21억 정도
  channelName: string; // 채널 이름
  channelUrl: string; // 채널 URL 주소
  subscriber: number; // 스코어 파워
  profileImage: string; // 프로필 이미지
  createdAt: Date;
  updatedAt: Date;
};
