import { defineStore } from 'pinia';
import type { AdminInfo } from "@/api/adminInfo/type.ts";

const defaultInfo: AdminInfo = {
  id: 0,
  phone: '',
  username: '',
  name: '',
  password: '',
  profilePath: '',
  updateTime: null,
  createTime: '',
  status: 2
};

export const useMineInfoStore = defineStore('mineInfo', {
  state: () => ({
    mine: defaultInfo
  }),
  actions: {
    setMineInfo (mine: AdminInfo) {
      this.mine  = mine;
    },
    reset () {
      this.$reset();
    }
  }
});
