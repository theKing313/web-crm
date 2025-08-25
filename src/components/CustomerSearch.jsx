import { useState } from "react";
import { fetchCustomerByPhone } from "../api/index";
import CustomerCreate from "./CustomerCreate";

export default function CustomerSearch({ token }) {
  const [phone, setPhone] = useState("");
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await fetchCustomerByPhone(phone);

      console.log(data);
      setCustomer(data?.results?.[0] || null);
    } catch (err) {
      console.error(err);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-2">
      <label className="text-sm">Телефон клиента:</label>
      <input
        type="text"
        className="border p-2 rounded"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-green-500 text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? "Поиск..." : "Найти клиента"}
      </button>

      {customer ? (
        <div className="mt-2 p-2 border rounded bg-gray-50">
          <p>
            <b>Имя:</b> {customer.name}
          </p>
          <p>
            <b>Телефон:</b> {customer.phone}
          </p>
        </div>
      ) : (
        phone &&
        !loading && (
          <CustomerCreate initialPhone={phone} onCreate={setCustomer} />
        )
      )}
    </div>
  );
}
