import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.username,
          password: form.password,
        }),
      });
      console.log(form.username, form.password);

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Алдаа гарлаа.");
        setLoading(false);
        return;
      }

      // Хэрэглэгчийн мэдээллийг хадгалах
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      navigate("/places");
    } catch (err) {
      console.error("Login error:", err);
      setError("Сервертэй холбогдож чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md w-[400px] mx-auto mt-10">
      <h1 className="text-xl font-bold mb-4">Нэвтрэх</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Нэвтрэх нэр:</label>
          <input
            className="border border-black rounded w-full px-2 py-1"
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Нууц үг:</label>
          <input
            className="border border-black rounded w-full px-2 py-1"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600"
          >
            Бүртгүүлэх
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
