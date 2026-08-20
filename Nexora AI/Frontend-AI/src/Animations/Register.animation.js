import gsap from "gsap";

export const registerAnimation = (containerRef) => {
  const ctx = gsap.context(() => {
    // =========================
    // PAGE ENTRANCE
    // =========================

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    tl.from(".register-shell", {
      opacity: 0,
      scale: 0.97,
      y: 20,
      duration: 0.8,
    })
      .from(
        ".register-brand",
        {
          opacity: 0,
          x: -30,
          duration: 0.7,
        },
        "-=0.5"
      )
      .from(
        ".register-orbit",
        {
          opacity: 0,
          scale: 0.65,
          duration: 1.1,
          ease: "back.out(1.4)",
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
        "-=0.55"
      )
      .from(
        ".register-form-content > *",
        {
          opacity: 0,
          y: 22,
          stagger: 0.08,
          duration: 0.55,
        },
        "-=0.45"
      );

    // =========================
    // ORBIT ROTATION
    // =========================

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

    // =========================
    // DOT PULSE
    // =========================

    gsap.to(".register-dot", {
      scale: 1.35,
      opacity: 0.65,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      stagger: 0.25,
      ease: "sine.inOut",
    });

    // =========================
    // CORE GLOW
    // =========================

    gsap.to(".register-core-glow", {
      scale: 1.2,
      opacity: 0.65,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // =========================
    // CORE PULSE RING
    // =========================

    gsap.to(".register-core-pulse", {
      scale: 1.12,
      opacity: 0.45,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // =========================
    // AMBIENT GLOW
    // =========================

    gsap.to(".register-ambient", {
      scale: 1.08,
      opacity: 0.7,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // =========================
    // CORE LIGHT
    // =========================

    gsap.to(".register-core-light", {
      scale: 1.5,
      opacity: 0.75,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, containerRef);

  return () => ctx.revert();
};