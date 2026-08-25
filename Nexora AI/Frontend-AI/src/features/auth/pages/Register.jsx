import React, { useLayoutEffect, useState } from "react";
import { Link } from "react-router";
import gsap from "gsap";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from(".register-shell", {
        opacity: 0,
        scale: 0.97,
        duration: 0.8,
      })
        .from(
          ".register-brand",
          {
            opacity: 0,
            x: -35,
            duration: 0.7,
          },
          "-=0.5"
        )
        .from(
          ".register-orbit",
          {
            opacity: 0,
            scale: 0.65,
            duration: 1,
            ease: "back.out(1.5)",
          },
          "-=0.5"
        )
        .from(
          ".register-copy > *",
          {
            opacity: 0,
            y: 25,
            stagger: 0.1,
            duration: 0.65,
          },
          "-=0.45"
        )
        .from(
          ".register-form-content > *",
          {
            opacity: 0,
            y: 22,
            stagger: 0.08,
            duration: 0.55,
          },
          "-=0.4"
        );

      gsap.to(".register-orbit-one", {
        rotation: 360,
        duration: 18,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".register-orbit-two", {
        rotation: -360,
        duration: 25,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".register-orbit-three", {
        rotation: 360,
        duration: 34,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".register-core-glow", {
        scale: 1.18,
        opacity: 0.65,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".register-core-pulse", {
        scale: 1.12,
        opacity: 0.55,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".register-dot", {
        y: -15,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        stagger: 0.35,
        ease: "sine.inOut",
      });

      gsap.to(".register-ambient", {
        opacity: 0.75,
        scale: 1.08,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  const submitForm = (event) => {
    event.preventDefault();

    const payload = {
      username,
      email,
      password,
    };

    console.log("Register payload:", payload);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#030712] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(0,190,220,0.08),transparent_32%),radial-gradient(circle_at_85%_50%,rgba(0,110,255,0.06),transparent_30%)]" />

        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(49,184,198,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(49,184,198,.12) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />
      </div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-6 sm:px-8">
        <div className="register-shell relative grid min-h-[720px] w-full max-w-[1240px] overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#080d18]/90 shadow-[0_30px_100px_rgba(0,0,0,.55)] backdrop-blur-xl lg:grid-cols-2">

          {/* LEFT */}
          <section className="relative hidden overflow-hidden border-r border-white/[0.07] lg:block">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(0,196,224,.11),transparent_35%)]" />

            {/* Brand */}
            <div className="register-brand absolute left-10 top-9 z-20 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/[0.08] text-2xl font-bold text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,.12)]">
                N
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  Nexora<span className="text-cyan-400">AI</span>
                </h2>

                <p className="mt-0.5 text-[11px] uppercase tracking-[0.28em] text-slate-500">
                  Intelligent Workspace
                </p>
              </div>
            </div>

            {/* AI ORBIT */}
            <div className="absolute left-1/2 top-[42%] h-[410px] w-[410px] -translate-x-1/2 -translate-y-1/2">
              <div className="register-ambient absolute inset-[15%] rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="register-orbit absolute inset-0">
                <div className="register-orbit-one absolute inset-[9%] rounded-full border border-cyan-400/20">
                  <span className="register-dot absolute -right-1 top-[16%] h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_#22d3ee]" />
                </div>

                <div className="register-orbit-two absolute inset-[22%] rounded-full border border-cyan-400/[0.14]">
                  <span className="register-dot absolute -left-1 top-[38%] h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_15px_#60a5fa]" />
                </div>

                <div className="register-orbit-three absolute inset-[35%] rounded-full border border-cyan-400/[0.12]">
                  <span className="register-dot absolute right-[5%] bottom-[15%] h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_12px_#67e8f9]" />
                </div>
              </div>

              {/* Core */}
              <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2">
                <div className="register-core-glow absolute -inset-7 rounded-full bg-cyan-400/10 blur-2xl" />

                <div className="register-core-pulse absolute -inset-2 rounded-full border border-cyan-300/20" />

                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-cyan-300/25 bg-[#06111f] shadow-[0_0_45px_rgba(34,211,238,.12)]">
                  <div className="absolute h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_#22d3ee]" />

                  <span className="mt-12 text-[12px] font-semibold tracking-wide text-cyan-200">
                    AI CORE
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom copy */}
            <div className="register-copy absolute bottom-12 left-10 right-12">
              <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.35em] text-cyan-400">
              </p>

              <h1 className="max-w-[520px] text-5xl font-bold leading-[1.05] tracking-[-0.04em]">
                Build your future
                <br />
                with <span className="text-cyan-400">Nexora AI.</span>
              </h1>

              <p className="mt-6 max-w-[500px] text-[15px] leading-7 text-slate-500">
                Create your account and step into an intelligent workspace
                designed to make your ideas faster, smarter and better.
              </p>
            </div>
          </section>

          {/* RIGHT */}
          <section className="relative flex min-h-[720px] items-center justify-center px-7 py-12 sm:px-12 lg:px-16">
            <div className="register-form-content w-full max-w-[500px]">

              <div className="mb-8">
                <p className="mb-4 text-[12px] font-semibold uppercase tracking-[0.35em] text-cyan-400">
                  Create Account
                </p>

                <h1 className="text-4xl font-bold tracking-[-0.035em] sm:text-5xl">
                  Welcome to Nexora
                </h1>

                <p className="mt-4 text-[15px] leading-6 text-slate-500">
                  Create your account and start exploring the power of AI.
                </p>
              </div>

              <form onSubmit={submitForm} className="space-y-5">

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="mb-3 block text-[12px] font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Enter your username"
                    required
                    className="h-14 w-full rounded-xl border border-white/[0.08] bg-[#050912] px-5 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-700 hover:border-cyan-400/20 focus:border-cyan-400/60 focus:bg-[#07101c] focus:shadow-[0_0_0_4px_rgba(34,211,238,.07),0_0_30px_rgba(34,211,238,.05)]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-3 block text-[12px] font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-14 w-full rounded-xl border border-white/[0.08] bg-[#050912] px-5 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-700 hover:border-cyan-400/20 focus:border-cyan-400/60 focus:bg-[#07101c] focus:shadow-[0_0_0_4px_rgba(34,211,238,.07),0_0_30px_rgba(34,211,238,.05)]"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-3 block text-[12px] font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Create a strong password"
                    required
                    className="h-14 w-full rounded-xl border border-white/[0.08] bg-[#050912] px-5 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-700 hover:border-cyan-400/20 focus:border-cyan-400/60 focus:bg-[#07101c] focus:shadow-[0_0_0_4px_rgba(34,211,238,.07),0_0_30px_rgba(34,211,238,.05)]"
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="group relative mt-2 h-14 w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-sm font-bold text-white shadow-[0_10px_35px_rgba(0,140,255,.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_15px_40px_rgba(0,170,255,.28)]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />

                  <span className="relative">Create Account</span>
                </button>
              </form>

              {/* Login */}
              <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-cyan-400 transition hover:text-cyan-300"
                >
                  Sign in
                </Link>
              </p>

              {/* Footer */}
              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.7)]" />
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