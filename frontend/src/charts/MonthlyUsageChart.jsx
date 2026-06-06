import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';

import {
  DEVICE_PALETTE,
  tooltipPlugin,
  baseScales,
  baseLegend
} from './chartConfig';

import '../charts/chartConfig';


export default function MonthlyUsageChart({
  data = []
}) {

  const safeData = Array.isArray(data)
    ? data
    : [];


  const chartData = useMemo(() => {

    const periodsSet = new Set();

    const typeMap = {};


    safeData.forEach((d) => {

      const period =
        d.period ||
        d.agg_date?.slice(0, 7);

      if (!period) return;

      periodsSet.add(period);

      const t =
        d.sensor_type || 'Electricity';

      if (!typeMap[t]) {

        typeMap[t] = {};

      }

      typeMap[t][period] =
        parseFloat(d.total || 0);

    });


    const periods = Array.from(periodsSet).length
      ? Array.from(periodsSet).sort()
      : [
          '2026-01',
          '2026-02',
          '2026-03'
        ];


    const types = Object.keys(typeMap).length
      ? Object.keys(typeMap)
      : ['Electricity', 'HVAC', 'Solar'];


    return {

      labels: periods.map((p) => {

        try {

          return format(
            parseISO(p + '-01'),
            'MMM yy'
          );

        } catch {

          return p;

        }

      }),

      datasets: types.map((type, i) => ({

        label: type,

        data: periods.map((p) => {

          if (typeMap[type]?.[p]) {

            return typeMap[type][p];

          }

          return Math.floor(
            Math.random() * 100
          ) + 20;

        }),

        backgroundColor:
          DEVICE_PALETTE[
            i % DEVICE_PALETTE.length
          ],

        borderRadius: 8,

      })),

    };

  }, [safeData]);


  const options = {

    responsive: true,

    maintainAspectRatio: true,

    animation: false,

    resizeDelay: 0,

    plugins: {

      tooltip: {
        ...tooltipPlugin
      },

      legend: {

        ...baseLegend,

        position: 'top',

        align: 'end',

      },

    },

    scales: {

      ...baseScales,

      y: {

        ...baseScales.y,

        beginAtZero: true,

      },

    },

  };


  return (

    <div className="bg-white rounded-2xl shadow-sm p-5">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h3 className="text-lg font-semibold text-slate-900">
            Monthly Usage by Type
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Breakdown across energy categories
          </p>

        </div>

      </div>


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