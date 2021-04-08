<template>
  <div>
    <h1>
      活动签到概况
    </h1>
    <div class="p10">
      <el-button icon="el-icon-refresh" round @click="loadData">刷新</el-button>
      <el-button icon="el-icon-download" round>导出</el-button>
    </div>
    <el-container v-if="column.length > 0">
      <el-main>
        <el-table
          :data="signData"
          style="width: 100%"
          height="500"
          :default-sort="{ prop: 'name', order: 'descending' }"
          border
          stripe
        >
          <el-table-column fixed prop="name" sortable label="名称" width="100">
          </el-table-column>
          <!-- 签到状况 -->
          <el-table-column
            v-for="(c, idx) in column"
            :key="c.signId"
            :label="`第${idx + 1}次`"
            width="120"
          >
            <template slot-scope="scope">
              <span style="margin-left: 10px">
                <span
                  style="font-size: 1.5rem;"
                  :style="{
                    color: RecordStatusColor[scope.row[c.signId].status]
                  }"
                >
                  <i :class="RecordStatusIcon[scope.row[c.signId].status]"></i>
                </span>
                {{ StatusText[scope.row[c.signId].status] }}
              </span>
            </template>
          </el-table-column>

          <!-- 合计 -->
          <el-table-column label="合计">
            <el-table-column
              width="120"
              sortable
              v-for="a in AnalyzeColumn"
              :key="a.label"
              :label="a.label"
              :prop="a.prop"
            >
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { Message } from "element-ui";
import {
  RecordStatusTagType,
  RecordStatusIcon,
  RecordStatus,
  RecordStatusColor,
  RecordStatusText
} from "@/constants";
export default {
  data() {
    return {
      RecordStatusTagType,
      RecordStatusIcon,
      RecordStatus,
      RecordStatusColor,
      signData: [],
      column: [],
      StatusText: {
        [RecordStatus.not]: "",
        [RecordStatus.success]: "",
        [RecordStatus.fail]: "签到失败",
        [RecordStatus.late]: "迟到",
        [RecordStatus.notArrived]: ""
      },
      AnalyzeColumn: Object.values(RecordStatus).map(v => {
        return {
          prop: `${v}`,
          label: RecordStatusText[v]
        };
      })
    };
  },
  methods: {
    loadData() {
      this.$api.activity.getActivityOverview(this.$route.query.id).then(res => {
        const { people, sign } = res.data;
        people.forEach(p => {
          Object.values(RecordStatus).forEach(v => {
            p[v] = 0;
          });
          sign.forEach(s => {
            const r = s.records.find(v => v.userId === p.userId) || {
              status: -1,
              rank: 0,
              tips: ""
            };
            p[r.status]++;
            p[s.signId] = r;
          });
        });
        this.signData = [...people, ...people, ...people];
        this.column = [...sign];
        Message.success("刷新完成");
      });
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style></style>
