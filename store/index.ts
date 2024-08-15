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
};

// 유튜버를 상태에 저장하고, 불러올 것임
// 마찬가지로 session 짱박아가지고 돈을 아낄거임
const useYoutuber = create<youtuberState>((set) => ({
  list: [], // 최대 1000개, CRUD
  init: (list: TYoutuber[]) =>
    set(() => ({
      list: list,
    })),
}));

const useUser = create((set) => ({
  id: "",
  nickname: "", // 수정을 제공
  createdAt: "", // 가입일
  updatedAt: "", // 최종 수정일
  // profileImageUrl: '', 서비스 비용 측면상 못 넣습니다
  login: (user: any) =>
    set(() => ({
      id: user.id,
      nickname: user.nickname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
  logout: () =>
    set(() => ({
      id: "",
      nickname: "",
      createdAt: "",
      updatedAt: "",
    })),
  editNickname: (nickname: string) => set(() => ({ nickname })),
}));

export { useRestorantList, useUser, useYoutuber };
