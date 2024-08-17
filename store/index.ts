import { IRestorant, IRestorantHistory, TYoutuber } from "@/types";
import { create } from "zustand";

// 맛집 리스트 저장, 캐시 처리
// GET 요청 덜 보내서 비용을 절감
// 저장 > Session
// 업데이트 주기가 길어도 됨

type restorantState = {
  list: IRestorant[];
};

const useRestorantList = create<restorantState>((set) => ({
  list: [], // 최대 1000개, CRUD
  add: (item: IRestorant) =>
    set((state: any) => ({
      list: [...state.list, item],
    })),
  // 모든 수정은 이곳에서 처리
  addHistory: (item: IRestorantHistory) =>
    set((state: any) => ({
      // 고민해서 작성
    })),
}));

type youtuberState = {
  list: TYoutuber[];
  setYoutuber: (list: TYoutuber[]) => void;
};

// 유튜버를 상태에 저장하고, 불러올 것임
// 마찬가지로 session 짱박아가지고 돈을 아낄거임
const useYoutuber = create<youtuberState>((set) => ({
  list: [], // 최대 1000개, CRUD
  setYoutuber: (list: TYoutuber[]) =>
    set(() => ({
      list: list,
    })),
}));

type TUser = {
  id: string;
  email: string;
  avatar_url: string;
  name: string;
  load: boolean;
  login: (user: any) => void;
  logout: () => void;
};

const useUser = create<TUser>((set) => ({
  id: "",
  email: "",
  avatar_url: "",
  name: "",
  load: false,
  // profileImageUrl: '', 서비스 비용 측면상 못 넣습니다
  login: (user: any) =>
    set(() => ({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar_url: user.avatar_url,
      load: true,
    })),
  logout: () =>
    set(() => ({
      id: "",
      email: "",
      name: "",
      avatar_url: "",
      load: false,
    })),
}));

export { useRestorantList, useUser, useYoutuber };
