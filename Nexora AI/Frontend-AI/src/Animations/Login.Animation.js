import gsap from "gsap";

export const loginAnimation = (containerRef) => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // Initial states
    gsap.set(
      [
        ".login-wrapper",
        ".login-brand",
        ".login-orb",
        ".login-visual-text",
        ".login-card",
        ".login-title",
        ".login-field",
        ".login-button",
        ".login-footer",
      ],
      {
        opacity: 0,
      }
    );

    gsap.set(".login-wrapper", {
      y: 35,
      scale: 0.97,
    });

    gsap.set(".login-brand", {
      y: -20,
    });

    gsap.set(".login-orb", {
      scale: 0.65,
      y: 25,
    });

    gsap.set(".login-visual-text", {
      y: 25,
    });

    gsap.set(".login-card", {
      x: 35,
    });

    gsap.set(".login-title", {
      y: 25,
    });

    gsap.set(".login-field", {
      y: 20,
    });

    gsap.set(".login-button", {
      y: 15,
      scale: 0.97,
    });

    gsap.set(".login-footer", {
      y: 10,
    });

    // Main wrapper
    tl.to(".login-wrapper", {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.9,
    })

      // Left brand
      .to(
        ".login-brand",
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.55"
      )

      // AI Core
      .to(
        ".login-orb",
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "back.out(1.5)",
        },
        "-=0.45"
      )

      // Right card
      .to(
        ".login-card",
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
        },
        "-=0.65"
      )

      // Heading
      .to(
        ".login-title",
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        "-=0.35"
      )

      // Inputs
      .to(
        ".login-field",
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
        ".login-button",
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
        ".login-footer",
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
        },
        "-=0.25"
      )

      // Left visual text
      .to(
        ".login-visual-text",
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
        },
        "-=0.45"
      );

    // AI core continuous floating animation
    gsap.to(".login-orb", {
      y: -8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    });

    // Decorative rings rotation
    gsap.to(".login-visual .absolute.rounded-full.border", {
      rotation: 360,
      duration: 18,
      repeat: -1,
      ease: "none",
    });

    // Cyan glow breathing effect
    gsap.to(".login-visual > .absolute", {
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