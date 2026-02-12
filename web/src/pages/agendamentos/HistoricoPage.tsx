import { useEffect, useState } from "react";
import { api } from "../../services/api";

type Cliente = {
  id: number;
  nome: string;
};

type Servico = {
  id: number;
  nome: string;
};

type Agendamento = {
  id: number;
  dataHora: string;
  cliente: Cliente;
  servico: Servico;
};

export default function HistoricoPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  useEffect(() => {
    async function carregar() {
      const response = await api.get("/agendamentos/historico?page=1&limit=20");
      setAgendamentos(response.data.data);
    }

    carregar();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">
        Histórico de Agendamentos
      </h1>

      <div className="bg-zinc-900 rounded">
        {agendamentos.map((agendamento) => (
          <div
            key={agendamento.id}
            className="border-b border-zinc-800 p-3"
          >
            <p className="font-medium">
              {agendamento.cliente.nome} — {agendamento.servico.nome}
            </p>

            <p className="text-sm text-zinc-400">
              {new Date(agendamento.dataHora).toLocaleDateString("pt-BR")} às{" "}
              {new Date(agendamento.dataHora).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}

        {agendamentos.length === 0 && (
          <p className="p-4 text-zinc-400">
            Nenhum agendamento no histórico.
          </p>
        )}
      </div>
    </div>
  );
}
