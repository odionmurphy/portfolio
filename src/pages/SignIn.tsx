import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("Please enter your email");
    // mock auth
    localStorage.setItem("userEmail", email);
    if (remember) localStorage.setItem("remember", "1");
    setError(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold">Welcome back</h1>
          <p className="text-sm text-gray-400 mt-2">
            Sign in to access your purchases
          </p>
        </div>

        <div className="space-y-4">
          <button
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-2 rounded-md font-medium"
            onClick={() => {
              // mock social sign-in
              localStorage.setItem("userEmail", "social@example.com");
              navigate("/");
            }}
            type="button"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M21 12.3c0-.8-.1-1.6-.3-2.3H12v4.3h4.6c-.2 1-1 2.5-2.6 3.3l-.0 2.2c2.4-1 4.1-3 4.1-6z"
                fill="#4285F4"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-gray-700" />
            <div className="text-sm text-gray-400">or</div>
            <div className="flex-1 border-t border-gray-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember((v) => !v)}
                  className="w-4 h-4"
                />
                <span className="text-gray-300">Remember me</span>
              </label>
              <button type="button" className="text-yellow-400 hover:underline">
                Forgot password?
              </button>
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded"
            >
              Sign in
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-yellow-400 hover:underline"
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
