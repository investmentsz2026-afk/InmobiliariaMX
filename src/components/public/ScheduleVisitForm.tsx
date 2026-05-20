"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Calendar, Clock, Loader2, CheckCircle } from "lucide-react";

interface VisitInputs {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes?: string;
}

interface ScheduleVisitFormProps {
  propertyId: string;
  propertyTitle: string;
}

export default function ScheduleVisitForm({ propertyId, propertyTitle }: ScheduleVisitFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VisitInputs>();

  const onSubmit = async (data: VisitInputs) => {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          propertyId,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Error al procesar tu solicitud de pedido.");
      }

      setSuccess(true);
      reset();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "No se pudo enviar tu pedido. Intente nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#111111] border border-gold-400/20 p-8 rounded-sm text-center flex flex-col items-center justify-center min-h-[350px]">
        <CheckCircle className="w-12 h-12 text-gold-400 mb-4 animate-pulse" />
        <h3 className="font-serif text-xl text-white mb-2 font-semibold">¡Solicitud Recibida!</h3>
        <p className="text-gray-400 text-xs leading-relaxed max-w-xs mb-6">
          Hemos recibido tu solicitud para el corte/paquete <strong>{propertyTitle}</strong>. Nos comunicaremos contigo de inmediato por WhatsApp o correo para coordinar el pago y el envío.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-5 py-2 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm"
        >
          Hacer otro pedido
        </button>
      </div>
    );
  }

  // Get tomorrow's date string (YYYY-MM-DD) to set as min date in calendar
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="bg-[#111111] border border-white/5 p-6 rounded-sm text-white">
      <h3 className="font-serif text-lg font-semibold text-white mb-1">Coordinar Pedido</h3>
      <p className="text-[11px] text-gray-400 mb-6 leading-relaxed">
        Elige la fecha y hora estimada en la que deseas recibir tu pedido o pasar a recogerlo en sucursal.
      </p>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Nombre completo</label>
          <input
            type="text"
            className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
            placeholder="Ej. Juan Pérez"
            {...register("name", { required: "El nombre es requerido" })}
          />
          {errors.name && <span className="text-[9px] text-red-400 mt-1 block">{errors.name.message}</span>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Correo electrónico</label>
          <input
            type="email"
            className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
            placeholder="correo@ejemplo.com"
            {...register("email", {
              required: "El correo es requerido",
              pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" },
            })}
          />
          {errors.email && <span className="text-[9px] text-red-400 mt-1 block">{errors.email.message}</span>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Teléfono (WhatsApp)</label>
          <input
            type="tel"
            className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
            placeholder="Ej. +52 322 201 8003"
            {...register("phone", { required: "El teléfono es requerido" })}
          />
          {errors.phone && <span className="text-[9px] text-red-400 mt-1 block">{errors.phone.message}</span>}
        </div>

        {/* Date and Time Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Fecha de entrega</label>
            <div className="relative">
              <input
                type="date"
                min={getMinDate()}
                className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                {...register("date", { required: "Seleccione fecha" })}
              />
            </div>
            {errors.date && <span className="text-[9px] text-red-400 mt-1 block">{errors.date.message}</span>}
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Hora sugerida</label>
            <select
              className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
              {...register("time", { required: "Seleccione hora" })}
            >
              <option value="">Seleccionar</option>
              <option value="12:00 PM">12:00 PM</option>
              <option value="1:30 PM">1:30 PM</option>
              <option value="3:00 PM">3:00 PM</option>
              <option value="4:30 PM">4:30 PM</option>
              <option value="6:00 PM">6:00 PM</option>
            </select>
            {errors.time && <span className="text-[9px] text-red-400 mt-1 block">{errors.time.message}</span>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-1 font-bold">Indicaciones especiales</label>
          <textarea
            className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white resize-none"
            placeholder="Ej. Término medio para Zona Grill o entrega congelada al vacío..."
            rows={2}
            {...register("notes")}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gold-400 hover:bg-gold-500 disabled:bg-gray-700 disabled:text-gray-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            "Enviar Solicitud de Pedido"
          )}
        </button>
      </form>
    </div>
  );
}
