import Link from "next/link"
import { Gamepad2 } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-violet-500"
            >
              <Gamepad2 className="h-6 w-6" />
              LapakRo
            </Link>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Marketplace produk Roblox terpercaya di Indonesia. Belanja aman
              dengan sistem escrow.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Navigasi
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-slate-500 hover:text-violet-500 dark:text-slate-400"
                >
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=robux"
                  className="text-sm text-slate-500 hover:text-violet-500 dark:text-slate-400"
                >
                  Robux
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=gamepass"
                  className="text-sm text-slate-500 hover:text-violet-500 dark:text-slate-400"
                >
                  Game Pass
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=avatar"
                  className="text-sm text-slate-500 hover:text-violet-500 dark:text-slate-400"
                >
                  Item Avatar
                </Link>
              </li>
              <li>
                <Link
                  href="/seller/dashboard"
                  className="text-sm text-slate-500 hover:text-violet-500 dark:text-slate-400"
                >
                  Jual di LapakRo
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Bantuan
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-500 hover:text-violet-500 dark:text-slate-400"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-500 hover:text-violet-500 dark:text-slate-400"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-500 hover:text-violet-500 dark:text-slate-400"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-slate-500 hover:text-violet-500 dark:text-slate-400"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Metode Pembayaran
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {["BCA", "BNI", "Mandiri", "BRI", "GoPay", "OVO", "DANA", "LinkAja"].map(
                (method) => (
                  <span
                    key={method}
                    className="inline-flex items-center rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {method}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
          <p className="text-center text-xs text-slate-400">
            &copy; {new Date().getFullYear()} LapakRo. Hak cipta
            dilindungi. Tidak terafiliasi dengan Roblox Corporation.
          </p>
        </div>
      </div>
    </footer>
  )
}
