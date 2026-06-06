import { Building2, Cpu, Bell, Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const CARDS = [
  {
    key:   'buildings',
    label: 'Buildings',
    icon:  Building2,
    color: 'cyan',
    suffix: '',
    desc:  'Monitored facilities',
  },
  {
    key:   'active_sensors',
    label: 'Active Sensors',
    icon:  Cpu,
    color: 'emerald',
    suffix: '',
    desc:  'Online & reporting',
  },
  {
    key:   'today_kwh',
    label: "Today's Usage",
    icon:  Zap,
    color: 'amber',
    suffix: ' kWh',
    desc:  'Energy consumed today',
    decimal: true,
  },
  {
    key:   'open_alerts',
    label: 'Open Alerts',
    icon:  Bell,
    color: 'rose',
    suffix: '',
    desc:  'Require attention',
  },
];

const COLOR_MAP = {
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/20',    icon: 'text-cyan-400',    val: 'text-cyan-300'    },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', val: 'text-emerald-300' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: 'text-amber-400',   val: 'text-amber-300'   },
  rose:    { bg: 'bg-rose-500/10',    border: 'border-rose-500/20',    icon: 'text-rose-400',    val: 'text-rose-300'    },
};

function TrendBadge({ value, prev }) {
  if (!prev || prev === 0) return null;
  const pct = ((value - prev) / prev * 100).toFixed(1);
  const up  = pct > 0;
  const eq  = Math.abs(pct) < 0.5;
  if (eq) return <span className="flex items-center gap-0.5 text-slate-400 text-xs"><Minus size={11}/> 0%</span>;
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${up ? 'text-rose-400' : 'text-emerald-400'}`}>
      {up ? <TrendingUp size={11}/> : <TrendingDown size={11}/>}
      {Math.abs(pct)}%
    </span>
  );
}

export default function KPICards({ summary = {}, loading, prevSummary }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
      {CARDS.map(({ key, label, icon: Icon, color, suffix, desc, decimal }) => {
        const c   = COLOR_MAP[color];
        const val = summary[key];
        return (
          <div key={key} className={`card-hover p-5 border ${c.border}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center`}>
                <Icon size={17} className={c.icon} />
              </div>
              {prevSummary && <TrendBadge value={val} prev={prevSummary[key]} />}
            </div>
            {/* Value */}
            <div className="mb-1">
              {loading ? (
                <div className="h-8 w-20 bg-slate-800 rounded-lg animate-pulse" />
              ) : (
                <p className={`font-display text-2xl font-bold ${c.val}`}>
                  {val == null ? '—' : (decimal ? parseFloat(val).toFixed(1) : val)}
                  {val != null && <span className="text-sm ml-1 font-normal text-slate-800">{suffix}</span>}
                </p>
              )}
            </div>
            <p className="text-xs font-medium text-slate-900">{label}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
          </div>
        );
      })}
    </div>
  );
}