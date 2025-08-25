import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function AuthForm({ onAuth }) {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    Cookies.set("token", token, { expires: 1 });

    navigate("/dashboard"); // редирект
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md flex flex-col gap-4"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <label htmlFor="token" className="text-sm font-semibold text-gray-700">
        Введите токен кассы:
      </label>
      <input
        id="token"
        type="text"
        className="border border-gray-300 rounded-md px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        placeholder="Введите ваш токен"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-medium transition"
      >
        Войти
      </button>
    </form>
  );
}
