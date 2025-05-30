import { parse } from "path";
import { Engineer } from "../types/engineer";
import { Task, TaskStatus } from "../types/task";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LoadChart = ({ engineers }: { engineers: Engineer[] }) => {
  const data = engineers.map((e) => ({
    name: e.name,
    carga: parseFloat(
      (
        e.tasks?.reduce(
          (sum, t) =>
            t.status === TaskStatus.em_andamento ||
            t.status === TaskStatus.pendente
              ? sum + t.hours / e.eficiency
              : sum,
          0
        ) || 0
      ).toFixed(1)
    ),
  }));

  return (
    <div className="mt-4 p-4 border rounded bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-2">
        Carga Alocada por Engenheiro
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="carga" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LoadChart;
