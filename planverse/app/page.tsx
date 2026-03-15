import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-white font-bold text-xl tracking-tight">
              planverse
            </span>
          </div>
          <Link
            href="/studio"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Open Studio →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/50 border border-purple-700 text-purple-300 text-sm mb-8">
          <span>✨</span>
          <span>Powered by Claude Vision AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Design your
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {" "}perfect{" "}
          </span>
          space
        </h1>

        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
          Drag and drop furniture, experiment with interior styles, and get
          instant AI-powered design feedback. Interior planning made simple.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/studio"
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors text-lg shadow-lg shadow-purple-900/50"
          >
            Start Designing Free →
          </Link>
          <button className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors text-lg border border-slate-600">
            Watch Demo
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              emoji: "🛋️",
              title: "Drag & Drop Canvas",
              description:
                "Place furniture with precision using our intuitive canvas editor. Rotate, resize, and position items exactly where you want them.",
            },
            {
              emoji: "🤖",
              title: "Claude AI Analysis",
              description:
                "Get instant feedback from Claude Vision. Receive suggestions on space utilization, flow, and style consistency.",
            },
            {
              emoji: "🎨",
              title: "6 Interior Styles",
              description:
                "Choose from Modern, Scandinavian, Industrial, Bohemian, Minimalist, or Japandi to match your vision.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <div className="text-4xl mb-4">{feature.emoji}</div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-center">
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-12 border border-purple-700">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to design your dream space?
          </h2>
          <p className="text-purple-300 mb-8 text-lg">
            No account required. Start designing in seconds.
          </p>
          <Link
            href="/studio"
            className="inline-block px-10 py-4 bg-white text-purple-900 font-bold rounded-xl hover:bg-purple-50 transition-colors text-lg"
          >
            Launch Studio →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 px-6 py-8 text-center text-slate-500 text-sm">
        <p>© 2024 Planverse · Interior Layout Planning SaaS</p>
      </footer>
    </main>
  );
}
