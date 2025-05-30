import axios from "axios";
import React, { useEffect, useState } from "react";
import { Task, TaskStatus } from "../types/task";
import { Engineer } from "../types/engineer";
import { Pencil, Plus, Trash } from "lucide-react";

const Tasks = ({
  tasks,
  setTasks,
  engineers,
}: {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  engineers: Engineer[];
}) => {
  const [newTask, setNewTask] = useState<{
    name: string;
    priority: string;
    hours: number;
    engineer_id: number | null;
  }>({ name: "", priority: "Media", hours: 1, engineer_id: null });
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const handleAddTask = () => {
    axios
      .post("/tasks", newTask)
      .then(() => {
        setNewTask({
          name: "",
          priority: "Media",
          hours: 1,
          engineer_id: null,
        });
        setTasks((prev) => [
          ...prev,
          {
            ...newTask,
            id: Date.now(),
            status: TaskStatus.pendente,
            priority:
              newTask.priority === "Alta"
                ? "Alta"
                : newTask.priority === "Media"
                ? "Media"
                : "Baixa",
          } as Task,
        ]);
        setAdding(false);
      })
      .catch(console.error);
  };

  const handleUpdateTaskStatus = (id: number, status: TaskStatus) => {
    const started_at =
      status === TaskStatus.em_andamento
        ? new Date().toLocaleString()
        : undefined;
    axios
      .put(`/tasks/${id}`, { status, started_at })
      .then(() =>
        setTasks((prev) =>
          prev.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status,
                  ...(started_at ? { started_at: new Date(started_at) } : {}),
                }
              : e
          )
        )
      )
      .catch(console.error);
  };

  const handleEditTask = (task: Task) => {
    console.log("Editing task:", task);
    axios
      .put(`/tasks/${task.id}`, task)
      .then(() => setEditingId(null))
      .then(() =>
        setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)))
      )
      .catch(console.error);
  };

  const handleDeleteTask = (id: number) => {
    if (window.confirm("Deseja realmente deletar esta tarefa?")) {
      axios
        .delete(`/tasks/${id}`)
        .then(() => setTasks((prev) => prev.filter((task) => task.id !== id)))
        .catch(console.error);
    }
  };

  const availableEngineers = engineers.filter(
    (e) =>
      !(e.tasks ?? []).some(
        (t) => t.status === "Pendente" || t.status === TaskStatus.em_andamento
      )
  );

  const filteredTasks = filterStatus
    ? tasks.filter((task) => task.status === filterStatus)
    : tasks;

  return (
    <div className="p-4 bg-white rounded shadow-md w-[100%] h-[85vh]">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Tarefas</h2>
        <button
          onClick={() => setAdding(true)}
          className="bg-green-500 text-white p-2 rounded-full"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="mb-2">
        <select
          className="border p-1 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value={TaskStatus.pendente}>Pendente</option>
          <option value={TaskStatus.em_andamento}>Em andamento</option>
          <option value={TaskStatus.concluida}>Concluída</option>
        </select>
      </div>

      {adding && (
        <div className="mb-4 border-t pt-4">
          <input
            type="text"
            placeholder="Nome da tarefa"
            className="border p-1 rounded w-full mb-2"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Duração em horas"
            className="border p-1 rounded w-full mb-2"
            value={newTask.hours}
            onChange={(e) => setNewTask({ ...newTask, hours: +e.target.value })}
          />
          <select
            className="border p-1 rounded w-full mb-2"
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
          >
            <option value="Alta">Alta</option>
            <option value="Media">Média</option>
            <option value="Baixa">Baixa</option>
          </select>
          <select
            className="border p-1 rounded w-full mb-2"
            value={newTask.engineer_id ?? ""}
            onChange={(e) =>
              setNewTask({ ...newTask, engineer_id: Number(e.target.value) })
            }
          >
            <option value="">Selecione um engenheiro</option>
            {availableEngineers.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-4 py-1 rounded"
              onClick={handleAddTask}
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

      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li key={task.id} className="border p-2 rounded">
            {editingId === task.id ? (
              <div className="space-y-2">
                <input
                  className="border p-1 rounded w-full"
                  value={task.name}
                  onChange={(e) => {
                    const updated = tasks.map((t) =>
                      t.id === task.id ? { ...t, name: e.target.value } : t
                    );
                    setTasks(updated);
                  }}
                />
                <input
                  type="number"
                  className="border p-1 rounded w-full"
                  value={task.hours}
                  onChange={(e) => {
                    const updated = tasks.map((t) =>
                      t.id === task.id ? { ...t, hours: +e.target.value } : t
                    );
                    setTasks(updated);
                  }}
                />
                <select
                  className="border p-1 rounded w-full"
                  value={task.priority}
                  onChange={(e) => {
                    const updated = tasks.map((t) =>
                      t.id === task.id
                        ? { ...t, priority: e.target.value as Task["priority"] }
                        : t
                    );
                    setTasks(updated);
                  }}
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
                <select
                  className="border p-1 rounded w-full"
                  value={task.engineer_id ?? ""}
                  onChange={(e) => {
                    const updated = tasks.map((t) =>
                      t.id === task.id
                        ? { ...t, engineer_id: Number(e.target.value) }
                        : t
                    );
                    setTasks(updated);
                  }}
                >
                  <option value="">Selecione um engenheiro</option>
                  {engineers
                    .filter((e) => {
                      const hasActiveTask = (e.tasks ?? []).some(
                        (t) =>
                          t.status === "Pendente" ||
                          t.status === TaskStatus.em_andamento
                      );
                      const taskDuration = newTask.hours / (e.eficiency || 1);
                      return !hasActiveTask && taskDuration <= e.max_hours;
                    })
                    .map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                </select>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => handleEditTask(task)}
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
            ) : (
              <div className="flex justify-between items-center">
                <span>
                  <strong>{task.name}</strong> <br /> Prioridade:{" "}
                  {task.priority} - Tempo: {task.hours}h - Status: {task.status}
                </span>
                <div className="flex gap-2">
                  {task.status !== TaskStatus.concluida && task.engineer_id && (
                    <button
                      className="text-blue-600 text-sm"
                      onClick={() =>
                        handleUpdateTaskStatus(
                          task.id,
                          task.status === TaskStatus.pendente
                            ? TaskStatus.em_andamento
                            : TaskStatus.concluida
                        )
                      }
                    >
                      Marcar como{" "}
                      {task.status === TaskStatus.pendente
                        ? TaskStatus.em_andamento
                        : TaskStatus.concluida}
                    </button>
                  )}
                  <button
                    className="text-blue-500"
                    onClick={() => setEditingId(task.id)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="text-red-500"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
