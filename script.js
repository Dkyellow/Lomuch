document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Close menu on click
            if(menuToggle) {
                 menuToggle.querySelector('i').classList.remove('fa-times');
                 menuToggle.querySelector('i').classList.add('fa-bars');
            }
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible to run only once
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Observe Feature Cards
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.2}s`; // Staggered delay
        observer.observe(card);
    });

    // Observe Product Cards
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe Use Story Labels
    document.querySelectorAll('.ingredient-label').forEach(label => {
        observer.observe(label);
    });

    // Helper to add 'visible' triggers
    const animateScroll = () => {
        const triggers = document.querySelectorAll('.feature-card, .product-card');
        triggers.forEach(el => {
            const rect = el.getBoundingClientRect();
            if(rect.top < window.innerHeight - 100) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    };
    
    window.addEventListener('scroll', animateScroll);
    animateScroll(); // Initial check

    // --- Form Handling (WhatsApp) ---
    const form = document.getElementById('quoteForm');
    const msg = document.getElementById('form-feedback');
    const submitBtn = document.querySelector('.btn-submit');
    const loader = document.querySelector('.loader');
    const btnText = document.querySelector('.btn-text');
    const WHATSAPP_NUMBER = "+263779570683"; // REPLACE WITH ACTUAL NUMBER

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic Validation
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const date = document.getElementById('date').value;
            const flavor = document.getElementById('flavor').value;
            const message = document.getElementById('message').value.trim();

            if (!name || !phone || !date) {
                msg.textContent = "Please fill in all required fields.";
                msg.className = "feedback-msg error";
                return;
            }

            // Simulate Loading
            btnText.classList.add('hidden');
            loader.classList.remove('hidden');
            submitBtn.disabled = true;

            setTimeout(() => {
                // Construct WhatsApp Message
                let waText = `*New Cake Quote Request*%0A%0A`;
                waText += `*Name:* ${name}%0A`;
                waText += `*Phone:* ${phone}%0A`;
                waText += `*Date:* ${date}%0A`;
                waText += `*Flavor:* ${flavor}%0A`;
                if(message) waText += `*Message:* ${message}%0A`;

                const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

                // Open WhatsApp
                window.open(waURL, '_blank');

                // Reset UI
                loader.classList.add('hidden');
                btnText.classList.remove('hidden');
                submitBtn.disabled = false;
                form.reset();
                msg.textContent = "Redirecting to WhatsApp...";
                msg.className = "feedback-msg success";
                
                setTimeout(() => msg.textContent = "", 3000);

            }, 1000); 
        });
    }

    // --- Product Buy Buttons (WhatsApp) ---
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.product-card');
            const title = card.querySelector('h3').innerText;
            const price = card.querySelector('.price').innerText;
            
            // Note: We cannot send the actual image file via URL scheme, 
            // but we describe the item clearly.
            const text = `Hi! I would like to order this cake:%0A*${title}* - ${price}%0A%0AIs it available?`;
            
            const waURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
            window.open(waURL, '_blank');
        });
    });

    // --- Carousel Logic ---
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (track && prevBtn && nextBtn) {
        let scrollAmount = 0;
        const cardWidth = 320; // 300px min-width + 20px gap approx
        // We need to calculate maxScroll dynamic
        
        const scrollCarousel = (direction) => {
            const containerWidth = document.querySelector('.carousel-viewport').offsetWidth;
            const trackWidth = track.scrollWidth;
            const maxScroll = trackWidth - containerWidth;

            if (direction === 'next') {
                scrollAmount += cardWidth;
                if (scrollAmount > maxScroll) scrollAmount = maxScroll;
            } else {
                scrollAmount -= cardWidth;
                if (scrollAmount < 0) scrollAmount = 0;
            }
            
            track.style.transform = `translateX(-${scrollAmount}px)`;
        };

        nextBtn.addEventListener('click', () => scrollCarousel('next'));
        prevBtn.addEventListener('click', () => scrollCarousel('prev'));

        // Swipe Functionality
        let startX;
        let isDown = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX;
            isDown = true;
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            // logic can be complex for smooth drag, let's keep it simple: detect swipe direction on end
        });

        track.addEventListener('touchend', (e) => {
            if (!isDown) return;
            isDown = false;
            const endX = e.changedTouches[0].pageX;
            const diff = startX - endX;

            if (Math.abs(diff) > 50) { // Threshold
                if (diff > 0) {
                    scrollCarousel('next');
                } else {
                    scrollCarousel('prev');
                }
            }
        });
    }

    // --- Hero Parallax/Floating Effect on Mouse Move (Enhanced) ---
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const moveX = (e.clientX * -1 / 50);
            const moveY = (e.clientY * -1 / 50);
            const cake = document.querySelector('.main-cake');
            
            if(cake) {
                cake.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
    }
});
