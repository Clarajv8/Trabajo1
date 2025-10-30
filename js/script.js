// $(function() { ... }) es el atajo de jQuery para 
// document.addEventListener('DOMContentLoaded', function() { ... })
$(function() {

    // --- Lógica del Preloader ---
    const $preloader = $('#preloader');
    
    // Ocultar scroll al inicio si el preloader existe
    if ($preloader.length) {
        $('body').css('overflow', 'hidden');
    }

    // $(window).on('load', ...) es el equivalente a window.addEventListener('load', ...)
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

    // Nos aseguramos de que todos los elementos existan (jQuery .length > 0)
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

    // Seleccionar todos los elementos interactivos
    const $hoverables = $('a, button, .radio-etiqueta, .navbar-logo, .navbar-menu-movil-icono');

    if ($cursorDot.length && $cursorOutline.length) {
        // .on('mousemove', ...) es el equivalente a addEventListener('mousemove', ...)
        $(window).on('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            
            // Usamos .css() para cambiar estilos en jQuery
            $cursorDot.css('transform', `translate(${x - $cursorDot.outerWidth() / 2}px, ${y - $cursorDot.outerHeight() / 2}px)`);
            
            $cursorOutline.css('transform', `translate(${x - $cursorOutline.outerWidth() / 2}px, ${y - $cursorOutline.outerHeight() / 2}px)`);
        });

        // Añadir/quitar clase de hover al contorno
        // jQuery puede gestionar eventos para múltiples elementos a la vez
        $hoverables.on('mouseenter', () => {
            $cursorOutline.addClass('cursor-hover');
        });
        $hoverables.on('mouseleave', () => {
            $cursorOutline.removeClass('cursor-hover');
        });
    }


    // --- Lógica de Animaciones de Scroll (IntersectionObserver) ---
    // IntersectionObserver es una API nativa del navegador, no es parte de jQuery.
    // La traducimos usando selectores de jQuery *dentro* del Observer.
    const $animatedElements = $('.animate-on-scroll');

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const $target = $(entry.target); // Convertimos el 'target' a un objeto jQuery

                if (entry.isIntersecting) {
                    $target.addClass('is-visible');
                    
                    // Animar gráficos de barras cuando sean visibles
                    // Usamos .find() de jQuery
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
            threshold: 0.1 // 10% del elemento debe estar visible
        });

        // .each() para observar cada elemento
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
            // .is(':checked') es como se comprueba un 'checked' en jQuery
            if ($radioFisica.is(':checked')) {
                $detallesEnvio.show(); // .show() es como display = 'block'
                // .prop() es como se cambia la propiedad 'required'
                $inputsEnvio.prop('required', true);
            } else {
                $detallesEnvio.hide(); // .hide() es como display = 'none'
                $inputsEnvio.prop('required', false);
            }
        }

        // Podemos unir ambos selectores
        $('#sub_fisica, #sub_digital').on('change', actualizarVisibilidadFormulario);

        // Ejecutar la función una vez al cargar la página
        actualizarVisibilidadFormulario();
    }


    // --- Lógica del Año Actual en el Footer ---
    const $elementoAno = $('#ano-actual');
    if ($elementoAno.length) {
        // .text() es como se cambia el 'textContent'
        $elementoAno.text(new Date().getFullYear());
    }

});

