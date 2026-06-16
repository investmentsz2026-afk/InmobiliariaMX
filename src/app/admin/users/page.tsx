"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Loader2, X, Check, Users, Search, Shield, UserCheck, Key } from "lucide-react";
import ConfirmModal from "@/components/admin/ConfirmModal";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // UI state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);

  // Deletion confirm modal state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Form fields state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "USER">("USER");

  useEffect(() => {
    // Redirection if not admin
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
      router.push("/admin/orders"); // Workers are redirected to Orders
    }
  }, [status, session, router]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError("Error al cargar el listado de usuarios.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión al cargar usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "ADMIN") {
      fetchUsers();
    }
  }, [status, session]);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("USER");
    setError("");
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user: UserRecord) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(""); // Keep password empty unless changing
    setRole(user.role);
    setError("");
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    // Prevent self deletion
    const userToDelete = users.find(u => u.id === id);
    if (userToDelete?.email === session?.user?.email) {
      setError("No puedes eliminar tu propia cuenta de administrador activa.");
      setTimeout(() => setError(""), 4000);
      return;
    }
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDeletion = async () => {
    if (!pendingDeleteId) return;
    try {
      const res = await fetch(`/api/admin/users?id=${pendingDeleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== pendingDeleteId));
        setSuccessMsg("Usuario eliminado correctamente.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Error al eliminar usuario.");
        setTimeout(() => setError(""), 4000);
      }
    } catch (err) {
      console.error(err);
      setError("Error al conectar con el servidor.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setIsConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const body: any = {
      name,
      email,
      role,
    };

    if (password) {
      body.password = password;
    } else if (!editingUser) {
      setError("La contraseña es obligatoria para nuevos usuarios.");
      setSubmitting(false);
      return;
    }

    try {
      const url = editingUser ? `/api/admin/users?id=${editingUser.id}` : "/api/admin/users";
      const method = editingUser ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al guardar usuario.");
      }

      setSuccessMsg(editingUser ? "Usuario actualizado con éxito." : "Usuario creado con éxito.");
      setIsFormOpen(false);
      fetchUsers();
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter users by search query
  const filteredUsers = users.filter(user => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4 text-white">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
        <span className="text-xs text-neutral-500 tracking-wider uppercase font-semibold">Cargando personal...</span>
      </div>
    );
  }

  // Double check role permission before rendering UI
  if ((session?.user as any)?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="space-y-8 font-sans text-white">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-gold-400" />
            Administrar Usuarios
          </h1>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">
            Añadir y editar cuentas de administradores o trabajadores para el sistema
          </p>
        </div>
        
        <div>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-3 bg-gold-400 hover:bg-gold-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            Nuevo Usuario / Personal
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      {users.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#111111] p-4 border border-neutral-800 rounded-sm">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="Buscar por nombre o correo..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 pl-9 pr-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white placeholder-neutral-500"
            />
            <Search className="absolute left-3 top-3 text-neutral-500 w-4 h-4" />
          </div>
        </div>
      )}

      {/* Main Listing Table */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950 border border-neutral-800 rounded-sm">
          <h3 className="font-serif text-lg text-neutral-300 mb-1">Sin resultados</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            No se encontraron cuentas que coincidan con la búsqueda.
          </p>
        </div>
      ) : (
        <div className="bg-[#111111] border border-neutral-800 rounded-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-neutral-800 bg-black/40 text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                <th className="py-4 px-6">Nombre Completo</th>
                <th className="py-4 px-6">Correo Electrónico</th>
                <th className="py-4 px-6">Rol / Cargo</th>
                <th className="py-4 px-6">Fecha de Alta</th>
                <th className="py-4 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-xs text-neutral-300">
              {currentUsers.map((user) => {
                const isCurrentUser = user.email === session?.user?.email;
                return (
                  <tr key={user.id} className="hover:bg-neutral-850 transition-colors">
                    <td className="py-4 px-6 font-semibold text-neutral-100">{user.name} {isCurrentUser && <span className="text-[9px] text-gold-400 font-mono italic ml-1.5">(Tú)</span>}</td>
                    <td className="py-4 px-6 text-neutral-400 font-mono">{user.email}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest border rounded-xs ${
                        user.role === "ADMIN"
                          ? "bg-gold-400/10 text-gold-400 border-gold-400/25"
                          : "bg-red-500/10 text-red-400 border-red-500/25"
                      }`}>
                        {user.role === "ADMIN" ? "ADMINISTRADOR" : "TRABAJADOR"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-500">{new Date(user.createdAt).toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-gold-400 border border-transparent hover:border-neutral-700 transition-all rounded-xs"
                          title="Editar usuario"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {!isCurrentUser && (
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 hover:bg-red-500/10 text-neutral-400 hover:text-red-400 border border-transparent hover:border-neutral-700 transition-all rounded-xs"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-neutral-800 bg-black/20 text-xs gap-4">
              <span className="text-neutral-500">
                Mostrando <span className="font-semibold text-neutral-300">{indexOfFirstItem + 1}</span> a{" "}
                <span className="font-semibold text-neutral-300">
                  {Math.min(indexOfLastItem, filteredUsers.length)}
                </span>{" "}
                de <span className="font-semibold text-neutral-300">{filteredUsers.length}</span> cuentas
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-neutral-850 hover:border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-white disabled:opacity-50 disabled:pointer-events-none rounded-sm transition-all uppercase tracking-widest font-semibold text-[10px]"
                >
                  Anterior
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 rounded-sm transition-all font-serif font-bold text-xs ${
                      currentPage === page
                        ? "bg-gold-400 text-obsidian"
                        : "border border-neutral-850 hover:border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-neutral-850 hover:border-neutral-700 bg-neutral-950 text-neutral-400 hover:text-white disabled:opacity-50 disabled:pointer-events-none rounded-sm transition-all uppercase tracking-widest font-semibold text-[10px]"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide Drawer Editor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-end font-sans">
          <div className="w-full max-w-lg bg-[#111111] h-full overflow-y-auto border-l border-neutral-800 p-8 flex flex-col justify-between animate-in slide-in-from-right duration-350">
            <div>
              {/* Form Title */}
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800 mb-6">
                <h2 className="font-serif text-2xl font-semibold text-white">
                  {editingUser ? "Editar Datos de Cuenta" : "Nuevo Registro de Personal"}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-2 text-neutral-500 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-sm mb-6 flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. Pedro Picapiedra"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Correo de Acceso</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@inmobiliaria.com"
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">
                      {editingUser ? "Nueva Contraseña (Opcional)" : "Contraseña de Acceso"}
                    </label>
                    <input
                      type="password"
                      required={!editingUser}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={editingUser ? "Dejar vacío para mantener contraseña actual" : "Contraseña de mínimo 6 caracteres"}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] uppercase tracking-widest text-neutral-500 mb-2 font-bold">Cargo / Rol en el Sistema</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as "ADMIN" | "USER")}
                      className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-white"
                    >
                      <option value="USER">Trabajador (Acceso limitado a Pedidos y Perfil)</option>
                      <option value="ADMIN">Administrador (Acceso total al sistema)</option>
                    </select>
                  </div>
                </div>

                {/* Form actions */}
                <div className="pt-6 border-t border-neutral-800 flex gap-4 mt-8">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 bg-gold-400 hover:bg-gold-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-obsidian text-xs font-semibold tracking-widest uppercase transition-all rounded-sm flex items-center justify-center font-bold"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar Cuenta"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-6 py-3.5 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold tracking-widest uppercase transition-colors rounded-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirm deletion modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Confirmar Eliminación"
        message="¿Está seguro de eliminar esta cuenta de usuario/personal del sistema? No podrá volver a iniciar sesión con estas credenciales."
        variant="danger"
        onConfirm={confirmDeletion}
        onCancel={() => { setIsConfirmOpen(false); setPendingDeleteId(null); }}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />

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
