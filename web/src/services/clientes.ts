import { api } from "./api";

export async function listarClientes(page = 1, limit = 10) {
  const response = await api.get("/clientes", {
    params: { page, limit },
  });

  return response.data;
}

export async function criarCliente(dados: {
  nome: string;
  telefone: string;
  observacao?: string;
}) {
  const response = await api.post("/clientes", dados);
  return response.data;
}

export async function atualizarCliente(
  id: number,
  dados: { nome: string; telefone: string; observacao?: string }
) {
  const response = await api.put(`/clientes/${id}`, dados);
  return response.data;
}

export async function excluirCliente(id: number) {
  await api.delete(`/clientes/${id}`);
}
