"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/cartStore";
import { MessageSquare, Plus, Minus, ShoppingCart, Check, Scale } from "lucide-react";

interface ProductProps {
  id: string;
  title: string;
  price: number;
  slug: string;
  type: "CASA" | "TERRENO" | "DEPARTAMENTO" | "PROYECTO";
  weight: number;
  image: string;
  qualityPrices?: Record<string, number>;
}

export default function ProductDetailPageActions({ product }: { product: ProductProps }) {
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  // Weight Source of Truth (Grams)
  const baseWeight = product.weight || 1000;
  const [selectedWeight, setSelectedWeight] = useState(baseWeight);
  const [weightUnit, setWeightUnit] = useState<"g" | "kg">("kg");
  const [customWeightInput, setCustomWeightInput] = useState("");

  // Sync text input with selectedWeight and unit
  useEffect(() => {
    if (weightUnit === "kg") {
      setCustomWeightInput((selectedWeight / 1000).toString());
    } else {
      setCustomWeightInput(selectedWeight.toString());
    }
  }, [selectedWeight, weightUnit]);

  const [showConfirmation, setShowConfirmation] = useState(false);

  // Grill Custom Selections (Zona Grill only)
  const [doneness, setDoneness] = useState("Término Medio");
  const [side1, setSide1] = useState("Papa Asada");
  const [side2, setSide2] = useState("Tortillas de Harina");

  const getWeightText = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)} kg`;
    }
    return `${val} g`;
  };

  // Pricing calculation
  const activePriceForBaseWeight = product.price;

  // Linear calculation: (Selected / Base) * BasePrice
  const unitPrice = Math.round((selectedWeight / baseWeight) * activePriceForBaseWeight);
  const totalPrice = unitPrice * quantity;

  // Format price parts for display
  const formatPriceParts = (value: number) => {
    const formatted = new Intl.NumberFormat("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    const [integer, decimal] = formatted.split(".");
    return { integer, decimal };
  };

  const { integer, decimal } = formatPriceParts(totalPrice);

  // Handlers for weight customization
  const handleInputChange = (text: string) => {
    // Keep decimal numbers for kg, clean non-numeric
    const cleaned = text.replace(/[^0-9.]/g, "");
    setCustomWeightInput(cleaned);

    const num = parseFloat(cleaned);
    if (!isNaN(num) && num > 0) {
      if (weightUnit === "kg") {
        setSelectedWeight(Math.round(num * 1000));
      } else {
        setSelectedWeight(Math.round(num));
      }
    }
  };

  const handleUnitToggle = (unit: "g" | "kg") => {
    setWeightUnit(unit);
  };

  const handleStep = (direction: "up" | "down") => {
    // Step by 100g (0.1 kg)
    const step = 100;
    const change = direction === "up" ? step : -step;
    setSelectedWeight((prev) => Math.max(100, prev + change));
  };

  const applyPreset = (grams: number) => {
    if (grams >= 1000) {
      setWeightUnit("kg");
    } else {
      setWeightUnit("g");
    }
    setSelectedWeight(grams);
  };

  // Cart operations
  const handleAddToCart = () => {
    const formattedWeight = selectedWeight >= 1000
      ? `${(selectedWeight / 1000).toFixed(2)} kg`
      : `${selectedWeight} g`;

    const uniqueId = `${product.id}-${selectedWeight}-default`;
    const optionedTitle = `${product.title} (${formattedWeight})`;

    // Add designated quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: uniqueId,
        title: optionedTitle,
        price: unitPrice,
        image: product.image,
        weight: selectedWeight,
      });
    }

    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  const handleWhatsAppGrillOrder = () => {
    const text = `Hola Carnicero %26 Grill!%0A%0AMe gustaría ordenar una especialidad de la *Zona Grill*:%0A%0A*Producto:* ${product.title}%0A*Término:* ${doneness}%0A*Complemento 1:* ${side1}%0A*Complemento 2:* ${side2}%0A*Precio:* $${product.price} MXN%0A%0A¿Me podrían confirmar el tiempo de preparación para pasar por él o coordinar envío?`;
    window.open(`https://wa.me/523222018003?text=${text}`, "_blank");
  };

  const isGrillItem = product.type === "PROYECTO";

  return (
    <div className="space-y-6 font-sans text-white">
      {isGrillItem ? (
        // GRILL OPTIONS FORM (ZONA GRILL ORDER)
        <div className="space-y-5 bg-[#111111] border border-white/10 rounded-sm p-6 shadow-lg">
          <div className="border-b border-white/5 pb-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-gold-400 uppercase">
              Personaliza tu Orden Grill
            </h4>
            <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wide">
              Las especialidades grill se preparan al momento y se coordinan vía WhatsApp.
            </p>
          </div>

          {/* Doneness */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
              Término del Corte
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {["Término Medio", "Tres Cuartos", "Bien Cocido", "Término Azul"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDoneness(opt)}
                  className={`py-2 px-3 text-left border rounded-sm transition-all duration-300 cursor-pointer ${
                    doneness === opt
                      ? "border-gold-400 bg-gold-400/10 text-gold-400"
                      : "border-white/5 bg-black/30 text-neutral-300 hover:border-white/10"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Side 1 */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
              Elige Complemento Uno
            </label>
            <select
              value={side1}
              onChange={(e) => setSide1(e.target.value)}
              className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none text-neutral-200 rounded-sm cursor-pointer"
            >
              <option value="Papa Asada">Papa Asada al Carbón</option>
              <option value="Queso Fundido">Queso Fundido con Chorizo</option>
              <option value="Guacamole">Guacamole Premium con Totopos</option>
              <option value="Elote Asado">Elote Amarillo Asado</option>
            </select>
          </div>

          {/* Side 2 */}
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
              Elige Complemento Dos
            </label>
            <select
              value={side2}
              onChange={(e) => setSide2(e.target.value)}
              className="w-full bg-black/40 border border-white/10 focus:border-gold-400 py-2.5 px-3 text-xs outline-none text-neutral-200 rounded-sm cursor-pointer"
            >
              <option value="Tortillas de Harina">Tortillas de Harina Sonorenses</option>
              <option value="Cebollitas Asadas">Cebollitas Cambray Asadas</option>
              <option value="Chiles Toreados">Chiles Toreados con Cebolla</option>
              <option value="Frijoles Charros">Frijoles Charros Especiales</option>
            </select>
          </div>

          {/* Grill WhatsApp Button */}
          <button
            onClick={handleWhatsAppGrillOrder}
            className="w-full py-4 bg-[#25D366] hover:bg-[#1ebd54] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm flex items-center justify-center gap-2 mt-4 shadow-lg hover:shadow-[#25D366]/20 cursor-pointer border-none animate-pulse"
          >
            <MessageSquare className="w-4 h-4" />
            Pedir por WhatsApp
          </button>
        </div>
      ) : (
        // PREMIUM CUSTOM WEIGHT & QUALITY SELECTORS
        <div className="space-y-6 bg-[#111111] border border-white/10 rounded-sm p-6 shadow-lg">
          {/* Custom Weight Controls */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-gold-400" />
                Cantidad / Peso Personalizado
              </label>

              {/* Unit Toggle Switch */}
              <div className="flex items-center border border-white/10 bg-black/40 p-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => handleUnitToggle("g")}
                  className={`px-2 py-1 rounded-xs transition-all cursor-pointer ${
                    weightUnit === "g"
                      ? "bg-gold-400 text-obsidian font-bold"
                      : "text-neutral-500 hover:text-white"
                  }`}
                >
                  Gramos (g)
                </button>
                <button
                  type="button"
                  onClick={() => handleUnitToggle("kg")}
                  className={`px-2 py-1 rounded-xs transition-all cursor-pointer ${
                    weightUnit === "kg"
                      ? "bg-gold-400 text-obsidian font-bold"
                      : "text-neutral-500 hover:text-white"
                  }`}
                >
                  Kilos (kg)
                </button>
              </div>
            </div>

            {/* Weight Input Box + Stepper */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleStep("down")}
                className="p-3 bg-black/40 hover:bg-neutral-800 border border-white/10 hover:border-white/20 transition-all rounded-sm flex items-center justify-center text-neutral-400 hover:text-gold-400 cursor-pointer h-10 w-10 text-lg font-bold"
              >
                -
              </button>

              <div className="relative flex-1">
                <input
                  type="text"
                  value={customWeightInput}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 focus:border-gold-400 h-10 px-3 text-sm text-center font-bold font-mono text-gold-400 outline-none transition-colors rounded-sm"
                />
                <span className="absolute right-3.5 top-2.5 text-[10px] font-mono text-neutral-500 uppercase tracking-widest pointer-events-none select-none">
                  {weightUnit}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleStep("up")}
                className="p-3 bg-black/40 hover:bg-neutral-800 border border-white/10 hover:border-white/20 transition-all rounded-sm flex items-center justify-center text-neutral-400 hover:text-gold-400 cursor-pointer h-10 w-10 text-lg font-bold"
              >
                +
              </button>
            </div>

            {/* Quick Weight Presets */}
            <div className="grid grid-cols-5 gap-1 pt-1 text-[9px] font-semibold uppercase tracking-wider text-center">
              {[250, 500, 1000, 1500, 2000].map((val) => {
                const isActive = selectedWeight === val;
                const label = val >= 1000 ? `${(val / 1000).toFixed(val % 1000 !== 0 ? 1 : 0)} kg` : `${val}g`;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => applyPreset(val)}
                    className={`py-1.5 border rounded-xs transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "border-gold-400 bg-gold-400/10 text-gold-400 font-bold"
                        : "border-white/5 bg-black/25 text-neutral-400 hover:text-white hover:border-white/10"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>



          {/* Price Calculation Display */}
          <div className="pt-4 border-t border-white/5 flex flex-col justify-between gap-1.5">
            <div className="flex items-center justify-between text-neutral-500 text-[9px] uppercase tracking-widest">
              <span>Cálculo Proporcional ({getWeightText(selectedWeight)})</span>
              <span>Ref: {getWeightText(baseWeight)}</span>
            </div>
            
            <div className="flex items-baseline text-white">
              <span className="text-xl font-light mr-1 text-gold-400">$</span>
              <span className="font-serif text-5xl font-bold tracking-tight">{integer}</span>
              <span className="text-xl font-bold text-gold-400">.{decimal}</span>
              <span className="text-xs font-sans font-normal text-neutral-400 ml-2">MXN</span>
            </div>
            
            <p className="text-[10px] text-neutral-500 mt-1 uppercase tracking-wide">
              Los <span className="underline cursor-pointer hover:text-white">gastos de envío</span> se calculan en la pantalla de pago.
            </p>
          </div>

          {/* Quantity Selector & Add button */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-neutral-400 tracking-widest">Unidades</span>
              
              {/* Counter */}
              <div className="flex items-center border border-white/10 bg-black/20 rounded-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-neutral-400 hover:text-gold-400 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-5 text-sm font-bold w-12 text-center select-none text-gold-400 font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-neutral-400 hover:text-gold-400 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Red Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-xs font-bold tracking-widest uppercase transition-all duration-350 rounded-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer border-none ${
                showConfirmation
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-[#b01e28] hover:bg-[#91181f] text-white hover:shadow-[#b01e28]/20"
              }`}
            >
              {showConfirmation ? (
                <>
                  <Check className="w-4 h-4 animate-bounce" />
                  ¡Agregado al Carrito!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Agregar al Carrito
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
