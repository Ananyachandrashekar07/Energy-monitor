import { useState, useEffect } from 'react';

import {
  zonesApi,
  buildingsApi,
  floorsApi
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



export default function RoomsPage() {

  const [zones, setZones] = useState([]);

  const [floors, setFloors] = useState([]);

  const [buildings, setBuildings] = useState([]);

  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editItem, setEditItem] = useState(null);

  const [confirmId, setConfirmId] = useState(null);

  const [selBuilding, setSelBuilding] = useState('');

  const [form, setForm] = useState({

    floor_id: '',

    name: '',

    zone_type: 'office',

    area_sqm: '',

  });



  const fetchZones = async () => {

  setLoading(true);

  try {

    const { data } = await zonesApi.getAll({
      limit: 100,
    });

    const sortedData = [...(data.data || [])].sort(
      (a, b) => a.zone_id - b.zone_id
    );

    setZones(sortedData);

  } catch (err) {

    console.error(err);

    toast.error('Failed to load zones');

  } finally {

    setLoading(false);

  }

};



  useEffect(() => {

    fetchZones(page);

  }, [page]);



  useEffect(() => {

    buildingsApi

      .getAll({ limit: 100 })

      .then(({ data }) =>

        setBuildings(data.data ?? [])

      );

  }, []);



  useEffect(() => {

    if (!selBuilding) {

      setFloors([]);

      return;

    }

    floorsApi

      .getAll({

        building_id: selBuilding

      })

      .then(({ data }) =>

        setFloors(data.data ?? [])

      );

  }, [selBuilding]);



  const save = async (e) => {

    e.preventDefault();

    const payload = {

      ...form,

      area_sqm:
        form.area_sqm || null,

    };

    try {

      if (editItem) {

        await zonesApi.update(

          editItem.zone_id,

          payload

        );

        toast.success('Zone updated');

      } else {

        await zonesApi.create(payload);

        toast.success('Zone created');

      }

      setShowModal(false);

      fetchZones(page);

    } catch {

      toast.error('Save failed');

    }

  };



  const del = async () => {

    try {

      await zonesApi.remove(confirmId);

      toast.success('Deleted');

      setConfirmId(null);

      fetchZones(page);

    } catch {

      toast.error('Delete failed');

    }

  };



  const cols = [

    {

      key: 'zone_id',

      label: '#',

      render: (v) => (

        <div className="flex justify-center">

          <span className="text-slate-500 text-sm">

            {v}

          </span>

        </div>

      ),

    },

    {

      key: 'name',

      label: 'Name',

      render: (v) => (

        <div className="flex justify-center">

          <span className="font-semibold text-slate-800">

            {v}

          </span>

        </div>

      ),

    },

    {

      key: 'zone_type',

      label: 'Type',

      render: (v) => (

        <div className="flex justify-center">

          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs capitalize">

            {v}

          </span>

        </div>

      ),

    },

    {

      key: 'floor_label',

      label: 'Floor',

      render: (v) => (

        <div className="flex justify-center">

          <span className="text-slate-700">

            {v}

          </span>

        </div>

      ),

    },

   
{
  key: 'building_name',
  label: 'Building',
  render: (_, row) => (
    <div className="text-center text-slate-700">
      {row.building_name}
    </div>
  ),
},

    {

      key: 'area_sqm',

      label: 'Area',

      render: (v) => (

        <div className="flex justify-center">

          <span className="text-slate-700">

            {v ? `${v} m²` : '—'}

          </span>

        </div>

      ),

    },

    {

      key: 'zone_id',

      label: 'Actions',

      render: (_, row) => (

        <div className="flex items-center justify-center gap-3">

          <button
            onClick={() => {

              setEditItem(row);

              setForm({

                floor_id: row.floor_id,

                name: row.name,

                zone_type: row.zone_type,

                area_sqm:
                  row.area_sqm ?? '',

              });

              setShowModal(true);

            }}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          >

            <Pencil size={15} />

          </button>


          <button
            onClick={() =>
              setConfirmId(row.zone_id)
            }
            className="p-2 rounded-lg hover:bg-red-50 text-red-500"
          >

            <Trash2 size={15} />

          </button>

        </div>

      ),

    },

  ];



  return (

    <div className="min-h-screen p-6 bg-gradient-to-br from-cyan-50 via-white to-blue-100">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">

            Rooms & Zones

          </h1>

          <p className="text-sm text-slate-500 mt-1">

            Logical areas within each floor

          </p>

        </div>


        <button
          onClick={() => {

            setEditItem(null);

            setForm({

              floor_id: '',

              name: '',

              zone_type: 'office',

              area_sqm: '',

            });

            setShowModal(true);

          }}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-2"
        >

          <Plus size={15} />

          Add Zone

        </button>

      </div>



      {/* Table */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        <div className="overflow-x-auto">

          <Table
            columns={cols}
            data={zones}
            loading={loading}
            emptyMessage="No zones found"
            className="w-full text-center"
          />

        </div>


        <Pagination
          pagination={pagination}
          onChange={setPage}
        />

      </div>



      {/* Modal */}

      {showModal && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">

            {/* Header */}

            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">

                  {editItem ? 'Edit Zone' : 'Add Zone'}

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  Enter zone details

                </p>

              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-red-500 text-3xl leading-none"
              >
                ×
              </button>

            </div>



            {/* Form */}

            <form
              onSubmit={save}
              className="p-8 space-y-5"
            >

              {!editItem && (

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Building

                  </label>

                  <select
                    value={selBuilding}
                    onChange={(e) =>
                      setSelBuilding(e.target.value)
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800"
                  >

                    <option value="">

                      Select Building

                    </option>

                    {buildings.map((b) => (

                      <option
                        key={b.building_id}
                        value={b.building_id}
                      >

                        {b.name}

                      </option>

                    ))}

                  </select>

                </div>

              )}


              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">

                  Floor

                </label>

                <select
                  value={form.floor_id}
                  onChange={(e) =>
                    setForm({

                      ...form,

                      floor_id: e.target.value,

                    })
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800"
                  required
                >

                  <option value="">

                    Select Floor

                  </option>

                  {floors.map((f) => (

                    <option
                      key={f.floor_id}
                      value={f.floor_id}
                    >

                      Floor {f.floor_number}

                    </option>

                  ))}

                </select>

              </div>


              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Zone Name

                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm({

                        ...form,

                        name: e.target.value,

                      })
                    }
                    placeholder="Enter zone name"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800"
                    required
                  />

                </div>


                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Zone Type

                  </label>

                  <select
                    value={form.zone_type}
                    onChange={(e) =>
                      setForm({

                        ...form,

                        zone_type: e.target.value,

                      })
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800"
                  >

                    <option value="office">

                      Office

                    </option>

                    <option value="lab">

                      Lab

                    </option>

                    <option value="conference">

                      Conference

                    </option>

                    <option value="classroom">

                      Classroom

                    </option>

                  </select>

                </div>

              </div>


              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">

                  Area (m²)

                </label>

                <input
                  type="number"
                  value={form.area_sqm}
                  onChange={(e) =>
                    setForm({

                      ...form,

                      area_sqm: e.target.value,

                    })
                  }
                  placeholder="Optional"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800"
                />

              </div>


              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                >

                  Cancel

                </button>


                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl"
                >

                  {editItem ? 'Update Zone' : 'Create Zone'}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}



      <ConfirmDialog
        open={!!confirmId}
        onConfirm={del}
        onCancel={() =>
          setConfirmId(null)
        }
      />

    </div>

  );

}