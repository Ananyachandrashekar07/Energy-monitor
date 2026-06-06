import { useMemo } from 'react';

import {
  Bar,
  Doughnut
} from 'react-chartjs-2';

import {
  DEVICE_PALETTE
} from './chartConfig';

import '../charts/chartConfig';



// ─────────────────────────────────────────────────────────────
// TOP CONSUMERS BAR CHART
// ─────────────────────────────────────────────────────────────

export function DeviceConsumptionBar({
  data = []
}) {

  const safeData = Array.isArray(data)
    ? data
    : [];


  const top = safeData.length
    ? safeData.slice(0, 8)
    : [
        {
          sensor_id: 1,
          total_consumption: 120
        },
        {
          sensor_id: 2,
          total_consumption: 90
        },
        {
          sensor_id: 3,
          total_consumption: 75
        },
      ];


  const chartData = useMemo(() => ({

    labels: top.map((d, index) =>

      d.serial_number ||

      d.sensor_name ||

      `Sensor ${index + 1}`

    ),

    datasets: [

      {

        label: 'Consumption (kWh)',

        data: top.map((d) =>

          Number(

            parseFloat(

              d.total_consumption || 0

            ).toFixed(2)

          )

        ),

        backgroundColor: top.map(

          (_, i) =>

            DEVICE_PALETTE[
              i % DEVICE_PALETTE.length
            ]

        ),

        borderRadius: 8,

        borderWidth: 1,

      },

    ],

  }), [top]);


  const options = {

    indexAxis: 'y',

    responsive: true,

    maintainAspectRatio: true,

    animation: false,

    resizeDelay: 0,

    plugins: {

      legend: {
        display: false
      },

    },

    scales: {

      x: {

        ticks: {
          color: '#334155'
        },

        grid: {
          color: 'rgba(0,0,0,0.05)'
        },

      },

      y: {

        ticks: {
          color: '#334155'
        },

        grid: {
          display: false
        },

      },

    },

  };


  return (

    <div className="bg-white rounded-2xl shadow-sm p-5">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h3 className="text-lg font-semibold text-slate-900">

            Top Consumers

          </h3>

          <p className="text-xs text-slate-500 mt-1">

            Devices by total consumption

          </p>

        </div>

      </div>


      <div
        style={{
          height: '320px',
          width: '100%',
          position: 'relative'
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
// DOUGHNUT CHART
// ─────────────────────────────────────────────────────────────

export function DeviceTypeDoughnut({
  data = []
}) {

  const safeData = Array.isArray(data)
    ? data
    : [];


  const aggregated = useMemo(() => {

    const map = {};

    safeData.forEach((d) => {

      const t =
        d.sensor_type || 'other';

      map[t] =

        (map[t] || 0)

        +

        parseFloat(

          d.total_consumption || 0

        );

    });

    return map;

  }, [safeData]);


  const labels = Object.keys(aggregated);

  const values = Object.values(aggregated).length

    ? Object.values(aggregated)

    : [40, 30, 20, 10];


  const total = values.reduce(

    (a, b) => a + b,

    0

  );


  const chartData = useMemo(() => ({

    labels: labels.length

      ? labels

      : [
          'Electricity',
          'Water',
          'HVAC',
          'Solar'
        ],

    datasets: [

      {

        data: values.map((v) =>

          Number(v.toFixed(2))

        ),

        backgroundColor: values.map(

          (_, i) =>

            DEVICE_PALETTE[
              i % DEVICE_PALETTE.length
            ]

        ),

        borderWidth: 1,

        hoverOffset: 0,

      },

    ],

  }), [labels, values]);


  const options = {

    responsive: true,

    maintainAspectRatio: true,

    animation: false,

    resizeDelay: 0,

    plugins: {

      legend: {

        position: 'bottom',

        labels: {

          color: '#334155',

          boxWidth: 12,

          padding: 15,

        },

      },

      tooltip: {

        enabled: true,

      },

    },

  };


  return (

    <div className="bg-white rounded-2xl shadow-sm p-5">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h3 className="text-lg font-semibold text-slate-900">

            Usage by Type

          </h3>

          <p className="text-xs text-slate-500 mt-1">

            Share of total consumption

          </p>

        </div>

      </div>


      <div
        style={{
          height: '320px',
          width: '100%',
          position: 'relative'
        }}
      >

        <Doughnut
          data={chartData}
          options={options}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

          <span className="text-2xl font-bold text-slate-900">

            {total.toFixed(0)}

          </span>

          <span className="text-xs text-slate-500">

            Total kWh

          </span>

        </div>

      </div>

    </div>

  );

}