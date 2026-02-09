import { api } from "./api";

export async function listarServicos(page = 1, limit = 10) {
  const response = await api.get("/servicos", {
    params: { page, limit },
  });

  return response.data;
}
export async function criarServico(dados: {
  nome: string;
  preco: number;
}) {
  const response = await api.post("/servicos", dados);
  return response.data;
}
export async function atualizarServico(
  id: number,
  dados: { nome: string; preco: number }
) {
  const response = await api.put(`/servicos/${id}`, dados);
  return response.data;
}
export async function excluirServico(id: number) {
  await api.delete(`/servicos/${id}`);
}
