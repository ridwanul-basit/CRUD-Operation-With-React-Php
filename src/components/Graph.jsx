import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line
} from "recharts";

export default function Graph() {
  const [graphData, setGraphData] = useState(null);

  const fetchGraphData = async () => {
    try {
      const res = await fetch("http://localhost/college_api/get_graph_data.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setGraphData(data);
    } catch (err) {
      console.error("Error loading graph data:", err);
    }
  };

  useEffect(() => { fetchGraphData(); }, []);

  if (!graphData) return <div className="p-6">Loading charts...</div>;

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#8B5CF6"];

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-2xl font-bold mb-4">📊 Dashboard Analytics</h2>

      {/* Verified vs Pending */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-3">Account Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: "Verified", value: graphData.verified },
                { name: "Pending", value: graphData.pending },
              ]}
              cx="50%" cy="50%" labelLine={false}
              outerRadius={120} fill="#8884d8" dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              <Cell fill="#10B981" />
              <Cell fill="#F59E0B" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Students by Department */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-3">Students by Department</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={graphData.departments}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#6366F1" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Registrations */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-3">Monthly Registrations</h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={graphData.monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
