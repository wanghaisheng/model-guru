/**
 * Model Guru - Main JavaScript
 * Handles all interactive features and animations
 */

import i18n from './i18n.js';
import LanguageSwitcher from './components/LanguageSwitcher.js';

// ===== DOM Elements =====
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const nav = document.querySelector('.nav');
const heroTitle = document.querySelector('.hero-title');
const featureCards = document.querySelectorAll('.feature-card');
const pricingCards = document.querySelectorAll('.pricing-card');
const playgroundContainer = document.querySelector('.playground-container');
const modelSelector = document.querySelector('.model-selector select');
const previewContainer = document.querySelector('.preview-container');
const resultsContainer = document.querySelector('.results-container');
const particlesContainer = document.getElementById('particles-js');
const newsletterForm = document.querySelector('.newsletter-form');

// ===== Header Scroll Effect =====
let lastScroll = 0;
if (header) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
}

// ===== Mobile Menu Toggle =====
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Animate hamburger to X
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans.forEach((span, index) => {
            if (mobileMenu.classList.contains('active')) {
                if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) span.style.opacity = '0';
                if (index === 2) span.style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                span.style.transform = 'none';
                span.style.opacity = '1';
            }
        });
    });
}

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
            
            // Reset hamburger menu
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans.forEach(span => {
                span.style.transform = 'none';
                span.style.opacity = '1';
            });
        }
    });
});

// ===== Hero Title Animation =====
const animateHeroTitle = () => {
    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    
    const typeWriter = () => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    typeWriter();
};

// ===== Feature Cards Animation =====
const animateFeatureCards = () => {
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
};

// ===== Pricing Cards Hover Effect =====
pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('featured')) {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = 'var(--shadow-lg)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('featured')) {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        }
    });
});

// ===== Playground Interactive Features =====
function initializePlayground() {
    const modelSelect = document.getElementById('model-select');
    const paramInput = document.getElementById('param-input');
    const temperatureInput = document.getElementById('temperature');
    const creativityInput = document.getElementById('creativity');
    const generateBtn = document.getElementById('generate-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    const zoomBtn = document.getElementById('zoom-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    // Initialize particles
    initializeParticles();
    
    // Initialize 3D preview
    initialize3DPreview();
    
    // Initialize model comparison
    initializeModelComparison();
    
    // Event Listeners
    modelSelect.addEventListener('change', updatePreview);
    temperatureInput.addEventListener('input', updateParamValue);
    creativityInput.addEventListener('input', updateParamValue);
    generateBtn.addEventListener('click', generateResult);
    rotateBtn.addEventListener('click', rotatePreview);
    zoomBtn.addEventListener('click', zoomPreview);
    resetBtn.addEventListener('click', resetPreview);
    
    // Initialize with default model
    updatePreview();
}

function initializeParticles() {
    const particlesOverlay = document.querySelector('.particles-overlay');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = particlesOverlay.offsetWidth;
    canvas.height = particlesOverlay.offsetHeight;
    particlesOverlay.appendChild(canvas);
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.color = `rgba(13, 110, 253, ${Math.random() * 0.5 + 0.2})`;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }
        
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = particlesOverlay.offsetWidth;
        canvas.height = particlesOverlay.offsetHeight;
    });
}

function initialize3DPreview() {
    const previewContainer = document.querySelector('.preview-container');
    let rotation = 0;
    let zoom = 1;
    
    window.rotatePreview = function() {
        rotation += 90;
        updatePreviewTransform();
    };
    
    window.zoomPreview = function() {
        zoom = zoom === 1 ? 1.5 : 1;
        updatePreviewTransform();
    };
    
    window.resetPreview = function() {
        rotation = 0;
        zoom = 1;
        updatePreviewTransform();
    };
    
    function updatePreviewTransform() {
        previewContainer.style.transform = `rotate(${rotation}deg) scale(${zoom})`;
    }
}

function initializeModelComparison() {
    const modelA = document.getElementById('model-a');
    const modelB = document.getElementById('model-b');
    const metrics = document.querySelectorAll('.metric');
    
    function updateComparison(modelId, metrics) {
        const modelDetails = document.querySelector(`#${modelId} .model-details`);
        const fills = document.querySelectorAll(`.metric-fill.${modelId}-fill`);
        
        // Update model details
        modelDetails.innerHTML = `
            <div class="model-metric">
                <span>Accuracy: ${metrics.accuracy}%</span>
                <span>Speed: ${metrics.speed}ms</span>
                <span>Quality: ${metrics.quality}%</span>
            </div>
        `;
        
        // Update metric bars
        fills.forEach((fill, index) => {
            const value = Object.values(metrics)[index];
            fill.style.width = `${value}%`;
        });
    }
    
    // Example metrics (replace with actual data)
    const metricsA = {
        accuracy: 95,
        speed: 120,
        quality: 90
    };
    
    const metricsB = {
        accuracy: 85,
        speed: 150,
        quality: 80
    };
    
    updateComparison('model-a', metricsA);
    updateComparison('model-b', metricsB);
}

function updateParamValue(event) {
    const value = event.target.value;
    const valueDisplay = event.target.nextElementSibling;
    valueDisplay.textContent = `${value}%`;
}

function generateResult() {
    const modelSelect = document.getElementById('model-select');
    const paramInput = document.getElementById('param-input');
    const resultsContainer = document.querySelector('.results-container');
    
    // Show loading state
    resultsContainer.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Generating results...</p>
        </div>
    `;
    
    // Simulate API call
    setTimeout(() => {
        const model = modelSelect.value;
        const prompt = paramInput.value;
        
        // Example result (replace with actual API response)
        const result = {
            model: model,
            prompt: prompt,
            output: `Sample output for ${model} with prompt: ${prompt}`,
            metrics: {
                accuracy: Math.random() * 100,
                speed: Math.random() * 200 + 100,
                quality: Math.random() * 100
            }
        };
        
        // Update results
        resultsContainer.innerHTML = `
            <div class="result-item">
                <h4>Model: ${result.model}</h4>
                <p>Prompt: ${result.prompt}</p>
                <p>Output: ${result.output}</p>
                <div class="result-metrics">
                    <span>Accuracy: ${result.metrics.accuracy.toFixed(1)}%</span>
                    <span>Speed: ${result.metrics.speed.toFixed(1)}ms</span>
                    <span>Quality: ${result.metrics.quality.toFixed(1)}%</span>
                </div>
            </div>
        `;
        
        // Update comparison
        updateComparison('model-a', result.metrics);
    }, 2000);
}

// ===== Intersection Observer for Animations =====
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .pricing-card, .pain-point-card').forEach(el => {
        observer.observe(el);
    });
};

// ===== Particle Background =====
const createParticleBackground = () => {
    if (!particlesContainer) return;
    
    const particleCount = 50;
    const colors = ['#FF3366', '#00F5FF', '#FFD700', '#9B30FF'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 4 + 2;
        
        // Random color
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        
        // Set styles
        particle.style.cssText = `
            position: absolute;
            left: ${posX}%;
            top: ${posY}%;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            opacity: 0.6;
            animation: float ${duration}s ease-in-out infinite;
        `;
        
        particlesContainer.appendChild(particle);
    }
};

// ===== Newsletter Form =====
const initializeNewsletterForm = () => {
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            showNotification('Thanks for subscribing!', 'success');
            newsletterForm.reset();
        } catch (error) {
            showNotification('Something went wrong. Please try again.', 'error');
        }
    });
};

// ===== Language Change Handler =====
const handleLanguageChange = (lang) => {
    console.log(`Language change requested: ${lang}`);
    // Use the imported i18n instance
    i18n.switchLanguage(lang).then(() => {
        console.log("Language switched successfully in main.js");
        // Add any language-specific UI updates here if needed
        // e.g., re-initialize certain components that depend on language
    }).catch(error => {
        console.error("Error switching language from main.js:", error);
    });
};

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
    initMobileMenu();
    initLoadingOverlay();
    initLanguageSwitcher();
    initHeaderScroll();
    initSmoothScroll();
    initHeroAnimations();
    initFeatureCards();
    initModelCards();
    initParticleBackground();
    initScrollAnimations();
    initModelFilters();
    initSearch();
    initializeModelSelection();
});

/**
 * Initialize language switcher
 */
function initLanguageSwitcher() {
    // Corrected ID selector to match the HTML
    const languageSelect = document.getElementById('languageSwitcher'); 
    if (languageSelect) {
        // Set initial language
        const savedLanguage = localStorage.getItem('language') || 'en';
        languageSelect.value = savedLanguage;
        handleLanguageChange(savedLanguage); // Apply initial language on load
        
        // Handle language change
        languageSelect.addEventListener('change', (e) => {
            handleLanguageChange(e.target.value);
        });
    }
}

/**
 * Update dynamic content based on language
 * @param {string} lang - Current language code
 */
function updateDynamicContent(lang) {
    // Update any content that needs special handling for different languages
    // For example, adjusting layout for languages with different text lengths
    
    // Adjust hero section for languages with longer text
    if (lang === 'zh' || lang === 'ja') {
        document.querySelector('.hero-title').style.fontSize = '2.5rem';
    } else {
        document.querySelector('.hero-title').style.fontSize = '3rem';
    }
}

/**
 * Initialize header scroll effect
 */
function initHeaderScroll() {
    const nav = document.querySelector('.nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            nav.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-up');
            nav.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-down');
            nav.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuButton.classList.toggle('active');
        });
    }
}

/**
 * Initialize smooth scrolling
 */
function initSmoothScroll() {
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
}

/**
 * Initialize hero section animations
 */
function initHeroAnimations() {
    const title = document.querySelector('.hero h1');
    const subtitle = document.querySelector('.hero p');
    const cta = document.querySelector('.hero .btn');
    
    if (!title || !subtitle || !cta) return;

    title.classList.add('animate-in');
    setTimeout(() => subtitle.classList.add('animate-in'), 200);
    setTimeout(() => cta.classList.add('animate-in'), 400);
}

/**
 * Initialize feature cards animations
 */
function initFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });
}

/**
 * Initialize pricing cards hover effects
 */
function initPricingCards() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
    });
}

/**
 * Initialize particle background effect
 */
function initParticleBackground() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: ['#ff00ff', '#00ffff', '#ffff00'] },
            shape: {
                type: 'circle',
                stroke: { width: 0, color: '#000000' },
                polygon: { nb_sides: 5 }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
            },
            size: {
                value: 3,
                random: true,
                anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#ff00ff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: { enable: false, rotateX: 600, rotateY: 1200 }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: { enable: true, mode: 'repulse' },
                onclick: { enable: true, mode: 'push' },
                resize: true
            },
            modes: {
                repulse: { distance: 200, duration: 0.4 },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .model-card, .pain-point-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Model list handling
const mockModels = [
  {
    id: 1,
    name: 'SDXL',
    platform: 'Replicate',
    description: 'Stable Diffusion XL image generation model',
    likes: 1200,
    runs: 50000,
    dateAdded: '2024-04-01',
    category: 'Image Generation'
  },
  // Add more mock models here
];

function filterModels(filters) {
  let filtered = [...mockModels];
  
  if (filters.platform) {
    filtered = filtered.filter(model => model.platform === filters.platform);
  }
  
  if (filters.category) {
    filtered = filtered.filter(model => model.category === filters.category);
  }
  
  return filtered;
}

function sortModels(models, sortBy) {
  const sorted = [...models];
  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
    case 'mostLikes':
      return sorted.sort((a, b) => b.likes - a.likes);
    case 'mostRuns':
      return sorted.sort((a, b) => b.runs - a.runs);
    case 'alphabetical':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

// Track loaded assets and total assets
let loadedAssets = 0;
let totalAssets = 0;
let hasError = false;
let errorCount = 0;
let maxErrors = 3; // Maximum number of errors before forcing hide

// Function to hide loading overlay
const hideLoadingOverlay = () => {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (!loadingOverlay) return;
    
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
    }, 500);
};

// Handle asset loading
const handleAssetLoad = () => {
    loadedAssets++;
    if (loadedAssets >= totalAssets || hasError) {
        hideLoadingOverlay();
    }
};

// Handle asset errors
const handleAssetError = (asset) => {
    errorCount++;
    loadedAssets++;
    
    // Log the error for debugging
    console.warn(`Failed to load asset: ${asset.src || asset.href || 'unknown asset'}`);
    
    // If we have too many errors, force hide the loading overlay
    if (errorCount >= maxErrors) {
        hasError = true;
        hideLoadingOverlay();
    } else if (loadedAssets >= totalAssets) {
        hideLoadingOverlay();
    }
};

// Function to track new assets
const trackNewAsset = (asset) => {
    totalAssets++;
    if (asset.complete || asset.readyState === 4) {
        handleAssetLoad();
    } else {
        asset.addEventListener('load', handleAssetLoad);
        asset.addEventListener('error', () => handleAssetError(asset));
    }
};

// Loading Animation
function initLoadingOverlay() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        // Hide loading overlay when all assets are loaded
        window.addEventListener('load', () => {
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 500);
        });
    }
}

// Update the updateModelList function to track new assets
function updateModelList(filters = {}, sortBy = 'newest') {
    const filtered = filterModels(filters);
    const sorted = sortModels(filtered, sortBy);
    
    const modelList = document.querySelector('#modelList');
    if (!modelList) return;
    
    modelList.innerHTML = sorted.map(model => `
        <div class="model-card" data-model-id="${model.id}">
            <h3>${model.name}</h3>
            <p class="platform">${model.platform}</p>
            <p class="description">${model.description}</p>
            <div class="metrics">
                <span>❤️ ${model.likes}</span>
                <span>🔄 ${model.runs}</span>
            </div>
        </div>
    `).join('');
    
    // After creating model cards, track any new assets
    const newImages = document.querySelectorAll('.model-card img');
    newImages.forEach(trackNewAsset);
}

/**
 * Initialize model filters and sorting
 */
function initModelFilters() {
    const platformFilter = document.querySelector('#platformFilter');
    const categoryFilter = document.querySelector('#categoryFilter');
    const sortSelect = document.querySelector('#sortSelect');
    
    // Initialize filters with default values
    if (platformFilter) {
        platformFilter.addEventListener('change', () => {
            updateModelList({
                platform: platformFilter.value,
                category: categoryFilter?.value
            }, sortSelect?.value);
        });
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', () => {
            updateModelList({
                platform: platformFilter?.value,
                category: categoryFilter.value
            }, sortSelect?.value);
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            updateModelList({
                platform: platformFilter?.value,
                category: categoryFilter?.value
            }, sortSelect.value);
        });
    }
    
    // Initial model list update
    updateModelList();
}

/**
 * Initialize model cards with hover effects and animations
 */
function initModelCards() {
    const modelCards = document.querySelectorAll('.model-card');
    
    modelCards.forEach(card => {
        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
        
        // Add click handler for model details
        card.addEventListener('click', () => {
            const modelId = card.getAttribute('data-model-id');
            if (modelId) {
                window.location.href = `/model/${modelId}`;
            }
        });
        
        // Initialize metrics animations
        const metrics = card.querySelectorAll('.model-metrics .metric');
        metrics.forEach((metric, index) => {
            metric.style.animationDelay = `${index * 0.1}s`;
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
  // Load initial translations
  await loadTranslations(currentLang);
  updateContent();
  
  // Set up language switcher
  const langSwitcher = document.querySelector('#languageSwitcher');
  if (langSwitcher) {
    langSwitcher.value = currentLang;
    langSwitcher.addEventListener('change', (e) => handleLanguageChange(e.target.value));
  }
  
  // Set up model list filters
  const platformFilter = document.querySelector('#platformFilter');
  const categoryFilter = document.querySelector('#categoryFilter');
  const sortSelect = document.querySelector('#sortSelect');
  
  if (platformFilter) {
    platformFilter.addEventListener('change', () => {
      updateModelList({
        platform: platformFilter.value,
        category: categoryFilter?.value
      }, sortSelect?.value);
    });
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      updateModelList({
        platform: platformFilter?.value,
        category: categoryFilter.value
      }, sortSelect?.value);
    });
  }
  
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      updateModelList({
        platform: platformFilter?.value,
        category: categoryFilter?.value
      }, sortSelect.value);
    });
  }
  
  // Initial model list update
  updateModelList();
});

// Theme Switcher
function initThemeSwitcher() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    const html = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
        updateThemeIcon(themeSwitcher.querySelector('i'), savedTheme);
    }
    
    themeSwitcher.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(themeSwitcher.querySelector('i'), newTheme);
    });
}

function updateThemeIcon(icon, theme) {
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Search Functionality
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    if (!searchInput || !searchResults) return;

    let debounceTimer;

    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = searchInput.value.trim();
            if (query.length >= 2) {
                performSearch(query);
            } else {
                searchResults.style.display = 'none';
            }
        }, 300);
    });

    // Close search results when clicking outside
    document.addEventListener('click', (event) => {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = 'none';
        }
    });
}

async function performSearch(query) {
    const searchResults = document.querySelector('.search-results');
    const resultsList = document.querySelector('.search-results-list');
    
    // Simulate API call
    const mockResults = [
        { name: 'SDXL-Turbo', platform: 'Stability AI', category: 'Image Generation' },
        { name: 'Mixtral-8x7B', platform: 'Hugging Face', category: 'Language Model' },
        { name: 'Stable Audio', platform: 'Stability AI', category: 'Audio Generation' }
    ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.platform.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );

    if (resultsList) {
        resultsList.innerHTML = mockResults.map(result => `
            <li class="search-result-item">
                <div class="result-name">${result.name}</div>
                <div class="result-details">
                    <span class="result-platform">${result.platform}</span>
                    <span class="result-category">${result.category}</span>
                </div>
            </li>
        `).join('');
    }

    searchResults.style.display = mockResults.length ? 'block' : 'none';
}

function initializeModelSelection() {
    const modelSearch = document.querySelector('.model-search .form-control');
    const addModelBtn = document.querySelector('.add-model-btn');
    const selectedModels = document.querySelector('.selected-models');
    const selectedCount = document.querySelector('.selected-count');
    const compareBtn = document.querySelector('.comparison-cta .btn-primary');
    
    let selectedModelsList = [];
    const maxFreeModels = 3;
    
    // Example model data (replace with actual API call)
    const availableModels = [
        { id: 'sdxl-turbo', name: 'SDXL-Turbo' },
        { id: 'mixtral-8x7b', name: 'Mixtral-8x7B' },
        { id: 'stable-audio', name: 'Stable Audio' },
        { id: 'dall-e-3', name: 'DALL-E 3' },
        { id: 'gpt-4', name: 'GPT-4' }
    ];
    
    function updateSelectedCount() {
        selectedCount.textContent = selectedModelsList.length;
        compareBtn.disabled = selectedModelsList.length < 2;
    }
    
    function addModel(model) {
        if (selectedModelsList.length >= maxFreeModels) {
            showUpgradePrompt();
            return;
        }
        
        if (!selectedModelsList.includes(model)) {
            selectedModelsList.push(model);
            renderSelectedModels();
            updateSelectedCount();
            updatePreview();
        }
    }
    
    function removeModel(modelId) {
        selectedModelsList = selectedModelsList.filter(m => m.id !== modelId);
        renderSelectedModels();
        updateSelectedCount();
        updatePreview();
    }
    
    function renderSelectedModels() {
        selectedModels.innerHTML = selectedModelsList.map(model => `
            <div class="model-tag" data-model-id="${model.id}">
                <span>${model.name}</span>
                <span class="remove-model">×</span>
            </div>
        `).join('');
        
        // Add click handlers for remove buttons
        document.querySelectorAll('.remove-model').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modelId = e.target.closest('.model-tag').dataset.modelId;
                removeModel(modelId);
            });
        });
    }
    
    function updatePreview() {
        // Update preview with selected models' data
        // This would be replaced with actual API calls
        const previewFields = document.querySelectorAll('.preview-field');
        previewFields.forEach(field => {
            const fieldName = field.querySelector('h5').textContent;
            if (fieldName === 'Model Name' && selectedModelsList.length > 0) {
                field.querySelector('.value').textContent = selectedModelsList[0].name;
            }
            // Add more field updates as needed
        });
    }
    
    function showUpgradePrompt() {
        // Show upgrade modal or redirect to pricing page
        const upgradeModal = document.createElement('div');
        upgradeModal.className = 'upgrade-modal';
        upgradeModal.innerHTML = `
            <div class="upgrade-content">
                <h3>Upgrade to Premium</h3>
                <p>Free users can compare up to 3 models. Upgrade to compare unlimited models and access advanced features.</p>
                <div class="upgrade-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.upgrade-modal').remove()">Not Now</button>
                    <a href="/pricing" class="btn btn-primary">Upgrade Now</a>
                </div>
            </div>
        `;
        document.body.appendChild(upgradeModal);
    }
    
    // Add model button click handler
    addModelBtn.addEventListener('click', () => {
        const searchTerm = modelSearch.value.toLowerCase();
        const matchingModel = availableModels.find(m => 
            m.name.toLowerCase().includes(searchTerm)
        );
        
        if (matchingModel) {
            addModel(matchingModel);
            modelSearch.value = '';
        }
    });
    
    // Initialize
    updateSelectedCount();
} 