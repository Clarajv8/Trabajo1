$(function() {
    // Referencias a elementos comunes
    const $window = $(window);
    const $body = $('body');
    const $header = $('.header-principal');
    const $preloader = $('#preloader');
    const $popup = $('#popup-login');

    // ------------------------------------------------------
    // 1. LÓGICA DEL PRELOADER Y CARGA INICIAL
    // ------------------------------------------------------
    // Bloquear scroll mientras carga
    if ($preloader.length) $body.addClass('no-scroll');

    $window.on('load', function() {
        // A. Quitar preloader
        if ($preloader.length) {
            $preloader.addClass('loaded');
        }

        // B. Permitir scroll temporalmente (por si el popup falla)
        $body.removeClass('no-scroll');
        
        // C. Mostrar Popup tras 1 segundo
        setTimeout(function() {
            if ($popup.length) {
                $popup.addClass('visible');
                $body.addClass('no-scroll'); // Bloquear scroll de nuevo
            }
        }, 1000);
    });


    // ------------------------------------------------------
    // 2. LÓGICA DEL HEADER (EFECTO ABC GIGANTE)
    // ------------------------------------------------------
    $window.on('scroll', function() {
        // Si bajamos más de 50px
        if ($window.scrollTop() > 50) {
            $header.addClass('scrolled');
            $body.addClass('scrolled'); // Añade padding al body
        } else {
            $header.removeClass('scrolled');
            $body.removeClass('scrolled');
        }
    });


    // ------------------------------------------------------
    // 3. LÓGICA DEL POPUP (LOGIN / REGISTRO / BIENVENIDA)
    // ------------------------------------------------------
    
    // Referencias a las vistas
    const $viewLogin = $('#view-login');
    const $viewRegistro = $('#view-registro');
    const $viewExito = $('#view-exito');

    // Función para cerrar popup y resetear vistas
    function cerrarPopup() {
        $popup.removeClass('visible');
        $body.removeClass('no-scroll');
        
        // Esperar a que termine la animación de cierre (300ms) para resetear
        setTimeout(() => {
            $viewLogin.show();
            $viewRegistro.hide();
            $viewExito.hide();
            // Limpiar inputs
            $('.popup-input').val('');
        }, 300);
    }

    // Botones de cierre generales
    $('.popup-cerrar, #btn-cerrar-final').on('click', cerrarPopup);

    // Cerrar clicando fuera
    $popup.on('click', function(e) {
        if (e.target === this) cerrarPopup();
    });

    // CAMBIAR ENTRE VISTAS (Login <-> Registro)
    $('#btn-ir-registro').on('click', function(e) {
        e.preventDefault();
        $viewLogin.fadeOut(200, function() {
            $viewRegistro.fadeIn(200);
        });
    });

    $('#btn-ir-login').on('click', function(e) {
        e.preventDefault();
        $viewRegistro.fadeOut(200, function() {
            $viewLogin.fadeIn(200);
        });
    });

    // MANEJAR EL ENVÍO (SUBMIT) SIN RECARGAR
    $('#form-login, #form-registro').on('submit', function(e) {
        e.preventDefault(); // ¡ESTO EVITA LA RECARGA DE PÁGINA!
        
        // Ocultar el formulario actual
        $(this).parent().fadeOut(200, function() {
            // Mostrar mensaje de éxito
            $viewExito.fadeIn(200);
        });
    });

    // Función global para el Ojito (llamada desde el HTML onclick)
    window.togglePass = function(idInput, btn) {
        const input = document.getElementById(idInput);
        if (input.type === "password") {
            input.type = "text";
            btn.style.color = "#fff"; // Indicar visualmente
        } else {
            input.type = "password";
            btn.style.color = "#999";
        }
    };


    // ------------------------------------------------------
    // 4. MENÚ MÓVIL
    // ------------------------------------------------------
    const $iconoMenu = $('.navbar-menu-movil-icono');
    const $menuMovil = $('.navbar-menu');

    $iconoMenu.on('click', function() {
        $(this).toggleClass('icono-activo');
        $menuMovil.toggleClass('menu-abierto');
        $body.toggleClass('no-scroll');
    });
    
    // Cerrar menú al clicar un enlace
    $('.navbar-enlace').on('click', function() {
        if ($menuMovil.hasClass('menu-abierto')) {
            $menuMovil.removeClass('menu-abierto');
            $iconoMenu.removeClass('icono-activo');
            $body.removeClass('no-scroll');
        }
    });


    // ------------------------------------------------------
    // 5. CURSOR PERSONALIZADO
    // ------------------------------------------------------
    const $cursor = $('.cursor-outline');
    
    if ($cursor.length) {
        $window.on('mousemove', function(e) {
            // Mover el cursor
            $cursor.css({
                top: e.clientY + 'px',
                left: e.clientX + 'px'
            });
        });

        // Efecto hover
        $('a, button, input, .radio-etiqueta').on('mouseenter', function() {
            $cursor.addClass('cursor-hover');
        }).on('mouseleave', function() {
            $cursor.removeClass('cursor-hover');
        });

        // Invertir color en zonas oscuras (ejemplo con id #backstage)
        $('#backstage, .popup-contenedor').on('mouseenter', function() {
            $cursor.addClass('cursor-invertido');
        }).on('mouseleave', function() {
            $cursor.removeClass('cursor-invertido');
        });
    }

    // Año footer
    $('#ano-actual').text(new Date().getFullYear());

    // ------------------------------------------------------
    // 6. BOTÓN SUSCRIBIRSE (ABRIR POPUP DIRECTAMENTE)
    // ------------------------------------------------------
    $('.accion-abrir-registro').on('click', function(e) {
        e.preventDefault(); // Evita que recargue o baje la página

        // 1. Si el menú móvil está abierto, lo cerramos visualmente
        if ($('.navbar-menu').hasClass('menu-abierto')) {
            $('.navbar-menu').removeClass('menu-abierto');
            $('.navbar-menu-movil-icono').removeClass('icono-activo');
            // No quitamos 'no-scroll' todavía porque el popup lo necesita
        }

        // 2. Abrimos el Popup
        $('#popup-login').addClass('visible');
        $('body').addClass('no-scroll');

        // 3. Forzamos que se vea la vista de REGISTRO, no la de Login
        $('#view-login').hide();
        $('#view-exito').hide();
        $('#view-registro').show();
    });

});