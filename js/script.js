$(function() {
    const $window = $(window);
    const $body = $('body');
    const $header = $('.header-principal');
    
    let loginModal = null;

    // --- 1. INICIALIZACIÓN INMEDIATA ---
    const modalElement = document.getElementById('modalLogin');
    
    if (modalElement && typeof bootstrap !== 'undefined') {
        try {
            loginModal = new bootstrap.Modal(modalElement);
            console.log("✅ Modal inicializado correctamente.");

            console.log("⏳ Iniciando cuenta atrás de 1 segundos...");
            setTimeout(function() {
                console.log("🚀 Ejecutando loginModal.show()...");
                loginModal.show();
            }, 1000);

        } catch (e) {
            console.error("❌ Error al crear instancia de Bootstrap:", e);
        }
    } else {
        console.error("❌ Error: Falta el div #modalLogin o la librería Bootstrap.");
    }

    // --- 2. HEADER ABC (SCROLL) ---
    $window.on('scroll', function() {
        if ($window.scrollTop() > 50) {
            $header.addClass('scrolled');
            $body.addClass('scrolled');
        } else {
            $header.removeClass('scrolled');
            $body.removeClass('scrolled');
        }
    });

    // --- 3. LÓGICA INTERNA DEL POPUP ---
    const $viewLogin = $('#view-login');
    const $viewRegistro = $('#view-registro');
    const $viewExito = $('#view-exito');

    $('.accion-abrir-registro, #btn-ir-registro').on('click', function(e) {
        e.preventDefault();
        
        if ($('.navbar-menu').hasClass('menu-abierto')) {
            $('.navbar-menu').removeClass('menu-abierto');
            $('.navbar-menu-movil-icono').removeClass('icono-activo');
            $body.removeClass('no-scroll');
        }

        if (loginModal) {
            loginModal.show();
            $viewLogin.hide();
            $viewExito.hide();
            $viewRegistro.fadeIn(200);
        }
    });

    $('#btn-ir-login').on('click', function(e) {
        e.preventDefault();
        $viewRegistro.hide();
        $viewLogin.fadeIn(200);
    });

    $('#form-login, #form-registro').on('submit', function(e) {
        e.preventDefault();
        $viewLogin.hide();
        $viewRegistro.hide();
        $viewExito.fadeIn(200);
    });

    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', function () {
            $viewRegistro.hide();
            $viewExito.hide();
            $viewLogin.show();
            $('form').trigger("reset");
        });
    }

    // --- 4. OTRAS FUNCIONES ---
    window.togglePass = function(idInput, btn) {
        const input = document.getElementById(idInput);
        if (input.type === "password") {
            input.type = "text";
            $(btn).css('color', 'white');
        } else {
            input.type = "password";
            $(btn).css('color', '#999');
        }
    };

    const $iconoMenu = $('.navbar-menu-movil-icono');
    const $menuMovil = $('.navbar-menu');

    $iconoMenu.on('click', function() {
        $(this).toggleClass('icono-activo');
        $menuMovil.toggleClass('menu-abierto');
        if ($menuMovil.hasClass('menu-abierto')) $body.addClass('no-scroll');
        else $body.removeClass('no-scroll');
    });

    // Cursor
    const $cursor = $('.cursor-outline');
    if($cursor.length) {
        $window.on('mousemove', function(e){
             $cursor.css({ top: e.clientY + 'px', left: e.clientX + 'px' });
        });
        $('a, button, input').on('mouseenter', ()=> $cursor.addClass('cursor-hover'))
                             .on('mouseleave', ()=> $cursor.removeClass('cursor-hover'));
    }
    
    $('#ano-actual').text(new Date().getFullYear());
});