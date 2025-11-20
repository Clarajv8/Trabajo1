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
        console.log("ℹ️ No hay modal de login en esta página.");
    }

    // --- 2. HEADER CBA ---
    if ($body.hasClass('page-datos')) {
        $header.addClass('scrolled');
        $body.addClass('scrolled');
    } else {
        $window.on('scroll', function() {
            if ($window.scrollTop() > 50) {
                $header.addClass('scrolled');
                $body.addClass('scrolled');
            } else {
                $header.removeClass('scrolled');
                $body.removeClass('scrolled');
            }
        });
    }

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
            $(btn).css('color', '#000000'); 
        } else {
            input.type = "password";
            $(btn).css('color', '#999999'); 
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

            // --- 5. ABOUT ME: TARJETAS ARRASTRABLES Y OVERLAY ---

    const $aboutArea = $('#about-me-area');
    const $aboutCards = $('.about-card');
    const $aboutOverlay = $('#about-overlay');
    const $aboutOverlayImg = $('#about-overlay-img');

    if ($aboutArea.length && $aboutCards.length) {

        // Posicionar de forma aleatoria dentro del área
        function posicionarAleatorio($card) {
            const areaRect = $aboutArea[0].getBoundingClientRect();
            const cardRect = $card[0].getBoundingClientRect();

            const maxLeft = areaRect.width - cardRect.width;
            const maxTop = areaRect.height - cardRect.height;

            const left = Math.max(0, Math.random() * maxLeft);
            const top = Math.max(0, Math.random() * maxTop);

            $card.css({
                left: left + 'px',
                top: top + 'px'
            });
        }

        $aboutCards.each(function () {
            posicionarAleatorio($(this));
        });

        let isDragging = false;
        let activeCard = null;
        let offsetX = 0;
        let offsetY = 0;

        function getClientPos(e) {
            if (e.type && e.type.startsWith('touch')) {
                const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                return { x: touch.clientX, y: touch.clientY };
            }
            return { x: e.clientX, y: e.clientY };
        }

        function startDrag(e) {
            const $target = $(e.currentTarget);
            activeCard = $target;
            isDragging = false;

            const cardRect = $target[0].getBoundingClientRect();
            const pos = getClientPos(e);

            offsetX = pos.x - cardRect.left;
            offsetY = pos.y - cardRect.top;

            $(document)
                .on('mousemove.aboutDrag touchmove.aboutDrag', onDrag)
                .on('mouseup.aboutDrag touchend.aboutDrag touchcancel.aboutDrag', endDrag);
        }

        function onDrag(e) {
            if (!activeCard) return;

            const areaRect = $aboutArea[0].getBoundingClientRect();
            const cardRect = activeCard[0].getBoundingClientRect();
            const pos = getClientPos(e);

            let left = pos.x - offsetX - areaRect.left;
            let top = pos.y - offsetY - areaRect.top;

            const maxLeft = areaRect.width - cardRect.width;
            const maxTop = areaRect.height - cardRect.height;

            left = Math.min(Math.max(0, left), maxLeft);
            top = Math.min(Math.max(0, top), maxTop);

            activeCard.css({
                left: left + 'px',
                top: top + 'px'
            });

            isDragging = true;
        }

        function endDrag(e) {
            $(document).off('.aboutDrag');

            if (!activeCard) return;

            const $clickedCard = activeCard;
            const fueArrastre = isDragging;

            activeCard = null;
            isDragging = false;

            // si solo fue clic, abrimos overlay
            if (!fueArrastre) {
                abrirOverlay($clickedCard);
            }
        }

        function abrirOverlay($card) {
            const imgSrc = $card.data('image');

            if (imgSrc) {
                $aboutOverlayImg.attr('src', imgSrc);
            } else {
                $aboutOverlayImg.attr('src', '');
            }

            $aboutOverlay.addClass('is-visible');
            $body.addClass('no-scroll');
        }

        function cerrarOverlay() {
            $aboutOverlay.removeClass('is-visible');
            $aboutOverlayImg.attr('src', '');
            $body.removeClass('no-scroll');
        }

        $aboutCards.on('mousedown touchstart', startDrag);

        $aboutOverlay.on('click', function (e) {
            if (
                $(e.target).is('.about-overlay') ||
                $(e.target).is('.about-overlay-close')
            ) {
                cerrarOverlay();
            }
        });
    }

        // --- 6. BACKSTAGE: GALERÍA CON TAMAÑOS ALEATORIOS ---

    const $backstageItems = $('.backstage-item');

    if ($backstageItems.length) {
        const clasesTamaño = [
            'backstage-item--tall',
            'backstage-item--wide',
            'backstage-item--big',
            '' // algunos quedan "normales"
        ];

        $backstageItems.each(function () {
            const randomIndex = Math.floor(Math.random() * clasesTamaño.length);
            const clase = clasesTamaño[randomIndex];
            if (clase) {
                $(this).addClass(clase);
            }
        });
    }
});