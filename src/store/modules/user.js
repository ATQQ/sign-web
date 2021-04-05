const state = {
  token: localStorage.getItem("token"),
  avatar: "/static/logo.png",
  nickname: "未登录",
  gender: 1
};

const mutations = {
  setToken(state, payload) {
    state.token = payload;
    localStorage.setItem("token", payload);
  },
  clearToken(state) {
    state.token = "";
  },
  setUserInfo(state, payload) {
    const { avatar, nickname, gender } = payload;
    state.avatar = avatar;
    state.nickname = nickname;
    state.gender = gender;
  }
};

const actions = {
  setUserInfo(context, payload) {
    context.commit("setUserInfo", payload);
  },
  setToken({ commit }, payload) {
    commit("setToken", payload);
  }
};
export default {
  namespaced: true,
  state,
  actions,
  mutations
};
