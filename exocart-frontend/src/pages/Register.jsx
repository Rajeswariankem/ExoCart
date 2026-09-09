import {
  User,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  Truck,
  BadgePercent,
  Headset,
  ShoppingBag,
} from "lucide-react";

import { useState } from "react";
import { registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Register() {
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      phoneNumber: ""
    });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await registerUser(formData);

      toast.success("Account created successfully!");

      console.log(response.data);

      setFormData({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
      });

    } catch (error) {

          console.log(error.response.data);

          toast.error(error.response.data);
      }
  };

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center px-4 py-3">

     <div className="w-full max-w-5xl bg-[#081225] border border-slate-800 rounded-3xl shadow-2xl grid lg:grid-cols-2 overflow-hidden">

        {/* LEFT SECTION */}

        <div className="relative p-6 flex flex-col justify-center">

          <div className="absolute w-56 h-56 bg-green-500/10 blur-[100px] rounded-full top-16 left-12"></div>

          <div className="flex items-center gap-2 mb-5 relative z-10">

            <div className="bg-green-500 p-1.5 rounded-lg">
              <ShoppingBag size={18} color="white" />
            </div>

            <h1 className="text-xl font-bold text-white">
              Exo<span className="text-green-400">Cart</span>
            </h1>

          </div>

          <h2 className="text-3xl font-bold text-white leading-tight mb-3 relative z-10">
            Smart Shopping,
            <br />
            <span className="text-green-400">
              Better Living
            </span>
          </h2>

          <p className="text-slate-400 text-sm leading-6 mb-6 max-w-sm relative z-10">
            Join ExoCart and enjoy a seamless shopping experience with fast delivery,
            exciting offers and trusted service.
          </p>

          <div className="space-y-3 relative z-10">

            <div className="flex items-center gap-3">

              <div className="bg-green-500/10 p-2 rounded-lg">
                <BadgePercent className="text-green-400" size={16} />
              </div>

              <div>
                <h3 className="text-white text-sm font-semibold">
                  Best Deals
                </h3>

                <p className="text-slate-400 text-xs">
                  Daily discounts and offers
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="bg-green-500/10 p-2 rounded-lg">
                <Truck className="text-green-400" size={16} />
              </div>

              <div>
                <h3 className="text-white text-sm font-semibold">
                  Fast Delivery
                </h3>

                <p className="text-slate-400 text-xs">
                  Delivered to your doorstep
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="bg-green-500/10 p-2 rounded-lg">
                <ShieldCheck className="text-green-400" size={16} />
              </div>

              <div>
                <h3 className="text-white text-sm font-semibold">
                  Secure Payments
                </h3>

                <p className="text-slate-400 text-xs">
                  Trusted transactions
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="bg-green-500/10 p-2 rounded-lg">
                <Headset className="text-green-400" size={16} />
              </div>

              <div>
                <h3 className="text-white text-sm font-semibold">
                  24/7 Support
                </h3>

                <p className="text-slate-400 text-xs">
                  Always available
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SECTION */}

        <div className="flex items-center justify-center p-5">

          <div className="w-full max-w-sm">
            <form onSubmit={handleSubmit}>

            <div className="text-center mb-6">

              <div className="bg-green-500/10 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <User size={22} className="text-green-400" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">
                Create Account
              </h2>

              <p className="text-slate-400 text-sm">
                Fill your details to get started
              </p>

            </div>

            {/* Name */}

            <div className="relative mb-3">

              <User
                size={16}
                className="absolute left-4 top-3.5 text-slate-400"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-transparent border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white text-sm outline-none focus:border-green-400"
              />

            </div>

            {/* Email */}

            <div className="relative mb-3">

              <Mail
                size={16}
                className="absolute left-4 top-3.5 text-slate-400"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full bg-transparent border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white text-sm outline-none focus:border-green-400"
              />

            </div>

            {/* Password */}

            <div className="relative mb-3">

              <Lock
                size={16}
                className="absolute left-4 top-3.5 text-slate-400"
              />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-transparent border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white text-sm outline-none focus:border-green-400"
              />

            </div>

            {/* Phone */}

            <div className="relative mb-4">

              <Phone
                size={16}
                className="absolute left-4 top-3.5 text-slate-400"
              />

              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full bg-transparent border border-slate-700 rounded-lg py-2.5 pl-11 pr-4 text-white text-sm outline-none focus:border-green-400"
              />

            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 transition-all duration-300 text-white text-sm font-semibold py-2.5 rounded-lg"
            >
              Create Account
            </button>
            </form>

            <p className="text-center text-slate-400 text-sm mt-4">
              Already have an account?
              <span
                onClick={() => navigate("/login")}
                className="text-green-400 ml-2 cursor-pointer"
              >
                Login
              </span>
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;