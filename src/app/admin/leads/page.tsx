"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Phone, Mail, Clock, ShieldAlert, Loader2 } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "NUEVO" | "CONTACTADO" | "DESCARTADO";
  createdAt: string;
  property: {
    title: string;
    slug: string;
  } | null;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/leads");
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleStatusChange = async (id: string, newStatus: "NUEVO" | "CONTACTADO" | "DESCARTADO") => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/leads?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: newStatus } : lead))
        );
      }
    } catch (error) {
      console.error("Error updating lead status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-8 font-sans text-white">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-semibold text-white">Mensajes de Clientes</h1>
        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">Gestión de Consultas y Contactos</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
          <span className="text-xs text-neutral-500 tracking-wider uppercase font-semibold">Cargando mensajes...</span>
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950 border border-neutral-800 rounded-sm">
          <MessageSquare className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
          <h3 className="font-serif text-lg text-neutral-300 mb-1">Sin mensajes</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Aún no se han recibido envíos del formulario de contacto público.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className={`p-6 bg-[#111111] border rounded-sm transition-all duration-300 ${
                lead.status === "NUEVO" ? "border-emerald-500/20" : "border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 pb-4 border-b border-neutral-800">
                {/* User info */}
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-lg font-semibold text-white">{lead.name}</h3>
                    <span className="text-[10px] text-neutral-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-neutral-400 mt-2">
                    <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
                      <Mail className="w-3.5 h-3.5" />
                      {lead.email}
                    </a>
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
                      <Phone className="w-3.5 h-3.5" />
                      {lead.phone}
                    </a>
                  </div>
                </div>

                {/* Status selector */}
                <div className="flex items-center gap-3 self-start md:self-auto">
                  {updatingId === lead.id && <Loader2 className="w-4 h-4 text-gold-400 animate-spin" />}
                  <label className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Estado:</label>
                  <select
                    value={lead.status}
                    disabled={updatingId === lead.id}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                    className={`text-xs py-1.5 px-3 rounded-xs border outline-none font-semibold uppercase tracking-widest ${
                      lead.status === "NUEVO"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : lead.status === "CONTACTADO"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : "bg-neutral-800 text-neutral-400 border-neutral-700"
                    }`}
                  >
                    <option value="NUEVO">Nuevo</option>
                    <option value="CONTACTADO">Contactado</option>
                    <option value="DESCARTADO">Descartado</option>
                  </select>
                </div>
              </div>

              {/* Message content */}
              <div className="space-y-4">
                {lead.property && (
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-sm inline-flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Interés en:</span>
                    <span className="text-xs font-semibold text-gold-400">{lead.property.title}</span>
                  </div>
                )}
                
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold mb-1.5">Mensaje del cliente:</p>
                  <div className="p-4 bg-black/30 border border-neutral-800/50 rounded-sm text-sm text-neutral-300 font-light leading-relaxed whitespace-pre-line">
                    {lead.message}
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
