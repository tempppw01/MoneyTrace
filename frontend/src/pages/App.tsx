import React, { useState, useEffect } from "react";
import "../styles/App.css";

const API_BASE = "/api";

type TransactionType = "income" | "expense";

type Transaction = {
  id: string;
  amount: number;
  category: string;
  note?: string | null;
  created_at: string;
  type?: TransactionType;
};

// 预设分类
const CATEGORIES = {
  expense: ["餐饮", "交通", "购物", "娱乐", "医疗", "住房", "教育", "其他"],
  income: ["工资", "奖金", "投资", "兼职", "礼金", "其他"]
};

export default function App() {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES.expense[0]);
  const [note, setNote] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<"all" | TransactionType>("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 切换类型时更新默认分类
  useEffect(() => {
    setCategory(CATEGORIES[type][0]);
  }, [type]);

  // 创建交易记录
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          category,
          note: note || null
        })
      });

      if (!res.ok) {
        throw new Error(`请求失败：${res.status}`);
      }

      const data = (await res.json()) as Transaction;
      
      // 添加类型标记
      const newTransaction = { ...data, type };
      setTransactions([newTransaction, ...transactions]);

      // 重置表单
      setAmount("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "创建失败");
    } finally {
      setLoading(false);
    }
  }

  // 删除交易记录
  function handleDelete(id: string) {
    setTransactions(transactions.filter(t => t.id !== id));
  }

  // 计算统计数据
  const stats = transactions.reduce(
    (acc, t) => {
      if (t.type === "income") {
        acc.income += t.amount;
      } else {
        acc.expense += t.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = stats.income - stats.expense;

  // 过滤交易记录
  const filteredTransactions = transactions.filter(t => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  // 格式化日期
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "今天";
    if (days === 1) return "昨天";
    if (days < 7) return `${days}天前`;
    
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric"
    });
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>💰 MoneyTrace</h1>
        <p>简单、优雅的记账工具</p>
      </header>

      <div className="main-content">
        {/* 左侧：表单和统计 */}
        <div>
          {/* 统计卡片 */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>总余额</h3>
                <div className="amount">¥{balance.toFixed(2)}</div>
              </div>
              <div className="stat-card income">
                <h3>总收入</h3>
                <div className="amount">¥{stats.income.toFixed(2)}</div>
              </div>
              <div className="stat-card expense">
                <h3>总支出</h3>
                <div className="amount">¥{stats.expense.toFixed(2)}</div>
              </div>
              <div className="stat-card">
                <h3>记录数</h3>
                <div className="amount">{transactions.length}</div>
              </div>
            </div>
          </div>

          {/* 记账表单 */}
          <div className="card">
            <div className="form-section">
              <h2>记一笔</h2>
              <form onSubmit={handleCreate}>
                {/* 类型选择 */}
                <div className="type-selector">
                  <button
                    type="button"
                    className={`type-btn ${type === "expense" ? "active expense" : ""}`}
                    onClick={() => setType("expense")}
                  >
                    💸 支出
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${type === "income" ? "active" : ""}`}
                    onClick={() => setType("income")}
                  >
                    💰 收入
                  </button>
                </div>

                {/* 金额 */}
                <div className="form-group">
                  <label>金额</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>

                {/* 分类 */}
                <div className="form-group">
                  <label>分类</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES[type].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 备注 */}
                <div className="form-group">
                  <label>备注（可选）</label>
                  <input
                    type="text"
                    placeholder="添加备注..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "提交中..." : "✓ 添加记录"}
                </button>

                {error && <div className="error-message">{error}</div>}
              </form>
            </div>
          </div>
        </div>

        {/* 右侧：交易记录列表 */}
        <div className="card">
          <div className="transactions-section">
            <h2>交易记录</h2>

            {/* 过滤标签 */}
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filter === "all" ? "active" : ""}`}
                onClick={() => setFilter("all")}
              >
                全部 ({transactions.length})
              </button>
              <button
                className={`filter-tab ${filter === "income" ? "active" : ""}`}
                onClick={() => setFilter("income")}
              >
                收入 ({transactions.filter(t => t.type === "income").length})
              </button>
              <button
                className={`filter-tab ${filter === "expense" ? "active" : ""}`}
                onClick={() => setFilter("expense")}
              >
                支出 ({transactions.filter(t => t.type === "expense").length})
              </button>
            </div>

            {/* 交易列表 */}
            <div className="transaction-list">
              {filteredTransactions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <p>还没有记录，开始记账吧！</p>
                </div>
              ) : (
                filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-category">
                        {transaction.type === "income" ? "💰" : "💸"}{" "}
                        {transaction.category}
                      </div>
                      {transaction.note && (
                        <div className="transaction-note">{transaction.note}</div>
                      )}
                      <div className="transaction-date">
                        {formatDate(transaction.created_at)}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        className={`transaction-amount ${transaction.type || "expense"}`}
                      >
                        {transaction.type === "income" ? "+" : "-"}¥
                        {transaction.amount.toFixed(2)}
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(transaction.id)}
                        title="删除"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
