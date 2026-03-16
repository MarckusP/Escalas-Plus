import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900">
      <h1 className="text-4xl font-bold text-white mb-2">404</h1>
      <p className="text-white/70 mb-6">Página não encontrada.</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
