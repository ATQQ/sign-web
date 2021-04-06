<template>
  <div class="sign-list">
    <el-container>
      <el-aside width="500px">
        <h1>创建新签到</h1>
        <div class="create-sign">
          <el-input
            placeholder="请输入签到持续市场"
            v-model="time"
            type="number"
            class="input-with-select"
          >
            <el-button slot="prepend">二维码签到</el-button>
            <el-button slot="append">min</el-button>
          </el-input>
          <el-button class="begin" type="success" @click="startNew"
            >开始</el-button
          >
        </div>
        <h1>所有签到表</h1>
        <el-collapse accordion class="all-signs" @change="handleCheckDetail">
          <el-collapse-item
            v-for="(s, idx) in signs"
            :key="s.signId"
            :name="s.signId"
          >
            <template slot="title">
              {{ `第${signs.length - idx}次签到` }}
              <el-tag class="status-tag" :type="statusTag[s.status]">
                {{ SignStatusText[s.status] }}
              </el-tag>
            </template>
            <div>
              <ul>
                <li>
                  开始时间:
                  {{ new Date(s.startTime).Format("yyyy-MM-dd hh:mm:ss") }}
                </li>
                <li>
                  结束时间:
                  {{ new Date(s.endTime).Format("yyyy-MM-dd hh:mm:ss") }}
                </li>
                <li>
                  签到方式:
                  <span class="sign-method">
                    {{ s.method.includes(1) ? "二维码" : "" }}
                  </span>
                  <span class="sign-method">
                    {{ s.method.includes(2) ? "定位" : "" }}
                  </span>
                </li>
              </ul>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { Message } from "element-ui";
import { SignStatusText, SignStatus } from "@/constants";
export default {
  data() {
    return {
      time: 5,
      activityId: "",
      stop: false,
      SignStatusText: SignStatusText,
      statusTag: {
        [SignStatus.ing]: "success",
        [SignStatus.over]: "danger",
        [SignStatus.pause]: "primary"
      }
    };
  },
  computed: {
    ...mapState("sign", ["signList"]),
    signs() {
      return this.signList.slice(0).reverse();
    }
  },
  methods: {
    ...mapActions("sign", ["getSignListByActivityId"]),
    startNew() {
      // 默认位置四川省政府
      this.$api.sign
        .createNewSign(this.activityId, [1], this.time, {
          latitude: 30.65089,
          longitude: 104.07572
        })
        .then(() => {
          Message.success("创建成功");
        });
    },
    refresh() {
      setTimeout(() => {
        if (this.stop) return;
        this.getSignListByActivityId(this.activityId);
        this.refresh();
      }, 1000);
    },
    handleCheckDetail(signId) {
      if (!signId) {
        return;
      }
      console.log(signId);
    }
  },
  mounted() {
    this.activityId = this.$route.query.id;
    this.refresh();
  },
  beforeDestroy() {
    this.stop = true;
  }
};
</script>

<style scoped>
.sign-list {
  padding: 10px;
}
.create-sign {
  width: 80%;
  margin: 15px auto;
  display: flex;
}
.begin {
  margin-left: 10px;
}
.all-signs {
  padding: 15px;
  overflow-y: scroll;
  height: calc(100vh - 300px);
}
.status-tag {
  margin-left: 10px;
}
.sign-method {
  margin-left: 10px;
}
</style>
