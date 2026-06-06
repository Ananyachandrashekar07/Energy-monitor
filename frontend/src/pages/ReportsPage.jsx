import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { reportsApi } from '../services/services';
import { DeviceConsumptionBar } from '../charts/DeviceConsumptionChart';
import MonthlyUsageChart from '../charts/MonthlyUsageChart';
import { LoadingOverlay } from '../components/UI';
import { Download, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const fmt = (d) => format(d, 'yyyy-MM-dd');

export default function ReportsPage() {
  const today = new Date();
  const [from,      setFrom]      = useState(fmt(subDays(today, 29)));
  const [to,        setTo]        = useState(fmt(today));
  const [groupBy,   setGroupBy]   = useState('zone');
  const [sType,     setSType]     = useState('');
  const [results,   setResults]   = useState([]);
  const [trends,    setTrends]    = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [ran,       setRan]       = useState(false);

  const run = async () => {
    setLoading(true);
    try {
      const [cr, tr] = await Promise.all([
        reportsApi.getConsumption({ from, to, group_by: groupBy, ...(sType ? { sensor_type: sType } : {}) }),
        reportsApi.getTrends({ from, to, ...(sType ? { sensor_type: sType } : {}) }),
      ]);
      setResults(cr.data.data ?? []);
      setTrends(tr.data.data ?? []);
      setRan(true);
    } catch { toast.error('Report generation failed'); }
    finally { setLoading(false); }
  };

  const exportCSV = () => {
    if (!results.length) return;
    const headers = Object.keys(results[0]).join(',');
    const rows    = results.map(r => Object.values(r).map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob    = new Blob([headers + '\n' + rows], { type: 'text/csv' });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a'); a.href = url;
    a.download = `energy-report-${from}-to-${to}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const COLS = { zone: ['label','zone_type','floor_label','building_name'], building: ['label'], floor: ['label','building_name'], sensor: ['label','sensor_type','zone_name','unit'] };
  const baseCols = COLS[groupBy] ?? ['label'];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-cyan-50 via-white to-blue-100">
      <div className="flex items-center justify-between">
        <div><h1 className="page-title">Reports</h1><p className="text-sm text-slate-500 mt-1">Generate and export energy consumption reports</p></div>
        {ran && results.length > 0 && (
          <button onClick={exportCSV} className="btn-secondary flex items-center gap-2"><Download size={14} /> Export CSV</button>
        )}
      </div>

      {/* Report controls */}
      <div className="card p-5">
        <h3 className="section-title mb-4">Report Parameters</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div><label className="label">From</label><input type="date" value={from} max={to} onChange={e => setFrom(e.target.value)} className="input" /></div>
          <div><label className="label">To</label><input type="date" value={to} min={from} onChange={e => setTo(e.target.value)} className="input" /></div>
          <div>
            <label className="label">Group By</label>
            <select className="input" value={groupBy} onChange={e => setGroupBy(e.target.value)}>
              <option value="zone">Zone</option>
              <option value="floor">Floor</option>
              <option value="building">Building</option>
              <option value="sensor">Sensor</option>
            </select>
          </div>
          <div>
            <label className="label">Sensor Type</label>
            <select className="input" value={sType} onChange={e => setSType(e.target.value)}>
              <option value="">All types</option>
              {['electricity','water','gas','hvac','solar'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <button onClick={run} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <span className="w-4 h-4 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" /> : <Search size={14} />}
            Generate Report
          </button>
        </div>
      </div>

      {loading && <LoadingOverlay />}

      {!loading && ran && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <MonthlyUsageChart data={trends} loading={false} />
            <DeviceConsumptionBar data={results.slice(0,8).map(r => ({ ...r, total_consumption: r.total_consumption, serial_number: r.label }))} loading={false} />
          </div>

          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="section-title text-sm">Consumption Data — {results.length} rows</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    {[...baseCols, 'total_consumption','avg_value','peak_value','reading_count'].map(c => (
                      <th key={c} className="table-header capitalize">{c.replace(/_/g,' ')}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      {baseCols.map(c => <td key={c} className="table-cell">{row[c] ?? '—'}</td>)}
                      <td className="table-cell font-mono text-cyan-400">{parseFloat(row.total_consumption??0).toFixed(2)}</td>
                      <td className="table-cell font-mono">{parseFloat(row.avg_value??0).toFixed(2)}</td>
                      <td className="table-cell font-mono text-amber-400">{parseFloat(row.peak_value??0).toFixed(2)}</td>
                      <td className="table-cell text-slate-500">{row.reading_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {results.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-sm">No data for the selected period</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}