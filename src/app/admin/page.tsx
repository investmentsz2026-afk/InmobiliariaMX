import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Beef, MessageSquare, CalendarRange, ArrowRight, Clock, Eye } from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Aggregate stats on the server
  const [totalProperties, totalLeads, newLeadsCount, pendingVisitsCount, recentLeads, upcomingVisits] = await Promise.all([
    prisma.property.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NUEVO" } }),
    prisma.visit.count({ where: { status: "PENDIENTE" } }),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { property: { select: { title: true } } },
    }),
    prisma.visit.findMany({
      take: 5,
      where: { status: "PENDIENTE" },
      orderBy: { date: "asc" },
      include: { property: { select: { title: true } } },
    }),
  ]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold text-white">Resumen del Sistema</h1>
        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">Panel de Control General</p>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total properties */}
        <div className="p-6 bg-[#111111] border border-neutral-800 rounded-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Productos</span>
            <p className="text-3xl font-serif font-bold text-white">{totalProperties}</p>
          </div>
          <div className="p-3 bg-neutral-800 rounded-full text-gold-400">
            <Beef className="w-6 h-6" />
          </div>
        </div>

        {/* Total leads */}
        <div className="p-6 bg-[#111111] border border-neutral-800 rounded-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Mensajes de Clientes</span>
            <p className="text-3xl font-serif font-bold text-white">{totalLeads}</p>
          </div>
          <div className="p-3 bg-neutral-800 rounded-full text-gold-400">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        {/* New Leads */}
        <div className="p-6 bg-[#111111] border border-neutral-800 rounded-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Nuevos Mensajes</span>
            <p className="text-3xl font-serif font-bold text-emerald-400">{newLeadsCount}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Pending Visits */}
        <div className="p-6 bg-[#111111] border border-neutral-800 rounded-sm flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Pedidos Agendados</span>
            <p className="text-3xl font-serif font-bold text-amber-400">{pendingVisitsCount}</p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-full text-amber-400">
            <CalendarRange className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main activities panels split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent leads */}
        <div className="p-6 bg-[#111111] border border-neutral-800 rounded-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-white">Mensajes Recientes</h2>
            <Link
              href="/admin/leads"
              className="text-[10px] tracking-widest uppercase text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1.5"
            >
              Ver todos
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-800">
            {recentLeads.length === 0 ? (
              <p className="text-xs text-neutral-500 py-4">No hay mensajes registrados.</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-200">{lead.name}</p>
                    <p className="text-[10px] text-neutral-500">{lead.email} | {lead.phone}</p>
                    {lead.property && (
                      <p className="text-[9px] text-gold-400 uppercase tracking-wider">Interés: {lead.property.title}</p>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 text-[8px] uppercase tracking-wider font-semibold rounded-xs ${
                    lead.status === "NUEVO" 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : lead.status === "CONTACTADO"
                      ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                  }`}>
                    {lead.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Scheduled visits */}
        <div className="p-6 bg-[#111111] border border-neutral-800 rounded-sm space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-white">Próximos Pedidos</h2>
            <Link
              href="/admin/visits"
              className="text-[10px] tracking-widest uppercase text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1.5"
            >
              Ver pedidos
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-neutral-800">
            {upcomingVisits.length === 0 ? (
              <p className="text-xs text-neutral-500 py-4">No hay pedidos agendados.</p>
            ) : (
              upcomingVisits.map((visit) => (
                <div key={visit.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-200">{visit.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                      <span className="text-neutral-400 font-medium">{formatDate(visit.date)}</span>
                      <span>•</span>
                      <span>{visit.time}</span>
                    </div>
                    <p className="text-[9px] text-gold-400 uppercase tracking-wider">{visit.property.title}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[8px] uppercase tracking-wider font-semibold rounded-xs">
                    {visit.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
