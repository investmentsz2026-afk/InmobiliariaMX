"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Lock, Mail, Check, X, Loader2, Shield } from "lucide-react";

export default function AdminProfilePage() {
  const { data: session, update: updateSession } = useSession();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/profile");
      if (res.ok) {
        const data = await res.json();
        setName(data.name || "");
        setEmail(data.email || "");
      } else {
        setError("Error al cargar la información del perfil.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al cargar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMsg("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("La nueva contraseña y su confirmación no coinciden.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword: newPassword ? currentPassword : undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al actualizar el perfil.");
      }

      setSuccessMsg("Perfil actualizado correctamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Update NextAuth session
      if (updateSession) {
        await updateSession({
          ...session,
          user: {
            ...session?.user,
            name,
            email,
          }
        });
      }
      
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al conectar con el servidor.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-white">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
        <span className="text-xs text-neutral-500 tracking-wider uppercase font-semibold">Cargando perfil...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans text-white">
      {/* Header section */}
      <div>
        <h1 className="font-serif text-3xl font-semibold text-white flex items-center gap-2">
          <User className="w-8 h-8 text-gold-400" />
          Mi Perfil
        </h1>
        <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">
          Administra tus datos de perfil, correo electrónico y contraseña
        </p>
      </div>

      <div className="bg-[#111111] border border-neutral-800 rounded-sm shadow-xl p-8 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Profile Avatar Card */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-neutral-800 mb-8">
          <div className="w-20 h-20 bg-neutral-850 border border-neutral-800 rounded-full flex items-center justify-center text-gold-400 text-3xl font-serif font-bold shadow-inner shrink-0 select-none">
            {name ? name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-serif text-xl font-bold text-neutral-150">{name || "Administrador"}</h3>
            <p className="text-xs text-neutral-500 font-mono">{email}</p>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-gold-400/20 bg-gold-400/5 text-[9px] font-bold tracking-widest text-gold-400 uppercase rounded-xs">
              <Shield className="w-3 h-3" />
              {(session?.user as any)?.role === "ADMIN" ? "Administrador Principal" : "Trabajador / Personal"}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-sm mb-6 flex items-center gap-2">
            <X className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre y Correo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Nombre Completo</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 pl-9 pr-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                />
                <User className="absolute left-3 top-3 text-neutral-500 w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Correo Electrónico</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ejemplo.com"
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 pl-9 pr-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                />
                <Mail className="absolute left-3 top-3 text-neutral-500 w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Cambio de Contraseña */}
          <div className="border-t border-neutral-800 pt-6 mt-6 space-y-4">
            <h4 className="font-serif text-sm font-semibold text-gold-400 flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              Cambiar Contraseña
            </h4>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">
              Completa estos campos únicamente si deseas modificar tu contraseña de acceso
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[8px] uppercase tracking-widest text-neutral-500 font-bold">Contraseña Actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña actual"
                  required={!!newPassword}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-500 font-bold">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[8px] uppercase tracking-widest text-neutral-500 font-bold">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma la nueva contraseña"
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-neutral-800 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-gold-400 hover:bg-gold-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all rounded-sm flex items-center justify-center font-bold shadow-lg"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando Cambios...
                </>
              ) : (
                "Guardar Perfil"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Floating Success Toast */}
      {successMsg && (
        <div className="fixed bottom-5 right-5 z-[999] bg-[#111111] border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="p-1 rounded-full bg-emerald-500/10">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider">{successMsg}</span>
        </div>
      )}
    </div>
  );
}
