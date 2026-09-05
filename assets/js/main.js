/* Portfolio interactions: the SSO round trip, scroll reveals, footer year. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- the signature flow ---------------- */

  var flow = document.getElementById("flow");

  if (flow) {
    // Each wire carries two pulses: the request out, the signed assertion back.
    Array.prototype.forEach.call(flow.querySelectorAll(".flow__wire"), function (wire) {
      ["out", "back"].forEach(function (dir) {
        var pulse = document.createElement("span");
        pulse.className = "flow__pulse flow__pulse--" + dir;
        wire.appendChild(pulse);
      });
    });

    var sealTimer;

    var play = function () {
      if (reduceMotion) return;
      window.clearTimeout(sealTimer);
      flow.classList.remove("is-playing", "is-sealed");
      void flow.offsetWidth; // restart the animation sequence
      flow.classList.add("is-playing");
      // The assertion comes back signed once the last pulse lands.
      sealTimer = window.setTimeout(function () {
        flow.classList.add("is-sealed");
      }, 4700);
    };

    var replay = flow.querySelector("[data-replay]");
    if (replay) {
        if (reduceMotion) replay.hidden = true;
      replay.addEventListener("click", play);
    }

    // Run once the hero has settled, not the instant the parser gets here.
    window.setTimeout(play, 450);
  }

  /* ---------------- scroll reveals ---------------- */

  var revealTargets = document.querySelectorAll(
    ".head, .about, .domain, .timeline > li, .notes li, .certs__label,\n     .contact__line, .links, .colophon"
  );

  if (!reduceMotion && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    Array.prototype.forEach.call(revealTargets, function (el, i) {
      el.setAttribute("data-reveal", "");
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      observer.observe(el);
    });
  }

  /* ---------------- nav follows the section you are in ---------------- */

  var navLinks = document.querySelectorAll(".nav__links a[href^='#']");

  if (navLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    var sections = [];

    Array.prototype.forEach.call(navLinks, function (link) {
      var section = document.querySelector(link.getAttribute("href"));
      if (!section) return;
      byId[section.id] = link;
      sections.push(section);
    });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link) return;
        // A section counts as current while it crosses the middle of the screen.
        link.classList.toggle("is-active", entry.isIntersecting);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------------- light and dark ---------------- */

  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");

  if (toggle) {
    var systemLight = window.matchMedia("(prefers-color-scheme: light)");

    // What is actually on screen: the explicit choice, else the system.
    var current = function () {
      return root.getAttribute("data-theme") || (systemLight.matches ? "light" : "dark");
    };

    var label = function () {
      toggle.setAttribute("aria-label",
        current() === "dark" ? "Switch to light theme" : "Switch to dark theme");
    };

    toggle.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";

      if (!reduceMotion) {
        root.classList.add("theme-anim");
        window.setTimeout(function () { root.classList.remove("theme-anim"); }, 420);
      }

      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}

      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", next === "dark" ? "#07090F" : "#F6F5F1");

      label();
    });

    // Follow the system while no explicit choice has been made.
    systemLight.addEventListener("change", function () {
      if (!root.getAttribute("data-theme")) label();
    });

    label();
  }

  /* ---------------- how far down the page you are ---------------- */

  var progress = document.querySelector("[data-progress]");

  if (progress) {
    var ticking = false;

    var draw = function () {
      var doc = document.documentElement;
      var scrollable = doc.scrollHeight - window.innerHeight;
      var ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      progress.style.width = Math.max(0, Math.min(1, ratio)) * 100 + "%";
      ticking = false;
    };

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(draw);
    }, { passive: true });

    window.addEventListener("resize", draw, { passive: true });
    draw();
  }

  /* ---------------- footer year ---------------- */

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
