document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const backButton = document.getElementById('backToSlides');
    const agendaButton = document.querySelector('.agenda-button');
    let currentSlide = 0;
    let lastMainSlide = 0;

    // Initialize
    function init() {
        currentSlide = 0;
        updateSlideVisibility();
        setupKeyboardNavigation();
        setupProgressIndicator();
        setupAgendaNavigation();
        setupResizeHandler();
    }

    // Show current slide, hide others with transition
    function updateSlideVisibility() {
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.style.opacity = '0';
                slide.classList.add('active');
                setTimeout(() => {
                    slide.style.opacity = '1';
                }, 50);
            } else {
                slide.classList.remove('active');
            }
        });
        updateProgressIndicator();
        updateAgendaButton();
    }

    // Update agenda button visibility
    function updateAgendaButton() {
        if (currentSlide === 0 || currentSlide === 1) { // Hide on title and agenda slides
            agendaButton.style.display = 'none';
        } else {
            agendaButton.style.display = 'flex';
        }
    }

    // Create and update progress indicator
    function setupProgressIndicator() {
        const container = document.createElement('div');
        container.className = 'progress-container';
        
        for (let i = 0; i < slides.length - 1; i++) {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            container.appendChild(dot);
        }
        
        document.body.appendChild(container);
    }

    function updateProgressIndicator() {
        const dots = document.querySelectorAll('.progress-dot');
        dots.forEach((dot, index) => {
            if (index === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Update navigation button visibility
    function updateNavigationButtons() {
        prevButton.style.display = currentSlide === 0 ? 'none' : 'flex';
        nextButton.style.display = currentSlide === slides.length - 1 ? 'none' : 'flex';
    }

    // Navigate to previous slide with transition
    function previousSlide() {
        if (currentSlide > 0) {
            const currentSlideElement = slides[currentSlide];
            currentSlideElement.style.opacity = '0';
            setTimeout(() => {
                currentSlide--;
                updateSlideVisibility();
                updateNavigationButtons();
            }, 300);
        }
    }

    // Navigate to next slide with transition
    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            const currentSlideElement = slides[currentSlide];
            currentSlideElement.style.opacity = '0';
            setTimeout(() => {
                currentSlide++;
                updateSlideVisibility();
                updateNavigationButtons();
            }, 300);
        }
    }

    // Handle appendix navigation
    function goToAppendix() {
        lastMainSlide = currentSlide;
        const currentSlideElement = slides[currentSlide];
        currentSlideElement.style.opacity = '0';
        setTimeout(() => {
            currentSlide = slides.length - 1;
            updateSlideVisibility();
            updateNavigationButtons();
        }, 300);
    }

    // Return to last main slide from appendix
    function backToSlides() {
        const currentSlideElement = slides[currentSlide];
        currentSlideElement.style.opacity = '0';
        setTimeout(() => {
            currentSlide = lastMainSlide;
            updateSlideVisibility();
            updateNavigationButtons();
        }, 300);
    }

    // Setup agenda navigation
    function setupAgendaNavigation() {
        // Agenda button click handler
        agendaButton.addEventListener('click', () => {
            goToSlide(1); // Agenda is slide 1
        });

        // Agenda item click handlers
        document.querySelectorAll('.agenda-item').forEach(item => {
            item.addEventListener('click', () => {
                const targetSlide = item.dataset.slide;
                const slideIndex = Array.from(slides).findIndex(slide => slide.id === targetSlide);
                if (slideIndex !== -1) {
                    goToSlide(slideIndex);
                }
            });
        });
    }

    // Navigate to specific slide
    function goToSlide(index) {
        if (index >= 0 && index < slides.length) {
            const currentSlideElement = slides[currentSlide];
            currentSlideElement.style.opacity = '0';
            setTimeout(() => {
                currentSlide = index;
                updateSlideVisibility();
                updateNavigationButtons();
            }, 300);
        }
    }

    // Setup keyboard navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    previousSlide();
                    break;
                case 'ArrowRight':
                case 'Space':
                    nextSlide();
                    break;
                case 'Escape':
                    if (currentSlide === slides.length - 1) {
                        backToSlides();
                    }
                    break;
            }
        });
    }

    // Handle window resizing to maintain aspect ratio and scaling
    function setupResizeHandler() {
        function updateSize() {
            const container = document.querySelector('.slide-container');
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const aspectRatio = 16 / 9;

            let width = windowWidth;
            let height = width / aspectRatio;

            if (height > windowHeight) {
                height = windowHeight;
                width = height * aspectRatio;
            }

            container.style.width = `${width}px`;
            container.style.height = `${height}px`;
            
            // Update CSS custom property for scaling
            const scale = Math.min(width / 1920, height / 1080); // Using 1920x1080 as base resolution
            document.documentElement.style.setProperty('--base-unit', `${scale}rem`);
        }

        window.addEventListener('resize', updateSize);
        updateSize(); // Initial call
    }

    // Event Listeners
    prevButton.addEventListener('click', previousSlide);
    nextButton.addEventListener('click', nextSlide);
    backButton.addEventListener('click', backToSlides);

    document.querySelectorAll('.appendix-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            goToAppendix();
        });
    });

    // Handle touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                previousSlide();
            } else {
                nextSlide();
            }
        }
    }

    // Add transition styles
    slides.forEach(slide => {
        slide.style.transition = 'opacity 0.3s ease-in-out';
    });

    // Initialize the presentation
    init();
});
