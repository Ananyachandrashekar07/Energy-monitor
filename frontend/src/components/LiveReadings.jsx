import { useEffect, useState } from 'react';
import { readingsApi } from '../services/services';
import { Activity, Zap, Droplets, Wind, Sun, Thermometer } from 'lucide-react';

const TYPE_META = {
  electricity: { icon: Zap,         color: 'text-cyan-400',    bg: 'bg-cyan-500/10'    },
  water:       { icon: Droplets,    color: 'text-blue-400',    bg: 'bg-blue-500/10'    },
  gas:         { icon: Wind,        color: 'text-amber-400',   bg: 'bg-amber-500/10'   },
  hvac:        { icon: Thermometer, color: 'text-violet-400',  bg: 'bg-violet-500/10'  },
  solar:       { icon: Sun,         color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
};

export default function LiveReadings() {
  const [readings, setReadings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tick,     setTick]     = useState(0);

  const fetchLatest = async () => {
    try {
      const { data } = await readingsApi.getLatest();
      setReadings(data.data?.slice(0, 12) ?? []);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLatest(); }, [tick]);

  // Auto-refresh every 30 s
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <h3 className="section-title text-base">Live Readings</h3>
        </div>
        <button onClick={fetchLatest} className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">Refresh</button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-800/60 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : readings.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-slate-500 text-sm gap-2">
          <Activity size={16} /> No readings yet
        </div>
      ) : (
        <div className="space-y-2">
          {readings.map((r) => {
            const meta = TYPE_META[r.sensor_type] ?? TYPE_META.electricity;
            const Icon = meta.icon;
            return (
              <div key={r.reading_id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/40 transition-colors">
                <div className={`w-7 h-7 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={13} className={meta.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300 truncate">{r.serial_number}</p>
                  <p className="text-[10px] text-slate-500 truncate">{r.zone_name} · {r.building_name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-mono font-semibold ${meta.color}`}>
                    {parseFloat(r.value).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-slate-500">{r.unit}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}