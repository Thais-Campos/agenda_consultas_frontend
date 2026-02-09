import { useEffect, useState } from "react";
import { atualizarServico, criarServico, excluirServico, listarServicos } from "../../../src/services/servicos";

type Servico = {
    id: number;
    nome: string;
    preco: number;
};

export default function ServicosPage() {
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [servicoEditando, setServicoEditando] = useState<any | null>(null);



    useEffect(() => {
        async function carregar() {
            const response = await listarServicos(page, 10);
            setServicos(response.data);
            setTotalPages(response.meta.totalPages);
        }

        carregar();
    }, [page]);

    async function handleSalvar() {
        if (servicoEditando) {
            await atualizarServico(servicoEditando.id, {
                nome,
                preco: Number(preco),
            });
            setServicoEditando(null);
        } else {
            await criarServico({
                nome,
                preco: Number(preco),
            });
        }

        setNome("");
        setPreco("");

        const response = await listarServicos(page, 10);
        setServicos(response.data);
    }


    function handleEditar(servico: any) {
        setServicoEditando(servico);
        setNome(servico.nome);
        setPreco(String(servico.preco));
    }

    async function handleExcluir(id: number) {
        const confirmar = confirm("Deseja realmente excluir este serviço?");
        if (!confirmar) return;

        await excluirServico(id);

        const response = await listarServicos(page, 10);
        setServicos(response.data);
    }

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Serviços</h1>

            <div className="bg-zinc-900 p-4 rounded mb-4 flex gap-2">
                <input
                    type="text"
                    placeholder="Nome do serviço"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="flex-1 bg-zinc-800 p-2 rounded outline-none"
                />

                <input
                    type="number"
                    step="0.01"
                    placeholder="Preço"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    className="w-32 bg-zinc-800 p-2 rounded outline-none"
                />

                <button
                    onClick={handleSalvar}
                    className="bg-emerald-600 px-4 rounded font-medium hover:bg-emerald-500"
                >
                    Salvar
                </button>
            </div>


            {servicos.map((servico: Servico) => (
                <div
                    key={servico.id}
                    className="border-b border-zinc-800 p-3 flex items-center justify-between"
                >
                    <div>
                        <p className="font-medium">{servico.nome}</p>
                        <p className="text-sm text-zinc-400">
                            R$ {Number(servico.preco).toFixed(2)}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEditar(servico)}
                            className="text-sm bg-zinc-700 px-3 py-1 rounded hover:bg-zinc-600"
                        >
                            Editar
                        </button>

                        <button
                            onClick={() => handleExcluir(servico.id)}
                            className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-500"
                        >
                            Excluir
                        </button>
                    </div>

                </div>
            ))}



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
