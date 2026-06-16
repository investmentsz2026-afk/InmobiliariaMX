"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";
import { X, ShieldCheck, CheckCircle2, ArrowRight, MessageSquare, CreditCard, Send, Copy, Check, Upload, Trash2, Loader2, Camera, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { bankConfig } from "@/lib/paymentConfig";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Cargar Stripe con la clave pública (se lee del .env)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

// =============================
// Componente interno del formulario de pago
// =============================
function CheckoutForm() {
  const { items, clearCart, toggleCheckout } = useCartStore();

  // Form Fields
  const [cardName, setCardName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Configuration and toggles
  const [paymentMethod, setPaymentMethod] = useState<"TARJETA" | "SPEI">("TARJETA");
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [error, setError] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  // Flow State
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [orderNumber, setOrderNumber] = useState("");

  // Stripe hooks (solo funcionan dentro del <Elements> provider)
  const stripe = useStripe();
  const elements = useElements();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ---- Handlers ----

  const handleReceiptChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingReceipt(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/api/upload/receipt", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.error || "Fallo en la carga del comprobante");
      }

      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        setReceiptUrl(data.urls[0]);
      } else {
        throw new Error("No se devolvió URL del comprobante");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al subir comprobante. Intenta de nuevo.");
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !email || !phone || !address) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    setStep("processing");
    setError("");

    try {
      if (paymentMethod === "TARJETA") {
        // ==========================================
        // FLUJO DE PAGO REAL CON STRIPE
        // ==========================================
        if (!stripe || !elements) {
          setError("Stripe no está listo. Recarga la página.");
          setStep("form");
          return;
        }

        // 1. Crear PaymentIntent en nuestro backend
        const intentRes = await fetch("/api/stripe/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: subtotal,
            description: `Pedido Carnicero & Grill - ${items.map((i) => i.title).join(", ")}`,
            customerEmail: email,
          }),
        });

        if (!intentRes.ok) {
          const intentErr = await intentRes.json();
          throw new Error(intentErr.error || "Error al iniciar el proceso de pago.");
        }

        const { clientSecret } = await intentRes.json();

        // 2. Confirmar el pago con Stripe Elements (cobro real)
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          throw new Error("No se pudo acceder al formulario de tarjeta.");
        }

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardName,
              email: email,
              phone: phone,
              address: { line1: address },
            },
          },
        });

        if (stripeError) {
          throw new Error(stripeError.message || "El pago fue rechazado. Verifica los datos de tu tarjeta.");
        }

        if (paymentIntent?.status !== "succeeded") {
          throw new Error("El pago no fue completado. Intenta de nuevo.");
        }
      }

      // 3. Guardar la orden en nuestra base de datos
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cardName,
          email,
          phone,
          address,
          paymentMethod,
          total: subtotal,
          items: items.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            weight: item.weight,
          })),
          receiptUrl: paymentMethod === "SPEI" ? receiptUrl : undefined,
        }),
      });

      if (!orderRes.ok) {
        const resData = await orderRes.json();
        throw new Error(resData.error || "No se pudo registrar la orden.");
      }

      const orderData = await orderRes.json();
      setOrderNumber(orderData.orderNumber);
      setStep("success");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al procesar el pago. Intenta de nuevo.");
      setStep("form");
    }
  };

  // Send Order Detail via WhatsApp
  const handleWhatsAppSend = () => {
    const methodLabel = paymentMethod === "TARJETA" ? "Pago con Tarjeta (Stripe - Cobro Real)" : "Transferencia SPEI (Pendiente de validar)";

    const itemsText = items
      .map(
        (item) =>
          `• *${item.quantity}x ${item.title}* (${item.weight >= 1000 ? `${(item.weight / 1000).toFixed(2)} kg` : `${item.weight} g`}) - $${(
            item.price * item.quantity
          ).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN`
      )
      .join("%0A");

    const text =
      `🥩 *CARNICERO %26 GRILL* 🥩%0A` +
      `¡Hola! Acabo de realizar mi pedido en línea y deseo coordinar la entrega.%0A%0A` +
      `📌 *DETALLES DEL PEDIDO:*%0A` +
      `• *Folio de Orden:* ${orderNumber}%0A` +
      `• *Cliente:* ${cardName}%0A` +
      `• *WhatsApp:* ${phone}%0A` +
      `• *Email:* ${email}%0A` +
      `• *Dirección de Entrega:* ${address}%0A` +
      `• *Método de Pago:* ${methodLabel}%0A%0A` +
      `🛒 *PRODUCTOS COMPRADOS:*%0A${itemsText}%0A%0A` +
      `💰 *Monto Total:* *$${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN*%0A%0A` +
      (paymentMethod === "SPEI"
        ? (receiptUrl 
           ? `✅ *Nota:* He realizado el pago por Transferencia SPEI y he adjuntado el comprobante digital en el sistema (${receiptUrl}).`
           : `⚠️ *Nota:* He realizado el pago por Transferencia SPEI. A continuación adjunto captura de mi comprobante de transferencia bancaria.`)
        : `✅ *Nota:* Pago realizado exitosamente con tarjeta Stripe. El cobro ya fue acreditado.`);

    window.open(`https://wa.me/523222018003?text=${text}`, "_blank");
  };

  const handleClose = () => {
    if (step === "success") {
      clearCart();
    }
    setStep("form");
    setCardName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPaymentMethod("TARJETA");
    setReceiptUrl("");
    setError("");
    toggleCheckout(false);
  };

  // Stripe CardElement styling premium
  const cardElementOptions = {
    style: {
      base: {
        fontSize: "14px",
        color: "#171717",
        fontFamily: "system-ui, -apple-system, sans-serif",
        "::placeholder": {
          color: "#a3a3a3",
        },
        iconColor: "#b01e28",
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
    hidePostalCode: true,
  };

  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-neutral-250 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#b01e28]" />
          <h3 className="font-serif text-lg font-semibold text-neutral-900 tracking-wide">
            {step === "success"
              ? "Pedido Confirmado"
              : paymentMethod === "TARJETA"
              ? "Pago Seguro con Tarjeta"
              : "Instrucciones de Pago SPEI"}
          </h3>
        </div>
        {step !== "processing" && (
          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-800 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto max-h-[75vh] text-neutral-900">
        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Method selector tabs */}
            <div className="space-y-1.5">
              <label className="block text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Método de Pago</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("TARJETA");
                    setError("");
                  }}
                  className={`py-2.5 px-3 border text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === "TARJETA"
                      ? "border-[#b01e28] bg-[#b01e28]/5 text-[#b01e28]"
                      : "border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900 hover:border-neutral-300"
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Tarjeta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("SPEI");
                    setError("");
                  }}
                  className={`py-2.5 px-3 border text-[10px] font-bold uppercase tracking-wider rounded-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                    paymentMethod === "SPEI"
                      ? "border-[#b01e28] bg-[#b01e28]/5 text-[#b01e28]"
                      : "border-neutral-200 bg-white text-neutral-500 hover:text-neutral-900 hover:border-neutral-300"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  SPEI / CLABE
                </button>
              </div>
            </div>

            {/* ==================== */}
            {/* STRIPE CARD ELEMENT  */}
            {/* ==================== */}
            {paymentMethod === "TARJETA" && (
              <div className="space-y-2">
                <label className="block text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                  Datos de Tarjeta de Crédito / Débito
                </label>
                <div className="bg-white border border-neutral-200 focus-within:border-[#b01e28] p-4 rounded-sm transition-colors duration-300">
                  <CardElement options={cardElementOptions} />
                </div>
                <p className="text-[9px] text-neutral-500 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  Cobro procesado de forma segura por Stripe. Tus datos nunca se almacenan en nuestros servidores.
                </p>
              </div>
            )}

            {/* SPEI bank details card */}
            {paymentMethod === "SPEI" && (
              <div className="space-y-4">
                <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-sm space-y-3 font-sans">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200/80">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#b01e28]">Datos para Transferencia (SPEI)</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>

                  <div className="grid grid-cols-3 gap-y-2 text-xs">
                    <span className="text-neutral-500 font-bold uppercase text-[9px]">Banco:</span>
                    <span className="col-span-2 text-neutral-850 font-semibold">{bankConfig.banco}</span>

                    <span className="text-neutral-500 font-bold uppercase text-[9px]">Cuenta:</span>
                    <span className="col-span-2 text-neutral-850 font-semibold">{bankConfig.cuenta}</span>

                    <span className="text-neutral-500 font-bold uppercase text-[9px] self-center">CLABE:</span>
                    <div className="col-span-2 flex items-center justify-between text-neutral-850 font-semibold bg-white px-2 py-1 rounded-xs border border-neutral-200 font-mono text-[11px]">
                      <span>{bankConfig.clabe}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(bankConfig.clabe.replace(/\s/g, ""));
                          setCopiedClabe(true);
                          setTimeout(() => setCopiedClabe(false), 2000);
                        }}
                        className="text-[#b01e28] hover:text-[#91181f] ml-2 cursor-pointer border-none bg-transparent"
                      >
                        {copiedClabe ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <span className="text-neutral-500 font-bold uppercase text-[9px]">Beneficiario:</span>
                    <span className="col-span-2 text-neutral-850 font-semibold">{bankConfig.beneficiario}</span>
                  </div>
                  <p className="text-[9px] text-neutral-550 leading-normal uppercase font-semibold">
                    * Realiza la transferencia y luego envía el comprobante por WhatsApp para validar tu pedido.
                  </p>
                </div>

                {/* Receipt Uploader */}
                <div className="p-4 border border-dashed border-neutral-300 rounded-sm bg-neutral-50/50 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">Comprobante de Pago (Opcional)</span>
                    <span className="text-[9px] text-neutral-400 italic">Formatos: JPG, PNG</span>
                  </div>

                  {uploadingReceipt ? (
                    <div className="flex items-center justify-center py-4 gap-2 text-xs text-neutral-500 font-medium">
                      <Loader2 className="w-4 h-4 text-[#b01e28] animate-spin" />
                      Subiendo archivo...
                    </div>
                  ) : receiptUrl ? (
                    <div className="relative flex items-center gap-3 p-2 bg-white border border-neutral-200 rounded-sm">
                      <img
                        src={receiptUrl}
                        alt="Comprobante de Pago"
                        className="w-10 h-10 object-cover rounded-xs border border-neutral-200"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-emerald-650 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          ¡Comprobante Cargado!
                        </p>
                        <p className="text-[9px] text-neutral-400 truncate">El comprobante se adjuntará a tu orden.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReceiptUrl("")}
                        className="p-1 text-neutral-400 hover:text-red-650 hover:bg-neutral-100 rounded-xs transition-colors cursor-pointer border-none bg-transparent"
                        title="Eliminar comprobante"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        id="receipt-file-input"
                        onChange={handleReceiptChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="receipt-file-input"
                        className="flex flex-col items-center justify-center py-4 border border-dashed border-neutral-300 hover:border-[#b01e28] bg-white hover:bg-red-50/5 text-neutral-500 hover:text-[#b01e28] rounded-xs cursor-pointer transition-all gap-1.5"
                      >
                        <Camera className="w-5 h-5 animate-pulse" />
                        <span className="text-xs font-semibold">Subir Foto o Captura de Pantalla</span>
                        <span className="text-[9px] text-neutral-400">Presiona aquí para seleccionar tu comprobante</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Form Inputs */}
            <div className="space-y-4">
              {/* Name field */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1.5">
                  {paymentMethod === "TARJETA" ? "Nombre del Titular" : "Nombre Completo del Cliente"}
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Ej. JHOSMELL MENDOZA"
                  className="w-full bg-white border border-neutral-200 focus:border-[#b01e28] py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-neutral-800 uppercase font-medium"
                />
              </div>

              {/* Contact Info (Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1.5">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-white border border-neutral-200 focus:border-[#b01e28] py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-neutral-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1.5">WhatsApp / Celular</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 322 201 8003"
                    className="w-full bg-white border border-neutral-200 focus:border-[#b01e28] py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-neutral-800 font-mono font-medium"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1.5">Dirección Completa de Entrega</label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, Número, Colonia, Referencias y Municipio de entrega"
                  className="w-full bg-white border border-neutral-200 focus:border-[#b01e28] py-2.5 px-3 text-xs outline-none transition-colors duration-300 rounded-sm text-neutral-800 resize-none font-medium"
                />
              </div>
            </div>

            {/* Error Box */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-650 text-xs rounded-sm font-semibold">
                {error}
              </div>
            )}

            {/* Subtotal Banner */}
            <div className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-sm flex items-center justify-between text-xs font-semibold">
              <span className="text-neutral-500 uppercase tracking-wider">Total del Pedido</span>
              <span className="font-serif text-[#b01e28] font-bold text-sm">
                ${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
              </span>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={paymentMethod === "TARJETA" && !stripe}
              className="w-full py-4 bg-[#b01e28] hover:bg-[#91181f] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-none shadow-md"
            >
              {paymentMethod === "TARJETA" ? `Pagar $${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN` : "Confirmar Pedido SPEI"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* PROCESSING STEP */}
        {step === "processing" && (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-neutral-100 border-t-[#b01e28] animate-spin" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-serif text-lg font-semibold text-neutral-900 tracking-wide">
                {paymentMethod === "TARJETA" ? "Procesando Cobro con Stripe..." : "Registrando Pedido en el Sistema..."}
              </h4>
              <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                Por favor no cierres la ventana. Estamos completando tu solicitud de forma segura.
              </p>
            </div>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-6">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </motion.div>

            <div className="space-y-1.5">
              <h4 className="font-serif text-2xl font-bold text-neutral-900 tracking-wide">
                {paymentMethod === "TARJETA" ? "¡Pago Exitoso!" : "¡Pedido Registrado!"}
              </h4>
              <p className="text-xs text-neutral-500 font-medium">
                Tu orden se ha generado correctamente. Folio de Compra: <strong className="text-[#b01e28] font-mono">{orderNumber}</strong>
              </p>
              {paymentMethod === "TARJETA" && (
                <p className="text-[10px] text-emerald-650 font-bold mt-1">
                  ✓ El cobro de ${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN fue acreditado exitosamente por Stripe.
                </p>
              )}
            </div>

            {/* Receipt Details Box */}
            <div className="w-full bg-neutral-50 border border-neutral-200/80 rounded-sm p-5 text-left text-xs space-y-3 font-light text-neutral-800">
              <h5 className="font-semibold uppercase tracking-wider text-neutral-500 pb-1.5 border-b border-neutral-200/80 text-[9px] flex justify-between">
                <span>Resumen de Pedido</span>
                <span className="text-[#b01e28] font-bold">{paymentMethod === "TARJETA" ? "Tarjeta (Stripe)" : "SPEI"}</span>
              </h5>
              <div className="max-h-[120px] overflow-y-auto space-y-2 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-neutral-700">
                    <span>
                      {item.quantity}x {item.title}
                    </span>
                    <span className="font-semibold text-neutral-900">
                      ${(item.price * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-200/80 pt-2 flex justify-between items-center text-sm font-semibold text-neutral-900">
                <span>Total del Pedido</span>
                <span className="font-serif text-[#b01e28] font-bold">${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN</span>
              </div>
              <div className="text-[10px] text-neutral-500 pt-1 leading-normal border-t border-neutral-200/80 mt-2">
                <strong>Dirección de envío:</strong> {address}
              </div>
            </div>

            {/* Action buttons */}
            <div className="w-full space-y-3 pt-2">
              <button
                onClick={handleWhatsAppSend}
                className="w-full py-3.5 bg-[#25D366] hover:bg-[#1ebd54] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 shadow-md cursor-pointer border-none"
              >
                <MessageSquare className="w-4 h-4" />
                Enviar Comprobante al WhatsApp
              </button>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-white border border-neutral-200 hover:border-[#b01e28] text-neutral-600 hover:text-[#b01e28] text-xs font-semibold tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer"
              >
                Cerrar y Regresar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// =============================
// Componente principal con Stripe Provider
// =============================
export default function CheckoutModal() {
  const { isCheckoutOpen } = useCartStore();

  if (!isCheckoutOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-sans">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        />

        {/* Modal container wrapped in Stripe Elements provider */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-lg bg-white border border-neutral-200 rounded-sm overflow-hidden shadow-2xl z-10 flex flex-col my-8"
        >
          <Elements
            stripe={stripePromise}
            options={{
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#b01e28",
                  colorBackground: "#ffffff",
                  colorText: "#171717",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                },
              },
            }}
          >
            <CheckoutForm />
          </Elements>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
