import React, { useState } from "react";

const API_BASE = "/api";

type TransactionResult = {
  id: string;
  amount: number;
  category: string;
  note?: string | null;
  created_at: string;
};

export default function App() {
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("餐饮");
  const [note, setNote] = useState("");
  const [result, setResult] = useState<TransactionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    setError(null);
    const res = await fetch(`${API_BASE}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, category, note })
    });

    if (!res.ok) {
      setError(`请求失败：${res.status}`);
      return;
    }

    const data = (await res.json()) as TransactionResult;
    setResult(data);
  }

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>MoneyTrace 记账</h1>
      <div>
        <label>金额：</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>
      <div>
        <label>类别：</label>
        <input value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div>
        <label>备注：</label>
        <input value={note} onChange={(e) => setNote(e.target.value)} />
      </div>
      <button onClick={handleCreate} style={{ marginTop: 12 }}>
        记一笔
      </button>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {result && (
        <pre style={{ marginTop: 12, background: "#f6f8fa", padding: 12 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}