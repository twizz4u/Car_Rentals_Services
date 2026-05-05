import { Link } from "react-router-dom";
import { useState } from "react";


const CustomerAuthForm = ({ isLogin, setIsLogin }) => {

  const [regValue, setRegValue] = useState({})
  const [submit, setSubmit] = useState(false)


  // console.log(regValue);

  function onchangeHannder(e) {
    setRegValue({ ...regValue, [e.target.name]: e.target.value })
  }



  function submitLoginHandler() {
    console.log(regValue, 'from login habdler');


  }

  const submitRegHandler = async () => {
    // if (!regValue.firstname || !regValue.secondname || !regValue.gender || !regValue.age || !regValue.phone || !regValue.address || !regValue.city || !regValue.state || !regValue.email || !regValue.password) {
    //   console.log(regValue, 'from reg handler');
    //   return
    // }

    if (!regValue.firstname) {
      console.log(regValue.firstname);
      return
    }
    if (!regValue.secondname) {
      console.log(regValue.secondname);
      return
    }
    if (!regValue.gender) {
      console.log(regValue.gender);
      return
    }
    if (!regValue.age) {
      console.log(regValue.age);
      return
    }
    if (!regValue.phone) {
      console.log(regValue.phone);
      return
    }
    if (!regValue.address) {
      console.log(regValue.address);
      return
    }

    if (!regValue.city) {
      console.log(regValue.city);
      return
    }

    if (!regValue.state) {
      console.log(regValue.state)
      return
    }

    if (!regValue.email) {
      console.log(regValue.email)
      return
    }

    if (!regValue.password) {
      console.log(!regValue.password)
      return
    }


    if (regValue.password != regValue.confirmPassword) {
      console.log(regValue.password, regValue.confirmPassword, 'from reg handler');
      return
    }
    // console.log(regValue, 'form submithandler');

    try {
      const response = await fetch("http://127.0.0.1:8000/api/customer/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(regValue)
      });

      const responseData = await response.json();
      console.log('Status code:', response.status);
      console.log('Response body:', responseData);

    } catch (error) {
      console.log('Fetch error:', error);
    }


    // console.log(response)
  }



  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center lg:text-left mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.08)]">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        <p className="text-slate-500 text-sm mt-3 leading-relaxed">
          {isLogin
            ? "Log in securely to manage your bookings and rentals."
            : "Enter your details to get started with your premium rental experience."}
        </p>
      </div>

      <form className="space-y-4">
        {!isLogin && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-slate-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstname"
                value={regValue.firstname || ''}
                onChange={(e) => onchangeHannder(e)}
                placeholder="John"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="secondname"
                className="text-sm font-medium text-slate-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="secondname"
                name="secondname"
                value={regValue.secondname || ''}
                onChange={(e) => onchangeHannder(e)}
                placeholder="Doe"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>
        )}


        {!isLogin && (<><div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={regValue.gender == 'male'}
              onChange={(e) => onchangeHannder(e)}
              className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
              Male
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={regValue.gender == 'female'}
              onChange={(e) => onchangeHannder(e)}
              className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-slate-700 group-hover:text-slate-900 transition-colors">
              Female
            </span>
          </label>
        </div>


          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-slate-700"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={regValue.phone || ''}
              onChange={(e) => onchangeHannder(e)}
              placeholder="+234 801 234 5678"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </div>


          <div className="space-y-2">
            <label
              htmlFor="address"
              className="text-sm font-medium text-slate-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={regValue.address || ''}
              onChange={(e) => onchangeHannder(e)}
              placeholder="123 Main Street"
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* City, State, Zip */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label
                htmlFor="city"
                className="text-sm font-medium text-slate-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={regValue.city || ''}
                onChange={(e) => onchangeHannder(e)}
                placeholder="Lagos"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="state"
                className="text-sm font-medium text-slate-700"
              >
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={regValue.state || ''}
                onChange={(e) => onchangeHannder(e)}
                placeholder="Lagos"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="age" className="text-sm font-medium text-slate-700">Age </label>
              <input
                type="number"
                id="age"
                name="age"
                min={'0'}
                value={regValue.age || ''}
                onChange={(e) => onchangeHannder(e)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>
          </div>
        </>)}

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1" htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={regValue.email || ''}
            onChange={(e) => onchangeHannder(e)}
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-white/60 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 placeholder-slate-400 outline-none transition-all shadow-sm font-medium text-slate-700"
            placeholder="john@example.com"
          />
        </div>


        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={regValue.password || ''}
            onChange={(e) => onchangeHannder(e)}
            className="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-white/60 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 placeholder-slate-400 outline-none transition-all shadow-sm font-medium text-slate-700"
            placeholder="••••••••"
          />
        </div>

        {!isLogin && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={regValue.confirmPassword || ''}
              onChange={(e) => onchangeHannder(e)}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200/80 bg-white/60 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 placeholder-slate-400 outline-none transition-all shadow-sm font-medium text-slate-700"
              placeholder="••••••••"
            />
          </div>
        )}

        <div className="pt-4">
          <button
            type="button" //
            onClick={isLogin ? submitLoginHandler : submitRegHandler}
            className="w-full bg-slate-900 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-[0_8px_25px_rgba(16,185,129,0.3)] active:scale-[0.98] uppercase tracking-wide text-sm"
          >
            {isLogin ? "Sign In Securely" : "Create Account"}
          </button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm font-medium text-slate-500">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="font-bold text-emerald-600 hover:text-emerald-500 transition-colors uppercase tracking-wide text-[11px] ml-1 border-b border-transparent hover:border-emerald-500 pb-0.5 outline-none"
        >
          {isLogin ? "Create one now" : "Log in instead"}
        </button>
      </div>
    </div>
  );
};

export default CustomerAuthForm;
