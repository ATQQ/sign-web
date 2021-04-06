<template>
  <el-container>
    <el-main>
      <h1 v-if="!signId">请在左侧选择要展示的签到</h1>
      <div v-else>
        <h1
          :class="{
            onlyGPS
          }"
        >
          <el-tag
            style="margin-right:20px"
            :type="statusTag[signDetail.status]"
          >
            {{ SignStatusText[signDetail.status] }}
          </el-tag>
          <span v-if="signDetail.status !== SignStatus.ing"
            >加入活动口令
            <span style="color:black;">{{ activityPwd }}</span></span
          >
          <span
            v-if="
              signDetail.method.includes(2) &&
                SignStatus.ing === signDetail.status
            "
          >
            定位签到口令
            <span style="color:red;">{{ signDetail.pwd }}</span>
          </span>
          <span class="p10" v-if="signDetail.status === SignStatus.ing">
            剩余时间:{{ rTime }}
          </span>
        </h1>
        <div v-show="SignStatus.ing === signDetail.status">
          <div class="qrcode" v-if="signDetail.method.includes(1)">
            <div class="p10">
              <el-button icon="el-icon-minus" circle @click="scale -= 0.1">
              </el-button>
              <el-button icon="el-icon-plus" circle @click="scale += 0.1">
              </el-button>
            </div>
            <qr-code
              :value="qcValue"
              :style="{
                width: `${scale * 500}px`,
                height: `${scale * 500}px`
              }"
            />
          </div>
        </div>
      </div>
    </el-main>
    <el-aside width="300px" style="z-index: 1;background: #fff;">
      <h1>签到概况</h1>
      <div class="p10">
        <el-progress
          :text-inside="true"
          :stroke-width="24"
          :percentage="successPer"
          status="success"
        ></el-progress>
        <div class="p10">
          <el-select v-model="filter" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="p10">
          <div>
            活动总人数:{{ activityPeople.length }},当前状态人数:{{
              records.length
            }}
          </div>
          <div class="p10">
            <el-collapse v-model="activePeople" accordion>
              <el-collapse-item
                v-for="(d, idx) in records"
                :key="idx"
                :name="idx"
              >
                <template slot="title">
                  <div class="peopleName">
                    {{ d.name }}
                    <el-tag :type="RecordStatusTagType[d.status]">
                      {{ RecordStatusText[d.status] }}
                    </el-tag>
                    <span
                      class="rank"
                      v-show="
                        d.status === RecordStatus.success ||
                          d.status === RecordStatus.late
                      "
                      >{{ d.rank }}</span
                    >
                  </div>
                </template>
                <div v-if="d.status === RecordStatus.not">无签到详细数据</div>
                <div v-else>
                  <div v-show="d.rank">第 {{ d.rank }} 个参与签到</div>
                  <div>
                    时间:
                    {{ new Date(d.lastTime).Format("yyyy-MM-dd hh:mm:ss") }}
                  </div>
                  <div>方式: {{ SignMethodText[d.method] }}</div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import { mapState, mapGetters, mapActions } from "vuex";
import {
  SignStatusText,
  SignStatus,
  RecordStatusText,
  RecordStatus,
  RecordStatusTagType,
  SignMethodText
} from "@/constants";

import QrCode from "@/components/QrCode.vue";
export default {
  name: "signDetail",
  props: {
    signId: {
      type: String
    }
  },
  components: {
    QrCode
  },
  data() {
    return {
      SignStatusText,
      RecordStatusText,
      RecordStatus,
      SignStatus,
      RecordStatusTagType,
      SignMethodText,
      signData: {},
      time: 0,
      stop: false,
      timer: null,
      filter: "all",
      options: [
        {
          value: "all",
          label: "全部"
        },
        {
          value: "not",
          label: "未签到"
        },
        {
          value: "success",
          label: "成功"
        },
        {
          value: "fail",
          label: "失败"
        },
        {
          value: "late",
          label: "迟到"
        },
        {
          value: "notArrived",
          label: "旷课"
        }
      ],
      statusTag: {
        [SignStatus.ing]: "success",
        [SignStatus.over]: "danger",
        [SignStatus.pause]: "primary"
      },
      remainTime: 0,
      scale: 1,
      activePeople: ""
    };
  },
  methods: {
    ...mapActions("people", ["getActivityPeopleById"]),
    ...mapActions("record", ["getSignRecordsById"]),
    handleFilterChange(e) {
      this.filter = e.detail.name;
    },
    handleSelectorChange(e) {
      this.time = +e.detail.value;
    },
    refresh() {
      if (this.stop) return;
      if (!this.signData || !this.signData.activityId) {
        this.timer = setTimeout(this.refresh, 1200);
      } else {
        this.getActivityPeopleById(this.signData.activityId)
          .then(() => {
            return this.getSignRecordsById(this.signData.signId);
          })
          .then(() => {
            this.timer = setTimeout(this.refresh, 1200);
          })
          .catch(() => {
            this.timer = setTimeout(this.refresh, 1200);
          });
      }
    }
  },
  computed: {
    ...mapState("sign", ["signList"]),
    ...mapGetters("activity", ["getActivityById"]),
    ...mapState("people", ["activityPeople"]),
    ...mapState("record", ["signRecords"]),
    successPer() {
      const sum = this.activityPeople.length;
      const success = this.signRecords.filter(s => {
        return (
          s.status === this.RecordStatus.success ||
          s.status === this.RecordStatus.late
        );
      }).length;
      return +~~((success / sum) * 100);
    },
    activityPwd() {
      return (
        this?.signDetail?.activityId &&
        this.getActivityById(this.signDetail.activityId).pwd
      );
    },
    signDetail() {
      this.signData = this.signList.find(v => v.signId === this.signId);
      if (!this.signData) {
        return this.signData;
      }
      const { status, endTime } = this.signData;
      if (status === this.SignStatus.ing && this.remainTime === 0) {
        this.remainTime = new Date(endTime).getTime() - Date.now();
      } else if (status !== this.SignStatus.ing) {
        this.remainTime = 0;
      }
      return this.signData;
    },
    records() {
      const data = this.activityPeople
        .map(p => {
          const record = this.signRecords.find(v => v.userId === p.userId) || {
            status: -1,
            rank: 0,
            tips: ""
          };
          return {
            ...record,
            name: p.name,
            userId: p.userId,
            peopleId: p.peopleId,
            status: record.status,
            rank: record.rank,
            recordId: record.recordId,
            tips: record.tips,
            signId: this.signId
          };
        })
        .filter(d => {
          if (this.filter === "all") return true;
          if (this.filter === "not") return d.status === -1;
          return d.status === RecordStatus[this.filter];
        })
        .sort((a, b) => {
          return a.rank - b.rank;
        });
      return data;
    },
    rTime() {
      if (this.remainTime < 1000) {
        return "";
      }
      const min = ~~(this.remainTime / 1000 / 60);
      const second = ~~(this.remainTime / 1000 - min * 60);
      this.remainTime = new Date(this.signData.endTime).getTime() - Date.now();
      return `${min}分${second}秒`;
    },
    qcValue() {
      if (this?.signDetail?.qrcode) {
        return JSON.stringify({
          type: "sign",
          qrcode: this.signDetail.qrcode
        });
      }
      return JSON.stringify({
        type: "sign",
        qrcode: "none"
      });
    },
    onlyGPS() {
      return (
        this?.signDetail?.status === SignStatus.ing &&
        this?.signDetail?.method.length === 1 &&
        this.signDetail.method.includes(2)
      );
    }
  },
  watch: {
    signId(to, from) {
      if (to !== from && to) {
        clearTimeout(this.timer);
        this.refresh();
      }
    }
  },
  beforeDestroy() {
    this.stop = true;
  }
};
</script>

<style scoped>
.status {
  display: flex;
  align-items: center;
  justify-content: center;
}
.onlyGPS {
  position: absolute;
  top: 20%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 5.5rem;
}
.peopleName::first-letter {
  font-weight: bold;
  font-size: 2rem;
}
.peopleName {
  font-size: 1.5rem;
}
</style>
