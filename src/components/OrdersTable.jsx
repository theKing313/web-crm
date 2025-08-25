import React, { useEffect, useState } from "react";
import { Trash2, Edit2, Printer } from "lucide-react";
import { fetchTables } from "../api/index";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import SalesDocumentForm from "./ui/SalesDocumentForm";
import { Switch } from "@mui/material";
import { styled } from "@mui/material/styles";

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#1890ff",
        ...theme.applyStyles("dark", {
          backgroundColor: "#177ddc",
        }),
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: "rgba(0,0,0,.25)",
    boxSizing: "border-box",
    ...theme.applyStyles("dark", {
      backgroundColor: "rgba(255,255,255,.35)",
    }),
  },
}));

export default function OrdersTable() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchTables,
  });

  const [salesData, setSalesData] = useState([]);
  const [selectedSaleOpen, setSelectedSaleOpen] = useState(false);
  const [selectedSaleData, setSelectedSaleData] = useState(null);

  useEffect(() => {
    if (data?.result) {
      setSalesData(data.result);
    }
  }, [data]);

  if (isLoading) return <div>Loading posts...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const sortedData = salesData.slice().sort((a, b) => {
    const dateA = dayjs(a.created_at, "DD.MM.YYYY HH:mm:ss");
    const dateB = dayjs(b.created_at, "DD.MM.YYYY HH:mm:ss");
    return dateB.valueOf() - dateA.valueOf();
  });

  const handleDelete = (id) => {
    setSalesData((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (sale) => {
    setSelectedSaleData(sale);
    setSelectedSaleOpen(true);
  };

  return (
    <>
      {selectedSaleOpen && (
        <SalesDocumentForm
          isOpen={selectedSaleOpen}
          onClose={() => setSelectedSaleOpen(false)}
          saleData={selectedSaleData}
        />
      )}
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setSelectedSaleData(null);
              setSelectedSaleOpen(true);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            + Новая продажа
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg">Таблица</button>
          <button className="px-4 py-2 bg-gray-200 rounded-lg">
            Календарь
          </button>
        </div>

        <table className="w-full border-collapse rounded-xl overflow-hidden shadow">
          <thead className="bg-gray-100 text-left text-black">
            <tr>
              <th className="p-2">Номер</th>
              <th className="p-2">Приоритет</th>
              <th className="p-2">Дата проведения</th>
              <th className="p-2">Статус</th>
              <th className="p-2">Оплачен полностью</th>
              <th className="p-2">Сумма</th>
              <th className="p-2">Скидка</th>
              <th className="p-2">Товаров</th>
              <th className="p-2">Оплачено</th>
              <th className="p-2">Оплачено бонусами</th>
              <th className="p-2">Оплачено рублями</th>
              <th className="p-2">Действие</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((o) => (
              <tr
                key={o.id}
                className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition text-black"
              >
                <td
                  className="p-2 text-blue-600 cursor-pointer"
                  onClick={() => handleEdit(o)}
                >
                  {o.id}
                </td>
                <td className="p-2">{o.priority}</td>
                <td className="p-2">
                  {dayjs(o.created_at, "D.M.YYYY HH:mm:ss").format(
                    "DD.MM.YYYY HH:mm:ss"
                  )}
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <AntSwitch
                      defaultChecked={o.status}
                      inputProps={{ "aria-label": "ant design" }}
                    />
                    {o.status ? (
                      <span className="text-green-600">Оплачено</span>
                    ) : (
                      <span className="text-red-600">Не оплачено</span>
                    )}
                  </div>
                </td>
                <td className="p-2">
                  {o.paid ? (
                    <span className="text-green-600">✔ Оплачено</span>
                  ) : (
                    <span className="text-red-600">✘ Не оплачено</span>
                  )}
                </td>
                <td className="p-2">{o.sum}</td>
                <td className="p-2">{o.discount}</td>
                <td className="p-2">{o.items}</td>
                <td className="p-2">{o.paidAmount}</td>
                <td className="p-2">{o.paidBonus}</td>
                <td className="p-2">{o.paidRub}</td>
                <td className="p-2 flex gap-2 text-white">
                  <button
                    className="p-1 rounded hover:bg-gray-200"
                    onClick={() => handleDelete(o.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-gray-200"
                    onClick={() => handleEdit(o)}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button className="p-1 rounded hover:bg-gray-200">
                    <Printer size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
