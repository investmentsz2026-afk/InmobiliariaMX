"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

interface FormInputs {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function HomeContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const pathname = usePathname();

  const isStorePage = pathname.startsWith("/store") || pathname.startsWith("/propiedades");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || "Algo salió mal al enviar el formulario.");
      }

      setSubmitSuccess(true);
      reset();
    } catch (err: any) {
      console.error("Lead submission error:", err);
      setSubmitError(err.message || "Error al conectar con el servidor. Intente de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerClass = isStorePage
    ? "bg-white border border-[#b01e28]/25 p-10 text-center flex flex-col items-center justify-center min-h-[400px] rounded-sm"
    : "bg-black border border-gold-400/25 p-10 text-center flex flex-col items-center justify-center min-h-[400px] rounded-sm";

  const successTitleClass = isStorePage
    ? "font-serif text-2xl text-neutral-900 mb-3"
    : "font-serif text-2xl text-white mb-3";

  const successDescClass = isStorePage
    ? "text-neutral-500 text-sm max-w-sm mb-8 leading-relaxed"
    : "text-neutral-400 text-sm max-w-sm mb-8 leading-relaxed";

  const successBtnClass = isStorePage
    ? "px-6 py-2.5 bg-[#b01e28] hover:bg-[#91181f] text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer"
    : "px-6 py-2.5 bg-gold-400 hover:bg-gold-500 text-black text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer";

  const inputClass = isStorePage
    ? "w-full bg-white text-neutral-900 border-b border-neutral-200 focus:border-[#b01e28] py-3 px-1 text-sm outline-none transition-colors duration-300 placeholder-neutral-400"
    : "w-full bg-transparent text-white border-b border-neutral-800 focus:border-gold-400 py-3 px-1 text-sm outline-none transition-colors duration-300 placeholder-neutral-500";

  const btnClass = isStorePage
    ? "w-full py-4 bg-[#b01e28] hover:bg-[#91181f] disabled:bg-neutral-200 disabled:text-neutral-400 text-white text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center shadow-lg hover:shadow-red-900/20 cursor-pointer border-none"
    : "w-full py-4 bg-gold-400 hover:bg-gold-500 disabled:bg-black/50 disabled:text-neutral-600 text-black text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center shadow-lg hover:shadow-gold-400/20 cursor-pointer border-none";

  const errorClass = isStorePage
    ? "p-4 bg-red-50 border border-red-200 text-red-650 text-xs rounded-sm"
    : "p-4 bg-red-950/20 border border-red-500/30 text-red-400 text-xs rounded-sm";

  if (submitSuccess) {
    return (
      <div className={containerClass}>
        <CheckCircle2 className={`w-16 h-16 mb-6 animate-bounce ${isStorePage ? "text-[#b01e28]" : "text-gold-400"}`} />
        <h3 className={successTitleClass}>¡Mensaje Enviado con Éxito!</h3>
        <p className={successDescClass}>
          Hemos recibido tu solicitud. Uno de nuestros maestros parrilleros o asesores de ventas se contactará contigo en las próximas horas para atender tu solicitud de manera personalizada.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className={successBtnClass}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className={errorClass}>
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Nombre completo"
            className={inputClass}
            {...register("name", { required: "El nombre es obligatorio" })}
          />
          {errors.name && <span className="text-[10px] text-red-500 mt-1 block font-semibold">{errors.name.message}</span>}
        </div>

        {/* Email input */}
        <div className="relative">
          <input
            type="email"
            placeholder="Correo electrónico"
            className={inputClass}
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" },
            })}
          />
          {errors.email && <span className="text-[10px] text-red-500 mt-1 block font-semibold">{errors.email.message}</span>}
        </div>
      </div>

      {/* Phone input */}
      <div className="relative">
        <input
          type="tel"
          placeholder="Número de teléfono (WhatsApp)"
          className={inputClass}
          {...register("phone", { required: "El teléfono es obligatorio" })}
        />
        {errors.phone && <span className="text-[10px] text-red-500 mt-1 block font-semibold">{errors.phone.message}</span>}
      </div>

      {/* Message input */}
      <div className="relative">
        <textarea
          placeholder="¿En qué cortes, paquetes o servicios estás interesado?"
          rows={4}
          className={`${inputClass} resize-none`}
          {...register("message", { required: "El mensaje es obligatorio" })}
        />
        {errors.message && <span className="text-[10px] text-red-500 mt-1 block font-semibold">{errors.message.message}</span>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={btnClass}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando solicitud...
          </>
        ) : (
          <>
            Enviar mensaje
            <Send className="w-3.5 h-3.5 ml-2" />
          </>
        )}
      </button>
    </form>
  );
}
