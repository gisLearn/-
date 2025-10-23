<template>
  <main>
    <div id="typhone-echarts" style="width:330px;height:220px;"></div>
  </main>
</template>
<script setup>
import echarts from 'echarts'
onMounted(() => {
  renderLineEchart()
})
const renderLineEchart = () => {
  let myEchart = echarts.init(document.getElementById('typhone-echarts'))
  var option = {
    grid: {
      top: 30
    },
    // 工具箱
    toolbox: {
      show: true,
      feature: {
        saveAsImage: {
          show: false
        }
      }
    },
    tooltip: {
      show: true
    },
    // 图例
    legend: {
      show: true,
      textStyle: {
        color: '#fff'
      },
      top: 6,
      right: 30
    },
    // x轴
    xAxis: {
      data: ["19-9时","19-11时","18-14时","18-17时","18-20时"],
      axisLabel: {
        show: true,
        interval: 0,
        textStyle: {
          color: '#fff'
        }
      }
    },
    yAxis: {
      // min: 'dataMin',
      splitLine: {
        show: true,
        lineStyle:{
          color: ['#666666'],
          width: 1,
          type: 'solid'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
            color: '#fff'
        },
        formatter: function (value, index) {
          return value.toFixed(2)
        }
      },
      min: function(value) {
        return 1.00
      }
    },
    series: [{
      name: '实测',
      type: 'line',
      data: [1.60, 2.10, 1.40, null, null],
      itemStyle:{
        normal:{
          color:'#75D8A3'
        }
      },
    }, {
      name: '预测',
      type: 'line',
      data: [null, null, 1.40, 1.20, 1.2],
      itemStyle:{
        normal:{
          color:'#75D8A3'
        }
      },
      lineStyle: {
        normal: {
          type: 'dashed',
          shadowColor:"#75D8A3",          //阴影颜色
          shadowOffsetX:0,            //阴影水平方向上的偏移距离。
          shadowOffsetY:1,            //阴影垂直方向上的偏移距离
          shadowBlur:10,    
        }
      }
    }]
  }
  myEchart.setOption(option)
}
</script>
 
<style>
  #typhone-echarts{
    width: 100%;
    height: 100%;
  }
</style>
