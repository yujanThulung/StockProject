import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/authentication.store";
import logo from "../assets/logo1.png";

const RegisterPage = () => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");

  const signup  = useAuthStore((s) => s.signup);
  const loading = useAuthStore((s) => s.loading);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await signup({ name, email, password });
    if (res.success) {
      setSuccess("Account created! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left: Brand panel ── */}
      <div className="hidden lg:flex flex-1 bg-blue-950 flex-col items-center justify-center px-12 text-center">
        <img src={logo} alt="logo" className="h-16 w-auto mb-8" />
        <h2 className="text-4xl font-black text-white leading-tight mb-4">
          Get<br />Started
        </h2>
        <p className="text-blue-200 text-sm max-w-xs leading-relaxed mb-8">
          Create your account and start tracking stocks, predictions, and market sentiment today.
        </p>
        <p className="text-blue-300 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* ── Right: Form ── */}
      <div className="flex-1 flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-7">Register</h2>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-lg py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Min. 8 characters with uppercase, number &amp; special character.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-950 hover:bg-blue-900 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-950 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
