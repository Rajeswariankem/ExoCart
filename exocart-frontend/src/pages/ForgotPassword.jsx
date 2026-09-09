import { useState } from "react";
import {
  Mail,
  ShieldCheck,
  Lock,
  ArrowLeft,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // STEP 1 - Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const message = await response.text();

      if (!response.ok) {
        toast.error(message || "Unable to send OTP.");
        return;
      }

      toast.success("OTP sent to your email.");
      setStep(2);
    } catch (error) {
      console.error("Send OTP Error:", error);
      toast.error("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2 - Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      toast.error("OTP must contain 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
          }),
        }
      );

      const message = await response.text();

      if (!response.ok) {
        toast.error(message || "Invalid or expired OTP.");
        return;
      }

      toast.success("OTP verified successfully.");
      setStep(3);
    } catch (error) {
      console.error("Verify OTP Error:", error);
      toast.error("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3 - Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please enter your new password.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            otp: otp.trim(),
            newPassword,
          }),
        }
      );

      const message = await response.text();

      if (!response.ok) {
        toast.error(message || "Unable to reset password.");
        return;
      }

      toast.success("Password reset successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white flex items-center justify-center px-5">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black">
            <span className="text-white">Exo</span>
            <span className="text-green-400">Cart</span>
          </h1>

          <p className="text-slate-400 text-sm mt-2">
            Reset your account password
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#081225] border border-slate-800 rounded-2xl p-7 shadow-2xl">

          {/* Steps */}
          <div className="flex items-center justify-center mb-8">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex items-center"
              >
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center
                    text-sm font-bold
                    ${
                      step >= item
                        ? "bg-green-500 text-black"
                        : "bg-slate-800 text-slate-500"
                    }
                  `}
                >
                  {item}
                </div>

                {item !== 3 && (
                  <div
                    className={`
                      w-20 h-[2px] mx-2
                      ${
                        step > item
                          ? "bg-green-500"
                          : "bg-slate-800"
                      }
                    `}
                  />
                )}
              </div>
            ))}

          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSendOtp}>

              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <Mail
                    size={27}
                    className="text-green-400"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-center">
                Forgot Password?
              </h2>

              <p className="text-slate-400 text-sm text-center mt-2 mb-6">
                Enter your registered email and we'll send you an OTP.
              </p>

              <label className="text-sm text-slate-300">
                Email Address
              </label>

              <div className="relative mt-2 mb-5">
                <Mail
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-500"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="
                    w-full h-11
                    bg-[#020817]
                    border border-slate-700
                    rounded-xl
                    pl-10 pr-4
                    text-sm text-white
                    outline-none
                    focus:border-green-500
                    transition
                  "
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-2 flex h-11 w-full
                  items-center justify-center gap-2
                  rounded-xl border border-transparent
                  bg-green-500
                  px-3
                  text-[15px] font-semibold
                  text-slate-950
                  transition-all duration-300
                  cursor-pointer
                  hover:border-green-500
                  hover:bg-[#122d1a]
                  hover:text-green-300
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {loading ? "Sending OTP..." : "Send OTP"}

                {!loading && <ArrowRight size={18} />}
              </button>

            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>

              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck
                    size={27}
                    className="text-green-400"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-center">
                Verify OTP
              </h2>

              <p className="text-slate-400 text-sm text-center mt-2 mb-6">
                Enter the 6-digit OTP sent to
                <span className="text-white ml-1">
                  {email}
                </span>
              </p>

              <label className="text-sm text-slate-300">
                OTP
              </label>

              <div className="relative mt-2 mb-5">
                <KeyRound
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-500"
                />

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value.replace(/\D/g, "")
                    )
                  }
                  placeholder="Enter 6-digit OTP"
                  className="
                    w-full h-11
                    bg-[#020817]
                    border border-slate-700
                    rounded-xl
                    pl-10 pr-4
                    text-sm text-white
                    tracking-[0.3em]
                    outline-none
                    focus:border-green-500
                    transition
                  "
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full h-11
                  bg-green-500
                  hover:bg-green-400
                  text-black
                  font-bold
                  rounded-xl
                  flex items-center justify-center gap-2
                  transition
                  cursor-pointer
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {loading ? "Verifying..." : "Verify OTP"}
                {!loading && <ArrowRight size={18} />}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="
                  w-full mt-3
                  text-sm text-slate-400
                  hover:text-white
                  transition
                  cursor-pointer
                "
              >
                Change email
              </button>

            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>

              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <Lock
                    size={27}
                    className="text-green-400"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-center">
                Create New Password
              </h2>

              <p className="text-slate-400 text-sm text-center mt-2 mb-6">
                Enter a new password for your account.
              </p>

              <label className="text-sm text-slate-300">
                New Password
              </label>

              <div className="relative mt-2 mb-4">
                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-500"
                />

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Enter new password"
                  className="
                    w-full h-11
                    bg-[#020817]
                    border border-slate-700
                    rounded-xl
                    pl-10 pr-4
                    text-sm text-white
                    outline-none
                    focus:border-green-500
                    transition
                  "
                />
              </div>

              <label className="text-sm text-slate-300">
                Confirm Password
              </label>

              <div className="relative mt-2 mb-5">
                <Lock
                  size={18}
                  className="absolute left-3 top-3.5 text-slate-500"
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm new password"
                  className="
                    w-full h-11
                    bg-[#020817]
                    border border-slate-700
                    rounded-xl
                    pl-10 pr-4
                    text-sm text-white
                    outline-none
                    focus:border-green-500
                    transition
                  "
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full h-11
                  bg-green-500
                  hover:bg-green-400
                  text-black
                  font-bold
                  rounded-xl
                  flex items-center justify-center gap-2
                  transition
                  cursor-pointer
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                {loading
                  ? "Resetting Password..."
                  : "Reset Password"}
                {!loading && <ArrowRight size={18} />}
              </button>

            </form>
          )}

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              w-full mt-5
              flex items-center justify-center gap-2
              text-sm text-slate-400
              hover:text-green-400
              transition
              cursor-pointer
            "
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>

        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;