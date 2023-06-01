'use strict';
var theme = {
  /**
   * Theme's components/functions list
   * Comment out or delete the unnecessary component.
   * Some components have dependencies (plugins).
   * Do not forget to remove dependency from src/js/vendor/ and recompile.
   */
  init: function() {
    theme.stickyHeader();
    theme.subMenu();
    theme.offCanvas();
    
    theme.onepageHeaderOffset();
    theme.anchorSmoothScroll();
    theme.imageHoverOverlay();
    theme.scrollCue();
    
    theme.lightbox();
    theme.forms();
  },
  /**
   * Sticky Header
   * Enables sticky behavior on navbar on page scroll
   * Requires assets/js/vendor/headhesive.min.js
  */
  stickyHeader: () => {
    var navbar = document.querySelector(".navbar");
    if (navbar == null) return;
    var options = {
      offset: 400,
      offsetSide: 'top',
      classes: {
        clone: 'navbar-clone fixed',
        stick: 'navbar-stick',
        unstick: 'navbar-unstick',
      }
    };
    var banner = new Headhesive('.navbar', options);
  },
  /**
   * Sub Menus
   * Enables multilevel dropdown
   */
  subMenu: () => {
    (function($bs) {
      const CLASS_NAME = 'has-child-dropdown-show';
      $bs.Dropdown.prototype.toggle = function(_original) {
          return function() {
              document.querySelectorAll('.' + CLASS_NAME).forEach(function(e) {
                  e.classList.remove(CLASS_NAME);
              });
              let dd = this._element.closest('.dropdown').parentNode.closest('.dropdown');
              for (; dd && dd !== document; dd = dd.parentNode.closest('.dropdown')) {
                  dd.classList.add(CLASS_NAME);
              }
              return _original.call(this);
          }
      }($bs.Dropdown.prototype.toggle);
      document.querySelectorAll('.dropdown').forEach(function(dd) {
          dd.addEventListener('hide.bs.dropdown', function(e) {
              if (this.classList.contains(CLASS_NAME)) {
                  this.classList.remove(CLASS_NAME);
                  e.preventDefault();
              }
              e.stopPropagation();
          });
      });
    })(bootstrap);
  },
  /**
   * Offcanvas
   * Enables offcanvas-nav, closes offcanvas on anchor clicks, focuses on input in search offcanvas
   */
  offCanvas: () => {
    var navbar = document.querySelector(".navbar");
    if (navbar == null) return;
    const navOffCanvasBtn = document.querySelectorAll(".offcanvas-nav-btn");
    const navOffCanvas = document.querySelector('.navbar:not(.navbar-clone) .offcanvas-nav');
    const bsOffCanvas = new bootstrap.Offcanvas(navOffCanvas, {scroll: true});
    const scrollLink = document.querySelectorAll('.onepage .navbar li a.scroll');
    const searchOffcanvas = document.getElementById('offcanvas-search');
    navOffCanvasBtn.forEach(e => {
      e.addEventListener('click', event => {
        bsOffCanvas.show();
      })
    });
    scrollLink.forEach(e => {
      e.addEventListener('click', event => {
        bsOffCanvas.hide();
      })
    });
    if(searchOffcanvas != null) {
      searchOffcanvas.addEventListener('shown.bs.offcanvas', function () {
        document.getElementById("search-form").focus();
      });
    }
  },
  /**
  
   * Onepage Header Offset
   * Adds an offset value to anchor point equal to sticky header height on a onepage
   */
  onepageHeaderOffset: () => {
    var navbar = document.querySelector(".navbar");
    if (navbar == null) return;
    const header_height = document.querySelector(".navbar").offsetHeight;
    const shrinked_header_height = 75;
    const sections = document.querySelectorAll(".onepage section");
    sections.forEach(section => {
      section.style.paddingTop = shrinked_header_height + 'px';
      section.style.marginTop = '-' + shrinked_header_height + 'px';
    });
    const first_section = document.querySelector(".onepage section:first-of-type");
    if(first_section != null) {
      first_section.style.paddingTop = header_height + 'px';
      first_section.style.marginTop = '-' + header_height + 'px';
    }
  },
  /**
   * Anchor Smooth Scroll
   * Adds smooth scroll animation to links with .scroll class
   * Requires assets/js/vendor/smoothscroll.js
   */
  anchorSmoothScroll: () => {
    const links = document.querySelectorAll(".scroll");
    for(const link of links) {
      link.addEventListener("click", clickHandler);
    }
    function clickHandler(e) {
      e.preventDefault();
      this.blur();
      const href = this.getAttribute("href");
      const offsetTop = document.querySelector(href).offsetTop;
      scroll({
        top: offsetTop,
        behavior: "smooth"
      });
    }
  },
  /**
   * Image Hover Overlay
   * Adds span.bg inside .overlay for simpler markup and styling purposes
   */
  imageHoverOverlay: () => {
    var overlay = document.querySelectorAll('.overlay > a, .overlay > span');
    for(var i = 0; i < overlay.length; i++) {
      var overlay_bg = document.createElement('span');
      overlay_bg.className = "bg";
      overlay[i].appendChild(overlay_bg);
    }
  },
  /**
   * scrollCue.js
   * Enables showing elements by scrolling
   * Requires assets/js/vendor/scrollCue.min.js
   */
  scrollCue: () => {
    scrollCue.init({
      interval: -200,
      duration: 700,
      percentage: 0.8
    });
    scrollCue.update();
  },
  /**
   
   * GLightbox
   * Enables lightbox functionality
   * Requires assets/js/vendor/glightbox.js
   */
  lightbox: () => {
    const lightbox = GLightbox({
      selector: '*[data-glightbox]',
      touchNavigation: true,
      loop: false,
      zoomable: false,
      autoplayVideos: false,
      moreLength: 0,
      slideExtraAttributes: {
        poster: ''
      },
      plyr: {
        css: '',
        js: '',
        config: {
          ratio: '',
          fullscreen: {
            enabled: false,
            iosNative: false
          },
          youtube: {
            noCookie: true,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3
          },
          vimeo: {
            byline: false,
            portrait: false,
            title: false,
            transparent: false
          }
        }
      },
    });
  },
  /**
   * Form Validation and Contact Form submit
   * Bootstrap validation - Only sends messages if form has class ".contact-form" and is validated and shows success/fail messages
   */
  forms: () => {
    (function() {
      "use strict";
      window.addEventListener("load", function() {
        var forms = document.querySelectorAll(".needs-validation");
        var inputRecaptcha = document.querySelector("input[data-recaptcha]"); 
        window.verifyRecaptchaCallback = function (response) {
          inputRecaptcha.value = response; 
          inputRecaptcha.dispatchEvent(new Event("change"));
        }
        window.expiredRecaptchaCallback = function () {
          var inputRecaptcha = document.querySelector("input[data-recaptcha]"); 
          inputRecaptcha.value = ""; 
          inputRecaptcha.dispatchEvent(new Event("change"));
        }
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener("submit", function(event) {
            if(form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add("was-validated");
            if(form.checkValidity() === true) {
              event.preventDefault();
              form.classList.remove("was-validated");
              // Send message only if the form has class .contact-form
              var isContactForm = form.classList.contains('contact-form');
              if(isContactForm) {
                var data = new FormData(form);
                var alertClass = 'red';
                fetch("assets/php/contact.html", {
                  method: "post",
                  body: data
                }).then((data) => {
                  if(data.ok) {
                    alertClass = 'green';
                  }
                  return data.text();
                }).then((txt) => {
                  var alertBox = '<div class="mb-6 text-' + alertClass + '">' + txt + '</div>';
                  if(alertClass && txt) {
                    form.querySelector(".messages").insertAdjacentHTML('beforeend', alertBox);
                    form.reset();
                    grecaptcha.reset();
                  }
                }).catch((err) => {
                  console.log(err);
                });
              }
            }
          }, false);
        });
      }, false);
    })();
  },
}
theme.init();
