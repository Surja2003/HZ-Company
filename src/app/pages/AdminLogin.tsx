import { useState } from "react";
import { useNavigate, Link } from "react-router";

import { Seo } from "../components/Seo";
import { login } from "../services/platformService";
import { setSession } from "../auth/session";

export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      const r = await login({ email: email.trim(), password });
      if (r.role !== "admin") {
        setError("This account is not an admin.");
        return;
      }
      setSession(r.token, r.role);
      navigate("/admin");
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo title="Admin Login" description="Admin access for HZ IT Company." path="/admin/login" />

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-10">
            <h1 className="text-3xl font-bold text-gray-900 font-poppins">
            Admin Login
          </h1>
          <p className="mt-2 text-gray-600">Manage orders, pricing, and leads.</p>

          <div className="mt-6 grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Email</span>
              <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div> : null}

            <button
              type="button"
              disabled={loading}
              onClick={onSubmit}
              className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-black disabled:opacity-50"
            >
              {loading ? "Please wait…" : "Login"}
            </button>

            <Link to="/" className="text-center text-sm text-gray-600 hover:underline">
              Back to website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
