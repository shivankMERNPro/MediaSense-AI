import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../features/apiSlices/authApi";
import { persistAuthSession } from "../utils/authSession";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone || undefined,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      const response = await registerUser(payload).unwrap();
      persistAuthSession(dispatch, response.data);
      toast.success(response.message || "Account created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(
        error?.data?.message || "Unable to register. Please try again.",
      );
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Create your MediaMind account
          </h1>
          <p className="text-white/70">
            Start organizing your media with AI intelligence.
          </p>
        </div>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          onSubmit={handleSubmit}
        >
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
              placeholder="Jane Doe"
              required
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Phone (optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
              placeholder="1234567890"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/80 mb-2">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Confirm password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/40"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="md:col-span-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition disabled:opacity-70"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-white/50 text-xs mt-6">
          OAuth sign-up is temporarily disabled. We’ll re-enable Google and
          GitHub buttons once provider review wraps up.
        </p>

        <p className="text-center text-white/70 text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-300 font-semibold hover:text-purple-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

