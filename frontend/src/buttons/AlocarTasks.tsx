import axios from "axios";
import React from "react";
import { Engineer } from "../types/engineer";
import { Task } from "../types/task";

interface Props {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setEngineers: React.Dispatch<React.SetStateAction<Engineer[]>>;
}

const AlocarTarefasButton: React.FC<Props> = ({ setTasks, setEngineers }) => {
  const alocarTarefas = () => {
    axios
      .post("/tasks/alocar")
      .then(() => {
        axios.get("/tasks").then((res) => setTasks(res.data));
        axios.get("/engineers").then((res) => setEngineers(res.data));
      })
      .catch(console.error);
  };

  return (
    <button
      onClick={alocarTarefas}
      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
    >
      Alocar Tarefas
    </button>
  );
};

export default AlocarTarefasButton;
