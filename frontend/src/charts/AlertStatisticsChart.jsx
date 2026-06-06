import {
  Bar,
  Doughnut
} from 'react-chartjs-2';

import '../charts/chartConfig';



// ─────────────────────────────────────────────────────────────
// ALERT SEVERITY BAR CHART
// ─────────────────────────────────────────────────────────────

export function AlertSeverityChart() {

  const chartData = {

    labels: [
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun'
    ],

    datasets: [

      {

        label: 'Critical',

        data: [2, 1, 3, 2, 4, 1, 2],

        backgroundColor: '#ef4444',

      },

      {

        label: 'Warning',

        data: [5, 4, 6, 3, 5, 4, 3],

        backgroundColor: '#f59e0b',

      },

      {

        label: 'Info',

        data: [8, 7, 6, 9, 8, 7, 6],

        backgroundColor: '#38bdf8',

      },

    ],

  };


  const options = {

    responsive: true,

    maintainAspectRatio: true,

    animation: false,

    resizeDelay: 0,

  };


  return (

    <div className="bg-white rounded-2xl shadow-sm p-5">

      <h3 className="text-lg font-semibold text-slate-900 mb-5">

        Alert Severity Overview

      </h3>

      <div
        style={{
          height: '320px',
          width: '100%'
        }}
      >

        <Bar
          data={chartData}
          options={options}
        />

      </div>

    </div>

  );

}



// ─────────────────────────────────────────────────────────────
// ALERT STATUS DOUGHNUT
// ─────────────────────────────────────────────────────────────

export function AlertStatusDoughnut() {

  const chartData = {

    labels: [
      'Open',
      'Resolved',
      'Critical'
    ],

    datasets: [

      {

        data: [12, 19, 5],

        backgroundColor: [
          '#38bdf8',
          '#34d399',
          '#f87171'
        ],

        borderWidth: 1,

      },

    ],

  };


  const options = {

    responsive: true,

    maintainAspectRatio: true,

    animation: false,

    resizeDelay: 0,

  };


  return (

    <div className="bg-white rounded-2xl shadow-sm p-5">

      <h3 className="text-lg font-semibold text-slate-900 mb-5">

        Alert Status

      </h3>

      <div
        style={{
          height: '320px',
          width: '100%'
        }}
      >

        <Doughnut
          data={chartData}
          options={options}
        />

      </div>

    </div>

  );

}