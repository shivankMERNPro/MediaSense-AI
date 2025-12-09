import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import httpClient from "../utils/httpClient";
import { persistAuthSession } from "../utils/authSession";

const OAuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("Completing OAuth flow...");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    const handleGithubCallback = async () => {
      try {
        const response = await httpClient.post("/api/v1/auth/oauth/github", {
          code,
        });
        persistAuthSession(dispatch, response.data.data);
        toast.success(response.data.message || "Signed in with GitHub");
        navigate("/dashboard", { replace: true });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "GitHub authentication failed.",
        );
        navigate("/login", { replace: true });
      }
    };

    if (state === "github" && code) {
      handleGithubCallback();
    } else {
      setStatus("Invalid OAuth response. Redirecting...");
      navigate("/login", { replace: true });
    }
  }, [location.search, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f031d] via-[#1d0b35] to-[#280045] px-4">
      <div className="bg-white/5 border border-white/10 rounded-3xl shadow-2xl px-6 py-10 backdrop-blur w-full max-w-md text-center">
        <h1 className="text-white text-2xl font-semibold mb-3">
          Authenticating...
        </h1>
        <p className="text-white/70">{status}</p>
      </div>
    </div>
  );
};

export default OAuthCallback;

