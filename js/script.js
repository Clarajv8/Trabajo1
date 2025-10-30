document.addEventListener('DOMContentLoaded', function() {

    const preloader = document.getElementById('preloader');
    
    // Ocultar scroll al inicio si el preloader existe
    if (preloader) {
        document.body.style.overflow = 'hidden';
    }

    // Usar 'window.load' para esperar a que todas las imágenes y recursos carguen
    window.addEventListener('load', () => {
        if (preloader) {
            preloader.classList.add('loaded');
        }
        // Devolver el scroll al body
        document.body.style.overflow = 'auto';
    });
    
    // --- Lógica del Cursor Personalizado ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');


// --- Lógica de Inversión del Cursor ---
    const seccionOscura = document.getElementById('backstage');

    // Nos aseguramos de que todos los elementos existan
    if (seccionOscura && cursorDot && cursorOutline) {
        
        // Cuando el ratón entra en la sección oscura
        seccionOscura.addEventListener('mouseenter', () => {
            cursorDot.classList.add('cursor-invertido');
            cursorOutline.classList.add('cursor-invertido');
        });
        
        // Cuando el ratón sale de la sección oscura
        seccionOscura.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('cursor-invertido');
            cursorOutline.classList.remove('cursor-invertido');
        });
    }

    
    // Seleccionar todos los elementos interactivos
    const hoverables = document.querySelectorAll(
        'a, button, .radio-etiqueta, .navbar-logo, .navbar-menu-movil-icono'
    );

    if (cursorDot && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            
            // Centrar el dot restando la mitad de su tamaño
            cursorDot.style.transform = `translate(${x - cursorDot.offsetWidth / 2}px, ${y - cursorDot.offsetHeight / 2}px)`;
            
            // Centrar el outline restando la mitad de su tamaño (esta línea ya estaba bien)
            cursorOutline.style.transform = `translate(${x - cursorOutline.offsetWidth / 2}px, ${y - cursorOutline.offsetHeight / 2}px)`;
        });

        // Añadir/quitar clase de hover al contorno
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('cursor-hover');
            });
        });
    }


    // --- Lógica de Animaciones de Scroll (IntersectionObserver) ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    
                    // Animar gráficos de barras cuando sean visibles
                    const bars = entry.target.querySelectorAll('.barra-valor');
                    bars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width') || '0%';
                    });
                }
                //Para que se anime CADA VEZ que entra en la vista
                else {
                    entry.target.classList.remove('is-visible');
                    const bars = entry.target.querySelectorAll('.barra-valor');
                    bars.forEach(bar => {
                        bar.style.width = '0%';
                    });
                }
            });
        }, {
            threshold: 0.1 // 10% del elemento debe estar visible
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }


    // --- Lógica del Formulario de Suscripción ---
    // Seleccionar los elementos del formulario
    const radioFisica = document.getElementById('sub_fisica');
    const radioDigital = document.getElementById('sub_digital');
    const detallesEnvio = document.getElementById('detalles-envio');
    
    // Chequeo de seguridad: solo ejecutar si los elementos existen
    if (radioFisica && radioDigital && detallesEnvio) {
        // Seleccionar todos los inputs dentro de los detalles de envío
        const inputsEnvio = detallesEnvio.querySelectorAll('input');

        // Función para actualizar la visibilidad del formulario
        function actualizarVisibilidadFormulario() {
            if (radioFisica.checked) {
                // Si la opción física está marcada
                detallesEnvio.style.display = 'block';
                // Hacer que los campos de envío sean obligatorios (required)
                inputsEnvio.forEach(input => {
                    input.required = true;
                });
            } else {
                // Si la opción digital (o cualquier otra) está marcada
                detallesEnvio.style.display = 'none';
                // Quitar el 'required' de los campos de envío
                inputsEnvio.forEach(input => {
                    input.required = false;
                });
            }
        }

        // Añadir un 'escuchador' de eventos a ambos botones de radio
        // 'change' se activa cuando el estado de 'checked' cambia
        radioFisica.addEventListener('change', actualizarVisibilidadFormulario);
        radioDigital.addEventListener('change', actualizarVisibilidadFormulario);

        // Ejecutar la función una vez al cargar la página
        // para asegurar que el estado inicial sea correcto (digital está 'checked' por defecto)
        actualizarVisibilidadFormulario();
    }


    // --- Lógica del Año Actual en el Footer ---
    const elementoAno = document.getElementById('ano-actual');
    if (elementoAno) {
        elementoAno.textContent = new Date().getFullYear();
    }

});

