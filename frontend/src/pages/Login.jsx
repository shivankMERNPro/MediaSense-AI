import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useLoginMutation } from "../features/apiSlices/authApi";
import { persistAuthSession } from "../utils/authSession";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [login, { isLoading }] = useLoginMutation();
  const from = location.state?.from || "/dashboard";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      persistAuthSession(dispatch, response.data);
      toast.success(response.message || "Welcome back!");
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(
        error?.data?.message || "Unable to sign in. Please try again.",
      );
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-8 backdrop-blur">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/70">
            Sign in with your MediaMind credentials.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Email
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 text-white font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition disabled:opacity-70"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-white/50 text-xs mt-6">
          Google/GitHub sign-in is temporarily disabled while we finalize the
          OAuth rollout. Use your email and password instead.
        </p>

        <p className="text-center text-white/70 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-purple-300 font-semibold hover:text-purple-200"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
