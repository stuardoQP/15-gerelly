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


    let currentUploaderName = 'Invitado';

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
                formattedName = guestName.replace(/[_-]/g, ' ');
                guestNameDisplay.innerText = formattedName;
                currentUploaderName = formattedName;
            }

            // Generar Código QR (Optimizado para lectura rápida y clara)
            const qrData = `TICKET XV GERELLY\nNombre: ${formattedName}\nPases Reservados: ${passes}`;
            const qrContainer = document.getElementById("qrcode");
            qrContainer.innerHTML = ""; // Limpiar por si acaso
            new QRCode(qrContainer, {
                text: qrData,
                width: 400,
                height: 400,
                colorDark : "#000000", // Negro puro para máximo contraste y rapidez de lectura
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.M // Nivel M hace el código menos denso y más rápido de leer
            });
            
            // Permitir que el QR se amplíe al hacer clic
            qrContainer.addEventListener('click', () => {
                // qrcode.js crea un canvas y/o un img. Buscamos el img o el canvas.
                const qrImg = qrContainer.querySelector('img');
                const qrCanvas = qrContainer.querySelector('canvas');
                
                if (qrImg && qrImg.src) {
                    openLightbox(qrImg.src);
                } else if (qrCanvas) {
                    openLightbox(qrCanvas.toDataURL());
                }
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
    const openGalleryBtn = document.getElementById('openGalleryBtn');
    const closeGalleryBtn = document.getElementById('closeGalleryBtn');
    const galleryModal = document.getElementById('galleryModal');
    const modalUploadBtn = document.getElementById('modalUploadBtn');
    const galleryContainer = document.getElementById('galleryContainer');

    // Variables globales para modales
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    let currentDeleteCallback = null;

    // Configuración modal borrar
    if(cancelDeleteBtn && confirmDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteConfirmModal.classList.add('hidden');
            currentDeleteCallback = null;
        });
        confirmDeleteBtn.addEventListener('click', () => {
            if(currentDeleteCallback) currentDeleteCallback();
            deleteConfirmModal.classList.add('hidden');
            currentDeleteCallback = null;
        });
    }

    // Funciones para Modal de Galería
    if (openGalleryBtn && closeGalleryBtn && galleryModal) {
        openGalleryBtn.addEventListener('click', () => {
            galleryModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
        });
        closeGalleryBtn.addEventListener('click', () => {
            galleryModal.classList.add('hidden');
            document.body.style.overflow = ''; // Restaurar scroll
        });
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        });

        // Abrir automáticamente si el enlace tiene #galeria
        if (window.location.hash === '#galeria') {
            galleryModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Saltar la portada y mostrar el contenido principal
            const coverOverlay = document.getElementById('coverOverlay');
            const mainContent = document.getElementById('mainContent');
            if (coverOverlay && mainContent) {
                coverOverlay.style.display = 'none';
                mainContent.classList.remove('hidden');
                // Nota: La música no se autodisparará por políticas del navegador sin interacción previa, lo cual es ideal para un uso rápido como subir fotos.
                if (typeof initScrollAnimations === 'function') initScrollAnimations();
            }
        }
    }

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
    function addImgToGallery(url, uploaderName = 'Invitado', deleteToken = null) {
        const div = document.createElement('div');
        div.className = 'gallery-item feed-card fade-in visible';
        
        let deleteBtnHtml = '';
        if (deleteToken) {
            deleteBtnHtml = `<button class="btn-delete" title="Eliminar por error">🗑️</button>`;
        }

        div.innerHTML = `
            <div class="feed-header">
                <span class="feed-avatar">👤</span>
                <div class="feed-info">
                    <span class="feed-author">${uploaderName}</span>
                    <span class="feed-time">Subió una foto nueva</span>
                </div>
                ${deleteBtnHtml}
            </div>
            <img src="${url}" alt="Recuerdo de los XV" class="feed-img">
            <div class="feed-actions">
                <button class="btn-like">🤍 Me gusta</button>
                <span class="like-count">0</span>
            </div>
        `;
        div.querySelector('img').addEventListener('click', () => openLightbox(url));

        // Lógica del botón Me Gusta (Visual / Local)
        const likeBtn = div.querySelector('.btn-like');
        const likeCount = div.querySelector('.like-count');
        let likes = Math.floor(Math.random() * 10) + 1; // Un par de likes iniciales para animar
        likeCount.innerText = `${likes} me gusta`;

        likeBtn.addEventListener('click', () => {
            if (likeBtn.classList.contains('liked')) {
                likes--;
                likeBtn.classList.remove('liked');
                likeBtn.innerHTML = '🤍 Me gusta';
            } else {
                likes++;
                likeBtn.classList.add('liked');
                likeBtn.innerHTML = '❤️ Te gusta';
            }
            likeCount.innerText = `${likes} me gusta`;
        });

        // Lógica del botón Eliminar
        if (deleteToken) {
            const delBtn = div.querySelector('.btn-delete');
            delBtn.addEventListener('click', () => {
                // Mostrar nuestro modal de confirmación
                deleteConfirmModal.classList.remove('hidden');
                
                // Definir qué pasa si acepta
                currentDeleteCallback = () => {
                    delBtn.innerHTML = '⏳';
                    delBtn.style.pointerEvents = 'none'; // Desactivar clics
                    
                    fetch('https://api.cloudinary.com/v1_1/lop0hj2d/delete_by_token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token: deleteToken })
                    }).then(res => {
                        if (res.ok) {
                            div.remove();
                        } else {
                            delBtn.innerHTML = '⚠️ Expiró';
                            delBtn.style.width = 'auto';
                            delBtn.style.padding = '0 10px';
                            delBtn.style.borderRadius = '10px';
                        }
                    }).catch(() => {
                        delBtn.innerHTML = '⚠️ Error';
                        delBtn.style.width = 'auto';
                        delBtn.style.padding = '0 10px';
                        delBtn.style.borderRadius = '10px';
                    });
                };
            });
        }

        // Se pone de primera en la lista
        galleryContainer.prepend(div);
    }

    // 2. Configurar Cloudinary Upload Widget (Se crea al hacer click para poder pedir nombre)
    const namePromptModal = document.getElementById('namePromptModal');
    const uploaderNameInput = document.getElementById('uploaderNameInput');
    const acceptNameBtn = document.getElementById('acceptNameBtn');
    const cancelNameBtn = document.getElementById('cancelNameBtn');

    function openCloudinaryWidget() {
        cloudinary.createUploadWidget({
            cloudName: 'lop0hj2d',
            uploadPreset: 'Fotos_Gerelly_XV',
            tags: ['xv_gerelly'], // Etiqueta automática para agrupar todas las fotos
            folder: `XV_Fotos/${currentUploaderName.replace(/ /g, '_')}`, // Guarda en carpeta con su nombre
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
                addImgToGallery(result.info.secure_url, currentUploaderName, result.info.delete_token);
            }
        }).open();
    }

    if (typeof cloudinary !== 'undefined' && modalUploadBtn) {
        modalUploadBtn.addEventListener('click', function () {
            // Si no hay nombre (ej. escaneó el QR de la mesa), abrimos nuestro modal personalizado
            if (currentUploaderName === 'Invitado') {
                namePromptModal.classList.remove('hidden');
            } else {
                openCloudinaryWidget();
            }
        });

        if (acceptNameBtn && cancelNameBtn) {
            acceptNameBtn.addEventListener('click', () => {
                const nameInput = uploaderNameInput.value.trim();
                if (nameInput !== '') {
                    currentUploaderName = nameInput;
                    namePromptModal.classList.add('hidden');
                    uploaderNameInput.style.border = 'none';
                    openCloudinaryWidget();
                } else {
                    uploaderNameInput.style.border = '2px solid #ff4b4b'; // Alerta visual
                }
            });

            cancelNameBtn.addEventListener('click', () => {
                namePromptModal.classList.add('hidden');
                uploaderNameInput.value = '';
                uploaderNameInput.style.border = 'none';
            });
        }
    }

    // 3. Cargar imágenes existentes (Requiere activar "Resource List" en Cloudinary)
    function loadGallery() {
        // Hacemos fetch al JSON que genera Cloudinary (si está activado)
        fetch('https://res.cloudinary.com/lop0hj2d/image/list/xv_gerelly.json')
            .then(res => res.json())
            .then(data => {
                if (data && data.resources) {
                    // Ordenar por timestamp de creación ascendente (al hacer prepend, las más nuevas quedan arriba)
                    data.resources.sort((a, b) => a.version - b.version);

                    data.resources.forEach(img => {
                        const url = `https://res.cloudinary.com/lop0hj2d/image/upload/v${img.version}/${img.public_id}.${img.format}`;
                        // Extraer el nombre de la carpeta (XV_Fotos/Nombre/archivo)
                        const parts = img.public_id.split('/');
                        const uploaderName = parts.length > 2 ? parts[1].replace(/_/g, ' ') : 'Invitado';
                        
                        addImgToGallery(url, uploaderName);
                    });
                }
            })
            .catch(err => console.log('Aún no hay fotos o la lista no es pública.', err));
    }
    
    // Llamar al inicio para mostrar fotos previas
    loadGallery();

});
