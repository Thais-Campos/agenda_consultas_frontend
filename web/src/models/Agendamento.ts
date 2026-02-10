export interface Agendamento {
  id?: number;

  clienteId: number;
  servicoId: number;

  // backend: `dataHora` (ISO string)
  dataHora: string;

  status?: "ATIVO" | "CANCELADO";
  canceladoEm?: string | null;
}
