$(function() {
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
    
    // --- Lógica del Cursor Personalizado ---
    const $cursorDot = $('.cursor-dot');
    const $cursorOutline = $('.cursor-outline');

    // --- Lógica de Inversión del Cursor ---
    const $seccionOscura = $('#backstage');

    if ($seccionOscura.length && $cursorDot.length && $cursorOutline.length) {
        // Cuando el ratón entra en la sección oscura
        $seccionOscura.on('mouseenter', () => {
            $cursorDot.addClass('cursor-invertido');
            $cursorOutline.addClass('cursor-invertido');
        });
        
        // Cuando el ratón sale de la sección oscura
        $seccionOscura.on('mouseleave', () => {
            $cursorDot.removeClass('cursor-invertido');
            $cursorOutline.removeClass('cursor-invertido');
        });
    }

    const $hoverables = $('a, button, .radio-etiqueta, .navbar-logo, .navbar-menu-movil-icono');

    if ($cursorDot.length && $cursorOutline.length) {
        $(window).on('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            
            $cursorDot.css('transform', `translate(${x - $cursorDot.outerWidth() / 2}px, ${y - $cursorDot.outerHeight() / 2}px)`);
            
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

