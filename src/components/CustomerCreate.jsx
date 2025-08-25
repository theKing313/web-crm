import { useState } from "react";
import { apiCreateCustomer } from "../api";

export default function CustomerCreate({ initialPhone = "", onCreate }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const newCustomer = await apiCreateCustomer({ name, phone });
      localStorage.setItem("lastCreatedCustomer", JSON.stringify(newCustomer));
      if (onCreate) onCreate(newCustomer);
    } catch (e) {
      setError("Ошибка при создании клиента");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-2 border rounded bg-gray-50">
      <p className="text-red-500">Клиент не найден</p>
      <label className="text-sm">Имя клиента:</label>
      <input
        type="text"
        className="border p-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label className="text-sm">Телефон клиента:</label>
      <input
        type="text"
        className="border p-2 rounded"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button
        onClick={handleCreate}
        className="bg-blue-500 text-white p-2 rounded"
        disabled={loading || !name || !phone}
      >
        {loading ? "Создание..." : "Создать клиента"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
