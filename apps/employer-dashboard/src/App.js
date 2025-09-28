import { useEffect, useState } from "react";
import { db } from "../../shared/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "employees"));
      const stressData = snapshot.docs.map((doc) => {
        const d = doc.data();
        const lastCheck = d.stressCheckIns?.[0]?.score || 0;
        return { name: doc.id, stress: lastCheck };
      });
      setData(stressData);
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Employer Dashboard</h1>
      <ResponsiveContainer width="80%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="stress" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default App;
