import Chartist from 'chartist';
import 'chartist/dist/chartist.min.css';

const gameStat = {
  data: [],
  addData(value) {
    gameStat.data.push(value);
  },
  resetData(value) {
    gameStat.data = [];
  },
  getChart(className) {
    new Chartist.Line(
      '.' + className,
      { series: [gameStat.data] },
      {
        low: 0, showArea: true, showPoint: false, fullWidth: true,
        axisX: { offset: 0, showLabel: false, showGrid: false },
        axisY: { offset: 0, showLabel: false, showGrid: false },
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
      }
    );
  }
};

export default gameStat;
