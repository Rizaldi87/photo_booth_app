import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";
import { useAuth } from "../../context/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      toast.success("Login berhasil");
      navigate("/admin");
    } else {
      toast.error(res.message || "Login gagal");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="w-[90%] max-w-md bg-[#111111] border border-[#292929] rounded p-8 font-mono">
        <div className="mb-8 text-center">
          <h1 className="text-[#C9A84C] text-xl">MyPixelBooth</h1>
          <p className="text-[#555250] text-xs mt-1">ADMIN LOGIN</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[#676666] text-sm block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-[#292929] text-white px-3 py-2 focus:outline-none focus:border-[#C9A84C]"
              placeholder="admin@pixelbooth.id"
              required
            />
          </div>

          <div>
            <label className="text-[#676666] text-sm block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-[#292929] text-white px-3 py-2 focus:outline-none focus:border-[#C9A84C]"
              placeholder="********"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="mt-4 bg-[#C9A84C] text-black py-2 hover:opacity-90 disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
