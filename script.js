/**
 * Keith's Massage Therapy – Static site scripts
 * Vanilla JS only: mobile nav, smooth scroll, FAQ accordion, fade-in on scroll.
 * User-facing text from lang/{locale}/user/usermessages.js; language toggle EN/FR.
 */

import userMessagesEn from "./lang/en/user/usermessages.js";
import userMessagesFr from "./lang/fr/user/usermessages.js";

var LOCALE_KEY = "locale";
var DEFAULT_LOCALE = "en";

(function () {
  "use strict";

  var messagesByLocale = { en: userMessagesEn, fr: userMessagesFr };

  function getCurrentLocale() {
    var stored = localStorage.getItem(LOCALE_KEY);
    return stored === "fr" || stored === "en" ? stored : DEFAULT_LOCALE;
  }

  function setCurrentLocale(locale) {
    localStorage.setItem(LOCALE_KEY, locale);
  }

  // -------------------------------------------------------------------------
  // Resolve nested path in object (e.g. "faq.items.0.question")
  // -------------------------------------------------------------------------
  function getByPath(obj, path) {
    return path.split(".").reduce(function (o, k) {
      return o != null && o[k] !== undefined ? o[k] : null;
    }, obj);
  }

  // -------------------------------------------------------------------------
  // Apply userMessages to the page (meta, data-msg, data-msg-aria-label)
  // -------------------------------------------------------------------------
  function applyUserMessages(msg) {
    if (!msg) return;

    if (msg.locale) {
      document.documentElement.lang = msg.locale;
    }
    document.title = msg.meta.title;
    var metaDesc = document.getElementById("meta-description");
    if (metaDesc) metaDesc.setAttribute("content", msg.meta.description);
    var ogTitle = document.getElementById("meta-og-title");
    if (ogTitle) ogTitle.setAttribute("content", msg.meta.ogTitle);
    var ogDesc = document.getElementById("meta-og-description");
    if (ogDesc) ogDesc.setAttribute("content", msg.meta.ogDescription);

    document.querySelectorAll("[data-msg]").forEach(function (el) {
      if (el.closest("#lang-toggle")) return;
      var path = el.getAttribute("data-msg");
      var value = getByPath(msg, path);
      if (value != null) {
        if (el.hasAttribute("data-msg-replace-year")) {
          value = String(value).replace("{year}", new Date().getFullYear());
        }
        if (el.hasAttribute("data-msg-html")) {
          el.innerHTML = value;
        } else {
          el.textContent = value;
        }
      }
    });

    document.querySelectorAll("[data-msg-aria-label]").forEach(function (el) {
      if (el.closest("#lang-toggle")) return;
      var path = el.getAttribute("data-msg-aria-label");
      var value = getByPath(msg, path);
      if (value != null) el.setAttribute("aria-label", value);
    });
  }

  function setLangToggleActive(locale) {
    var pill = document.getElementById("lang-toggle");
    if (!pill) return;
    pill.querySelectorAll(".lang-toggle-option").forEach(function (btn) {
      var isActive = btn.getAttribute("data-locale") === locale;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function initAndApplyMessages() {
    var locale = getCurrentLocale();
    var msg = messagesByLocale[locale];
    applyUserMessages(msg);
    setLangToggleActive(locale);
  }

  function switchLocale(locale) {
    if (locale === getCurrentLocale()) return;
    setCurrentLocale(locale);
    applyUserMessages(messagesByLocale[locale]);
    setLangToggleActive(locale);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initAndApplyMessages();
      var pill = document.getElementById("lang-toggle");
      if (pill) {
        pill.querySelectorAll(".lang-toggle-option").forEach(function (btn) {
          btn.addEventListener("click", function () {
            switchLocale(btn.getAttribute("data-locale"));
          });
        });
      }
    });
  } else {
    initAndApplyMessages();
    var pill = document.getElementById("lang-toggle");
    if (pill) {
      pill.querySelectorAll(".lang-toggle-option").forEach(function (btn) {
        btn.addEventListener("click", function () {
          switchLocale(btn.getAttribute("data-locale"));
        });
      });
    }
  }

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

  // Close mobile nav when a nav link or language toggle is clicked
  var navLinks = document.querySelectorAll(".nav-link, .nav .btn, .lang-toggle-option");
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

})();
