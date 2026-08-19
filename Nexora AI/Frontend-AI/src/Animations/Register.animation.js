import gsap from "gsap";

export const registerAnimation = (containerRef) => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // Initial states
    gsap.set(
      [
        ".register-wrapper",
        ".register-brand",
        ".register-orb",
        ".register-visual-text",
        ".register-card",
        ".register-title",
        ".register-field",
        ".register-button",
        ".register-footer",
      ],
      {
        opacity: 0,
      }
    );

    gsap.set(".register-wrapper", {
      y: 35,
      scale: 0.97,
    });

    gsap.set(".register-brand", {
      y: -20,
    });

    gsap.set(".register-orb", {
      scale: 0.65,
      y: 25,
    });

    gsap.set(".register-visual-text", {
      y: 25,
    });

    gsap.set(".register-card", {
      x: 35,
    });

    gsap.set(".register-title", {
      y: 25,
    });

    gsap.set(".register-field", {
      y: 20,
    });

    gsap.set(".register-button", {
      y: 15,
      scale: 0.97,
    });

    gsap.set(".register-footer", {
      y: 10,
    });

    // Main wrapper
    tl.to(".register-wrapper", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
    })

      // Brand
      .to(
        ".register-brand",
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.55"
      )

      // AI Core
      .to(
        ".register-orb",
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "back.out(1.5)",
        },
        "-=0.45"
      )

      // Register card
      .to(
        ".register-card",
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
        },
        "-=0.65"
      )

      // Heading
      .to(
        ".register-title",
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.35"
      )

      // Form fields
      .to(
        ".register-field",
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.12,
        },
        "-=0.3"
      )

      // Button
      .to(
        ".register-button",
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.55,
          ease: "back.out(1.4)",
        },
        "-=0.15"
      )

      // Footer
      .to(
        ".register-footer",
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        },
        "-=0.25"
      )

      // Left visual text
      .to(
        ".register-visual-text",
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
        },
        "-=0.45"
      );

    // AI Core floating animation
    gsap.to(".register-orb", {
      y: -8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    });

    // Decorative rings rotation
    gsap.to(".register-visual .absolute.rounded-full.border", {
      rotation: 360,
      duration: 18,
      repeat: -1,
      ease: "none",
    });

    // Background glow breathing
    gsap.to(".register-visual > .absolute", {
      scale: 1.12,
      opacity: 0.7,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    });

  }, containerRef);

  return () => ctx.revert();
};