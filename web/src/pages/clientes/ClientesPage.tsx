import { useEffect, useState } from "react";
import { atualizarCliente, criarCliente, excluirCliente, listarClientes } from "../../services/clientes";
import { api } from "../../services/api";
import { Pencil, Trash2 } from "lucide-react";


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


  useEffect(() => {
    async function carregar() {
      const response = await listarClientes(page, 10);

      setClientes(response.data);
      setTotal(Number(response.meta.total));
      setLimit(Number(response.meta.limit));
      setTotalPages(Number(response.meta.totalPages));

    }

    carregar();
  }, [page]);

  async function handleSalvar() {
    if (!nome.trim()) {
      alert("Nome é obrigatório");
      return;
    }

    if (!telefone.trim()) {
      alert("Telefone é obrigatório");
      return;
    }

    if (telefone.replace(/\D/g, "").length < 10) {
      alert("Telefone inválido");
      return;
    }

    if (clienteEditando) {
      await atualizarCliente(clienteEditando.id, { nome, telefone, observacao });
      setClienteEditando(null);
    } else {
      try {
        await criarCliente({ nome, telefone, observacao });
      } catch (error: any) {
        console.log(error.response?.data);
        alert("Erro ao cadastrar");
        return;
      }

    }

    setNome("");
    setTelefone("");
    setObservacao("");

    const response = await listarClientes(page, 10);
    console.log(response);

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


  async function handleExcluir(id: number) {
    const confirmarInicial = window.confirm(
      "Tem certeza que deseja excluir este cliente?"
    );

    if (!confirmarInicial) return;

    try {
      await excluirCliente(id);

    } catch (error: any) {

      if (error.response?.status === 400) {

        const confirmarForcado = window.confirm(
          "Este cliente possui agendamentos futuros. Deseja cancelar os agendamentos e excluir?"
        );

        if (!confirmarForcado) return;

        await api.delete(`/clientes/${id}/force`);

      } else {
        alert("Erro ao excluir cliente.");
        return;
      }
    }

    const response = await listarClientes(page, 10);

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

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Clientes</h1>

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
        {clientes.map((cliente) => (
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
                onClick={() => handleExcluir(cliente.id)}
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
