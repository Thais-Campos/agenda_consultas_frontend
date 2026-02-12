import { useEffect, useState } from "react";
import { atualizarCliente, criarCliente, excluirCliente, listarClientes } from "../../services/clientes";

type Cliente = {
  id: number;
  nome: string;
  telefone: string;
};

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);



  useEffect(() => {
    async function carregar() {
      const response = await listarClientes(page, 10);
      setClientes(response.data);
      setTotalPages(response.meta.totalPages);
    }

    carregar();
  }, [page]);

  async function handleSalvar() {
    if (clienteEditando) {
      await atualizarCliente(clienteEditando.id, { nome, telefone });
      setClienteEditando(null);
    } else {
      await criarCliente({ nome, telefone });
    }

    setNome("");
    setTelefone("");

    const response = await listarClientes(page, 10);
    setClientes(response.data);
  }


  function handleEditar(cliente: Cliente) {
    setClienteEditando(cliente);
    setNome(cliente.nome);
    setTelefone(cliente.telefone);
  }

  async function handleExcluir(id: number) {
    const confirmar = confirm("Deseja realmente excluir este cliente?");
    if (!confirmar) return;

    await excluirCliente(id);

    const response = await listarClientes(page, 10);
    setClientes(response.data);
  }


  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Clientes</h1>

      <div className="bg-zinc-900 p-4 rounded mb-4 flex gap-2">
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
          onChange={(e) => setTelefone(e.target.value)}
          className="flex-1 bg-zinc-800 p-2 rounded outline-none"
        />


        <button
          onClick={handleSalvar}
          className="bg-emerald-600 px-4 rounded font-medium hover:bg-emerald-500"
        >
          Salvar
        </button>

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

            <button
              onClick={() => handleEditar(cliente)}
              className="text-sm bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600"
            >
              Editar
            </button>

            <button
              onClick={() => handleExcluir(cliente.id)}
              className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-500"
            >
              Excluir
            </button>


          </div>
        ))}


        {clientes.length === 0 && (
          <p className="p-4 text-zinc-400">
            Nenhum cliente encontrado.
          </p>
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
