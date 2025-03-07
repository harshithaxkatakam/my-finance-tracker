// import React from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { useFinanceStore } from "../store/useFinanceStore";

// const CreditScoreChart = () => {
//   const { creditScores } = useFinanceStore();

//   const data = creditScores.map((score) => ({
//     date: score.date,
//     TransUnion: score.transUnion,
//     Experian: score.experian,
//     Equifax: score.equifax,
//   }));

//   return (
//     <div className="p-4 bg-white shadow-md rounded-lg">
//       <h2 className="text-lg font-semibold mb-2">Credit Score Trends</h2>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date" />
//           <YAxis domain={[300, 850]} />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="TransUnion" stroke="#8884d8" />
//           <Line type="monotone" dataKey="Experian" stroke="#82ca9d" />
//           <Line type="monotone" dataKey="Equifax" stroke="#ffc658" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default CreditScoreChart;
