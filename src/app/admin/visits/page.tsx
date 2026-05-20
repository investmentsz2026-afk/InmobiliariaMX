"use client";

import { useState, useEffect } from "react";
import { CalendarDays, Clock, Phone, Mail, User, Loader2, Check, X, RefreshCw } from "lucide-react";

interface Visit {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
  status: "PENDIENTE" | "CONFIRMADA" | "CANCELADA";
  property: {
    title: string;
    slug: string;
  };
}

export default function AdminVisitsPage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/visits");
      if (response.ok) {
        const data = await response.json();
        setVisits(data);
      }
    } catch (error) {
      console.error("Error fetching visits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleStatusChange = async (id: string, newStatus: "PENDIENTE" | "CONFIRMADA" | "CANCELADA") => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/visits?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setVisits((prev) =>
          prev.map((visit) => (visit.id === id ? { ...visit, status: newStatus } : visit))
        );
      }
    } catch (error) {
      console.error("Error updating visit status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC", // Maintain date consistency from DB date-only format
    });
  };

  const statusColors = {
    PENDIENTE: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    CONFIRMADA: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    CANCELADA: "bg-red-500/10 text-red-400 border-red-500/30",
  };

  const statusLabels = {
    PENDIENTE: "Pendiente",
    CONFIRMADA: "Confirmada",
    CANCELADA: "Cancelada",
  };

  return (
    <div className="space-y-8 font-sans text-white">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold text-white">Agenda de Pedidos</h1>
        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">Coordinación de entregas y recolecciones</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
          <span className="text-xs text-neutral-500 tracking-wider uppercase font-semibold">Cargando agenda...</span>
        </div>
      ) : visits.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950 border border-neutral-800 rounded-sm">
          <CalendarDays className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
          <h3 className="font-serif text-lg text-neutral-300 mb-1">Sin pedidos agendados</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Aún no se registran agendamientos de pedidos en el catálogo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {visits.map((visit) => (
            <div
              key={visit.id}
              className={`p-6 bg-[#111111] border rounded-sm transition-all duration-300 border-neutral-800 hover:border-neutral-750`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-800 mb-4">
                {/* Date / Time highlight */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-neutral-900 border border-neutral-800 text-gold-400 rounded-sm">
                    <CalendarDays className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-semibold text-white">
                      {formatDate(visit.date)}
                    </h3>
                    <p className="text-xs text-neutral-400 flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      Horario: {visit.time}
                    </p>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1.5 border text-[10px] font-semibold uppercase tracking-widest rounded-xs ${statusColors[visit.status]}`}>
                    {statusLabels[visit.status]}
                  </span>
                  
                  {visit.status === "PENDIENTE" && (
                    <div className="flex items-center gap-2">
                      {updatingId === visit.id ? (
                        <Loader2 className="w-4 h-4 text-gold-400 animate-spin" />
                      ) : (
                        <>
                          <button
                            onClick={() => handleStatusChange(visit.id, "CONFIRMADA")}
                            className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/20 transition-all rounded-xs"
                            title="Confirmar Pedido"
                            aria-label="Confirmar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(visit.id, "CANCELADA")}
                            className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all rounded-xs"
                            title="Cancelar Pedido"
                            aria-label="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {visit.status !== "PENDIENTE" && (
                    <button
                      onClick={() => handleStatusChange(visit.id, "PENDIENTE")}
                      disabled={updatingId === visit.id}
                      className="p-1.5 bg-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all rounded-xs border border-neutral-800"
                      title="Revertir a Pendiente"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Client and Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                {/* Client info */}
                <div className="space-y-3">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Datos del Cliente</p>
                  <div className="space-y-1.5">
                    <p className="flex items-center gap-2 font-medium text-neutral-200">
                      <User className="w-4 h-4 text-gray-500" />
                      {visit.name}
                    </p>
                    <p className="flex items-center gap-2 text-xs text-neutral-400">
                      <Mail className="w-4 h-4 text-gray-600" />
                      {visit.email}
                    </p>
                    <p className="flex items-center gap-2 text-xs text-neutral-400">
                      <Phone className="w-4 h-4 text-gray-600" />
                      {visit.phone}
                    </p>
                  </div>
                </div>

                {/* Property / Notes info */}
                <div className="space-y-3">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Producto y Comentarios</p>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                      {visit.property.title}
                    </p>
                    {visit.notes && (
                      <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-sm text-xs text-neutral-300 font-light leading-relaxed">
                        <strong>Nota:</strong> {visit.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
