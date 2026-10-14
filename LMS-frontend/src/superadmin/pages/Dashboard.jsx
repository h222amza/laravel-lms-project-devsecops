// src/superadmin/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { getSalesAnalytics } from "../../api/superAdmin";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const res = await getSalesAnalytics();
        // Laravel response: { total_revenue, this_month_revenue, total_orders, graph_data: [...] }
        setAnalytics(res.data || res); // http instance nasıl dönüyorsa
      } catch (err) {
        console.error("Error while loading analytics:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>;
  }

  if (!analytics) {
    return <p className="text-sm text-slate-500">No analytics data.</p>;
  }

  const {
    total_revenue,
    this_month_revenue,
    total_orders,
    graph_data = [],
  } = analytics;

  // Chart için max değer (yükseklik oranı)
  const numericValues = graph_data.map((item) => Number(item.total || 0));
  const maxValue = Math.max(...numericValues, 0) || 1; // 0 olmasın diye 1

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Overview of platform revenue and orders.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Total Revenue
          </p>
          <p className="mt-2 text-2xl font-semibold">
            ${Number(total_revenue || 0).toFixed(2)}
          </p>
        </div>

        {/* This Month Revenue */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            This Month Revenue
          </p>
          <p className="mt-2 text-2xl font-semibold">
            ${Number(this_month_revenue || 0).toFixed(2)}
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Total Orders
          </p>
          <p className="mt-2 text-2xl font-semibold">
            {Number(total_orders || 0)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Revenue by Day
            </h2>
            <p className="text-xs text-slate-500">
              Last {graph_data.length} days
            </p>
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Revenue by Day
              </h2>
              <p className="text-xs text-slate-500">
                Last {graph_data.length} days
              </p>
            </div>
          </div>

          {graph_data.length === 0 ? (
            <p className="text-xs text-slate-500">
              No revenue data for this period.
            </p>
          ) : (
            <div className="mt-4 h-48">
              {/* h-48 yüksekliği burada */}
              <div className="flex items-end gap-4 h-full">
                {graph_data.map((item) => {
                  const value = Number(item.total || 0);
                  const heightPercent = (value / maxValue) * 100;
                  const barHeight = value > 0 ? heightPercent : 4; // min 4%

                  return (
                    <div
                      key={item.date}
                      className="flex-1 flex flex-col justify-end items-center gap-1 h-full"
                    >
                      <div
                        className="w-full max-w-[28px] bg-indigo-500 rounded-t-lg transition-all border border-indigo-600"
                        style={{ height: `${barHeight}%` }}
                        title={`$${value.toFixed(2)}`}
                      />
                      <span className="text-[10px] text-slate-500">
                        {item.date}
                      </span>
                      <span className="text-[10px] text-slate-700">
                        {value > 0 ? `$${value.toFixed(2)}` : "$0.00"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
