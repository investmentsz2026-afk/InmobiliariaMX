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

  const [isEntering, setIsEntering] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

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
    setShowErrorModal(false);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin",
      });

      if (res?.error) {
        setShowErrorModal(true);
      } else {
        setIsEntering(true);
        setTimeout(() => {
          router.push("/admin");
        }, 1500); // 1.5s delay to show the beautiful "Ingresando al Cpanel" animation
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
                placeholder="admin@inmobiliaria.com"
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
            disabled={loading || isEntering}
            className="w-full py-3.5 bg-gold-400 hover:bg-gold-500 disabled:bg-gray-700 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center shadow-lg hover:shadow-gold-400/25 cursor-pointer"
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

      {/* ERROR MODAL (Usuario/Contraseña Incorrectos) */}
      {showErrorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            onClick={() => setShowErrorModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm bg-[#111111] border border-red-500/20 rounded-sm p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-10 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 border border-red-500/20">
              <Lock className="w-5 h-5" />
            </div>
            
            <div className="space-y-2">
              <h4 className="font-serif text-lg font-semibold text-white">
                Acceso Denegado
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Usuario y contraseña incorrectos.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowErrorModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-obsidian text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm shadow-md hover:shadow-gold-400/20 cursor-pointer border-none"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}

      {/* ENTERING CPANEL ANIMATION SCREEN */}
      {isEntering && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md">
          <div className="relative flex flex-col items-center max-w-sm w-full p-8 text-center space-y-6">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-gold-400/20"></div>
              <div className="absolute inset-0 rounded-full border-t-2 border-gold-400 animate-spin"></div>
              <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-gold-400 animate-spin" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-serif text-xl font-semibold tracking-wider text-white animate-pulse">
                Iniciando Sesión
              </h3>
              <p className="text-xs uppercase tracking-widest text-gold-400 font-bold tracking-[0.2em] animate-pulse">
                Ingresando al Cpanel...
              </p>
            </div>
            
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
          </div>
        </div>
      )}
    </section>
  );
}
