import { useState, useEffect } from 'react';

import {
  sensorsApi,
  zonesApi
} from '../services/services';

import {
  Table,
  Pagination,
  ConfirmDialog
} from '../components/UI';

import {
  Plus,
  Pencil,
  Trash2
} from 'lucide-react';

import toast from 'react-hot-toast';

export default function DevicesPage() {

  const [devices, setDevices] = useState([]);

  const [zones, setZones] = useState([]);

  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editItem, setEditItem] = useState(null);

  const [confirmId, setConfirmId] = useState(null);

  const [form, setForm] = useState({
    zone_id: '',
    sensor_name: '',
    sensor_type: 'electricity',
    unit: 'kWh',
    min_threshold: '',
    max_threshold: '',
  });

  const fetchDevices = async (p = 1) => {

    setLoading(true);

    try {

      const { data } = await sensorsApi.getAll({
        page: p,
        limit: 15,
      });

      const sortedDevices = [...(data.data || [])].sort(
  (a, b) => a.sensor_id - b.sensor_id
);

setDevices(sortedDevices);

      setPagination(data.pagination);

    } catch (err) {

      console.error(err);

      toast.error('Failed to load devices');

    } finally {

      setLoading(false);

    }

  };

  const fetchZones = async () => {

    try {

      const { data } = await zonesApi.getAll({
        limit: 100
      });

      setZones(data.data ?? []);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    fetchDevices(page);

  }, [page]);

  useEffect(() => {

    fetchZones();

  }, []);

  const save = async (e) => {

    e.preventDefault();

    const payload = {

      zone_id: form.zone_id,

      sensor_name: form.sensor_name,

      sensor_type: form.sensor_type,

      unit: form.unit,

      min_threshold:
        form.min_threshold || null,

      max_threshold:
        form.max_threshold || null,

      is_active: 1,

    };

    try {

      if (editItem) {

        await sensorsApi.update(
          editItem.sensor_id,
          payload
        );

        toast.success('Device updated');

      } else {

        await sensorsApi.create(payload);

        toast.success('Device created');

      }

      setShowModal(false);

      fetchDevices(page);

    } catch (err) {

      console.error(err);

      toast.error('Save failed');

    }

  };

  const del = async () => {

    try {

      await sensorsApi.remove(confirmId);

      toast.success('Deleted');

      setConfirmId(null);

      fetchDevices(page);

    } catch (err) {

      console.error(err);

      toast.error('Delete failed');

    }

  };

  const cols = [

 {
  key: 'sensor_id',
  label: '#',
  render: (_, row) => (
    <div className="text-center text-slate-600">
      {row.sensor_id}
    </div>
  ),
},

  {
  key: 'sensor_name',
  label: 'Device Name',
  render: (_, row) => (
    <div className="text-center font-semibold text-slate-800">
      {
        row.sensor_name ||
        row.sensor_label ||
        row.name ||
        `${row.sensor_type} Sensor`
      }
    </div>
  ),
},

  {
    key: 'sensor_type',
    label: 'Type',
    render: (v) => (
      <div className="flex justify-center">
        <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs capitalize">
          {v}
        </span>
      </div>
    ),
  },

  {
    key: 'zone_name',
    label: 'Zone',
    render: (v) => (
      <div className="text-center text-slate-700">
        {v || '—'}
      </div>
    ),
  },

  {
    key: 'unit',
    label: 'Unit',
    render: (v) => (
      <div className="text-center text-slate-700">
        {v}
      </div>
    ),
  },

  {
    key: 'is_active',
    label: 'Status',
    render: (v) => (
      <div className="flex justify-center">
        <span
          className={`px-3 py-1 rounded-xl text-xs ${
            v
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {v ? 'Active' : 'Inactive'}
        </span>
      </div>
    ),
  },

  {
    key: 'sensor_id',
    label: 'Actions',
    render: (_, row) => (

      <div className="flex items-center justify-center gap-3">

        <button
          onClick={() => {

            setEditItem(row);

            setForm({
              zone_id: row.zone_id,
              sensor_name:
                row.sensor_name ||
                row.name ||
                '',
              sensor_type: row.sensor_type,
              unit: row.unit,
              min_threshold:
                row.min_threshold || '',
              max_threshold:
                row.max_threshold || '',
            });

            setShowModal(true);

          }}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={() => setConfirmId(row.sensor_id)}
          className="p-2 rounded-lg hover:bg-red-50 text-red-500"
        >
          <Trash2 size={16} />
        </button>

      </div>

    ),
  },

];

  return (

    <div className="min-h-screen p-6 bg-gradient-to-br from-cyan-50 via-white to-blue-100">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold text-slate-900">
            Devices
          </h1>

          <p className="text-slate-500 mt-1">
            Manage all monitoring sensors
          </p>

        </div>

        <button
          onClick={() => {

            setEditItem(null);

            setForm({
              zone_id: '',
              sensor_name: '',
              sensor_type: 'electricity',
              unit: 'kWh',
              min_threshold: '',
              max_threshold: '',
            });

            setShowModal(true);

          }}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2"
        >
          <Plus size={18} />
          Add Device
        </button>

      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">

        <div className="overflow-x-auto">

          <Table
            columns={cols}
            data={devices}
            loading={loading}
            emptyMessage="No devices found"
            className="w-full"
          />

        </div>

        <Pagination
          pagination={pagination}
          onChange={setPage}
        />

      </div>

      {showModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">

            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">
                  {editItem ? 'Edit Device' : 'Add Device'}
                </h2>

                <p className="text-slate-500 text-sm mt-1">
                  Enter device details
                </p>

              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-3xl text-slate-400 hover:text-red-500"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={save}
              className="p-8 space-y-5"
            >

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Zone
                </label>

                <select
                  value={form.zone_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      zone_id: e.target.value,
                    })
                  }
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3 bg-white"
                  required
                >

                  <option value="">
                    Select Zone
                  </option>

                  {zones.map((z) => (

                    <option
                      key={z.zone_id}
                      value={z.zone_id}
                    >
                      {z.name}
                    </option>

                  ))}

                </select>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Device Name
                  </label>

                  <input
                    type="text"
                    value={form.sensor_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sensor_name: e.target.value,
                      })
                    }
                    placeholder="Enter device name"
                    className="w-full border border-slate-300 rounded-2xl px-4 py-3"
                    required
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sensor Type
                  </label>

                  <select
                    value={form.sensor_type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sensor_type: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded-2xl px-4 py-3 bg-white"
                  >

                    <option value="electricity">
                      Electricity
                    </option>

                    <option value="temperature">
                      Temperature
                    </option>

                    <option value="water">
                      Water
                    </option>

                    <option value="gas">
                      Gas
                    </option>

                  </select>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit
                  </label>

                  <input
                    type="text"
                    value={form.unit}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        unit: e.target.value,
                      })
                    }
                    className="w-full border border-slate-300 rounded-2xl px-4 py-3"
                  />

                </div>

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Minimum Threshold
                  </label>

                  <input
                    type="number"
                    value={form.min_threshold}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        min_threshold: e.target.value,
                      })
                    }
                    placeholder="Optional"
                    className="w-full border border-slate-300 rounded-2xl px-4 py-3"
                  />

                </div>

              </div>

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Maximum Threshold
                </label>

                <input
                  type="number"
                  value={form.max_threshold}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      max_threshold: e.target.value,
                    })
                  }
                  placeholder="Optional"
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3"
                />

              </div>

              <div className="flex justify-end gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-2xl"
                >
                  {editItem ? 'Update Device' : 'Create Device'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      <ConfirmDialog
        open={!!confirmId}
        onConfirm={del}
        onCancel={() => setConfirmId(null)}
      />

    </div>

  );

}