<script setup lang="ts">
// 按需引入 ECharts
import * as echarts from 'echarts/core';
import {
  BarChart,
  PieChart
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import DynamicIcon from "@/components/icon/DynamicIcon.vue";

// 注册 ECharts 组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  PieChart,
  CanvasRenderer
]);

// --- 顶部统计卡片数据 ---
const topCards = ref([
  { title: '课程总计', value: 34, icon: 'Monitor', color: '#40c9c6' },
  { title: '会员总计', value: 666, icon: 'User', color: '#36a3f7' },
  { title: '学时总计', value: 676868, icon: 'Goods', color: '#f4516c' },
  { title: '题目统计', value: 259, icon: 'Tickets', color: '#9d79e4' }
]);

// --- ECharts 实例和图表容器引用 ---
const barChartRef = ref<HTMLElement | null>(null);
const pieChartRef = ref<HTMLElement | null>(null);
// 使用 shallowRef 避免 ECharts 实例被深度代理
const barChartInstance = shallowRef<echarts.ECharts | null>(null);
const pieChartInstance = shallowRef<echarts.ECharts | null>(null);

// --- 访问统计 (柱状图) 配置 ---
const barChartOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['访问量', '访问用户'],
    top: '2%',
    textStyle: {
      color: '#666'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '访问量',
      type: 'bar',
      barWidth: '40%',
      data: [1220000, 420000, 180000, 120000, 850000, 380000, 200000, 250000, 780000, 450000, 1100000, 280000],
      itemStyle: {
        color: '#52c5c9'
      }
    },
    {
      name: '访问用户',
      type: 'bar',
      barWidth: '40%',
      data: [410000, 180000, 100000, 100000, 350000, 120000, 100000, 150000, 300000, 250000, 450000, 120000],
      itemStyle: {
        color: '#6e7eee'
      }
    }
  ]
};

// --- 课程占比 (饼图) 配置 ---
const pieChartOption = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    top: 'middle'
  },
  series: [
    {
      name: '课程分类',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: '随到随学', itemStyle: { color: '#41c8c8' } },
        { value: 735, name: '直播课程', itemStyle: { color: '#9c7de5' } },
        { value: 580, name: '录播课程', itemStyle: { color: '#f5516d' } },
        { value: 484, name: '精品小班', itemStyle: { color: '#506687' } },
        { value: 300, name: '其他', itemStyle: { color: '#b9b9b9' } }
      ]
    }
  ]
};

// --- 热门课程表格数据 ---
const hotCourses = ref([
  { rank: 1, name: 'Java核心技术', views: 1000 },
  { rank: 2, 'name': 'Spring Cloud Alibaba 实战', views: 853 },
  { rank: 3, 'name': 'PostgreSQL 高级应用', views: 631 },
  { rank: 4, 'name': 'Vue3.0 全面解析', views: 400 },
  { rank: 5, 'name': 'React 进阶实战', views: 350 },
  { rank: 6, 'name': '安卓开发进阶-Kotlin语言精通', views: 99 }
]);

// --- 热门销售数据 ---
// const hotSales = ref([
//   { name: 'Vue 实战', value: 79, color: '#40c9c6' },
//   { name: 'React 实战', value: 62, color: '#36a3f7' },
//   { name: 'Node.js 实战', value: 45, color: '#f4516c' }
// ]);

// --- 时间线数据 ---
const timelineActivities = ref([
  {
    title: '新课程发布',
    details: 'Spring Cloud Alibaba 实战课程正式上线，帮助开发者快速掌握微服务核心技术。',
    timestamp: '2025-06-15',
    type: 'primary',
    icon: 'Collection'
  },
  {
    title: '系统 V1.0 版本上线',
    details: '经过数月的开发与测试，系统第一个稳定版本正式发布，标志着项目进入新的阶段。',
    timestamp: '2025-05-20',
    type: 'success',
    icon: 'Promotion'
  },
  {
    title: '完成核心功能开发',
    details: '完成了后台管理系统的"系统管理"与"权限控制"核心模块的开发与联调工作。',
    timestamp: '2025-05-10',
    type: 'info',
    icon: 'CircleCheck'
  },
  {
    title: '项目搭建完成',
    details: '后台管理系统项目初始化，技术选型确定为 Vue3 + TypeScript + Element Plus。',
    timestamp: '2025-04-18',
    type: 'info',
    icon: 'Flag'
  }
]);

// --- 图表初始化和响应式处理 ---
const initCharts = () => {
  if (barChartRef.value) {
    barChartInstance.value = echarts.init(barChartRef.value);
    barChartInstance.value.setOption(barChartOption);
  }
  if (pieChartRef.value) {
    pieChartInstance.value = echarts.init(pieChartRef.value);
    pieChartInstance.value.setOption(pieChartOption);
  }
};

const handleResize = () => {
  barChartInstance.value?.resize();
  pieChartInstance.value?.resize();
};

onMounted(() => {
  initCharts();
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  barChartInstance.value?.dispose();
  pieChartInstance.value?.dispose();
});

</script>

<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :sm="12" :lg="6" v-for="card in topCards" :key="card.title" class="card-col">
        <el-card class="main-card" shadow="hover">
          <div class="card-content">
            <div class="card-icon-wrapper" :style="{ backgroundColor: card.color }">
              <el-icon :size="45" color="#fff">
                <DynamicIcon :name="card.icon" :size="45" />
              </el-icon>
            </div>
            <div class="card-details">
              <div class="card-title">{{ card.title }}</div>
              <div class="card-value">{{ card.value.toLocaleString() }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="mt-20" :gutter="20">
      <el-col :lg="12" :md="24">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">访问统计</div>
          </template>
          <div ref="barChartRef" class="chart-body"></div>
        </el-card>
      </el-col>
      <el-col :lg="12" :md="24">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">课程占比</div>
          </template>
          <div ref="pieChartRef" class="chart-body"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row class="mt-20" :gutter="20">
      <el-col :lg="12" :md="24">
        <el-card class="bottom-card" shadow="hover">
          <template #header>
            <div class="card-header">热门课程</div>
          </template>
          <el-table :data="hotCourses" style="width: 100%" height="280">
            <el-table-column prop="rank" label="排名" width="80" align="center" />
            <el-table-column prop="name" label="课程名称" />
            <el-table-column prop="views" label="播放量" width="120" align="center" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :lg="12" :md="24">
        <el-card class="bottom-card" shadow="hover">
          <template #header>
            <div class="card-header">时间线</div>
          </template>
          <div class="timeline-wrapper">
            <el-timeline>
              <el-timeline-item
                v-for="(activity) in timelineActivities"
                :key="activity.title"
                :timestamp="activity.timestamp"
                :type="(activity.type as any)"
                :hollow="true"
                placement="top"
              >
                <el-card class="timeline-card">
                  <div class="timeline-card-body">
                    <DynamicIcon :name="activity.icon" :size="20" />
                    <div class="timeline-content">
                      <h4 class="timeline-title">{{ activity.title }}</h4>
                      <el-tooltip
                        :content="activity.details"
                        placement="top"
                        effect="dark"
                      >
                        <p class="timeline-details">{{ activity.details }}</p>
                      </el-tooltip>
                    </div>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.dashboard-container{
  padding-top: 10px;
}
.mt-20 {
  margin-top: 20px;
}

/* 适配 el-row 在某些情况下的负边距 */
.el-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

/* 修正 el-col 在小屏幕下的堆叠间距 */
@media (max-width: 992px) {
  .card-col, .el-col[md="24"] {
    margin-bottom: 20px;
  }
}

/* 顶部统计卡片 */
.main-card {
  border-radius: 8px;
  border: none;
}
.card-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-icon-wrapper {
  padding: 18px;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}
.main-card:hover .card-icon-wrapper {
  transform: scale(1.1);
}
.card-details {
  text-align: right;
}
.card-title {
  color: #8c8c8c;
  font-size: 14px;
  margin-bottom: 10px;
}
.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #515151;
}

/* 中间图表卡片 */
.chart-card {
  border-radius: 8px;
  border: none;
}
.card-header {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
.chart-body {
  height: 300px;
}

/* 底部卡片 */
.bottom-card {
  height: 370px;
  border-radius: 8px;
  border: none;
}
.sales-list {
  padding: 10px;
}
.sale-item {
  margin-bottom: 25px;
}
.sale-name {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}
/* 时间线 */
.timeline-wrapper {
  padding: 10px 5px 10px 10px;
  height: 280px;
  overflow-y: auto;
}
.timeline-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s ease-in-out;
}

.timeline-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--el-box-shadow-dark);
}

.timeline-card-body {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  height: 30px;
}

.timeline-icon {
  margin-top: 2px;
  color: var(--el-color-primary);
}

.timeline-content {
  flex: 1;
  min-width: 0; /* 关键：确保 flex item 在内容溢出时能够正确收缩并触发省略号 */
}

.timeline-title {
  font-size: 12px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.timeline-details {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
