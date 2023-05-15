<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, Ref, watch } from "vue";
import * as echarts from "echarts";
import { yVector, xMatrix, Matrix } from "../data/data";
import { hypothesis } from "../algorithm/hypothesis";
import { normalFunction } from "../algorithm/normal";
import { ComputedRef } from "vue";

let myChart: echarts.ECharts;

const localXMatrix = ref<Matrix>(xMatrix);
const localYVector = ref<Matrix>(yVector);
const area = ref<number>(0);
const data = computed(() =>
  localXMatrix.value.map((item, index) => [
    ...item.slice(1),
    ...localYVector.value[index],
  ])
);

const finalThetas: ComputedRef = computed(() =>
  normalFunction(localYVector.value, localXMatrix.value)
);

const money = computed(() => {
  console.log(Number(area.value))
  return hypothesis(finalThetas.value, [1, Number(area.value)])
})

const markLineOpt = computed(() => {
  const formatter = `y = ${finalThetas.value[1][0]} * x + ${finalThetas.value[0][0]}`;
  const start = [0, hypothesis(finalThetas.value, [1, 0])];
  const end = [240, hypothesis(finalThetas.value, [1, 240])];
  return {
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

const isArray = (obj: any) =>
  Object.prototype.toString.call(obj) === "[object Array]";

const checkValue = (val: any) => {
  try {
    const value = JSON.parse(val);
    if (isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (
          !isArray(value[i]) ||
          value[i].length !== 2 ||
          typeof value[i][0] !== "number" ||
          typeof value[i][1] !== "number"
        ) {
          return false;
        }
      }
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

const handleChange = (e: any) => {
  if (checkValue(e.target.value)) {
    const x: Matrix = [];
    const y: Matrix = [];
    const nextData = JSON.parse(e.target.value);
    nextData.forEach((item: number[]) => {
      x.push([1, item[0]]);
      y.push([item[1]]);
    });
    localXMatrix.value = x;
    localYVector.value = y;
  }
};

onMounted(() => {
  // 基于准备好的dom，初始化echarts实例
  myChart = echarts.init(document.getElementById("test") as HTMLElement);
  // 绘制图表
  const dataAll = computed(() => [
    localXMatrix.value.map((item, index) => [
      ...(item as []).slice(1),
      ...(localYVector.value[index] as []),
    ]),
  ]);

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
        data: dataAll.value[0],
        markLine: markLineOpt.value,
      },
    ],
  }));

  watch(
    option,
    () => {
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
  <div id="test"></div>
  <textarea
    class="text"
    :value="JSON.stringify(data, null, 2)"
    @input="handleChange"
  />
  <div class="predict">
    <input v-model="area" />
    您的豪宅市值为：{{ money }} 万元
  </div>
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

.text {
  width: 400px;
  height: 500px;
}

.predict {
  margin-bottom: 200px;
}
</style>
