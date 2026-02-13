import { useEffect, useState } from "react";
import { atualizarCliente, criarCliente, excluirCliente, listarClientes } from "../../services/clientes";
import { api } from "../../services/api";
import { Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";


type Cliente = {
  id: number;
  nome: string;
  telefone: string;
  observacao?: string;
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [observacao, setObservacao] = useState("");
  const [clienteParaExcluir, setClienteParaExcluir] = useState<Cliente | null>(null);
  const [confirmandoForcado, setConfirmandoForcado] = useState(false);
  const [busca, setBusca] = useState("");


  useEffect(() => {
    async function carregar() {
      const response = await listarClientes(page, 10, busca);

      setClientes(response.data);
      setTotal(Number(response.meta.total));
      setLimit(Number(response.meta.limit));
      setTotalPages(Number(response.meta.totalPages));

    }

    carregar();
  }, [page, busca]);

  async function handleSalvar() {

    if (!nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (!telefone.trim()) {
      toast.error("Telefone é obrigatório");
      return;
    }

    if (telefone.replace(/\D/g, "").length < 10) {
      toast.error("Telefone inválido");
      return;
    }

    try {
      if (clienteEditando) {
        await atualizarCliente(clienteEditando.id, { nome, telefone, observacao });
        toast.success("Cliente atualizado com sucesso");
        setClienteEditando(null);
      } else {
        await criarCliente({ nome, telefone, observacao });
        toast.success("Cliente cadastrado com sucesso");
      }
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error("Erro ao salvar cliente");
      return;
    }

    setNome("");
    setTelefone("");
    setObservacao("");

    const response = await listarClientes(page, 10);

    setClientes(response.data);
    setTotal(Number(response.meta.total));
    setLimit(Number(response.meta.limit));
    setTotalPages(Number(response.meta.totalPages));
  }

  function handleEditar(cliente: Cliente) {
    setClienteEditando(cliente);
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
    setObservacao(cliente.observacao || "");
  }


  async function confirmarExclusao() {
    if (!clienteParaExcluir) return;

    try {
      await excluirCliente(clienteParaExcluir.id);
      toast.success("Cliente excluído com sucesso");
      setClienteParaExcluir(null);
      setConfirmandoForcado(false);

    } catch (error: any) {

      if (error.response?.status === 400 && !confirmandoForcado) {
        setConfirmandoForcado(true);
        return;
      }

      if (error.response?.status === 400 && confirmandoForcado) {
        await api.delete(`/clientes/${clienteParaExcluir.id}/force`);
        toast.success("Cliente excluído com cancelamento dos agendamentos");
        setClienteParaExcluir(null);
        setConfirmandoForcado(false);
      } else {
        toast.error("Erro ao excluir cliente");
      }
    }

    const response = await listarClientes(page, 10, busca);
    setClientes(response.data);
    setTotal(Number(response.meta.total));
    setLimit(Number(response.meta.limit));
    setTotalPages(Number(response.meta.totalPages));
  }

  function formatarTelefone(valor: string) {
    const apenasNumeros = valor.replace(/\D/g, "").slice(0, 11);

    if (apenasNumeros.length <= 10) {
      return apenasNumeros
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return apenasNumeros
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nome.toLowerCase().includes(busca.toLowerCase())
  );


  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Clientes</h1>

      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busca}
        onChange={(e) => {setBusca(e.target.value); setPage(1); }}
        className="mb-4 w-full bg-zinc-800 p-2 rounded outline-none"
      />
      <div className="bg-zinc-900 p-4 rounded mb-4 space-y-3">

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="flex-1 bg-zinc-800 p-2 rounded outline-none"
          />

          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
            className="flex-1 bg-zinc-800 p-2 rounded outline-none"
          />
        </div>

        <textarea
          placeholder="Observação (opcional)"
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          rows={2}
          className="w-full bg-zinc-800 p-2 rounded outline-none resize-none"
        />

        <div className="flex justify-end">
          <button
            onClick={handleSalvar}
            className="bg-orange-500 px-6 py-2 rounded font-medium hover:bg-orange-300 transition"
          >
            Salvar
          </button>
        </div>

      </div>


      {/* LISTA DE CLIENTES */}
      <div className="bg-zinc-900 rounded">
        {clientesFiltrados.map((cliente) => (
          <div
            key={cliente.id}
            className="border-b border-zinc-800 p-3 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{cliente.nome}</p>
              <p className="text-sm text-zinc-400">{cliente.telefone}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEditar(cliente)}
                className="p-2 bg-orange-500 rounded hover:bg-orange-300 transition"
                title="Editar"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => setClienteParaExcluir(cliente)}
                className="p-2 bg-orange-600 rounded hover:bg-orange-400 transition"
                title="Excluir"
              >
                <Trash2 size={16} />
              </button>
            </div>

          </div>
        ))}

        {clientes.length === 0 && (
          <p className="p-4 text-zinc-400">
            Nenhum cliente encontrado.
          </p>
        )}
      </div>

      {clienteParaExcluir && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              Confirmar exclusão
            </h2>

            <p className="text-sm text-zinc-400 mb-6">
              {confirmandoForcado
                ? "Este cliente possui agendamentos futuros. Deseja cancelar os agendamentos e excluir mesmo assim?"
                : (
                  <>
                    Deseja realmente excluir o cliente{" "}
                    <span className="text-orange-500 font-medium">
                      {clienteParaExcluir.nome}
                    </span>
                    ?
                  </>
                )}
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setClienteParaExcluir(null)}
                className="px-4 py-2 bg-zinc-700 rounded hover:bg-zinc-600"
              >
                Cancelar
              </button>

              <button
                onClick={confirmarExclusao}
                className="px-4 py-2 bg-orange-600 rounded hover:bg-orange-500"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}


      {/* PAGINAÇÃO */}
      {total > limit && (
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
      )}

    </div>
  );
}
