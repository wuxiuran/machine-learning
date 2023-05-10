<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, Ref, watch } from "vue";
import * as echarts from "echarts";
import "./algorithm/hypothesis";
import { yVector, xMatrix, thetas, Matrix } from "./data/data";
import { debuggerParams, fixed3, hypothesis } from "./algorithm/hypothesis";

let myChart: echarts.ECharts;

const formatTime = (time: number) =>
  `${Math.floor(time / 60)}分 ${time % 60}秒`;

const markLineOpt = ref({});
const derivatives: Ref<number[]> = ref([]);
const localThetas: Ref<number[]> = ref([]);
const count: Ref<number> = ref(0);
const timeTaken: Ref<number> = ref(Date.now());
const nowTime = Date.now();
const timeTakenText = computed(() =>
  formatTime(Math.floor((timeTaken.value - nowTime) / 1000))
);

debuggerParams(
  yVector as Matrix,
  xMatrix as Matrix,
  thetas as number[],
  0.002268,
  (e) => {
    derivatives.value = e.derivatives;
    localThetas.value = e.localThetas;
    timeTaken.value = e.timestamp;
    count.value += 1;
  }
).then((finalThetas) => {
  const formatter = `y = ${fixed3(finalThetas[1])} * x + ${fixed3(
    finalThetas[0]
  )}`;
  const start = [0, hypothesis(finalThetas, [1, 0])];
  const end = [240, hypothesis(finalThetas, [1, 240])];
  markLineOpt.value = {
    animation: true,
    label: {
      formatter,
      align: "right",
    },
    lineStyle: {
      type: "solid",
    },
    tooltip: {
      formatter,
    },
    data: [
      [
        {
          coord: start,
          symbol: "none",
        },
        {
          coord: end,
          symbol: "none",
        },
      ],
    ],
  };
});

onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  myChart = echarts.init(document.getElementById("test") as HTMLElement);
  // 绘制图表
  const dataAll = [
    xMatrix.map((item, index) => [
      ...(item as []).slice(1),
      ...(yVector[index] as []),
    ]),
  ];
  console.log(dataAll, 11);
  const option = computed(() => ({
    title: {
      text: "Anscombe's quartet",
      left: "center",
      top: 0,
    },
    // grid: [{ left: "7%", top: "7%", width: "38%", height: "38%" }],
    tooltip: {
      formatter: "Group {a}: ({c})",
    },
    xAxis: [{ gridIndex: 0, min: 0, max: 240 }],
    yAxis: [{ gridIndex: 0, min: -200, max: 3000 }],
    series: [
      {
        name: "I",
        type: "scatter",
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: dataAll[0],
        markLine: markLineOpt.value,
      },
    ],
  }));

  watch(
    option,
    () => {
      console.log(markLineOpt.value);
      myChart.setOption(option.value);
    },
    {
      immediate: true,
    }
  );

  window.addEventListener("resize", myChart.resize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", myChart.resize);
});
</script>

<template>
  <div class="label">
    已耗时：{{ timeTakenText }} <br />
    偏导数：<br />
    dTheta0: {{ derivatives[0] }}<br />
    dTheta1: {{ derivatives[1] }} <br />
    系数： <br />
    theta0: {{ localThetas[0] }}<br />
    theta1: {{ localThetas[1] }}<br />
    迭代次数: {{ count }}
  </div>
  <div id="test"></div>
</template>

<style scoped>
.label {
  position: absolute;
  left: 200px;
  top: 0;
  width: 690px;
  line-height: 32px;
  font-size: 20px;
  text-align: left;
}
#test {
  width: 100vw;
  height: 100vh;
}
</style>
