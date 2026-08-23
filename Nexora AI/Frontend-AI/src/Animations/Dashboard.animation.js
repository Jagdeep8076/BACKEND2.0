import gsap from "gsap";

export const dashboardAnimation = (containerRef) => {
  const ctx = gsap.context(() => {
    // =========================================================
    // MAIN TIMELINE
    // =========================================================

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    // =========================================================
    // INITIAL STATES
    // =========================================================

    gsap.set(".dashboard-sidebar", {
      x: -40,
      opacity: 0,
    });

    gsap.set(".dashboard-topbar", {
      y: -20,
      opacity: 0,
    });

    gsap.set(".dashboard-greeting", {
      y: 25,
      opacity: 0,
    });

    gsap.set(".dashboard-core", {
      scale: 0.65,
      opacity: 0,
    });

    gsap.set(".dashboard-action", {
      y: 25,
      opacity: 0,
    });

    gsap.set(".dashboard-chatbox", {
      y: 25,
      opacity: 0,
    });

    gsap.set(".dashboard-disclaimer", {
      opacity: 0,
    });

    // Orbit initial state
    gsap.set(
      [
        ".dashboard-ring-one",
        ".dashboard-ring-two",
        ".dashboard-ring-three",
      ],
      {
        opacity: 0,
        scale: 0.8,
      }
    );

    // Orbit dots
    gsap.set(".dashboard-orbit-dot", {
      opacity: 0,
      scale: 0,
    });

    // Particles
    gsap.set(".dashboard-particle", {
      opacity: 0,
    });

    // =========================================================
    // PAGE ENTRANCE
    // =========================================================

    tl.to(".dashboard-sidebar", {
      x: 0,
      opacity: 1,
      duration: 0.7,
    })

      // Topbar
      .to(
        ".dashboard-topbar",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
        },
        "-=0.45"
      )

      // Greeting
      .to(
        ".dashboard-greeting",
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
        },
        "-=0.35"
      )

      // AI Core
      .to(
        ".dashboard-core",
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "back.out(1.5)",
        },
        "-=0.35"
      )

      // Orbit rings appear
      .to(
        [
          ".dashboard-ring-one",
          ".dashboard-ring-two",
          ".dashboard-ring-three",
        ],
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "back.out(1.4)",
        },
        "-=0.65"
      )

      // Orbit dots appear
      .to(
        ".dashboard-orbit-dot",
        {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.08,
          ease: "back.out(1.8)",
        },
        "-=0.5"
      )

      // Particles
      .to(
        ".dashboard-particle",
        {
          opacity: 1,
          duration: 0.4,
          stagger: 0.08,
        },
        "-=0.35"
      )

      // Action cards
      .to(
        ".dashboard-action",
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
        },
        "-=0.35"
      )

      // Chatbox
      .to(
        ".dashboard-chatbox",
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
        },
        "-=0.25"
      )

      // Disclaimer
      .to(
        ".dashboard-disclaimer",
        {
          opacity: 1,
          duration: 0.4,
        },
        "-=0.25"
      );

    // =========================================================
    // AI CORE FLOAT
    // =========================================================

    gsap.to(".dashboard-core", {
      y: -8,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    });

    // =========================================================
    // CORE GLOW PULSE
    // =========================================================

    gsap.to(".dashboard-core-glow", {
      scale: 1.2,
      opacity: 0.65,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1,
    });

    // =========================================================
    // ORBIT RINGS
    // =========================================================

    // Inner orbit - clockwise
    gsap.to(".dashboard-ring-one", {
      rotation: 360,
      duration: 10,
      repeat: -1,
      ease: "none",
    });

    // Middle orbit - anti-clockwise
    gsap.to(".dashboard-ring-two", {
      rotation: -360,
      duration: 16,
      repeat: -1,
      ease: "none",
    });

    // Outer orbit - clockwise slower
    gsap.to(".dashboard-ring-three", {
      rotation: 360,
      duration: 24,
      repeat: -1,
      ease: "none",
    });

    // =========================================================
    // ORBIT DOT PULSE
    // =========================================================

    gsap.to(".dashboard-orbit-dot", {
      scale: 1.35,
      opacity: 0.55,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.2,
        from: "random",
      },
      ease: "sine.inOut",
    });

    // =========================================================
    // PARTICLES FLOATING
    // =========================================================

    gsap.to(".dashboard-particle", {
      y: -12,
      x: 8,
      opacity: 0.45,
      duration: 2,
      repeat: -1,
      yoyo: true,
      stagger: 0.4,
      ease: "sine.inOut",
    });

    // =========================================================
    // ACTION CARD HOVER
    // =========================================================

    const actionCards = gsap.utils.toArray(
      ".dashboard-action"
    );

    actionCards.forEach((card) => {
      const icon = card.querySelector(
        ".dashboard-action-icon"
      );

      const enter = () => {
        gsap.to(card, {
          y: -5,
          duration: 0.25,
          ease: "power2.out",
        });

        if (icon) {
          gsap.to(icon, {
            scale: 1.08,
            duration: 0.25,
            ease: "power2.out",
          });
        }
      };

      const leave = () => {
        gsap.to(card, {
          y: 0,
          duration: 0.25,
          ease: "power2.out",
        });

        if (icon) {
          gsap.to(icon, {
            scale: 1,
            duration: 0.25,
            ease: "power2.out",
          });
        }
      };

      card.addEventListener("mouseenter", enter);
      card.addEventListener("mouseleave", leave);
    });

    // =========================================================
    // CHATBOX FOCUS
    // =========================================================

    const chatBox = document.querySelector(
      ".dashboard-chatbox"
    );

    if (chatBox) {
      const textarea =
        chatBox.querySelector("textarea");

      textarea?.addEventListener("focus", () => {
        gsap.to(chatBox, {
          scale: 1.005,
          duration: 0.25,
          ease: "power2.out",
        });
      });

      textarea?.addEventListener("blur", () => {
        gsap.to(chatBox, {
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
        });
      });
    }

    // =========================================================
    // CORE LIGHT PULSE
    // =========================================================

    gsap.to(".dashboard-core-light", {
      opacity: 0.4,
      scale: 1.15,
      duration: 1.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

  }, containerRef);

  // =========================================================
  // CLEANUP
  // =========================================================

  return () => {
    ctx.revert();
  };
};