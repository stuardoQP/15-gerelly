document.addEventListener('DOMContentLoaded', () => {
    
    // --- Referencias a elementos ---
    const coverOverlay = document.getElementById('coverOverlay');
    const enterBtn = document.getElementById('enterBtn');
    const mainContent = document.getElementById('mainContent');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    
    // --- Lógica de la Portada y Música ---
    enterBtn.addEventListener('click', () => {
        // Ocultar portada
        coverOverlay.style.opacity = '0';
        coverOverlay.style.transform = 'translateY(-100vh)';
        
        setTimeout(() => {
            coverOverlay.style.display = 'none';
            // Mostrar contenido principal
            mainContent.classList.remove('hidden');
            // Inicializar animaciones de scroll
            initScrollAnimations();
        }, 1000);

        // Reproducir música
        playMusic();
    });

    // Control de Play/Pause desde el botón flotante
    musicToggleBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });

    function playMusic() {
        bgMusic.play().then(() => {
            musicToggleBtn.classList.add('playing');
        }).catch(error => {
            console.log("Auto-play was prevented. Please interact with the document first.", error);
        });
    }

    function pauseMusic() {
        bgMusic.pause();
        musicToggleBtn.classList.remove('playing');
    }


    // --- Lógica de la Cuenta Regresiva ---
    // Fecha objetivo: 17 de Octubre de 2026 a las 19:00
    const targetDate = new Date("October 17, 2026 19:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById("countdown").innerHTML = "<h3>¡El gran día ha llegado!</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Formato con ceros a la izquierda
        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    }

    // Actualizar cada segundo
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Llamada inicial


    // --- Lógica de Invitados Personalizados (URL Params) ---
    function initGuestInfo() {
        const urlParams = new URLSearchParams(window.location.search);
        const guestName = urlParams.get('nombre');
        const passes = urlParams.get('pases');

        if (passes) {
            const guestInfoContainer = document.getElementById('guestInfoContainer');
            const guestPassesDisplay = document.getElementById('guestPassesDisplay');
            
            guestPassesDisplay.innerText = passes;
            guestInfoContainer.classList.remove('hidden');

            let formattedName = 'Invitado Especial';
            if (guestName) {
                const guestNameDisplay = document.getElementById('guestNameDisplay');
                // Reemplazar guiones o guiones bajos con espacios si los hay
                formattedName = "Familia " + guestName.replace(/[_-]/g, ' ');
                guestNameDisplay.innerText = formattedName;
            }

            // Generar Código QR
            const qrData = `TICKET-XV-${guestName || 'Invitado'}-${passes}Pases`;
            const qrContainer = document.getElementById("qrcode");
            qrContainer.innerHTML = ""; // Limpiar por si acaso
            new QRCode(qrContainer, {
                text: qrData,
                width: 140,
                height: 140,
                colorDark : "#b565a7",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        }
    }
    initGuestInfo();


    // --- Animaciones de Scroll (Fade In) ---
    function initScrollAnimations() {
        const faders = document.querySelectorAll('.fade-in');
        
        const appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };
        
        const appearOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, appearOptions);
        
        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });
    }

    // --- Lógica del Modal de Regalo ---
    const openGiftBtn = document.getElementById('openGiftBtn');
    const closeGiftBtn = document.getElementById('closeGiftBtn');
    const giftModal = document.getElementById('giftModal');

    if (openGiftBtn && closeGiftBtn && giftModal) {
        openGiftBtn.addEventListener('click', () => {
            giftModal.classList.remove('hidden');
        });

        closeGiftBtn.addEventListener('click', () => {
            giftModal.classList.add('hidden');
        });

        // Cerrar al hacer clic fuera del modal
        giftModal.addEventListener('click', (e) => {
            if (e.target === giftModal) {
                giftModal.classList.add('hidden');
            }
        });
    }

    // --- Lógica del Modal de RSVP ---
    const openRsvpBtn = document.getElementById('openRsvpBtn');
    const closeRsvpBtn = document.getElementById('closeRsvpBtn');
    const rsvpModal = document.getElementById('rsvpModal');
    const rsvpForm = document.getElementById('rsvpForm');

    if (openRsvpBtn && closeRsvpBtn && rsvpModal) {
        openRsvpBtn.addEventListener('click', () => {
            rsvpModal.classList.remove('hidden');
        });

        closeRsvpBtn.addEventListener('click', () => {
            rsvpModal.classList.add('hidden');
        });

        rsvpModal.addEventListener('click', (e) => {
            if (e.target === rsvpModal) {
                rsvpModal.classList.add('hidden');
            }
        });

        if (rsvpForm) {
            rsvpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = document.getElementById('rsvpName').value;
                const status = document.getElementById('rsvpStatus').value;
                const message = document.getElementById('rsvpMessage').value;
                
                let whatsappText = `¡Hola! Soy *${name}*.\n\nTe escribo para confirmarte que *${status}* a los XV años de Gerelly.`;
                
                if (message.trim() !== '') {
                    whatsappText += `\n\nMensaje: "${message}"`;
                }
                
                const phoneNumber = '51983842973';
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappText)}`;
                
                window.open(whatsappUrl, '_blank');
                rsvpModal.classList.add('hidden');
            });
        }
    }

    // --- Lógica de Galería Cloudinary y Lightbox ---
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const galleryContainer = document.getElementById('galleryContainer');

    // 1. Configurar Lightbox (se crea una sola vez y se añade al body)
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay hidden';
    lightboxOverlay.innerHTML = `
        <button class="lightbox-close">&times;</button>
        <img class="lightbox-img" src="" alt="Foto en grande">
    `;
    document.body.appendChild(lightboxOverlay);

    const lightboxImg = lightboxOverlay.querySelector('.lightbox-img');
    const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');

    function openLightbox(url) {
        lightboxImg.src = url;
        lightboxOverlay.classList.remove('hidden');
    }

    lightboxClose.addEventListener('click', () => {
        lightboxOverlay.classList.add('hidden');
    });
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) lightboxOverlay.classList.add('hidden');
    });

    // Función para añadir imágenes al HTML
    function addImgToGallery(url) {
        const div = document.createElement('div');
        div.className = 'gallery-item fade-in visible';
        div.innerHTML = `<img src="${url}" alt="Recuerdo de los XV">`;
        div.addEventListener('click', () => openLightbox(url));
        // Se pone de primera en la lista
        galleryContainer.prepend(div);
    }

    // 2. Configurar Cloudinary Upload Widget
    if (typeof cloudinary !== 'undefined' && uploadPhotoBtn) {
        const myWidget = cloudinary.createUploadWidget({
            cloudName: 'lop0hj2d',
            uploadPreset: 'Fotos_Gerelly_XV',
            tags: ['xv_gerelly'], // Etiqueta automática para agrupar todas las fotos
            sources: ['local', 'camera', 'instagram'],
            language: 'es',
            text: {
                es: {
                    menu: { files: 'Mis Archivos' },
                    local: {
                        browse: 'Buscar',
                        dd_title_single: 'Arrastra tu foto aquí',
                        dd_title_multi: 'Arrastra tus fotos aquí',
                        drop_title_single: 'Suelta tu foto para subir',
                        drop_title_multi: 'Suelta tus fotos para subir'
                    }
                }
            }
        }, (error, result) => {
            if (!error && result && result.event === "success") {
                console.log('Imagen subida exitosamente: ', result.info);
                addImgToGallery(result.info.secure_url);
            }
        });

        uploadPhotoBtn.addEventListener('click', function () {
            myWidget.open();
        }, false);
    }

    // 3. Cargar imágenes existentes (Requiere activar "Resource List" en Cloudinary)
    function loadGallery() {
        // Hacemos fetch al JSON que genera Cloudinary (si está activado)
        fetch('https://res.cloudinary.com/lop0hj2d/image/list/xv_gerelly.json')
            .then(res => res.json())
            .then(data => {
                if (data && data.resources) {
                    data.resources.forEach(img => {
                        const url = `https://res.cloudinary.com/lop0hj2d/image/upload/v${img.version}/${img.public_id}.${img.format}`;
                        addImgToGallery(url);
                    });
                }
            })
            .catch(err => console.log('Aún no hay fotos o la lista no es pública.', err));
    }
    
    // Llamar al inicio para mostrar fotos previas
    loadGallery();

});
