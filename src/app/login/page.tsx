"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (res?.error) {
        setError("Credenciales incorrectas. Verifique correo y contraseña.");
      } else {
        router.push("/admin");
      }
    } catch (err) {
      console.error(err);
      setError("Error inesperado en el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-obsidian text-white flex items-center justify-center p-6 relative font-sans">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-obsidian via-obsidian/90 to-gold-950/20" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-md bg-[#111111] border border-white/5 p-8 rounded-sm shadow-2xl">
        <Link
          href="/"
          className="inline-flex items-center text-xs text-gray-500 hover:text-gold-400 mb-8 tracking-widest uppercase transition-colors duration-300 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          Volver al Inicio
        </Link>

        <div className="text-center mb-8">
          <span className="font-serif text-3xl tracking-widest font-semibold text-white">
            ELEGANCIA<span className="text-gold-400">.</span>
          </span>
          <p className="text-xs text-gray-500 tracking-wider uppercase mt-2">Acceso Administrativo</p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@elegancia.com"
                className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-3 pl-10 pr-4 text-xs outline-none transition-colors duration-300 rounded-sm text-white placeholder-gray-700"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-3 pl-10 pr-4 text-xs outline-none transition-colors duration-300 rounded-sm text-white placeholder-gray-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gold-400 hover:bg-gold-500 disabled:bg-gray-700 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center shadow-lg hover:shadow-gold-400/25"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Autenticando...
              </>
            ) : (
              "Ingresar al Panel"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
