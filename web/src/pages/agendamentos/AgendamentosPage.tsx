import { useEffect, useState } from "react";
import { criarAgendamento, deletarAgendamento, listarAgendamentos } from "../../../src/services/agendamentos";
import { listarServicos } from "../../services/servicos";
import { listarClientes } from "../../services/clientes";

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

export default function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [clienteId, setClienteId] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [dataHora, setDataHora] = useState("");
  const [cancelandoId, setCancelandoId] = useState<number | null>(null);

  useEffect(() => {
    async function carregar() {
      const response = await listarAgendamentos(page, 10);
      setAgendamentos(response.data);
      setTotalPages(response.meta.totalPages);
    }

    carregar();
  }, [page]);

  useEffect(() => {
    async function carregarAuxiliares() {
      const clientesResponse = await listarClientes();
      const servicosResponse = await listarServicos();

      setClientes(clientesResponse.data);
      setServicos(servicosResponse.data);
    }

    carregarAuxiliares();
  }, []);

  async function handleCriarAgendamento() {
    if (!clienteId || !servicoId || !dataHora) {
      alert("Preencha todos os campos");
      return;
    }

    const dataSelecionada = new Date(dataHora);
    const agora = new Date();

    if (dataSelecionada <= agora) {
      alert("Escolha uma data e horário no futuro");
      return;
    }

    const conflito = agendamentos.some((ag) => {
      const existente = new Date(ag.dataHora).toISOString();
      const novo = dataSelecionada.toISOString();
      return existente === novo;
    });

    if (conflito) {
      alert("Já existe um agendamento nesse horário");
      return;
    }


    const payload = {
      clienteId: Number(clienteId),
      servicoId: Number(servicoId),
      dataHora: new Date(dataHora).toISOString(),
    };

    try {
      await criarAgendamento(payload);
      

      // Recarrega a lista
      const response = await listarAgendamentos(page, 10);
      setAgendamentos(response.data);
      setTotalPages(response.meta.totalPages);

      // Limpa o form
      setClienteId("");
      setServicoId("");
      setDataHora("");
    } catch (error) {
      alert("Erro ao criar agendamento");
    }
  }

  async function handleCancelarAgendamento(id: number) {
    const confirmar = window.confirm("Deseja cancelar este agendamento?");
    if (!confirmar) return;

    try {
      setCancelandoId(id);

      await new Promise((resolve) => setTimeout(resolve, 1500));


      await deletarAgendamento(id);

      const response = await listarAgendamentos(page, 10);
      setAgendamentos(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      alert("Erro ao cancelar agendamento");
    } finally {
      setCancelandoId(null);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Agendamentos</h1>

      {/* NOVO AGENDAMENTO */}
      <div className="bg-zinc-900 rounded p-4 mb-6">
        <h2 className="text-lg font-medium mb-4">Novo agendamento</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* CLIENTE */}
          <select
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="bg-zinc-800 rounded px-3 py-2"
          >
            <option value="">Selecione o cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </option>
            ))}
          </select>

          {/* SERVIÇO */}
          <select
            value={servicoId}
            onChange={(e) => setServicoId(e.target.value)}
            className="bg-zinc-800 rounded px-3 py-2"
          >
            <option value="">Selecione o serviço</option>
            {servicos.map((servico) => (
              <option key={servico.id} value={servico.id}>
                {servico.nome}
              </option>
            ))}
          </select>

          {/* DATA / HORA */}
          <input
            type="datetime-local"
            value={dataHora}
            onChange={(e) => setDataHora(e.target.value)}
            className="bg-zinc-800 rounded px-3 py-2"
          />

          <button
            type="button"
            onClick={handleCriarAgendamento}
            className="bg-blue-600 hover:bg-blue-700 rounded px-4 py-2"
          >
            Agendar
          </button>

        </div>
      </div>

      <div className="bg-zinc-900 rounded">
        {agendamentos.length > 0 &&
          agendamentos.map((agendamento: Agendamento) => (
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

              <button
                type="button"
                onClick={() => handleCancelarAgendamento(agendamento.id)}
                disabled={cancelandoId === agendamento.id}
                className={`mt-2 text-sm ${cancelandoId === agendamento.id
                    ? "text-zinc-500 cursor-not-allowed"
                    : "text-red-400 hover:text-red-500"
                  }`}
              >
                {cancelandoId === agendamento.id ? "Cancelando..." : "Cancelar"}
              </button>

            </div>
          ))}

        {agendamentos.length === 0 && (
          <p className="p-4 text-zinc-400">Nenhum agendamento encontrado.</p>
        )}
      </div>

      {/* PAGINAÇÃO */}
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="text-sm text-zinc-400">
          Página {page} de {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
