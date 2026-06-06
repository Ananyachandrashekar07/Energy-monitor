import { useEffect, useState } from 'react';
import { alertsApi } from '../services/services';
import { Bell, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

const SEVERITY = {
  critical: { color: 'text-rose-400',    bg: 'bg-rose-500/10',    icon: XCircle        },
  high:     { color: 'text-amber-400',   bg: 'bg-amber-500/10',   icon: AlertTriangle  },
  medium:   { color: 'text-cyan-400',    bg: 'bg-cyan-500/10',    icon: Bell           },
  low:      { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2   },
};

const timeAgo = (ts) => {
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60)   return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
};

export default function RecentAlerts() {
  const [alerts,  setAlerts]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    alertsApi.getLogs({ status: 'open', limit: 6 })
      .then(({ data }) => setAlerts(data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-title text-base">Recent Alerts</h3>
        {alerts.length > 0 && (
          <span className="badge-red text-xs">{alerts.length} open</span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-slate-800/60 rounded-xl animate-pulse" />)}
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-slate-500">
          <CheckCircle2 size={28} strokeWidth={1} className="text-emerald-500/50" />
          <p className="text-xs">All clear — no open alerts</p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((a) => {
            const meta = SEVERITY[a.severity] ?? SEVERITY.medium;
            const Icon = meta.icon;
            return (
              <div key={a.alert_id} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl ${meta.bg} border border-current/5`}>
                <Icon size={14} className={`${meta.color} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">
                    {a.zone_name ?? 'Zone'} — {a.metric_type}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {a.serial_number} · {parseFloat(a.reading_value).toFixed(2)} {a.unit}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 flex-shrink-0">
                  <Clock size={10} />
                  {timeAgo(a.triggered_at)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}