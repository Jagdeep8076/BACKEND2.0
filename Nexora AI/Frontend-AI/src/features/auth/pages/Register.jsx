import { useEffect, useRef, useState } from "react";
import { registerAnimation } from "../../../Animations/Register.animation";

const Register = () => {
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const cleanup = registerAnimation(containerRef);

    return cleanup;
  }, []);

  // Two-way binding
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Register Data:", formData);
  };

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#030712] px-4 py-8 text-white"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/15 blur-[120px]" />

      {/* Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "45px 45px",
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="register-wrapper grid w-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.025] shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:grid-cols-2">

          {/* ================= LEFT SIDE ================= */}
          <section className="register-visual relative hidden min-h-[650px] overflow-hidden border-r border-white/[0.07] lg:flex">
            
            {/* Glow Orb */}
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[90px]" />

            {/* Decorative Rings */}
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10" />
            <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-400/10" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

            <div className="relative z-10 flex w-full flex-col justify-between p-10">
              
              {/* Logo */}
              <div className="register-brand flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
                  <span className="text-lg font-bold text-cyan-300">
                    N
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-semibold tracking-wide">
                    Nexora<span className="text-cyan-400">AI</span>
                  </h2>

                  <p className="text-[11px] uppercase tracking-[0.25em] text-gray-500">
                    Intelligent Workspace
                  </p>
                </div>
              </div>

              {/* AI Visual */}
              <div className="register-orb relative flex flex-1 items-center justify-center">
                <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-cyan-300/20 bg-gradient-to-br from-cyan-400/10 via-blue-500/10 to-transparent shadow-[0_0_80px_rgba(34,211,238,0.12)]">

                  <div className="absolute inset-4 rounded-full border border-blue-400/10" />

                  <div className="flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/20 bg-[#07111f]/90 shadow-[0_0_45px_rgba(34,211,238,0.18)]">
                    <div className="text-center">
                      <div className="mx-auto mb-2 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.9)]" />
                      <span className="text-xs font-semibold tracking-wider text-cyan-200">
                        AI
                      </span>
                    </div>
                  </div>

                  {/* Floating dots */}
                  <span className="absolute -right-5 top-8 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_15px_rgba(103,232,249,0.8)]" />
                  <span className="absolute -left-4 bottom-14 h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
                  <span className="absolute bottom-0 right-8 h-1 w-1 rounded-full bg-cyan-200" />
                </div>
              </div>

              {/* Bottom Text */}
              <div className="register-visual-text max-w-md">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-cyan-400">
                  Next Generation AI
                </p>

                <h1 className="text-4xl font-bold leading-tight">
                  Build your future
                  <br />
                  with <span className="text-cyan-400">Nexora AI.</span>
                </h1>

                <p className="mt-5 max-w-sm text-sm leading-6 text-gray-500">
                  Create your account and step into an intelligent workspace
                  designed to make your ideas faster, smarter and better.
                </p>
              </div>
            </div>
          </section>

          {/* ================= RIGHT SIDE ================= */}
          <section className="register-card flex min-h-[650px] items-center justify-center p-6 sm:p-10 lg:p-14">
            <div className="w-full max-w-md">

              {/* Mobile Brand */}
              <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-400/10">
                  <span className="font-bold text-cyan-300">N</span>
                </div>

                <h2 className="text-xl font-semibold">
                  Nexora<span className="text-cyan-400">AI</span>
                </h2>
              </div>

              {/* Title */}
              <div className="register-title mb-9">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-cyan-400">
                  Create Account
                </p>

                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Welcome to Nexora
                </h1>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Create your account and start exploring the power of AI.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Username */}
                <div className="register-field">
                  <label
                    htmlFor="username"
                    className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400"
                  >
                    Username
                  </label>

                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                      autoComplete="username"
                      className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 hover:border-white/[0.14] focus:border-cyan-400/50 focus:bg-cyan-400/[0.025] focus:shadow-[0_0_25px_rgba(34,211,238,0.08)]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="register-field">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400"
                  >
                    Email Address
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 hover:border-white/[0.14] focus:border-cyan-400/50 focus:bg-cyan-400/[0.025] focus:shadow-[0_0_25px_rgba(34,211,238,0.08)]"
                  />
                </div>

                {/* Password */}
                <div className="register-field">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-400"
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 placeholder:text-gray-700 hover:border-white/[0.14] focus:border-cyan-400/50 focus:bg-cyan-400/[0.025] focus:shadow-[0_0_25px_rgba(34,211,238,0.08)]"
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="register-button group relative mt-3 w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(34,211,238,0.12)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(34,211,238,0.22)] active:scale-[0.98]"
                >
                  <span className="relative z-10">
                    Create Account
                  </span>

                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </button>
              </form>

              {/* Footer */}
              <p className="register-footer mt-8 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-cyan-400 transition-colors hover:text-cyan-300"
                >
                  Sign in
                </a>
              </p>

              {/* Bottom Security Text */}
              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-gray-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
                Secure AI Workspace
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Register;