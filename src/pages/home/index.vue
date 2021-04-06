<template>
  <div>
    <el-container>
      <el-header class="header">
        <img
          class="logo"
          src="https://img.cdn.sugarat.top/mdImg/MTYxNzYwODI3MDQ4OA==617608270488"
          alt="活动考勤助手"
        />
      </el-header>
      <el-main>
        <p>在此输入验证码</p>
        <div class="input-container" @input="handleInput">
          <el-input class="code" type="text" v-model="code1" maxlength="1" />
          <el-input class="code" type="text" v-model="code2" maxlength="1" />
          <el-input class="code" type="text" v-model="code3" maxlength="1" />
          <el-input class="code" type="text" v-model="code4" maxlength="1" />
        </div>
        <div>
          <el-button
            @click="handleLogin"
            :round="inputOk"
            :type="inputOk ? 'success' : 'primary'"
            >登录</el-button
          >
          <el-link
            style="margin-left:20px;"
            type="primary"
            @click="showMan = !showMan"
            >如何获取?</el-link
          >
        </div>
        <div class="tips" v-show="showMan">
          <el-steps :active="step" finish-status="success" simple>
            <el-step title="1 扫小程序码" icon="el-icon-mobile-phone"></el-step>
            <el-step
              title="2 选择右下角电脑访问"
              icon="el-icon-picture"
            ></el-step>
            <el-step title="3 刷新验证码" icon="el-icon-key"></el-step>
          </el-steps>
          <el-button
            class="next-btn"
            @click="
              () => {
                step = (step + 1) % 3;
              }
            "
            type="primary"
            >下一步</el-button
          >
          <div class="pics">
            <img
              v-show="step === 0"
              src="https://img.cdn.sugarat.top/mdImg/MTYxNzYwODI3MDQ4OA==617608270488"
              alt="小程序码"
            />
            <img
              v-show="step === 1"
              src="https://img.cdn.sugarat.top/mdImg/MTYxNzY4MTcwNjcwNQ==Screenshot_2021-04-06-12-01-13-667_com.tencent.mm.jpg"
              alt="主页"
            />
            <img
              v-show="step === 2"
              src="https://img.cdn.sugarat.top/mdImg/MTYxNzY4MTcxMDcxMA==Screenshot_2021-04-06-12-01-18-408_com.tencent.mm.jpg"
              alt="获取验证码"
            />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { MessageBox, Message } from "element-ui";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      code1: "",
      code2: "",
      code3: "",
      code4: "",
      showMan: false,
      step: 0
    };
  },
  methods: {
    ...mapActions("user", ["setToken"]),
    handleInput(e) {
      if (
        e.target.value.length === 1 &&
        e.target.parentElement.nextElementSibling
      ) {
        e.target.parentElement.nextElementSibling.children[0].focus();
      } else if (
        e.target.value.length === 0 &&
        e.target.parentElement.previousElementSibling
      ) {
        e.target.parentElement.previousElementSibling.children[0].focus();
      }
    },
    handleLogin() {
      if (this.code.length < 4) {
        MessageBox.alert("验证码为4位数字", "提示", {
          confirmButtonText: "确定",
          center: true
        });
        return;
      }
      this.$api.user.login(this.code).then(res => {
        const { data } = res;
        if (!data) {
          Message.error("验证码无效");
          this.clearInput();
          return;
        }
        this.setToken(data);
        Message.success("登录成功");
        this.redirectActivity();
      });
    },
    redirectActivity() {
      if (localStorage.getItem("token")) {
        this.$router.replace({
          name: "activity"
        });
      }
    },
    clearInput() {
      this.code1 = "";
      this.code2 = "";
      this.code3 = "";
      this.code4 = "";
    }
  },
  computed: {
    code() {
      const { code1, code2, code3, code4 } = this;
      return [code1, code2, code3, code4].join("");
    },
    inputOk() {
      return this.code.length === 4;
    }
  },
  mounted() {
    const { token } = this.$route.query;
    if (token) {
      this.setToken(token);
    }
  }
};
</script>

<style scoped>
.header {
  overflow: hidden;
  height: auto !important;
}
.logo {
  margin-top: 20px;
  max-width: 500px;
  width: 100%;
}
.input-container {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.code {
  text-align: center;
  font-weight: bold;
  font-size: 2rem;
  width: 40px;
  margin: 10px;
}

.code >>> input {
  text-align: center;
  padding: 0;
}
.tips {
  padding: 10px;
  width: 80%;
  margin: 0 auto;
}
.tips .pics {
  display: flex;
  justify-content: center;
}
.tips .pics img {
  max-width: 50%;
  margin: 10px;
}
.next-btn {
  margin: 10px;
}
</style>
