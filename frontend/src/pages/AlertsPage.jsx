import { useState, useEffect } from 'react';
import { alertsApi } from '../services/services';
import { Table, Pagination, ConfirmDialog } from '../components/UI';
import Modal from '../components/Modal';
import { AlertSeverityChart, AlertStatusDoughnut } from '../charts/AlertStatisticsChart';
import { Plus, Pencil, Trash2, CheckCheck, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const BADGE = {
  open:         'badge-red',
  acknowledged: 'badge-amber',
  resolved:     'badge-green',
  critical:     'badge-red',
  high:         'badge-amber',
  medium:       'badge-cyan',
  low:          'badge-green',
};

export default function AlertsPage() {
  const [tab,  setTab]  = useState('logs');  // 'logs' | 'rules'
  const [logs,  setLogs]  = useState([]);
  const [rules, setRules] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page,  setPage]  = useState(1);
  const [loading, setLoading] = useState(false);
  const [showRule,  setShowRule]  = useState(false);
  const [editRule,  setEditRule]  = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [ruleForm,  setRuleForm]  = useState({ metric_type:'electricity', threshold_value:'', condition_op:'gt', window_minutes:60, building_id:'', zone_id:'' });

  const fetchLogs = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await alertsApi.getLogs({ page: p, limit: 15 });
      setLogs(data.data ?? []);
      setPagination(data.pagination);
    } finally { setLoading(false); }
  };

  const fetchRules = async () => {
    setLoading(true);
    try { const { data } = await alertsApi.getRules(); setRules(data.data ?? []); }
    finally { setLoading(false); }
  };

  useEffect(() => { tab === 'logs' ? fetchLogs(page) : fetchRules(); }, [tab, page]);

  const handleStatusChange = async (id, status) => {
    try {
      await alertsApi.updateLogStatus(id, { status });
      toast.success('Status updated');
      fetchLogs(page);
    } catch { toast.error('Failed to update'); }
  };

  const saveRule = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...ruleForm, threshold_value: parseFloat(ruleForm.threshold_value),
        building_id: ruleForm.building_id || null, zone_id: ruleForm.zone_id || null };
      if (editRule) { await alertsApi.updateRule(editRule.rule_id, payload); toast.success('Rule updated'); }
      else          { await alertsApi.createRule(payload); toast.success('Rule created'); }
      setShowRule(false); setEditRule(null);
      fetchRules();
    } catch { toast.error('Save failed'); }
  };

  const deleteRule = async () => {
    try { await alertsApi.deleteRule(confirmId); toast.success('Rule deleted'); setConfirmId(null); fetchRules(); }
    catch { toast.error('Delete failed'); }
  };

  const openEdit = (rule) => {
    setEditRule(rule);
    setRuleForm({ metric_type: rule.metric_type, threshold_value: rule.threshold_value,
      condition_op: rule.condition_op, window_minutes: rule.window_minutes,
      building_id: rule.building_id ?? '', zone_id: rule.zone_id ?? '' });
    setShowRule(true);
  };

  const logCols = [

 {
  key: 'alert_id',
  label: '#',
  render: (_, row) => (
  <div className="text-center text-slate-600">
    {logs.findIndex(
      item => item.alert_id === row.alert_id
    ) + 1}
  </div>
)
},

  {
    key: 'severity',
    label: 'Severity',
    render: v => (
      <div className="flex justify-center">
        <span className={BADGE[v]}>
          {v}
        </span>
      </div>
    )
  },

  {
    key: 'zone_name',
    label: 'Zone',
    render: v => (
      <div className="text-center">
        {v || '-'}
      </div>
    )
  },

  {
    key: 'metric_type',
    label: 'Type',
    render: v => (
      <div className="flex justify-center">
        <span className="badge-slate capitalize">
          {v}
        </span>
      </div>
    )
  },

  {
    key: 'reading_value',
    label: 'Value',
    render: (v, r) => (
      <div className="text-center font-mono">
        {parseFloat(v).toFixed(2)} {r.unit}
      </div>
    )
  },

  {
    key: 'status',
    label: 'Status',
    render: v => (
      <div className="flex justify-center">
        <span className={BADGE[v]}>
          {v}
        </span>
      </div>
    )
  },

  {
    key: 'triggered_at',
    label: 'Time',
    render: v => (
      <div className="text-center text-slate-500">
        {v?.slice(0, 16)}
      </div>
    )
  },

  {
    key: 'alert_id',
    label: 'Actions',
    render: (_, row) => (

      <div className="flex justify-center gap-2">

        {row.status !== 'acknowledged' && (

          <button
            onClick={() =>
              handleStatusChange(
                row.alert_id,
                'acknowledged'
              )
            }
            className="p-1.5 rounded-lg hover:bg-amber-500/10 text-amber-400"
          >
            <Eye size={14} />
          </button>

        )}

        {row.status !== 'resolved' && (

          <button
            onClick={() =>
              handleStatusChange(
                row.alert_id,
                'resolved'
              )
            }
            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-400"
          >
            <CheckCheck size={14} />
          </button>

        )}

      </div>

    )
  },

];

  const ruleCols = [
    { key: 'rule_id',         label: '#', render: v => <span className="font-mono text-xs text-slate-500">{v}</span> },
    { key: 'metric_type',     label: 'Type',       render: v => <span className="badge-slate capitalize">{v}</span> },
    { key: 'condition_op',    label: 'Condition',  render: (v, r) => <span className="font-mono text-xs text-slate-300">{v} {r.threshold_value}</span> },
    { key: 'building_name',   label: 'Building',   render: v => v ?? <span className="text-slate-600">Global</span> },
    { key: 'zone_name',       label: 'Zone',       render: v => v ?? <span className="text-slate-600">All zones</span> },
    { key: 'is_active',       label: 'Active',     render: v => <span className={v ? 'badge-green' : 'badge-slate'}>{v ? 'Active' : 'Off'}</span> },
    { key: 'rule_id',         label: 'Actions',    render: (_, row) => (
      <div className="flex gap-1">
        <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"><Pencil size={13} /></button>
        <button onClick={() => setConfirmId(row.rule_id)} className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors"><Trash2 size={13} /></button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Alerts</h1>
          <p className="text-sm text-slate-500 mt-1">Monitor and manage energy alerts</p>
        </div>
        {tab === 'rules' && (
          <button onClick={() => { setEditRule(null); setRuleForm({ metric_type:'electricity', threshold_value:'', condition_op:'gt', window_minutes:60, building_id:'', zone_id:'' }); setShowRule(true); }}
            className="btn-primary flex items-center gap-2"><Plus size={15} /> New Rule</button>
        )}
      </div>

      {/* Chart row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2"><AlertSeverityChart logs={logs} loading={loading} /></div>
        <AlertStatusDoughnut logs={logs} loading={loading} />
      </div>

      {/* Tabs */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-slate-800 px-1 pt-1">
          {['logs','rules'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px
                ${tab === t ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>
              {t === 'logs' ? 'Alert Logs' : 'Threshold Rules'}
            </button>
          ))}
        </div>

        {tab === 'logs' ? (
          <>
            <Table columns={logCols} data={logs} loading={loading} emptyMessage="No alerts found" />
            <Pagination pagination={pagination} onChange={(p) => setPage(p)} />
          </>
        ) : (
          <Table columns={ruleCols} data={rules} loading={loading} emptyMessage="No rules configured" />
        )}
      </div>

      {/* Rule form modal */}
      <Modal open={showRule} onClose={() => setShowRule(false)} title={editRule ? 'Edit Rule' : 'New Threshold Rule'}>
        <form onSubmit={saveRule} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Metric Type</label>
              <select className="input" value={ruleForm.metric_type} onChange={e => setRuleForm(f => ({...f, metric_type: e.target.value}))}>
                {['electricity','water','gas','hvac','solar'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Condition</label>
              <select className="input" value={ruleForm.condition_op} onChange={e => setRuleForm(f => ({...f, condition_op: e.target.value}))}>
                <option value="gt">Greater than (&gt;)</option>
                <option value="gte">Greater or equal (≥)</option>
                <option value="lt">Less than (&lt;)</option>
                <option value="lte">Less or equal (≤)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Threshold Value</label>
              <input className="input" type="number" step="0.01" required placeholder="e.g. 500"
                value={ruleForm.threshold_value} onChange={e => setRuleForm(f => ({...f, threshold_value: e.target.value}))} />
            </div>
            <div>
              <label className="label">Window (minutes)</label>
              <input className="input" type="number" min="1" value={ruleForm.window_minutes}
                onChange={e => setRuleForm(f => ({...f, window_minutes: parseInt(e.target.value)}))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Building ID (optional)</label>
              <input className="input" type="number" placeholder="Leave blank for global"
                value={ruleForm.building_id} onChange={e => setRuleForm(f => ({...f, building_id: e.target.value}))} />
            </div>
            <div>
              <label className="label">Zone ID (optional)</label>
              <input className="input" type="number" placeholder="Leave blank for all zones"
                value={ruleForm.zone_id} onChange={e => setRuleForm(f => ({...f, zone_id: e.target.value}))} />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" onClick={() => setShowRule(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editRule ? 'Update Rule' : 'Create Rule'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!confirmId} onConfirm={deleteRule} onCancel={() => setConfirmId(null)}
        message="Delete this threshold rule? All associated alerts will remain but no new ones will fire." />
    </div>
  );
}