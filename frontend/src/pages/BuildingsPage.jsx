import { useState, useEffect, useMemo } from 'react';

import { buildingsApi } from '../services/services';

import {
  Table,
  Pagination,
  ConfirmDialog
} from '../components/UI';

import {
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';

import toast from 'react-hot-toast';



export default function BuildingsPage() {

  const [buildings, setBuildings] = useState([]);

  const [pagination, setPagination] = useState(null);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editItem, setEditItem] = useState(null);

  const [confirmId, setConfirmId] = useState(null);

  const [search, setSearch] = useState('');



  const [form, setForm] = useState({

    name: '',

    city: '',

    country: 'India',

    total_floors: 1,

    area_sqm: '',

  });



  // FETCH BUILDINGS

  const fetchBuildings = async (p = 1) => {

    setLoading(true);

    try {

      const { data } =
        await buildingsApi.getAll({

          page: p,

          limit: 12,

        });

      setBuildings(data.data || []);

      setPagination(data.pagination);

    } catch {

      toast.error('Failed to load buildings');

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchBuildings(page);

  }, [page]);



  // SEARCH

  const filteredBuildings = useMemo(() => {

    return buildings.filter((building) => {

      return (

        building.name
          ?.toLowerCase()
          .includes(search.toLowerCase())

        ||

        building.city
          ?.toLowerCase()
          .includes(search.toLowerCase())

      );

    });

  }, [buildings, search]);



  // SAVE

  const save = async (e) => {

    e.preventDefault();

    const payload = {

      name:
        form.name,

      address:
        form.address || 'Bangalore',

      city:
        form.city || 'Bangalore',

      country:
        form.country || 'India',

      total_floors:
        parseInt(form.total_floors) || 1,

      area_sqm:
        parseFloat(form.area_sqm) || 1000,

      created_by: 1,

    };



    try {

      console.log(payload);

      if (editItem) {

        await buildingsApi.update(
          editItem.building_id,
          payload
        );

        toast.success(
          'Building updated'
        );

      } else {

        await buildingsApi.create(
          payload
        );

        toast.success(
          'Building created'
        );

      }

      setShowModal(false);

      fetchBuildings(page);

    } catch (err) {

      console.error(err);

      toast.error('Save failed');

    }

  };



  // DELETE

  const del = async () => {

    try {

      await buildingsApi.remove(
        confirmId
      );

      toast.success('Deleted');

      setConfirmId(null);

      fetchBuildings(page);

    } catch {

      toast.error('Delete failed');

    }

  };



  // EDIT

  const openEdit = (b) => {

    setEditItem(b);

    setForm({

      name: b.name,

      address: b.address,

      city: b.city,

      country: b.country,

      total_floors: b.total_floors,

      area_sqm: b.area_sqm || '',

    });

    setShowModal(true);

  };



  // NEW

  const openNew = () => {

    setEditItem(null);

    setForm({

      name: '',

      city: '',

      country: 'India',

      total_floors: 1,

      area_sqm: '',

    });

    setShowModal(true);

  };



  // TABLE COLUMNS

  const cols = [

    {

      key: 'building_id',

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

      key: 'city',

      label: 'City',

      render: (v) => (

        <div className="flex justify-center">

          <span className="text-slate-700">

            {v}

          </span>

        </div>

      ),

    },



    {

      key: 'country',

      label: 'Country',

      render: (v) => (

        <div className="flex justify-center">

          <span className="text-slate-700">

            {v}

          </span>

        </div>

      ),

    },



    {

      key: 'total_floors',

      label: 'Floors',

      render: (v) => (

        <div className="flex justify-center">

          <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs">

            {v}

          </span>

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

      key: 'building_id',

      label: 'Actions',

      render: (_, row) => (

        <div className="flex items-center justify-center gap-3">

          <button
            onClick={() => openEdit(row)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-all"
          >

            <Pencil size={15} />

          </button>



          <button
            onClick={() =>
              setConfirmId(
                row.building_id
              )
            }
            className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all"
          >

            <Trash2 size={15} />

          </button>

        </div>

      ),

    },

  ];



  return (

    <div className="min-h-screen p-6 bg-gradient-to-br from-cyan-50 via-white to-blue-100">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">

            Buildings

          </h1>

          <p className="text-sm text-slate-500 mt-1">

            Manage monitored facilities

          </p>

        </div>



        <button
          onClick={openNew}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all"
        >

          <Plus size={16} />

          Add Building

        </button>

      </div>



      {/* TABLE */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

        {/* SEARCH */}

        <div className="px-4 py-4 border-b border-slate-200">

          <input
            className="w-full max-w-xs px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Search buildings..."
            value={search}
            onChange={(e) => {

              setSearch(
                e.target.value
              );

              setPage(1);

            }}
          />

        </div>



        {/* TABLE */}

        <div className="overflow-x-auto">

          <Table
            columns={cols}
            data={filteredBuildings}
            loading={loading}
            emptyMessage="No buildings found"
            className="w-full text-center"
          />

        </div>



        {/* PAGINATION */}

        <Pagination
          pagination={pagination}
          onChange={setPage}
        />

      </div>



      {/* MODAL */}

      {showModal && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">

            {/* HEADER */}

            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200">

              <div>

                <h2 className="text-2xl font-bold text-slate-900">

                  {editItem
                    ? 'Edit Building'
                    : 'Add Building'
                  }

                </h2>

                <p className="text-sm text-slate-500 mt-1">

                  Enter building details

                </p>

              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="text-slate-400 hover:text-red-500 text-3xl"
              >
                ×
              </button>

            </div>



            {/* FORM */}

            <form
              onSubmit={save}
              className="p-8 space-y-5"
            >

              {/* NAME */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">

                  Building Name

                </label>

                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800"
                />

              </div>

              {/* CITY + COUNTRY */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    City

                  </label>

                  <input
                    required
                    value={form.city}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        city: e.target.value,
                      }))
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800"
                  />

                </div>



                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Country

                  </label>

                  <input
                    value={form.country}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        country: e.target.value,
                      }))
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800"
                  />

                </div>

              </div>



              {/* FLOORS + AREA */}

              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Floors

                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.total_floors}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        total_floors:
                          e.target.value,
                      }))
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800"
                  />

                </div>



                <div>

                  <label className="block text-sm font-medium text-slate-700 mb-2">

                    Area (m²)

                  </label>

                  <input
                    type="number"
                    value={form.area_sqm}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        area_sqm:
                          e.target.value,
                      }))
                    }
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-white text-slate-800"
                  />

                </div>

              </div>



              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100"
                >

                  Cancel

                </button>



                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl"
                >

                  {editItem
                    ? 'Update Building'
                    : 'Create Building'
                  }

                </button>

              </div>

            </form>

          </div>

        </div>

      )}



      {/* DELETE */}

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