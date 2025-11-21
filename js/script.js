$(function() {

     if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            duration: 800,
        });
    } else {
        console.warn("AOS NO CARGÓ");
    }

    const $window = $(window);
    const $body = $('body');
    const $header = $('.header-principal');
    
// 1. INICIALIZACIÓN Y ESTADO
    let loginModal = null;
    
    // LEER ESTADO DE MEMORIA
    let usuarioLogueado = sessionStorage.getItem('usuario_logueado') === 'true';

    // Si ya estaba logueado, actualizar botón directamente
    if (usuarioLogueado) {
        $('.accion-abrir-registro').text("BIENVENIDO");
    }

    const modalElement = document.getElementById('modalLogin');
    
    if (modalElement && typeof bootstrap !== 'undefined') {
        try {
            loginModal = new bootstrap.Modal(modalElement);
            
            // AUTO POPUP SOLO SI: No se ha visto Y no está logueado
            if (!sessionStorage.getItem('popup_visto') && !usuarioLogueado) {
                setTimeout(function() {
                    if (!usuarioLogueado) { // Doble check
                        loginModal.show();
                        sessionStorage.setItem('popup_visto', 'true');
                    }
                }, 2000);
            }

        } catch (e) {
            console.error("Error bootstrap modal:", e);
        }
    }

// 2. HEADER SCROLL
    if ($body.is('.page-datos, .page-diseñadores')) {
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

// 3. LÓGICA MODAL
    const $viewLogin = $('#view-login');
    const $viewRegistro = $('#view-registro');
    const $viewExito = $('#view-exito');
    const $botonesSuscripcion = $('.accion-abrir-registro, #btn-ir-registro');

    $botonesSuscripcion.on('click', function(e) {
        e.preventDefault();
        
        // Cerrar menú móvil
        if ($('.navbar-menu').hasClass('menu-abierto')) {
            $('.navbar-menu').removeClass('menu-abierto');
            $('.navbar-menu-movil-icono').removeClass('icono-activo');
            $body.removeClass('no-scroll');
        }

        if (loginModal) {
            loginModal.show();
            sessionStorage.setItem('popup_visto', 'true'); // Marcar como visto al abrir manual

            if (usuarioLogueado) {
                $viewLogin.hide(); $viewRegistro.hide(); $viewExito.show();
            } else {
                $viewLogin.hide(); $viewExito.hide(); $viewRegistro.show();
            }
        }
    });

    $('#btn-ir-login').on('click', function(e) {
        e.preventDefault(); $viewRegistro.hide(); $viewLogin.fadeIn(200);
    });
    
    $('#btn-ir-registro').on('click', function(e) {
         e.preventDefault(); $viewLogin.hide(); $viewRegistro.fadeIn(200);
    });

    $('#form-login, #form-registro').on('submit', function(e) {
        e.preventDefault();
        
        // GUARDAR ESTADO EN MEMORIA 
        usuarioLogueado = true;
        sessionStorage.setItem('usuario_logueado', 'true');
        sessionStorage.setItem('popup_visto', 'true');
        
        $('.accion-abrir-registro').text("BIENVENIDO");

        $viewLogin.hide(); $viewRegistro.hide(); $viewExito.fadeIn(200);
    });

    if (modalElement) {
        modalElement.addEventListener('hidden.bs.modal', function () {
            if (!usuarioLogueado) {
                $viewRegistro.hide(); $viewExito.hide(); $viewLogin.show();
                $('form').trigger("reset");
            }
        });
    }

// 4. UTILIDADES
    window.togglePass = function(idInput, btn) {
        const input = document.getElementById(idInput);
        if (input.type === "password") {
            input.type = "text"; $(btn).css('color', '#000000'); 
        } else {
            input.type = "password"; $(btn).css('color', '#999999'); 
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

    const $cursor = $('.cursor-outline');
    if($cursor.length) {
        $window.on('mousemove', function(e){
             $cursor.css({ top: e.clientY + 'px', left: e.clientX + 'px' });
        });
        $('a, button, input').on('mouseenter', ()=> $cursor.addClass('cursor-hover'))
                             .on('mouseleave', ()=> $cursor.removeClass('cursor-hover'));
    }
    
    $('#ano-actual').text(new Date().getFullYear());

// 5. ABOUT ME
    const $aboutArea = $('#about-me-area');
    const $aboutCards = $('.about-card');
    const $aboutOverlay = $('#about-overlay');
    const $aboutOverlayImg = $('#about-overlay-img');

    if ($aboutArea.length && $aboutCards.length) {
        function posicionarAleatorio($card) {
            const areaRect = $aboutArea[0].getBoundingClientRect();
            const cardRect = $card[0].getBoundingClientRect();
            const maxLeft = areaRect.width - cardRect.width;
            const maxTop = areaRect.height - cardRect.height;
            const left = Math.max(0, Math.random() * maxLeft);
            const top = Math.max(0, Math.random() * maxTop);
            $card.css({ left: left + 'px', top: top + 'px' });
        }

        $aboutCards.each(function () { posicionarAleatorio($(this)); });

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
            $(document).on('mousemove.aboutDrag touchmove.aboutDrag', onDrag)
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
            activeCard.css({ left: left + 'px', top: top + 'px' });
            isDragging = true;
        }

        function endDrag(e) {
            $(document).off('.aboutDrag');
            if (!activeCard) return;
            const $clickedCard = activeCard;
            const fueArrastre = isDragging;
            activeCard = null;
            isDragging = false;
            if (!fueArrastre) { abrirOverlay($clickedCard); }
        }

        function abrirOverlay($card) {
            $aboutOverlay.addClass('is-visible');
            $body.addClass('no-scroll');
        }

        function cerrarOverlay() {
            $aboutOverlay.removeClass('is-visible');
            // $aboutOverlayImg.attr('src', '');
            $body.removeClass('no-scroll');
        }

        $aboutCards.on('mousedown touchstart', startDrag);
        $aboutOverlay.on('click', function () {
            cerrarOverlay();
        });

    }

// 6. BACKSTAGE
    const $backstageItems = $('.backstage-item');
    if ($backstageItems.length) {
        const clasesTamaño = ['backstage-item--tall', 'backstage-item--wide', 'backstage-item--big', ''];
        $backstageItems.each(function () {
            const randomIndex = Math.floor(Math.random() * clasesTamaño.length);
            const clase = clasesTamaño[randomIndex];
            if (clase) { $(this).addClass(clase); }
        });
    }

// 7. DRAG & DROP DATOS
    if ($('.draggable-zone').length && $window.width() > 768) {
        
        let activeDragItem = null;
        let offset = { x: 0, y: 0 };
        
        const $ticket = $('#item-ticket');
        const $paper = $('#item-paper');

        $('.drag-item').on('mousedown', function(e) {
            activeDragItem = $(this);
            
            const position = activeDragItem.position();
            offset.x = e.pageX - position.left;
            offset.y = e.pageY - position.top;
            
            if (!activeDragItem.hasClass('post-it')) {
                $('.drag-item').not('.post-it').css('z-index', 5);
                activeDragItem.css('z-index', 10);
            } 
            
            activeDragItem.addClass('is-dragging');
            
            $(document).on('mousemove.deskDrag', moveItem);
            $(document).on('mouseup.deskDrag', stopItem);
        });

        function moveItem(e) {
            if (!activeDragItem) return;
            e.preventDefault(); 

            const $container = $('.draggable-zone');
            const containerWidth = $container.width();
            const containerHeight = $container.height();
            
            const itemWidth = activeDragItem.outerWidth();
            const itemHeight = activeDragItem.outerHeight();

            let newLeft = e.pageX - offset.x;
            let newTop = e.pageY - offset.y;

            // Límites
            if (newLeft < 0) newLeft = 0;
            if (newLeft + itemWidth > containerWidth) newLeft = containerWidth - itemWidth;
            if (newTop < 0) newTop = 0;
            if (newTop + itemHeight > containerHeight) newTop = containerHeight - itemHeight;

            // Colisiones
            if (!activeDragItem.hasClass('post-it')) {
                let $obstacle = null;
                if (activeDragItem.attr('id') === 'item-ticket') $obstacle = $paper;
                else if (activeDragItem.attr('id') === 'item-paper') $obstacle = $ticket;

                if ($obstacle) {
                    const proposedRect = {
                        left: newLeft,
                        right: newLeft + itemWidth,
                        top: newTop,
                        bottom: newTop + itemHeight
                    };

                    const obstaclePos = $obstacle.position();
                    const obstacleRect = {
                        left: obstaclePos.left,
                        right: obstaclePos.left + $obstacle.outerWidth(),
                        top: obstaclePos.top,
                        bottom: obstaclePos.top + $obstacle.outerHeight()
                    };

                    if (checkCollision(proposedRect, obstacleRect)) {
                        return; 
                    }
                }
            }

            activeDragItem.css({
                left: newLeft + 'px',
                top: newTop + 'px',
                right: 'auto'
            });
        }

        function stopItem() {
            if (activeDragItem) {
                activeDragItem.removeClass('is-dragging');
                activeDragItem = null;
            }
            $(document).off('.deskDrag');
        }

        function checkCollision(rect1, rect2) {
            const margin = 5; 
            return (rect1.left < rect2.right - margin &&
                    rect1.right > rect2.left + margin &&
                    rect1.top < rect2.bottom - margin &&
                    rect1.bottom > rect2.top + margin);
        }
    }

// 8. CARRUSEL DISEÑADORES – TODAS LAS FOTOS PUEDEN SER CENTRALES
    const $designerTrack = $('.designer-track');


    if ($designerTrack.length) {
        const $designerCards = $designerTrack.find('.designer-card');
        const $btnPrev = $('.designer-arrow--prev');
        const $btnNext = $('.designer-arrow--next');
        const $nameEl = $('.designer-name');
        const $textEl = $('.designer-text');
        
        const rootStyles = getComputedStyle(document.documentElement);
        const VISIBLE = parseInt(
            rootStyles.getPropertyValue('--visible-cards')
        ) || 5;

        const CARD_WIDTH = 100 / VISIBLE;
        const total = $designerCards.length;

        // Índice de la tarjeta que debe estar en el centro
        let currentIndex = 0;

        function wrapIndex(index) {
            return (index + total) % total;
        }

        function updateCarousel() {
            const translateX = 50 - (currentIndex + 0.5) * CARD_WIDTH;

            $designerTrack.css('transform', `translateX(${translateX}%)`);

            $designerCards.removeClass('is-center');
            const $centerCard = $designerCards.eq(currentIndex);
            $centerCard.addClass('is-center');

            $nameEl.text($centerCard.data('name') || '');
            $textEl.text($centerCard.data('description') || '');
        }

        function goNext() {
            currentIndex = wrapIndex(currentIndex + 1);
            updateCarousel();
        }

        function goPrev() {
            currentIndex = wrapIndex(currentIndex - 1);
            updateCarousel();
        }

        const AUTO_DELAY = 5000;
        let timer = setInterval(goNext, AUTO_DELAY);

        function resetAutoplay() {
            clearInterval(timer);
            timer = setInterval(goNext, AUTO_DELAY);
        }
        $btnNext.on('click', function () {
            goNext();
            resetAutoplay();
        });
        $btnPrev.on('click', function () {
            goPrev();
            resetAutoplay();
        });
        updateCarousel();
        $(window).on('resize', function () {
            setTimeout(updateCarousel, 300);
        });
    }

});