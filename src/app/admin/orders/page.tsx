"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  Calendar, 
  CreditCard, 
  Send, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  ListFilter,
  DollarSign,
  Check,
  X
} from "lucide-react";

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  weight: number;
}

interface Order {
  id: string;
  orderNumber: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: "TARJETA" | "SPEI";
  total: number;
  status: "PAGADO" | "ENTREGADO";
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"TODOS" | "PAGADO" | "ENTREGADO">("TODOS");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/orders");
      if (response.ok) {
        const data = await response.json();
        // Since Prisma items is Json, make sure it's parsed as array
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkAsDelivered = async (id: string) => {
    setUpdatingId(id);
    try {
      const response = await fetch(`/api/orders?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ENTREGADO" }),
      });

      if (response.ok) {
        setOrders((prev) =>
          prev.map((order) => (order.id === id ? { ...order, status: "ENTREGADO" } : order))
        );
        setSuccessMsg("Pedido marcado como entregado.");
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        const err = await response.json();
        setError(err.error || "No se pudo actualizar el estado de la compra.");
        setTimeout(() => setError(""), 4000);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Error de conexión al actualizar.");
      setTimeout(() => setError(""), 4000);
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

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "TODOS") return true;
    return order.status === filter;
  });

  return (
    <div className="space-y-8 font-sans text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-white">Compras / Pagos</h1>
          <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">
            Gestión y seguimiento de pedidos de clientes
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex bg-neutral-950 p-1 rounded-sm border border-neutral-850 self-start sm:self-auto">
          {(["TODOS", "PAGADO", "ENTREGADO"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all rounded-xs cursor-pointer ${
                filter === opt
                  ? "bg-gold-400 text-obsidian"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {opt === "TODOS" ? "Todos" : opt === "PAGADO" ? "Por Entregar" : "Entregados"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
          <span className="text-xs text-neutral-500 tracking-wider uppercase font-semibold">Cargando compras...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-[#111111] border border-neutral-850 rounded-sm">
          <ShoppingBag className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
          <h3 className="font-serif text-lg text-neutral-300 mb-1">Sin Compras</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto uppercase tracking-wide">
            No se encontraron registros de compras para el filtro seleccionado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className={`p-6 bg-[#111111] border rounded-sm transition-all duration-300 ${
                order.status === "PAGADO"
                  ? "border-amber-500/20 shadow-amber-500/[0.01]"
                  : "border-neutral-850 opacity-80"
              }`}
            >
              {/* Top row */}
              <div className="flex flex-col lg:flex-row justify-between gap-4 pb-4 border-b border-neutral-800">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-bold text-gold-400 bg-gold-400/5 border border-gold-400/25 px-2 py-0.5 rounded-sm">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(order.createdAt)}
                    </span>
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-xs flex items-center gap-1.5 ${
                      order.paymentMethod === "TARJETA"
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {order.paymentMethod === "TARJETA" ? <CreditCard className="w-3 h-3" /> : <Send className="w-3 h-3" />}
                      {order.paymentMethod === "TARJETA" ? "Tarjeta" : "SPEI"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-neutral-500" />
                    <h3 className="font-serif text-lg font-semibold text-white">{order.name}</h3>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-neutral-400">
                    <a href={`mailto:${order.email}`} className="flex items-center gap-1.5 hover:text-gold-400 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      {order.email}
                    </a>
                    <a 
                      href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-1.5 hover:text-gold-400 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-neutral-500" />
                      {order.phone}
                    </a>
                  </div>
                </div>

                {/* Right actions and Total */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4">
                  <div className="text-left lg:text-right">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block">Total Pagado</span>
                    <span className="font-serif text-xl font-bold text-white flex items-center">
                      <DollarSign className="w-4 h-4 text-gold-400" />
                      {formatPrice(order.total).replace("$", "")}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.status === "PAGADO" ? (
                      <button
                        type="button"
                        disabled={updatingId === order.id}
                        onClick={() => handleMarkAsDelivered(order.id)}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-bold text-[10px] uppercase tracking-wider transition-all duration-300 rounded-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {updatingId === order.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        Marcar Entregado
                      </button>
                    ) : (
                      <span className="px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Finalizado / Entregado
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom detail row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {/* Products list */}
                <div className="md:col-span-2 space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block">Productos Comprados</span>
                  <div className="bg-black/20 border border-neutral-850 rounded-xs divide-y divide-neutral-900 overflow-hidden">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-3 flex justify-between items-center text-xs">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-neutral-200">{item.title}</span>
                          <span className="text-[10px] text-neutral-500 block">
                            Peso: {item.weight >= 1000 ? `${(item.weight / 1000).toFixed(2)} kg` : `${item.weight} g`}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-neutral-400 font-semibold">{item.quantity} un.</span>
                          <span className="text-neutral-500 ml-2 font-mono">x {formatPrice(item.price)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold block flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                    Dirección de Entrega
                  </span>
                  <div className="bg-black/20 border border-neutral-850 rounded-xs p-3 text-xs text-neutral-300 leading-relaxed font-light min-h-[60px]">
                    {order.address}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Toast Notification */}
      {successMsg && (
        <div className="fixed bottom-5 right-5 z-[999] bg-[#111111] border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="p-1 rounded-full bg-emerald-500/10">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider">{successMsg}</span>
        </div>
      )}
      {error && (
        <div className="fixed bottom-5 right-5 z-[999] bg-[#111111] border border-red-500/30 text-red-400 px-4 py-3 rounded-sm shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="p-1 rounded-full bg-red-500/10">
            <X className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider">{error}</span>
        </div>
      )}
    </div>
  );
}
