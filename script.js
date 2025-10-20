// ===================== VIDEO BACKGROUND MANAGEMENT ===================== 
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.getElementById('hero-video');
    const animatedBackground = document.querySelector('.animated-background');
    
    if (heroVideo) {
        // Gestione del video background in bianco e nero
        heroVideo.addEventListener('loadeddata', function() {
            // Video caricato con successo - nascondi animazione CSS
            heroVideo.classList.add('loaded');
            if (animatedBackground) {
                animatedBackground.style.display = 'none';
            }
            console.log('Video background caricato in bianco e nero');
        });

        heroVideo.addEventListener('canplay', function() {
            // Video pronto per la riproduzione
            heroVideo.style.display = 'block';
            heroVideo.play().catch(e => console.log('Autoplay bloccato:', e));
        });

        heroVideo.addEventListener('error', function() {
            // Errore nel caricamento del video, mostra animazione CSS
            console.log('Errore nel caricamento video, usando animazione CSS');
            heroVideo.style.display = 'none';
            if (animatedBackground) {
                animatedBackground.style.display = 'block';
            }
        });

        // Prova a caricare il video
        heroVideo.load();

        // Controlla se il video è in viewport per ottimizzare performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (heroVideo.paused) {
                        heroVideo.play().catch(e => {
                            console.log('Auto-play fallito, video silenzioso');
                        });
                    }
                } else {
                    heroVideo.pause();
                }
            });
        });

        observer.observe(heroVideo);

        // Pause video quando la pagina non è visibile (performance)
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                heroVideo.pause();
            } else {
                heroVideo.play().catch(e => console.log('Play fallito'));
            }
        });
    }
});

// ===================== MENU MOBILE MANAGEMENT OTTIMIZZATO ===================== 
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mobileMenuFullscreen = document.querySelector('.mobile-menu-fullscreen');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-fullscreen a');
    const body = document.body;
    
    if (mobileMenuIcon && mobileMenuFullscreen && mobileMenuOverlay) {
        // Toggle menu mobile
        function toggleMobileMenu() {
            const isOpen = mobileMenuIcon.classList.contains('active');
            
            if (isOpen) {
                // Chiudi menu
                mobileMenuIcon.classList.remove('active');
                mobileMenuFullscreen.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                body.style.overflow = '';
                body.style.position = '';
                body.style.width = '';
            } else {
                // Apri menu
                mobileMenuIcon.classList.add('active');
                mobileMenuFullscreen.classList.add('active');
                mobileMenuOverlay.classList.add('active');
                body.style.overflow = 'hidden';
                body.style.position = 'fixed';
                body.style.width = '100%';
            }
        }
        
        // Event listeners ottimizzati
        mobileMenuIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        mobileMenuIcon.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
        
        mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
        
        // Chiudi menu al click sui link con smooth scroll
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        toggleMobileMenu();
                        setTimeout(() => {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }, 300);
                    }
                }
            });
        });
        
        // Chiudi menu con ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenuFullscreen.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
        
        // Gestione orientamento device
        window.addEventListener('orientationchange', function() {
            if (mobileMenuFullscreen.classList.contains('active')) {
                setTimeout(toggleMobileMenu, 100);
            }
        });
    }
});

// ===================== SMOOTH SCROLLING ===================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================== NAVBAR SCROLL EFFECT ===================== 
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Cambia opacity in base allo scroll
    if (scrollTop > 100) {
        navbar.style.background = 'rgba(10,10,10,0.98)';
        navbar.style.backdropFilter = 'blur(25px)';
    } else {
        navbar.style.background = 'rgba(10,10,10,0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
    
    lastScrollTop = scrollTop;
});

// ===================== TOUCH E SWIPE GESTURES MOBILE ===================== 
class TouchHandler {
    constructor() {
        this.startX = null;
        this.startY = null;
        this.threshold = 50; // Minima distanza per swipe
    }
    
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
    }
    
    handleTouchEnd(e, callback) {
        if (!this.startX || !this.startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - this.startX;
        const deltaY = endY - this.startY;
        
        // Determina direzione swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.threshold) {
            const direction = deltaX > 0 ? 'right' : 'left';
            callback(direction);
        }
        
        this.startX = null;
        this.startY = null;
    }
}

// Inizializza touch handler per chiudere menu mobile con swipe
document.addEventListener('DOMContentLoaded', function() {
    const touchHandler = new TouchHandler();
    const mobileMenu = document.querySelector('.mobile-menu-fullscreen');
    
    if (mobileMenu) {
        mobileMenu.addEventListener('touchstart', (e) => {
            touchHandler.handleTouchStart(e);
        }, { passive: true });
        
        mobileMenu.addEventListener('touchend', (e) => {
            touchHandler.handleTouchEnd(e, (direction) => {
                if (direction === 'right' && mobileMenu.classList.contains('active')) {
                    // Chiudi menu con swipe verso destra
                    document.querySelector('.mobile-menu-icon').click();
                }
            });
        }, { passive: true });
    }
});

// ===================== reCAPTCHA VALIDATION ===================== 
function validateRecaptcha() {
    const recaptchaResponse = grecaptcha.getResponse();
    return recaptchaResponse && recaptchaResponse.length > 0;
}

// Callback per reset reCAPTCHA se necessario
function resetRecaptcha() {
    if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
    }
}

// ===================== FORM OTTIMIZZATO MOBILE ===================== 
document.addEventListener('DOMContentLoaded', function() {
    const quoteForm = document.getElementById('quote-form');
    const submitButton = quoteForm?.querySelector('.quote-submit');
    
    if (quoteForm) {
        // Validazione real-time ottimizzata per mobile
        const inputs = quoteForm.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                // Rimuovi errori durante la digitazione
                this.classList.remove('error');
                const errorMsg = this.parentNode.querySelector('.error-message');
                if (errorMsg) errorMsg.remove();
            });
        });
        
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validazione completa
            let isValid = true;
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (!isValid) {
                showErrorMessage('Compila tutti i campi obbligatori');
                return;
            }
            
            // Validazione reCAPTCHA
            if (!validateRecaptcha()) {
                showErrorMessage('🛡️ Completa la verifica reCAPTCHA per continuare');
                // Scroll verso il reCAPTCHA
                const recaptchaContainer = document.querySelector('.recaptcha-container');
                if (recaptchaContainer) {
                    recaptchaContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // Disabilita bottone durante invio
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '⏳ Invio in corso...';
            }
            
            // Raccogli dati form
            const formData = new FormData(this);
            const data = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                servizio: formData.get('servizio'),
                data: formData.get('data') || 'Da definire',
                budget: formData.get('budget'),
                messaggio: formData.get('messaggio') || 'Nessun messaggio aggiuntivo'
            };
            
            // Crea messaggio WhatsApp ottimizzato
            const whatsappMessage = `🎵 *RICHIESTA PREVENTIVO NEWAR RECORDS* 🎵

👤 *Nome:* ${data.nome}
📧 *Email:* ${data.email}
📱 *Telefono:* ${data.telefono}
🎧 *Servizio:* ${data.servizio}
📅 *Data Evento:* ${data.data}
💰 *Budget:* ${data.budget}

📝 *Messaggio:*
${data.messaggio}

---
📍 Milano e Lombardia
⏰ Risposta garantita in 2 ore
🌐 Richiesta dal sito newarrecords.it`;
            
            // Codifica il messaggio per WhatsApp
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/393401234567?text=${encodedMessage}`;
            
            // Feedback immediato
            showSuccessMessage('Richiesta preparata! Ti stiamo reindirizzando su WhatsApp...');
            
            // Apri WhatsApp dopo breve delay
            setTimeout(() => {
                window.open(whatsappURL, '_blank');
                
                // Reset form e reCAPTCHA
                this.reset();
                resetRecaptcha();
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.innerHTML = '🚀 Richiedi Preventivo Gratuito';
                }
            }, 1500);
        });
    }
});

// Funzione validazione campo
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const name = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Rimuovi messaggi di errore esistenti
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) existingError.remove();
    field.classList.remove('error');
    
    // Campi obbligatori
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Campo obbligatorio';
    }
    
    // Validazioni specifiche
    if (value && type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Email non valida';
        }
    }
    
    if (value && type === 'tel') {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Numero di telefono non valido';
        }
    }
    
    // Mostra errore se campo non valido
    if (!isValid) {
        field.classList.add('error');
        const errorSpan = document.createElement('span');
        errorSpan.className = 'error-message';
        errorSpan.textContent = errorMessage;
        errorSpan.style.cssText = `
            color: #ff4757;
            font-size: 0.8rem;
            margin-top: 0.3rem;
            display: block;
        `;
        field.parentNode.appendChild(errorSpan);
    }
    
    return isValid;
}

// ===================== ANIMAZIONI ON SCROLL ===================== 
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Applica animazioni agli elementi
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll(
        '.service-card-pro, .portfolio-item, .team-member, .value-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===================== PORTFOLIO LIGHTBOX ===================== 
function initPortfolioLightbox() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('h4').textContent;
            const description = this.querySelector('p').textContent;
            
            createLightbox(img.src, title, description);
        });
    });
}

function createLightbox(imageSrc, title, description) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${imageSrc}" alt="${title}">
            <div class="lightbox-info">
                <h3>${title}</h3>
                <p>${description}</p>
            </div>
            <button class="lightbox-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Chiudi lightbox
    function closeLightbox() {
        document.body.removeChild(lightbox);
        document.body.style.overflow = '';
    }
    
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightbox();
    });
}

// Inizializza lightbox quando DOM è pronto
document.addEventListener('DOMContentLoaded', initPortfolioLightbox);

// ===================== UTILITY FUNCTIONS MOBILE OTTIMIZZATE ===================== 
function showSuccessMessage(message) {
    const toast = createToast(message, 'success');
    document.body.appendChild(toast);
    
    // Animazione entrata
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 100);
    
    // Rimozione automatica
    setTimeout(() => {
        removeToast(toast);
    }, 4000);
}

function showErrorMessage(message) {
    const toast = createToast(message, 'error');
    document.body.appendChild(toast);
    
    // Animazione entrata
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    }, 100);
    
    // Rimozione automatica
    setTimeout(() => {
        removeToast(toast);
    }, 5000);
}

function createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const colors = {
        success: {
            bg: 'linear-gradient(135deg, #28a745, #20a13a)',
            icon: '✅'
        },
        error: {
            bg: 'linear-gradient(135deg, #dc3545, #c82333)',
            icon: '❌'
        }
    };
    
    const color = colors[type];
    
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${color.icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="removeToast(this.parentElement)">&times;</button>
        </div>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color.bg};
        color: white;
        border-radius: 12px;
        z-index: 10000;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        max-width: calc(100vw - 40px);
        min-width: 280px;
    `;
    
    const content = toast.querySelector('.toast-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 20px;
    `;
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.style.cssText = `
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        line-height: 1;
        margin-left: auto;
        transition: background 0.2s ease;
    `;
    
    return toast;
}

function removeToast(toast) {
    if (toast && toast.parentElement) {
        toast.style.transform = 'translateX(100%)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 300);
    }
}

// ===================== VIEWPORT E ORIENTAMENTO ===================== 
function handleViewportChanges() {
    // Aggiusta altezza viewport per mobile
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Gestione orientamento
    const orientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    document.documentElement.setAttribute('data-orientation', orientation);
}

window.addEventListener('resize', debounce(handleViewportChanges, 100));
window.addEventListener('orientationchange', () => {
    setTimeout(handleViewportChanges, 100);
});

// Inizializza al caricamento
document.addEventListener('DOMContentLoaded', handleViewportChanges);

// ===================== SMOOTH SCROLLING OTTIMIZZATO ===================== 
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling per tutti i link interni
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ===================== PERFORMANCE E LAZY LOADING ===================== 
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer per animazioni
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Applica osservatore agli elementi animabili
    const animatedElements = document.querySelectorAll(
        '.service-card-pro, .portfolio-item, .team-member-clean, .contact-item'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Lazy loading per immagini
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        imageObserver.observe(img);
    });
});

// Aggiungi CSS per animazioni
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .toast:hover .toast-close {
        background: rgba(255,255,255,0.3) !important;
    }
    
    /* Stili per validazione form */
    .quote-form input.error,
    .quote-form select.error,
    .quote-form textarea.error {
        border-color: #ff4757 !important;
        box-shadow: 0 0 0 2px rgba(255, 71, 87, 0.2) !important;
    }
    
    /* Fix per viewport height mobile */
    .hero-professional {
        height: 100vh;
        height: calc(var(--vh, 1vh) * 100);
    }
    
    /* Orientamento landscape su mobile */
    @media (max-width: 768px) and (orientation: landscape) {
        .hero-professional {
            height: 100vh;
            padding: 60px 0 30px;
        }
        
        .hero-title-pro {
            font-size: 2.2rem !important;
        }
        
        .hero-subtitle {
            font-size: 1rem !important;
            margin-bottom: 1.5rem !important;
        }
        
        .hero-cta-group {
            margin-bottom: 1rem !important;
        }
        
        .hero-badges {
            display: none;
        }
    }
`;

document.head.appendChild(animationStyles);

// ===================== PREVENTIVO IMMEDIATO ===================== 
function calculateQuickQuote() {
    const service = document.querySelector('select[name="servizio"]').value;
    const date = document.querySelector('input[name="data"]').value;
    
    if (!service || !date) return;
    
    const baseRates = {
        'audio-rental': 300,
        'lighting': 400,
        'events': 500,
        'studio': 150,
        'consultation': 100
    };
    
    const eventDate = new Date(date);
    const today = new Date();
    const daysFromNow = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
    
    let multiplier = 1;
    if (daysFromNow < 7) multiplier = 1.3; // Rush fee
    if (eventDate.getDay() === 0 || eventDate.getDay() === 6) multiplier *= 1.2; // Weekend
    
    const estimate = Math.round(baseRates[service] * multiplier);
    
    showQuickEstimate(estimate, service);
}

function showQuickEstimate(amount, service) {
    const serviceNames = {
        'audio-rental': 'Noleggio Audio',
        'lighting': 'Illuminotecnica',
        'events': 'Gestione Eventi',
        'studio': 'Registrazione Studio',
        'consultation': 'Consulenza'
    };
    
    const estimateDiv = document.createElement('div');
    estimateDiv.className = 'quick-estimate';
    estimateDiv.innerHTML = `
        <h4>💰 Preventivo Indicativo</h4>
        <p><strong>${serviceNames[service]}</strong></p>
        <div class="estimate-amount">€${amount}*</div>
        <p class="estimate-note">*Prezzo indicativo, richiedi preventivo dettagliato</p>
    `;
    
    estimateDiv.style.cssText = `
        background: linear-gradient(135deg, var(--gold), var(--gold-dark));
        color: var(--black-deep);
        padding: 1.5rem;
        border-radius: 15px;
        margin-top: 1rem;
        text-align: center;
        font-weight: 600;
        animation: slideInUp 0.3s ease;
    `;
    
    const existingEstimate = document.querySelector('.quick-estimate');
    if (existingEstimate) existingEstimate.remove();
    
    document.querySelector('.quote-form').appendChild(estimateDiv);
}

// ===================== CSS ANIMATIONS ===================== 
const animationCSS = `
<style>
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}

@keyframes slideInUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

.lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: fadeIn 0.3s ease;
}

.lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    text-align: center;
}

.lightbox-content img {
    max-width: 100%;
    max-height: 70vh;
    border-radius: 10px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.8);
}

.lightbox-info {
    background: linear-gradient(135deg, rgba(184,134,11,0.9), rgba(22,33,62,0.9));
    padding: 1rem;
    border-radius: 0 0 10px 10px;
    color: white;
}

.lightbox-close {
    position: absolute;
    top: -10px;
    right: -10px;
    background: var(--gold);
    color: var(--black-deep);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>
`;

// Aggiungi CSS per animazioni
document.head.insertAdjacentHTML('beforeend', animationCSS);

// ===================== WHATSAPP STICKY ANIMATIONS ===================== 
document.addEventListener('DOMContentLoaded', function() {
    const whatsappSticky = document.querySelector('.whatsapp-sticky');
    
    if (whatsappSticky) {
        // Aggiungi effetto hover personalizzato
        whatsappSticky.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        whatsappSticky.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
        
        // Animazione di entrata ritardata
        setTimeout(() => {
            whatsappSticky.style.animation = 'slideInRight 0.5s ease';
        }, 2000);
    }
});

// ===================== LAZY LOADING IMAGES ===================== 
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// ===================== PERFORMANCE OPTIMIZATIONS ===================== 
// Debounce function per scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Ottimizza scroll events
window.addEventListener('scroll', debounce(function() {
    // Scroll ottimizzato
}, 16)); // ~60fps

console.log('🎵 Newar Records - Website loaded successfully! 🎵');