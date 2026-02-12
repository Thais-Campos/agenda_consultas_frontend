import { useEffect, useState } from "react";
import { api } from "../../services/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";


export default function DashboardPage() {

    const [totalClientes, setTotalClientes] = useState(0);
    const [totalServicos, setTotalServicos] = useState(0);
    const [totalAgendamentos, setTotalAgendamentos] = useState(0);
    const [agendamentosHoje, setAgendamentosHoje] = useState(0);

    const dataGrafico = [
        { name: "Clientes", total: totalClientes },
        { name: "Serviços", total: totalServicos },
        { name: "Agend.", total: totalAgendamentos },
    ];


    useEffect(() => {
        async function carregarDados() {
            try {
                const clientes = await api.get("/clientes?page=1&limit=100");
                const servicos = await api.get("/servicos?page=1&limit=100");
                const agendamentos = await api.get("/agendamentos?page=1&limit=100");



                setTotalClientes(clientes.data.meta.total);
                setTotalServicos(servicos.data.meta.total);
                setTotalAgendamentos(agendamentos.data.meta.total);

                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0);

                const amanha = new Date(hoje);
                amanha.setDate(amanha.getDate() + 1);

                const totalHoje = agendamentos.data.data.filter((a: any) => {
                    const data = new Date(a.dataHora);
                    return data >= hoje && data < amanha;
                }).length;

                setAgendamentosHoje(totalHoje);



            } catch (error) {
                console.error("Erro ao carregar dashboard", error);
            }
        }

        carregarDados();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-zinc-900 p-6 rounded-xl shadow">
                    <p className="text-zinc-400 text-sm">Clientes</p>
                    <h2 className="text-4xl font-bold mt-2 text-orange-500">
                        {totalClientes}
                    </h2>
                </div>

                <div className="bg-zinc-900 p-6 rounded-xl shadow">
                    <p className="text-zinc-400 text-sm">Serviços</p>
                    <h2 className="text-4xl font-bold mt-2 text-orange-500">
                        {totalServicos}
                    </h2>
                </div>

                <div className="bg-zinc-900 p-6 rounded-xl shadow">
                    <p className="text-zinc-400 text-sm">Agendamentos</p>
                    <h2 className="text-4xl font-bold mt-2 text-orange-500">
                        {totalAgendamentos}
                    </h2>
                </div>
                <div className="bg-zinc-900 p-6 rounded-xl shadow">
                    <p className="text-zinc-400 text-sm">Agendamentos Hoje</p>
                    <h2 className="text-4xl font-bold mt-2 text-emerald-500">
                        {agendamentosHoje}
                    </h2>
                </div>


            </div>

            {/* GRÁFICO */}
            <div className="mt-10 bg-zinc-900 p-6 rounded-xl">
                <h2 className="text-xl font-semibold mb-4">
                    Resumo Geral
                </h2>

                <div className="w-full h-64">
                    <ResponsiveContainer>
                        <BarChart data={dataGrafico}>
                            <XAxis dataKey="name" stroke="#a1a1aa" />
                            <YAxis stroke="#a1a1aa" />
                            <Tooltip
                                cursor={false}
                                contentStyle={{
                                    backgroundColor: "#18181b",
                                    border: "1px solid #27272a",
                                    borderRadius: "8px",
                                    color: "#fff",
                                }}
                            />

                            <Bar dataKey="total" fill="#f97316" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
