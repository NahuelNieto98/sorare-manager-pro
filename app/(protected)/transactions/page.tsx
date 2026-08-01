"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  type: string;
  playerName: string;
  rarity: string;
  price: number;
  date: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [type, setType] = useState("BUY");
  const [playerName, setPlayerName] = useState("");
  const [rarity, setRarity] = useState("limited");
  const [price, setPrice] = useState("");

  async function loadTransactions() {
    const res = await fetch("/api/transactions");
    const data = await res.json();
    setTransactions(data);
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  async function saveTransaction(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type,
        playerName,
        rarity,
        price: Number(price),
      }),
    });

    if (!res.ok) {
      alert("Error");
      return;
    }

    setPlayerName("");
    setPrice("");

    await loadTransactions();
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white">Transacciones</h1>

        <p className="text-zinc-400 mt-2">
          Gestiona todas tus compras y ventas.
        </p>
      </div>

      <form
        onSubmit={saveTransaction}
        className="rounded-2xl bg-[#17112F] p-8 border border-purple-900 space-y-5"
      >
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-xl bg-[#221A40] p-3 text-white"
        >
          <option value="BUY">Compra</option>
          <option value="SELL">Venta</option>
        </select>

        <input
          className="w-full rounded-xl bg-[#221A40] p-3 text-white"
          placeholder="Jugador"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <select
          value={rarity}
          onChange={(e) => setRarity(e.target.value)}
          className="w-full rounded-xl bg-[#221A40] p-3 text-white"
        >
          <option value="limited">Limited</option>
          <option value="rare">Rare</option>
          <option value="super_rare">Super Rare</option>
          <option value="unique">Unique</option>
        </select>

        <input
          type="number"
          step="0.01"
          className="w-full rounded-xl bg-[#221A40] p-3 text-white"
          placeholder="Precio (€)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button className="w-full rounded-xl bg-purple-600 py-3 font-bold text-white">
          Guardar transacción
        </button>
      </form>

      <div className="rounded-2xl bg-[#17112F] border border-purple-900 overflow-hidden">
        <table className="w-full text-white">
          <thead className="bg-[#221A40]">
            <tr>
              <th className="p-4 text-left">Tipo</th>
              <th className="p-4 text-left">Jugador</th>
              <th className="p-4 text-left">Rareza</th>
              <th className="p-4 text-left">Precio</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-purple-900">
                <td className="p-4">
                  {t.type === "BUY" ? "🟢 Compra" : "🔴 Venta"}
                </td>

                <td className="p-4">{t.playerName}</td>

                <td className="p-4">{t.rarity}</td>

                <td className="p-4">€{t.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
