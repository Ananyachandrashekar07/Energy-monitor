import { useMemo } from 'react';

import {
  Bar,
  Doughnut
} from 'react-chartjs-2';

import {
  COLORS,
  tooltipPlugin,
  baseScales,
  baseLegend
} from './chartConfig';

import { LoadingOverlay } from '../components/UI';

import '../charts/chartConfig';


const SEVERITY_COLORS = {

  critical: '#f43f5e',

  high: '#f59e0b',

  medium: '#06b6d4',

  low: '#10b981',

};


const STATUS_COLORS = {

  open: '#f43f5e',

  acknowledged: '#f59e0b',

  resolved: '#10b981',

};


// ─────────────────────────────────────────────────────────────
// ALERT SEVERITY BAR CHART
// ─────────────────────────────────────────────────────────────

export function AlertSeverityChart({
  logs = [],
  loading
}) {

  const safeLogs = Array.isArray(logs)
    ? logs
    : [];


  const chartData = useMemo(() => {

    const byDate = {};

    safeLogs.forEach((log) => {

      const date =
        (log.triggered_at || '')
          .slice(0, 10);

      if (!date) return;

      if (!byDate[date]) {

        byDate[date] = {

          critical: 0,

          high: 0,

          medium: 0,

          low: 0,

        };

      }

      byDate[date][log.severity] =
        (byDate[date][log.severity] || 0) + 1;

    });


    const dates = Object
      .keys(byDate)
      .sort()
      .slice(-14);

    const severities = [
      'critical',
      'high',
      'medium',
      'low'
    ];


    return {

      labels: dates.map(d => d.slice(5)),

      datasets: severities.map((sev) => ({

        label:
          sev.charAt(0).toUpperCase()
          + sev.slice(1),

        data: dates.map(
          d => byDate[d]?.[sev] || 0
        ),

        backgroundColor:
          SEVERITY_COLORS[sev],

        borderRadius: 4,

        stack: 'alerts',

      })),

    };

  }, [safeLogs]);


  const options = useMemo(() => ({

    responsive: true,

    maintainAspectRatio: false,

    animation: false,

    resizeDelay: 300,

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

        align: 'end',

      },

    },

    scales: {

      ...baseScales,

      x: {

        ...baseScales.x,

        stacked: true,

      },

      y: {

        ...baseScales.y,

        stacked: true,

        title: {

          display: true,

          text: 'Count',

          color: COLORS.text,

          font: {
            size: 11
          },

        },

      },

    },

  }), []);


  return (

    <div
      className="card p-5 overflow-hidden"
      style={{
        height: '420px'
      }}
    >

      <div className="flex items-center justify-between mb-5">

        <div>

          <h3 className="section-title">
            Alert Activity
          </h3>

          <p className="text-xs text-slate-500 mt-0.5">
            Daily alerts by severity
          </p>

        </div>

        <span className="badge-red text-xs">
          Alerts
        </span>

      </div>


      <div
        style={{
          height: '300px'
        }}
      >

        {loading ? (

          <LoadingOverlay />

        ) : (

          <Bar
            data={chartData}
            options={options}
          />

        )}

      </div>

    </div>

  );

}



// ─────────────────────────────────────────────────────────────
// ALERT STATUS DOUGHNUT
// ─────────────────────────────────────────────────────────────

export function AlertStatusDoughnut({
  logs = [],
  loading
}) {

  const safeLogs = Array.isArray(logs)
    ? logs
    : [];


  const counts = useMemo(() => {

    const map = {

      open: 0,

      acknowledged: 0,

      resolved: 0,

    };

    safeLogs.forEach((l) => {

      if (
        map[l.status] !== undefined
      ) {

        map[l.status]++;

      }

    });

    return map;

  }, [safeLogs]);


  const total =
    counts.open
    + counts.acknowledged
    + counts.resolved;


  const chartData = useMemo(() => ({

    labels: [

      'Open',

      'Acknowledged',

      'Resolved'

    ],

    datasets: [

      {

        data: [

          counts.open,

          counts.acknowledged,

          counts.resolved,

        ],

        backgroundColor: [

          STATUS_COLORS.open,

          STATUS_COLORS.acknowledged,

          STATUS_COLORS.resolved,

        ],

        borderWidth: 1,

        hoverOffset: 0,

      },

    ],

  }), [counts]);


  const options = useMemo(() => ({

    responsive: true,

    maintainAspectRatio: false,

    animation: false,

    resizeDelay: 300,

    plugins: {

      tooltip: {

        enabled: true,

      },

      legend: {

        position: 'bottom',

        labels: {

          color: '#cbd5e1',

          boxWidth: 12,

          padding: 15,

        },

      },

    },

  }), []);


  return (

    <div
      className="card p-5 overflow-hidden"
      style={{
        height: '430px'
      }}
    >

      <div className="flex items-center justify-between mb-5">

        <div>

          <h3 className="section-title">
            Alert Status
          </h3>

          <p className="text-xs text-slate-500 mt-0.5">
            Current resolution breakdown
          </p>

        </div>

      </div>


      <div
        className="relative w-full overflow-hidden"
        style={{
          height: '300px',
          minHeight: '300px',
          maxHeight: '300px'
        }}
      >

        {loading ? (

          <LoadingOverlay />

        ) : (

          <>

            <Doughnut
              data={chartData}
              options={options}
              redraw={false}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

              <span className="font-display text-xl font-bold text-slate-900">

                {total}

              </span>

              <span className="text-xs text-slate-500">

                Total

              </span>

            </div>

          </>

        )}

      </div>

    </div>

  );

}