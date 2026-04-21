"use client";

import { useState, useEffect } from "react";
import { searchProducts } from "@/app/actions/products";
import { createTransactionAction } from "@/app/actions/transaction";
import { Button } from "@/components/ui/Button";
import {
  ShoppingCart,
  Search,
  Plus,
  Trash2,
  Package,
  CircleDollarSign,
  X,
} from "lucide-react";

export default function NewTransactionPage() {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCartMobile, setShowCartMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        const data = await searchProducts(query);
        setResults(data);
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // NAVIGASI PALING AMAN: Gunakan replace agar history tidak menumpuk
  const closePage = () => {
    window.location.replace("/transactions");
  };

  if (!mounted) return null;

  const addToCart = (product: any, unit: any) => {
    const cartId = `${product.id}-${unit.id}`;
    const existingItem = cart.find((item) => item.cartId === cartId);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.cartId === cartId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          cartId,
          productId: product.id,
          name: product.name,
          unitName: unit.name,
          unitId: unit.id,
          price: unit.price,
          buyPrice: unit.buyPrice || 0,
          conversion: unit.conversion,
          quantity: 1,
        },
      ]);
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const changeAmount = payAmount > 0 ? payAmount - totalAmount : 0;

  const handleFinishTransaction = async () => {
    if (cart.length === 0) return;
    setIsLoading(true);
    try {
      const result = await createTransactionAction({
        customerName: "Umum",
        totalAmount,
        payAmount,
        changeAmount,
        items: cart.map((item) => ({
          productId: item.productId,
          unitName: item.unitName,
          quantity: item.quantity,
          priceAtTime: item.price,
          buyPriceAtTime: item.buyPrice,
          subtotal: item.price * item.quantity,
        })),
      });
      if (result.success) {
        closePage();
      } else {
        alert("Gagal!");
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    // CONTAINER UTAMA: Fixed, Flex Center
    <div
      className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 md:pl-72"
      suppressHydrationWarning
    >
      {/* BOX KASIR: Di HP akan kecil/pas di tengah, di laptop akan lebar */}
      <div className="w-full h-full md:h-[90vh] max-w-6xl bg-slate-50 md:rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header Kecil */}
        <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closePage}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
            >
              <X size={20} />
            </button>
            <h1 className="font-bold text-slate-800 text-sm md:text-base">
              Kasir SalhaShop
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCartMobile(!showCartMobile)}
              className="md:hidden p-2 bg-blue-50 text-blue-600 rounded-lg relative"
            >
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
            <div className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold text-xs">
              Rp {totalAmount.toLocaleString()}
            </div>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden relative">
          {/* Main Area */}
          <main className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Cari produk..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm"
                  >
                    <h3 className="font-bold text-slate-800 text-xs mb-2 truncate">
                      {product.name}
                    </h3>
                    <div className="space-y-1.5">
                      {product.units.map((unit: any) => (
                        <button
                          key={unit.id}
                          type="button"
                          onClick={() => addToCart(product, unit)}
                          className="w-full flex justify-between items-center p-2 rounded-lg bg-slate-50 hover:bg-blue-600 hover:text-white transition-all text-[11px] border border-slate-100"
                        >
                          <span>{unit.name}</span>
                          <span className="font-bold">
                            Rp {unit.price.toLocaleString()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Aside Keranjang: Di Mobile jadi slide-over */}
          <aside
            className={`
            absolute md:relative inset-y-0 right-0 w-full md:w-80 bg-white border-l shadow-xl flex flex-col z-20 transition-transform duration-300
            ${showCartMobile ? "translate-x-0" : "translate-x-full md:translate-x-0"}
          `}
          >
            <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
              <span className="font-bold text-xs flex items-center gap-2">
                <ShoppingCart size={16} /> Keranjang
              </span>
              <button
                onClick={() => setShowCartMobile(false)}
                className="md:hidden p-1 text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100"
                >
                  <div className="max-w-[150px]">
                    <p className="text-[11px] font-bold text-slate-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {item.quantity} {item.unitName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold">
                      {(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      onClick={() =>
                        setCart(cart.filter((c) => c.cartId !== item.cartId))
                      }
                      className="text-slate-300 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-900 text-white space-y-3">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">UANG TUNAI</span>
                <input
                  type="number"
                  className="bg-transparent text-right font-bold outline-none text-blue-400 w-1/2 text-sm"
                  value={payAmount || ""}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="flex justify-between items-center text-[11px] border-t border-white/10 pt-2">
                <span className="text-slate-400 font-bold">KEMBALIAN</span>
                <span
                  className={`font-bold text-sm ${changeAmount < 0 ? "text-red-500" : "text-green-400"}`}
                >
                  Rp {changeAmount.toLocaleString()}
                </span>
              </div>
              <Button
                className="w-full py-5 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700"
                onClick={handleFinishTransaction}
                disabled={
                  isLoading || cart.length === 0 || payAmount < totalAmount
                }
                isLoading={isLoading}
              >
                SIMPAN (RP {totalAmount.toLocaleString()})
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
