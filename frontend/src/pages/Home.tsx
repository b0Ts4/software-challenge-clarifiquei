import React, { useEffect, useState } from "react";
import Engineers from "../components/Engineers";
import Tasks from "../components/Tasks";
import axios from "axios";
import { Task } from "../types/task";
import { Engineer } from "../types/engineer";
import AlocarTarefasButton from "../buttons/AlocarTasks";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);

  useEffect(() => {
    axios
      .get("/engineers")
      .then((res) => setEngineers(res.data))
      .catch(console.error);
    axios
      .get("/tasks")
      .then((res) => setTasks(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="flex flex-col w-[100vw] h-[100vh] items-center px-4 py-2 bg-gray-100">
      <div className="grid grid-cols-2 mt-6 gap-4">
        <Engineers engineers={engineers} setEngineers={setEngineers} />
        <Tasks tasks={tasks} setTasks={setTasks} engineers={engineers} />
      </div>
      <div className="flex justify-end px-4 mt-4">
        <AlocarTarefasButton setTasks={setTasks} setEngineers={setEngineers} />
      </div>
    </div>
  );
}
