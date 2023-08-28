<template>
  <div>
    <h1>
      活动签到概况
    </h1>
    <el-container v-if="column.length > 0">
      <el-main>
        <div class="p10">
          <el-button icon="el-icon-refresh" round @click="loadData"
            >刷新</el-button
          >
          <el-button icon="el-icon-download" round @click="download"
            >导出</el-button
          >
        </div>
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
    <div v-else>
      <h2>暂无签到数据</h2>
    </div>
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
} from "@/constants/index.js";
import { tableToEexcell } from "@/utils/excel";

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
        this.signData = [...people];
        this.column = [...sign];
        Message.success("刷新完成");
      });
    },
    download() {
      const headers = ["名称"];
      this.column.forEach((_, idx) => {
        headers.push(`第${idx + 1}次`);
      });
      this.AnalyzeColumn.forEach(v => {
        headers.push(v.label);
      });
      const data = this.signData.map(s => {
        const row = [s.name];
        this.column.forEach(c => {
          row.push(RecordStatusText[s[c.signId].status]);
        });
        this.AnalyzeColumn.forEach(a => {
          row.push(s[a.prop]);
        });
        return row;
      });
      tableToEexcell(
        headers,
        data,
        `${this.$route.query.title || Date.now()}.xls`
      );
      Message.success("导出完成");
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style></style>
