import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import {
  Zap,
  Eye,
  EyeOff,
  LogIn,
  UserPlus
} from 'lucide-react';



export const LoginPage = () => {

  const { login } = useAuth();

  const navigate = useNavigate();



  const [form, setForm] = useState({
    email: '',
    password: '',
  });



  const [show, setShow] = useState(false);

  const [busy, setBusy] = useState(false);

  const [err, setErr] = useState('');



  const handle = async (e) => {

    e.preventDefault();

    setErr('');

    setBusy(true);



    try {

      await login(
        form.email,
        form.password
      );

      navigate('/dashboard');

    } catch (ex) {

      setErr(
        ex.response?.data?.message ??
        'Login failed'
      );

    } finally {

      setBusy(false);

    }

  };



  return (

    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-cyan-100 via-white to-blue-100 relative overflow-hidden">

      {/* Background Blur */}

      <div className="absolute w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl top-[-80px] left-[-80px]" />

      <div className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />



      <div className="w-full max-w-md  relative z-10">
      

 


      {/* RIGHT SIDE */}

          <div className="w-full max-w-lg mx-auto flex justify-center"></div>

        {/* Logo */}

        <div className="flex flex-col items-center mb-8">

          <div className="w-16 h-16 rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl border border-white/50 flex items-center justify-center mb-4">

            <Zap
              size={30}
              className="text-cyan-600"
            />

          </div>



          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">

            Energy Monitor

          </h1>



          <p className="text-slate-600 mt-2 text-center">

             Smart Energy Monitoring 

          </p>

        </div>



        {/* Card */}

        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[32px] p-8">

          <h2 className="text-3xl font-bold text-slate-900 mb-2">

            Welcome Back

          </h2>



          <p className="text-slate-500 mb-6">

            Sign in to continue monitoring

          </p>



          {err && (

            <div className="mb-5 px-4 py-3 rounded-2xl bg-rose-100 border border-rose-200 text-sm text-rose-600">

              {err}

            </div>

          )}



          <form
            onSubmit={handle}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                Email

              </label>



              <input
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-white/80 text-slate-900 outline-none focus:ring-4 focus:ring-cyan-200 transition-all"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    email: e.target.value,
                  }))
                }
              />

            </div>



            {/* Password */}

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                Password

              </label>



              <div className="relative">

                <input
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-white/80 text-slate-900 outline-none focus:ring-4 focus:ring-cyan-200 pr-12 transition-all"
                  type={show ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      password: e.target.value,
                    }))
                  }
                />



                <button
                  type="button"
                  onClick={() =>
                    setShow((s) => !s)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >

                  {show
                    ? <EyeOff size={18} />
                    : <Eye size={18} />
                  }

                </button>
              
              </div>

            </div>



            {/* Button */}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 text-white rounded-2xl py-3 font-semibold flex items-center justify-center gap-2"
            >

              {busy
                ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                )
                : (
                  <LogIn size={18} />
                )
              }

              {busy
                ? 'Signing in...'
                : 'Sign in'
              }

            </button>

          </form>
          <p className="text-center text-sm text-slate-700 mt-5">

          Don’t have an account?{' '}

          <Link
            to="/register"
            className="text-cyan-700 font-semibold hover:text-blue-700"
          >

            Create one

          </Link>

        </p>


        </div>

      </div>

    </div>

  );

};



export const RegisterPage = () => {

  const { register } = useAuth();

  const navigate = useNavigate();



  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'admin',
  });



  const [show, setShow] = useState(false);

  const [busy, setBusy] = useState(false);

  const [err, setErr] = useState('');



  const handle = async (e) => {

    e.preventDefault();

    setErr('');

    setBusy(true);



    try {

      await register(form);

      navigate('/dashboard');

    } catch (ex) {

      setErr(
        ex.response?.data?.message ??
        'Registration failed'
      );

    } finally {

      setBusy(false);

    }

  };



  const set = (k) => (e) =>

    setForm((f) => ({
      ...f,
      [k]: e.target.value,
    }));



  return (

    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-cyan-100 via-white to-blue-100 relative overflow-hidden">

      <div className="absolute w-96 h-96 bg-cyan-300/30 rounded-full blur-3xl top-[-80px] left-[-80px]" />

      <div className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />



      <div className="w-full max-w-md relative z-10">

        {/* Logo */}

        <div className="flex flex-col items-center mb-8">

          <div className="w-16 h-16 rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl border border-white/50 flex items-center justify-center mb-4">

            <Zap
              size={30}
              className="text-cyan-600"
            />

          </div>



          <h1 className="text-4xl font-bold text-slate-900">

            Energy Monitor

          </h1>



          <p className="text-slate-600 mt-2">

            Create your account

          </p>

        </div>



        {/* Card */}

        <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-[32px] p-8">

          <h2 className="text-3xl font-bold text-slate-900 mb-2">

            Get Started

          </h2>



          <p className="text-slate-500 mb-6">

            Create your monitoring account

          </p>



          {err && (

            <div className="mb-5 px-4 py-3 rounded-2xl bg-rose-100 border border-rose-200 text-sm text-rose-600">

              {err}

            </div>

          )}



          <form
            onSubmit={handle}
            className="space-y-5"
          >

            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                Full Name

              </label>



              <input
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-white/80 outline-none focus:ring-4 focus:ring-cyan-200"
                placeholder="Jane Smith"
                required
                value={form.full_name}
                onChange={set('full_name')}
              />

            </div>



            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                Email

              </label>



              <input
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-white/80 outline-none focus:ring-4 focus:ring-cyan-200"
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={set('email')}
              />

            </div>



            <div>

              <label className="block text-sm font-medium text-slate-700 mb-2">

                Password

              </label>



              <div className="relative">

                <input
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 bg-white/80 outline-none focus:ring-4 focus:ring-cyan-200 pr-12"
                  type={show ? 'text' : 'password'}
                  placeholder="Minimum 8 characters"
                  required
                  value={form.password}
                  onChange={set('password')}
                />



                <button
                  type="button"
                  onClick={() =>
                    setShow((s) => !s)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >

                  {show
                    ? <EyeOff size={18} />
                    : <Eye size={18} />
                  }

                </button>

              </div>

            </div>



            <button
              type="submit"
              disabled={busy}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 text-white rounded-2xl py-3 font-semibold flex items-center justify-center gap-2"
            >

              {busy
                ? (
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                )
                : (
                  <UserPlus size={18} />
                )
              }

              {busy
                ? 'Creating account...'
                : 'Create Account'
              }

            </button>

          </form>

        </div>



        <p className="text-center text-sm text-slate-700 mt-5">

          Already registered?{' '}

          <Link
            to="/login"
            className="text-cyan-700 font-semibold hover:text-blue-700"
          >

            Sign in

          </Link>

        </p>

      </div>

    </div>

  );

};