import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("Enter an email");
    // Mock sign-in: store email
    localStorage.setItem("userEmail", email);
    setError(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
      <div className="w-full max-w-md bg-gray-900 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded"
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
              className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded"
              required
            />
          </div>

          {error && <div className="text-red-400">{error}</div>}

          <div className="flex items-center justify-between">
            <button className="bg-yellow-500 px-4 py-2 rounded">Sign in</button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
