import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/results?from=${from}&to=${to}&date=${date}`);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl mb-6 font-semibold">Search Buses</h2>
      <div className="flex flex-col gap-3">
        <input placeholder="From" value={from} onChange={e => setFrom(e.target.value)} className="border p-2 rounded" />
        <input placeholder="To" value={to} onChange={e => setTo(e.target.value)} className="border p-2 rounded" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded" />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Search</button>
      </div>
    </div>
  );
}
