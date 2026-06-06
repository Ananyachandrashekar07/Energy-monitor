import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';

import {
  COLORS,
  tooltipPlugin,
  baseScales,
  baseLegend
} from './chartConfig';

import '../charts/chartConfig';


export default function DailyEnergyChart({
  data = []
}) {

  const safeData = Array.isArray(data)
    ? data
    : [];


  const chartData = useMemo(() => {

    const sorted = safeData.length
      ? [...safeData].sort((a, b) => {
          const aPeriod = a?.period || '';
          const bPeriod = b?.period || '';
          return aPeriod.localeCompare(bPeriod);
        })
      : [
          { period: '2026-05-01', total: 120, peak: 35 },
          { period: '2026-05-02', total: 90, peak: 28 },
          { period: '2026-05-03', total: 150, peak: 40 },
          { period: '2026-05-04', total: 110, peak: 30 },
        ];


    return {

      labels: sorted.map((d) => {

        try {

          return format(
            parseISO(d.period),
            'MMM d'
          );

        } catch {

          return d?.period || 'Unknown';

        }

      }),

      datasets: [

        {

          label: 'Total (kWh)',

          data: sorted.map((d) =>
            Number(
              parseFloat(
                d?.total || 0
              ).toFixed(2)
            )
          ),

          borderColor: COLORS.cyan,

          backgroundColor: 'rgba(6,182,212,0.15)',

          borderWidth: 2,

          fill: true,

          tension: 0.4,

        },

        {

          label: 'Peak (kWh)',

          data: sorted.map((d) =>
            Number(
              parseFloat(
                d?.peak || 0
              ).toFixed(2)
            )
          ),

          borderColor: COLORS.rose,

          borderDash: [4, 3],

          borderWidth: 2,

          fill: false,

          tension: 0.4,

        },

      ],

    };

  }, [safeData]);


  const options = {

    responsive: true,

    maintainAspectRatio: true,

    animation: false,

    resizeDelay: 0,

    interaction: {

      mode: 'index',

      intersect: false,

    },

    plugins: {

      tooltip: {
        ...tooltipPlugin
      },

      legend: {
        ...baseLegend,
        position: 'top',
        align: 'end'
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
            Daily Energy Usage
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            Last 30 days — all sensors
          </p>

        </div>

      </div>


      <div
        style={{
          height: '320px',
          width: '100%'
        }}
      >

        <Line
          data={chartData}
          options={options}
        />

      </div>

    </div>

  );

}