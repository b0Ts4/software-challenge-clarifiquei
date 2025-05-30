import axios from "axios";
import React, { useEffect, useState } from "react";
import { Engineer } from "../types/engineer";
import { BarChart2, Pencil, Plus, Trash, X } from "lucide-react";
import { Task, TaskStatus } from "../types/task";
import LoadChart from "./LoadChart";

const Engineers = ({
  engineers,
  setEngineers,
}: {
  engineers: Engineer[];
  setEngineers: React.Dispatch<React.SetStateAction<Engineer[]>>;
}) => {
  const [selectedEngineer, setSelectedEngineer] = useState<Engineer | null>(
    null
  );
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newEngineer, setNewEngineer] = useState({
    name: "",
    max_hours: 8,
    eficiency: 1,
  });
  const [showChart, setShowChart] = useState(false);

  const handleAddEngineer = () => {
    axios
      .post("/engineers", newEngineer)
      .then((res) => {
        setEngineers((prev) => [...prev, res.data]);
        setNewEngineer({ name: "", max_hours: 8, eficiency: 1 });
        setAdding(false);
      })
      .catch(console.error);
  };

  const handleEditEngineer = (id: number) => {
    const engineer = engineers.find((e) => e.id === id);
    if (engineer) {
      axios
        .put(`/engineers/${id}`, engineer)
        .then((res) => {
          setEngineers((prev) => prev.map((e) => (e.id === id ? res.data : e)));
          setEditingId(null);
        })
        .catch(console.error);
    }
  };

  const handleDeleteEngineer = (id: number) => {
    if (window.confirm("Deseja realmente deletar este engenheiro?")) {
      axios
        .delete(`/engineers/${id}`)
        .then(() => setEngineers((prev) => prev.filter((e) => e.id !== id)))
        .catch(console.error);
    }
  };

  const calcularCargaAlocada = (tasks: Task[] = [], eficiency: number) => {
    return tasks
      .filter(
        (t) =>
          t.status === TaskStatus.em_andamento ||
          t.status === TaskStatus.pendente
      )
      .reduce((total, t) => total + t.hours / eficiency, 0);
  };

  const calcularProgresso = (task: Task, eficiency: number) => {
    if (!task.started_at) return 0;
    const start = new Date(task.started_at).getTime();
    const now = new Date(new Date().toISOString()).getTime();
    if (start > now) return 0;
    console.log("start: ", start, "now: ", now);
    const duracaoEstimativaMs = (task.hours / eficiency) * 60 * 60 * 1000;
    const decorridoMs = now - start;
    return Math.min(100, (decorridoMs / duracaoEstimativaMs) * 100);
  };

  return (
    <div className="p-4 bg-white rounded shadow-md w-[100%] h-[85vh]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Engenheiros</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowChart((prev) => !prev)}
            className="bg-indigo-500 text-white p-2 rounded-full"
          >
            <BarChart2 size={16} />
          </button>

          <button
            onClick={() => setAdding(true)}
            className="bg-green-500 text-white p-2 rounded-full"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {showChart && <LoadChart engineers={engineers} />}
      <ul className="space-y-2">
        {engineers.map((engineer) => {
          const cargaAlocada = calcularCargaAlocada(
            engineer.tasks,
            engineer.eficiency
          );
          return (
            <li
              key={engineer.id}
              className="border p-2 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => setSelectedEngineer(engineer)}
            >
              <div className="flex justify-between items-center">
                <span>
                  <strong>{engineer.name}</strong> <br /> {engineer.max_hours}h
                  máx - {engineer.eficiency * 100}% - {cargaAlocada.toFixed(1)}h
                  alocadas
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(engineer.id);
                    }}
                    className="text-blue-500"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteEngineer(engineer.id)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
              {editingId === engineer.id && (
                <div className="mt-2 space-y-2">
                  <input
                    className="border p-1 rounded w-full"
                    value={engineer.name}
                    placeholder="Nome do engenheiro"
                    onChange={(e) => {
                      const updated = engineers.map((item) =>
                        item.id === engineer.id
                          ? { ...item, name: e.target.value }
                          : item
                      );
                      setEngineers(updated);
                    }}
                  />
                  <input
                    type="number"
                    className="border p-1 rounded w-full"
                    value={engineer.max_hours}
                    placeholder="Carga máxima de trabalho (horas)"
                    onChange={(e) => {
                      const updated = engineers.map((item) =>
                        item.id === engineer.id
                          ? { ...item, max_hours: +e.target.value }
                          : item
                      );
                      setEngineers(updated);
                    }}
                  />
                  <input
                    type="number"
                    step="0.01"
                    className="border p-1 rounded w-full"
                    value={engineer.eficiency}
                    placeholder="Eficiência (ex: 1 = 100%)"
                    onChange={(e) => {
                      const updated = engineers.map((item) =>
                        item.id === engineer.id
                          ? { ...item, eficiency: +e.target.value }
                          : item
                      );
                      setEngineers(updated);
                    }}
                  />
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEditEngineer(engineer.id)}
                    >
                      Salvar
                    </button>
                    <button
                      className="bg-gray-300 text-black px-3 py-1 rounded"
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {adding && (
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium mb-2">Novo Engenheiro</h3>
            <button onClick={() => setAdding(false)} className="text-gray-500">
              <X size={18} />
            </button>
          </div>
          <input
            className="border p-1 rounded w-full mb-2"
            type="text"
            placeholder="Nome do engenheiro"
            value={newEngineer.name}
            onChange={(e) =>
              setNewEngineer({ ...newEngineer, name: e.target.value })
            }
          />
          <input
            className="border p-1 rounded w-full mb-2"
            type="number"
            placeholder="Carga máxima de trabalho (horas)"
            value={newEngineer.max_hours}
            onChange={(e) =>
              setNewEngineer({ ...newEngineer, max_hours: +e.target.value })
            }
          />
          <input
            className="border p-1 rounded w-full mb-2"
            type="number"
            step="0.01"
            placeholder="Eficiência (ex: 1 = 100%)"
            value={newEngineer.eficiency}
            onChange={(e) =>
              setNewEngineer({ ...newEngineer, eficiency: +e.target.value })
            }
          />
          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-4 py-1 rounded"
              onClick={handleAddEngineer}
            >
              Adicionar
            </button>
            <button
              className="bg-gray-300 text-black px-4 py-1 rounded"
              onClick={() => setAdding(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {selectedEngineer && (
        <div className="mt-6 p-4 border rounded bg-gray-50 relative">
          <button
            onClick={() => setSelectedEngineer(null)}
            className="absolute top-2 right-2 text-gray-500"
          >
            <X size={18} />
          </button>
          <h3 className="text-lg font-semibold">Detalhes</h3>
          <p>
            <strong>Nome:</strong> {selectedEngineer.name}
          </p>
          <p>
            <strong>Carga Máxima:</strong> {selectedEngineer.max_hours}h
          </p>
          <p>
            <strong>Eficiência:</strong> {selectedEngineer.eficiency * 100}%
          </p>
          <p>
            <strong>Carga Alocada:</strong>{" "}
            {calcularCargaAlocada(
              selectedEngineer.tasks,
              selectedEngineer.eficiency
            ).toFixed(1)}
            h
          </p>
          {selectedEngineer.tasks!.length > 0 && (
            <div>
              <h4 className="font-medium mt-2">Tarefa em andamento:</h4>
              <ul className="list-disc list-inside space-y-2">
                {selectedEngineer
                  .tasks!.filter((t) => t.status === TaskStatus.em_andamento)
                  .map((task) => {
                    const progresso = calcularProgresso(
                      task,
                      selectedEngineer.eficiency
                    );
                    return (
                      <li key={task.id} className="mb-2">
                        <p className="text-sm font-medium">{task.name}</p>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="bg-blue-600 h-4 text-xs text-black text-center rounded-full"
                            style={{ width: `${progresso}%` }}
                          >
                            {Math.round(progresso)}%
                          </div>
                        </div>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Engineers;
