import type { Agendamento } from "../models/Agendamento";
import type { AgendamentoCreate } from "../models/AgendamentoCreate";
import { api } from "./api";

export async function listarAgendamentos(page = 1, limit = 10) {
  const response = await api.get("/agendamentos", {
    params: { page, limit },
  });

  return response.data;
}

export async function criarAgendamento(
  dados: AgendamentoCreate
): Promise<Agendamento> {
  const response = await api.post("/agendamentos", dados);
  return response.data;
}

export async function deletarAgendamento(id: number) {
  await api.delete(`/agendamentos/${id}`);
}