/**
 * Keith's Massage Therapy – Static site scripts
 * Vanilla JS only: mobile nav, smooth scroll, FAQ accordion, fade-in on scroll.
 */

(function () {
  "use strict";

  // -------------------------------------------------------------------------
  // DOM refs
  // -------------------------------------------------------------------------
  var header = document.getElementById("header");
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");

  // -------------------------------------------------------------------------
  // Mobile nav toggle
  // -------------------------------------------------------------------------
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen);
    });
  }

  // Close mobile nav when a nav link is clicked (for in-page anchors)
  var navLinks = document.querySelectorAll(".nav-link, .nav .btn");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      if (header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // -------------------------------------------------------------------------
  // Smooth scroll with offset for sticky header
  // -------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    var href = anchor.getAttribute("href");
    if (href === "#") return;

    anchor.addEventListener("click", function (e) {
      var id = href.slice(1);
      var target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      var headerHeight = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: top,
        behavior: "smooth",
      });
    });
  });

  // -------------------------------------------------------------------------
  // FAQ accordion
  // -------------------------------------------------------------------------
  var faqTriggers = document.querySelectorAll("[data-faq-toggle]");
  faqTriggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".faq-item");
      var content = document.getElementById(trigger.getAttribute("aria-controls"));
      var isOpen = item.hasAttribute("data-open");

      // Close others (optional: only one open at a time)
      document.querySelectorAll(".faq-item[data-open]").forEach(function (openItem) {
        if (openItem === item) return;
        openItem.removeAttribute("data-open");
        var otherContent = openItem.querySelector(".faq-content");
        var otherTrigger = openItem.querySelector(".faq-trigger");
        if (otherContent) otherContent.hidden = true;
        if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
      });

      if (isOpen) {
        item.removeAttribute("data-open");
        if (content) content.hidden = true;
        trigger.setAttribute("aria-expanded", "false");
      } else {
        item.setAttribute("data-open", "");
        if (content) content.hidden = false;
        trigger.setAttribute("aria-expanded", "true");
      }
    });

    // Keyboard: Enter/Space to toggle
    trigger.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        trigger.click();
      }
    });
  });

  // -------------------------------------------------------------------------
  // Fade-in on scroll (lightweight)
  // -------------------------------------------------------------------------
  var fadeElements = document.querySelectorAll(
    ".hero-content, .about-content, .service-card, .benefit-card, .faq-list, .contact-grid"
  );
  fadeElements.forEach(function (el) {
    el.classList.add("fade-in");
  });

  function checkFadeIn() {
    var viewportBottom = window.pageYOffset + window.innerHeight;
    var triggerOffset = 80;

    fadeElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      var top = rect.top + window.pageYOffset;
      if (viewportBottom > top + triggerOffset) {
        el.classList.add("visible");
      }
    });
  }

  if (fadeElements.length) {
    checkFadeIn();
    window.addEventListener("scroll", checkFadeIn, { passive: true });
    window.addEventListener("resize", checkFadeIn);
  }

  // -------------------------------------------------------------------------
  // Footer year
  // -------------------------------------------------------------------------
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
