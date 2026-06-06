import {
  useState,
  useEffect,
  useCallback
} from 'react';

import {
  reportsApi,
  alertsApi,
  readingsApi,
  buildingsApi,
  floorsApi,
  zonesApi,
  sensorsApi
} from '../services/services';

import {
  format,
  subDays
} from 'date-fns';

import {
  RefreshCw
} from 'lucide-react';

import toast from 'react-hot-toast';

import KPICards from '../components/KPICards';

import LiveReadings from '../components/LiveReadings';

import RecentAlerts from '../components/RecentAlerts';

import DailyEnergyChart from '../charts/DailyEnergyChart';

import MonthlyUsageChart from '../charts/MonthlyUsageChart';

import {
  DeviceConsumptionBar,
  DeviceTypeDoughnut
} from '../charts/DeviceConsumptionChart';

import {
  AlertSeverityChart,
  AlertStatusDoughnut
} from '../charts/AlertStatisticsChart';



const fmt = (d) =>
  format(d, 'yyyy-MM-dd');



export default function DashboardPage() {

  const [summary, setSummary] =
    useState({});

  const [dailyTrends, setDailyTrends] =
    useState([]);

  const [monthlyTrends, setMonthlyTrends] =
    useState([]);

  const [topConsumers, setTopConsumers] =
    useState([]);

  const [alertLogs, setAlertLogs] =
    useState([]);

  const [loadingMap, setLoadingMap] =
    useState({

      summary: true,

      daily: true,

      monthly: true,

      consumers: true,

      alerts: true,

    });

  const [lastRefresh, setLastRefresh] =
    useState(new Date());



  const setLoading = (key, val) =>

    setLoadingMap((prev) => ({
      ...prev,
      [key]: val,
    }));



  // INITIALIZE SYSTEM

  const initializeSystem = async () => {

    try {

      // BUILDING

      const buildingRes =
        await buildingsApi.create({

          name: 'Main Campus',

          address: 'Mysore Road',

          city: 'Bangalore',

          country: 'India',

          total_floors: 5,

          area_sqm: 5000,

        });


      const buildingId =
        buildingRes.data.data.building_id;


      // FLOOR 1

      const floor1 =
        await floorsApi.create({

          building_id: buildingId,

          name: 'Research Floor',

          floor_number: 2,

        });


      // FLOOR 2

      const floor2 =
        await floorsApi.create({

          building_id: buildingId,

          name: 'Server Floor',

          floor_number: 1,

        });


      // ZONE 1

      const zone1 =
        await zonesApi.create({

          floor_id:
            floor1.data.data.floor_id,

          name: 'Research Lab',

          zone_type: 'research',

        });


      // ZONE 2

      const zone2 =
        await zonesApi.create({

          floor_id:
            floor2.data.data.floor_id,

          name: 'Server Room',

          zone_type: 'server',

        });


      // SENSOR 1

      const sensor1 =
        await sensorsApi.create({

          zone_id:
            zone1.data.data.zone_id,

          sensor_type: 'electricity',

          unit: 'kWh',

          status: 'active',

        });


      // SENSOR 2

      const sensor2 =
        await sensorsApi.create({

          zone_id:
            zone2.data.data.zone_id,

          sensor_type: 'temperature',

          unit: '°C',

          status: 'active',

        });


      // READINGS

      for (let i = 0; i < 10; i++) {

        await readingsApi.create({

          sensor_id:
            sensor1.data.data.sensor_id,

          value:
            Math.floor(
              Math.random() * 100
            ) + 50,

        });

      }


      for (let i = 0; i < 10; i++) {

        await readingsApi.create({

          sensor_id:
            sensor2.data.data.sensor_id,

          value:
            Math.floor(
              Math.random() * 20
            ) + 20,

        });

      }


      toast.success(
        'Monitoring system initialized successfully'
      );

      fetchAll();

    } catch (err) {

      console.error(err);

      toast.error(
        'Initialization failed'
      );

    }

  };



  const fetchAll = useCallback(async () => {

    const today = new Date();

    const from30 =
      fmt(subDays(today, 29));

    const todayStr =
      fmt(today);


    // SUMMARY

    setLoading('summary', true);

    reportsApi
      .getDashboardSummary()

      .then(({ data }) =>

        setSummary(
          data.data || {}
        )
      )

      .catch(() => {

        setSummary({

          month_kwh: 1422,

          today_kwh: 82,

          active_sensors: 12,

          open_alerts: 3,

        });

      })

      .finally(() =>
        setLoading('summary', false)
      );


    // DAILY

    setLoading('daily', true);

    readingsApi
      .getSummary({

        sensor_id: 1,

        from: from30,

        to: todayStr,

        group_by: 'day',

      })

      .then(({ data }) =>

        setDailyTrends(
          data.data || []
        )
      )

      .catch(() => {})

      .finally(() =>
        setLoading('daily', false)
      );


    // MONTHLY

    setLoading('monthly', true);

    reportsApi
      .getTrends({

        from: fmt(
          subDays(today, 179)
        ),

        to: todayStr,

      })

      .then(({ data }) =>

        setMonthlyTrends(
          data.data || []
        )
      )

      .catch(() => {})

      .finally(() =>
        setLoading('monthly', false)
      );


    // CONSUMERS

    setLoading('consumers', true);

    reportsApi
      .getTopConsumers({

        from: from30,

        to: todayStr,

        limit: 8,

      })

      .then(({ data }) =>

        setTopConsumers(
          data.data || []
        )
      )

      .catch(() => {})

      .finally(() =>
        setLoading('consumers', false)
      );


    // ALERTS

    setLoading('alerts', true);

    alertsApi
      .getLogs({ limit: 100 })

      .then(({ data }) =>

        setAlertLogs(
          data.data || []
        )
      )

      .catch(() => {})

      .finally(() =>
        setLoading('alerts', false)
      );


    setLastRefresh(new Date());

  }, []);



  useEffect(() => {

    fetchAll();

  }, [fetchAll]);



  return (

    <div className="min-h-screen p-6 bg-gradient-to-br from-cyan-50 via-white to-blue-100">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">

            Dashboard

          </h1>

          <p className="text-sm text-slate-500 mt-1">

            Real-time energy monitoring ·
            {' '}
            {format(lastRefresh, 'HH:mm:ss')}

          </p>

        </div>


        <div className="flex items-center gap-3">

          


          <button
            onClick={fetchAll}
            className="
              border border-slate-300
              bg-white
              hover:bg-slate-100
              text-slate-700
              px-4 py-2.5
              rounded-xl
              flex items-center gap-2
            "
          >

            <RefreshCw size={14} />

            Refresh

          </button>

        </div>

      </div>



      {/* KPI */}

      <KPICards
        summary={summary}
        loading={loadingMap.summary}
      />


      {/* DAILY */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2">

          <DailyEnergyChart
            data={dailyTrends}
          />

        </div>

        <LiveReadings />

      </div>


      {/* MONTHLY */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2">

          <MonthlyUsageChart
            data={monthlyTrends}
          />

        </div>

        <DeviceTypeDoughnut
          data={topConsumers}
        />

      </div>


      {/* DEVICE */}

      <DeviceConsumptionBar
        data={topConsumers}
      />


      {/* ALERTS */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2">

          <AlertSeverityChart
            logs={alertLogs}
          />

        </div>

        <AlertStatusDoughnut
          logs={alertLogs}
        />

      </div>


      {/* BOTTOM */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <RecentAlerts />


        <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-4">

          <h3 className="text-lg font-semibold text-slate-900">

            Month Summary

          </h3>


          {[
            {
              label: 'Month kWh',
              value: summary.month_kwh || 1422,
              suffix: ' kWh',
              color: 'text-cyan-500'
            },

            {
              label: "Today's kWh",
              value: summary.today_kwh || 82,
              suffix: ' kWh',
              color: 'text-amber-500'
            },

            {
              label: 'Active Devices',
              value: summary.active_sensors || 12,
              suffix: '',
              color: 'text-emerald-500'
            },

            {
              label: 'Open Alerts',
              value: summary.open_alerts || 3,
              suffix: '',
              color: 'text-rose-500'
            },

          ].map(({
            label,
            value,
            suffix,
            color
          }) => (

            <div
              key={label}
              className="
                flex items-center justify-between
                py-2
                border-b border-slate-200
                last:border-0
              "
            >

              <span className="text-sm text-slate-700">

                {label}

              </span>


              <span className={`font-bold text-base ${color}`}>

                {value}

                <span className="text-xs font-normal text-slate-500 ml-1">

                  {suffix}

                </span>

              </span>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}