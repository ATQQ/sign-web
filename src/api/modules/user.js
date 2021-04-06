import http from "../../utils/http";

function login(code) {
  return http.post("/user/login/code", {
    code
  });
}

export default {
  login
};
