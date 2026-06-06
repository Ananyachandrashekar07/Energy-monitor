import { useState, useEffect } from 'react';

import { format, subDays } from 'date-fns';

import {
  reportsApi,
  readingsApi
} from '../services/services';

import DailyEnergyChart from '../charts/DailyEnergyChart';

import MonthlyUsageChart from '../charts/MonthlyUsageChart';

import {
  DeviceConsumptionBar,
  DeviceTypeDoughnut
} from '../charts/DeviceConsumptionChart';

import { Filter } from 'lucide-react';


const fmt = (d) => format(d, 'yyyy-MM-dd');


export default function AnalyticsPage() {

  const today = new Date();

  const [from, setFrom] = useState(
    fmt(subDays(today, 29))
  );

  const [to, setTo] = useState(
    fmt(today)
  );

  const [sType, setSType] = useState('');

  const [daily, setDaily] = useState([]);

  const [monthly, setMonthly] = useState([]);

  const [consumers, setConsumers] = useState([]);

  const [loading, setLoading] = useState(false);


  const fetchData = async () => {

    setLoading(true);

    try {

      const [d, m, c] = await Promise.allSettled([

        readingsApi.getSummary({
          sensor_id: 1,
          from,
          to,
          group_by: 'day'
        }),

        reportsApi.getTrends({
          from,
          to,
          ...(sType
            ? { sensor_type: sType }
            : {})
        }),

        reportsApi.getTopConsumers({
          from,
          to,
          limit: 10,
          ...(sType
            ? { sensor_type: sType }
            : {})
        }),

      ]);


      // DAILY DATA

      if (d.status === 'fulfilled') {

        const dailyData = d.value?.data?.data;

        setDaily(
          Array.isArray(dailyData)
            ? dailyData
            : []
        );

      } else {

        setDaily([]);

      }


      // MONTHLY DATA

      if (m.status === 'fulfilled') {

        const monthlyData = m.value?.data?.data;

        setMonthly(
          Array.isArray(monthlyData)
            ? monthlyData
            : []
        );

      } else {

        setMonthly([]);

      }


      // CONSUMERS DATA

      if (c.status === 'fulfilled') {

        const consumerData = c.value?.data?.data;

        setConsumers(
          Array.isArray(consumerData)
            ? consumerData
            : []
        );

      } else {

        setConsumers([]);

      }

    }

    catch (err) {

      console.error('Analytics fetch failed:', err);

      setDaily([]);

      setMonthly([]);

      setConsumers([]);

    }

    finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchData();

  }, []);


  return (

    <div className="min-h-screen p-6 bg-gradient-to-br from-cyan-50 via-white to-blue-100">

      <div className="flex flex-wrap items-center justify-between gap-3">

        <div>

          <h1 className="page-title">
            Analytics
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Deep-dive into energy consumption patterns
          </p>

        </div>


        {/* Filters */}

        <div className="flex flex-wrap items-center gap-3">

          <div className="flex items-center gap-2">

            <label className="text-xs text-slate-500">
              From
            </label>

            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="input py-2 text-xs w-36"
            />

          </div>


          <div className="flex items-center gap-2">

            <label className="text-xs text-slate-500">
              To
            </label>

            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="input py-2 text-xs w-36"
            />

          </div>


          <select
            value={sType}
            onChange={(e) => setSType(e.target.value)}
            className="input py-2 text-xs w-36"
          >

            <option value="">
              All types
            </option>

            {[
              'electricity',
              'water',
              'gas',
              'hvac',
              'solar'
            ].map((t) => (

              <option
                key={t}
                value={t}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>

            ))}

          </select>


          <button
            onClick={fetchData}
            className="btn-primary flex items-center gap-2"
          >

            <Filter size={14} />

            Apply

          </button>

        </div>

      </div>


      {/* Daily Chart */}

      <DailyEnergyChart
        data={daily}
        loading={loading}
      />


      {/* Monthly + Doughnut */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2">

          <MonthlyUsageChart
            data={monthly}
            loading={loading}
          />

        </div>


        <DeviceTypeDoughnut
          data={consumers}
          loading={loading}
        />

      </div>


      {/* Top Consumers */}

      <DeviceConsumptionBar
        data={consumers}
        loading={loading}
      />

    </div>

  );

}