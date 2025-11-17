$(function() {
    $(window).on('scroll', function() {
        var scrollUmbral = 50; 

        if ($(window).scrollTop() > scrollUmbral) {
            $('.header-principal').addClass('scrolled');
            $('body').addClass('scrolled');
        } else {
            $('.header-principal').removeClass('scrolled');
            $('body').removeClass('scrolled');
        }
    });
    const $preloader = $('#preloader');

    if ($preloader.length) {
        $('body').css('overflow', 'hidden');
    }

    $(window).on('load', () => {
        if ($preloader.length) {
            $preloader.addClass('loaded');
        }
        // Devolver el scroll al body
        $('body').css('overflow', 'auto');
    });

    // --- Lógica del Pop-up de Inicio de Sesión ---
    const $popup = $('#popup-login');
    const $popupCerrar = $popup.find('.popup-cerrar');
    const $enlaceSuscribete = $popup.find('.popup-enlace-accion');

        // para que no sea tan agresivo.
    $(window).on('load', () => {
        // Espera 1 segundo (1000ms) después de que todo cargue
        setTimeout(function() {
        
        if ($popup.length) {
            $popup.addClass('visible');
            $('body').addClass('no-scroll');
        }
        }, 1000); 
    });

    // 2. Función para cerrar el popup
    function cerrarPopup() {
        $popup.removeClass('visible');
        $('body').removeClass('no-scroll');
    }

    if ($popupCerrar.length) {
        $popupCerrar.on('click', cerrarPopup);
    }

    if ($enlaceSuscribete.length) {
        $enlaceSuscribete.on('click', cerrarPopup);
    }

    $popup.on('click', function(e) {
        if (e.target === this) {
        cerrarPopup();
        }
    });

    // 6. Lógica del "Ojito" para la contraseña
    const $passToggle = $('#popup-pass-toggle');
    const $passInput = $('#popup-pass');

    if ($passToggle.length && $passInput.length) {
        $passToggle.on('click', function() {
        $(this).toggleClass('mostrando');
        
        const tipoActual = $passInput.attr('type');
        
        if (tipoActual === 'password') {
            $passInput.attr('type', 'text');
        } else {
            $passInput.attr('type', 'password');
        }
        });
    }

    // --- Lógica del Menú Móvil ---
    const $iconoMenu = $('.navbar-menu-movil-icono');
    const $menuMovil = $('.navbar-menu'); 
    const $enlacesMenu = $menuMovil.find('a');

    if ($iconoMenu.length && $menuMovil.length) {
        // Al hacer clic en el icono
        $iconoMenu.on('click', function() {
            // 'this' es el icono en el que se hizo clic
            $(this).toggleClass('icono-activo');
            
            // Muestra/oculta el menú (añadiendo .menu-abierto a .navbar-menu)
            $menuMovil.toggleClass('menu-abierto');
            
            // Bloquea/desbloquea el scroll del body
            $('body').toggleClass('no-scroll');
        });

        // Opcional: Cerrar el menú si se hace clic en un enlace
        $enlacesMenu.on('click', function() {
            // Solo cerramos si está en modo "menu-abierto" (móvil)
            if ($menuMovil.hasClass('menu-abierto')) {
                $iconoMenu.removeClass('icono-activo');
                $menuMovil.removeClass('menu-abierto');
                $('body').removeClass('no-scroll');
            }
        });

        // Cerrar al hacer clic en el overlay (fuera del contenido)
        $(document).on('click', function(e) {
            if ($menuMovil.hasClass('menu-abierto')) {
                const isClickInsideMenu = $menuMovil[0].contains(e.target);
                const isClickOnIcon = $iconoMenu[0].contains(e.target);

                if (!isClickInsideMenu && !isClickOnIcon) {
                    $iconoMenu.removeClass('icono-activo');
                    $menuMovil.removeClass('menu-abierto');
                    $('body').removeClass('no-scroll');
                }
            }
        });
    }
    
    // --- Lógica del Cursor Personalizado ---
    const $cursorOutline = $('.cursor-outline');

    // --- Lógica de Inversión del Cursor ---
    const $seccionOscura = $('#backstage');

    if ($seccionOscura.length && $cursorOutline.length) {
        // Cuando el ratón entra en la sección oscura
        $seccionOscura.on('mouseenter', () => {
            $cursorOutline.addClass('cursor-invertido');
        });
        
        // Cuando el ratón sale de la sección oscura
        $seccionOscura.on('mouseleave', () => {
            $cursorOutline.removeClass('cursor-invertido');
        });
    }

    const $hoverables = $('a, button, .radio-etiqueta, .navbar-logo, .navbar-menu-movil-icono');

    if ($cursorOutline.length) {
        $(window).on('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            
            $cursorOutline.css('transform', `translate(${x - $cursorOutline.outerWidth() / 2}px, ${y - $cursorOutline.outerHeight() / 2}px)`);
        });

        $hoverables.on('mouseenter', () => {
            $cursorOutline.addClass('cursor-hover');
        });
        $hoverables.on('mouseleave', () => {
            $cursorOutline.removeClass('cursor-hover');
        });
    }


    // --- Lógica de Animaciones de Scroll (IntersectionObserver) --
    const $animatedElements = $('.animate-on-scroll');

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const $target = $(entry.target);

                if (entry.isIntersecting) {
                    $target.addClass('is-visible');
                    
                    // Animar gráficos de barras cuando sean visibles
                    const $bars = $target.find('.barra-valor');
                    
                    // .each() es el forEach de jQuery
                    $bars.each(function() {
                        const $bar = $(this);
                        $bar.css('width', $bar.attr('data-width') || '0%');
                    });
                }
                // Para que se anime CADA VEZ que entra en la vista
                else {
                    $target.removeClass('is-visible');
                    const $bars = $target.find('.barra-valor');
                    $bars.each(function() {
                        $(this).css('width', '0%');
                    });
                }
            });
        }, {
            threshold: 0.1 
        });

        $animatedElements.each(function() {
            observer.observe(this);
        });
    }

    // --- Lógica del Formulario de Suscripción ---
    const $radioFisica = $('#sub_fisica');
    const $radioDigital = $('#sub_digital');
    const $detallesEnvio = $('#detalles-envio');
    
    // Chequeo de seguridad: solo ejecutar si los elementos existen
    if ($radioFisica.length && $radioDigital.length && $detallesEnvio.length) {
        
        const $inputsEnvio = $detallesEnvio.find('input');

        function actualizarVisibilidadFormulario() {
            if ($radioFisica.is(':checked')) {
                $detallesEnvio.show(); 
                $inputsEnvio.prop('required', true);
            } else {
                $detallesEnvio.hide(); 
                $inputsEnvio.prop('required', false);
            }
        }

        $('#sub_fisica, #sub_digital').on('change', actualizarVisibilidadFormulario);

        actualizarVisibilidadFormulario();
    }


    // --- Lógica del Año Actual en el Footer ---
    const $elementoAno = $('#ano-actual');
    if ($elementoAno.length) {

        $elementoAno.text(new Date().getFullYear());
    }

});

