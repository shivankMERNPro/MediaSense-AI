import GitHubIcon from "@mui/icons-material/GitHub";
import { GoogleLogin } from "@react-oauth/google";

const buttonBase =
  "w-full flex items-center justify-center gap-2 rounded-xl py-3 font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";

const OAuthButtons = ({
  onGoogleSuccess,
  onGoogleError,
  onGithubClick,
  githubLoading = false,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        <GoogleLogin onSuccess={onGoogleSuccess} onError={onGoogleError} />
      </div>
      <button
        type="button"
        onClick={onGithubClick}
        disabled={githubLoading}
        className={`${buttonBase} bg-gray-900 text-white hover:bg-gray-800 focus:ring-purple-500`}
      >
        <GitHubIcon fontSize="small" />
        {githubLoading ? "Connecting..." : "Continue with GitHub"}
      </button>
    </div>
  );
};

export default OAuthButtons;

