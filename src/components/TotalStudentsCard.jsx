import { useEffect, useState } from "react";
import { Users, CheckCircle, XCircle } from "lucide-react"; // Icons
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TotalStudentsCard() {
  const [stats, setStats] = useState({ total: 0, verified: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost/college_api/get_total_students.php", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setStats({
          total: data.total,
          verified: data.verified,
          pending: data.pending,
        });
      }
    } catch (err) {
      console.error(err);
      setStats({ total: 0, verified: 0, pending: 0 });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Pie chart data
  const pieData = [
    { name: "Verified", value: stats.verified },
    { name: "Non-Verified", value: stats.pending },
  ];

  const COLORS = ["#10B981", "#EF4444"]; // Verified=green, Non-Verified=red

  return (
    <div className="space-y-6">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Students */}
        <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl shadow-xl p-6 flex items-center justify-between
                        transition-transform transform hover:scale-105 hover:shadow-2xl overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-wide opacity-70">Total Students</p>
            {loading ? (
              <p className="text-3xl font-extrabold mt-2">Loading...</p>
            ) : (
              <p className="text-3xl font-extrabold mt-2">{stats.total}</p>
            )}
            <p className="text-xs opacity-70 mt-1">As of {new Date().toLocaleDateString()}</p>
          </div>
          <div className="relative z-10 p-4 rounded-full bg-white/20 flex items-center justify-center shadow-md">
            <Users size={40} className="text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Verified Students */}
        <div className="relative bg-green-500 text-white rounded-2xl shadow-xl p-6 flex items-center justify-between
                        transition-transform transform hover:scale-105 hover:shadow-2xl overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-wide opacity-70">Verified Students</p>
            {loading ? (
              <p className="text-3xl font-extrabold mt-2">Loading...</p>
            ) : (
              <p className="text-3xl font-extrabold mt-2">{stats.verified}</p>
            )}
            <p className="text-xs opacity-70 mt-1">Successfully verified</p>
          </div>
          <div className="relative z-10 p-4 rounded-full bg-white/20 flex items-center justify-center shadow-md">
            <CheckCircle size={40} className="text-white drop-shadow-lg" />
          </div>
        </div>

        {/* Pending Students */}
        <div className="relative bg-red-500 text-white rounded-2xl shadow-xl p-6 flex items-center justify-between
                        transition-transform transform hover:scale-105 hover:shadow-2xl overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm uppercase tracking-wide opacity-70">Pending Students</p>
            {loading ? (
              <p className="text-3xl font-extrabold mt-2">Loading...</p>
            ) : (
              <p className="text-3xl font-extrabold mt-2">{stats.pending}</p>
            )}
            <p className="text-xs opacity-70 mt-1">Awaiting email verification</p>
          </div>
          <div className="relative z-10 p-4 rounded-full bg-white/20 flex items-center justify-center shadow-md">
            <XCircle size={40} className="text-white drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      {!loading && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">Verified vs Non-Verified Students</h3>
          <div className="w-full h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  label
                  isAnimationActive={true}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Students`, "Count"]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
