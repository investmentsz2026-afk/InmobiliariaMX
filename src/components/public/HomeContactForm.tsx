"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
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

  if (submitSuccess) {
    return (
      <div className="bg-[#111111] border border-gold-400/20 p-10 text-center flex flex-col items-center justify-center min-h-[400px] rounded-sm">
        <CheckCircle2 className="w-16 h-16 text-gold-400 mb-6 animate-bounce" />
        <h3 className="font-serif text-2xl text-white mb-3">¡Mensaje Enviado con Éxito!</h3>
        <p className="text-gray-400 text-sm max-w-sm mb-8 leading-relaxed">
          Hemos recibido tu solicitud. Uno de nuestros maestros parrilleros o asesores de ventas se contactará contigo en las próximas horas para atender tu solicitud de manera personalizada.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="px-6 py-2.5 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-sm">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Name input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full bg-[#111111] text-white border-b border-white/10 focus:border-gold-400 py-3 px-1 text-sm outline-none transition-colors duration-300 placeholder-gray-600"
            {...register("name", { required: "El nombre es obligatorio" })}
          />
          {errors.name && <span className="text-[10px] text-red-400 mt-1 block">{errors.name.message}</span>}
        </div>

        {/* Email input */}
        <div className="relative">
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full bg-[#111111] text-white border-b border-white/10 focus:border-gold-400 py-3 px-1 text-sm outline-none transition-colors duration-300 placeholder-gray-600"
            {...register("email", {
              required: "El correo es obligatorio",
              pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" },
            })}
          />
          {errors.email && <span className="text-[10px] text-red-400 mt-1 block">{errors.email.message}</span>}
        </div>
      </div>

      {/* Phone input */}
      <div className="relative">
        <input
          type="tel"
          placeholder="Número de teléfono (WhatsApp)"
          className="w-full bg-[#111111] text-white border-b border-white/10 focus:border-gold-400 py-3 px-1 text-sm outline-none transition-colors duration-300 placeholder-gray-600"
          {...register("phone", { required: "El teléfono es obligatorio" })}
        />
        {errors.phone && <span className="text-[10px] text-red-400 mt-1 block">{errors.phone.message}</span>}
      </div>

      {/* Message input */}
      <div className="relative">
        <textarea
          placeholder="¿En qué cortes, paquetes o servicios estás interesado?"
          rows={4}
          className="w-full bg-[#111111] text-white border-b border-white/10 focus:border-gold-400 py-3 px-1 text-sm outline-none transition-colors duration-300 placeholder-gray-600 resize-none"
          {...register("message", { required: "El mensaje es obligatorio" })}
        />
        {errors.message && <span className="text-[10px] text-red-400 mt-1 block">{errors.message.message}</span>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-gold-400 hover:bg-gold-500 disabled:bg-gray-700 disabled:text-gray-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center shadow-lg hover:shadow-gold-400/20"
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
