// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
});

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
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

// Scroll to section function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Scroll to role function for hero cards
function scrollToRole(roleId) {
    // First scroll to the roles section
    const rolesSection = document.getElementById('roles');
    if (rolesSection) {
        rolesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // After scrolling, highlight the specific role card
        setTimeout(() => {
            const roleCard = document.querySelector(`[data-role="${roleId}"]`);
            if (roleCard) {
                roleCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
                
                // Add temporary highlight effect
                roleCard.style.background = 'rgba(102, 126, 234, 0.1)';
                roleCard.style.border = '2px solid #667eea';
                setTimeout(() => {
                    roleCard.style.background = '';
                    roleCard.style.border = '';
                }, 3000);
            }
        }, 800);
    }
}

// Particle animation for hero background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Initialize particles when page loads
document.addEventListener('DOMContentLoaded', createParticles);

// Modal functions
function openRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        // Redirect to registration page if modal doesn't exist
        window.location.href = 'registration.html';
    }
}

function closeRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function openSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    document.getElementById('successModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const registrationModal = document.getElementById('registrationModal');
    const successModal = document.getElementById('successModal');
    const referralSharingModal = document.getElementById('referralSharingModal');
    
    if (event.target === registrationModal) {
        closeRegistrationModal();
    }
    if (event.target === successModal) {
        closeSuccessModal();
    }
    if (event.target === referralSharingModal) {
        closeReferralSharingModal();
    }
});

// Contact form handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Validate form data
    if (!data.name || !data.email || !data.subject || !data.message) {
        alert('Please fill in all fields.');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Send email using EmailJS or similar service
    // For now, we'll use a simple approach that can be easily integrated
    sendContactEmail(data)
        .then(() => {
            // Reset form
            this.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            openSuccessModal('Thank you for your message! We\'ll get back to you within 24 hours.');
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show error message
            alert('Sorry, there was an error sending your message. Please try again or contact us directly at info@aksharjobs.com');
        });
});

// Initialize EmailJS with actual credentials
const EMAILJS_PUBLIC_KEY = 'eH8UEJPLNPkS36LuT';
const EMAILJS_SERVICE_ID = 'service_kv87gsc';
const EMAILJS_TEMPLATE_ID = 'template_g8dtg3o';

// Initialize EmailJS when the page loads
document.addEventListener('DOMContentLoaded', function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
});

// Function to send contact email
async function sendContactEmail(data) {
    // Check if EmailJS is available
    if (typeof emailjs !== 'undefined') {
        try {
            // Send email using EmailJS with template variables that match your setup
            const result = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    email: 'kalpitpatel751@gmail.com',  // This goes to "To Email" field
                    name: data.name,                    // This goes to {{name}} in content
                    subject: data.subject,              // This goes to subject
                    message: data.message,              // This can be used in content
                    reply_to: data.email                // Use this for Reply-To in template
                }
            );
            
            console.log('Email sent successfully:', result);
            return Promise.resolve();
        } catch (error) {
            console.error('EmailJS error:', error);
            
            // If EmailJS fails, create a mailto link as fallback
            const mailtoLink = `mailto:kalpitpatel751@gmail.com?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(`From: ${data.name} (${data.email})\n\nMessage:\n${data.message}`)}`;
            
            // Open mailto link in new tab
            window.open(mailtoLink, '_blank');
            
            console.log('EmailJS failed, opened mailto link:', {
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                timestamp: new Date().toISOString()
            });
            
            // Still show success to user
            return Promise.resolve();
        }
    } else {
        // Fallback: Log the data and simulate success
        console.log('Contact form submission (EmailJS not available):', {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            timestamp: new Date().toISOString()
        });
        
        // Simulate successful send
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1500);
        });
    }
}

// Google Sheets integration via Google Apps Script (KEPT AS BACKUP/FALLBACK)
const REGISTRATION_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwjl75BoBiVOf2vEKXSioM7_ZhY1n5q5DluxxgGjx6uHK21b6KffVC94NGMqlaUN3XklQ/exec';

// Helper: persist a local backup so nothing is lost at expo
function saveRegistrationLocalBackup(reg) {
    try {
        const key = 'expo_registrations_backup_v1';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.push({ ...reg, savedAt: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(list));
    } catch (_) {
        // ignore storage issues silently
    }
}

async function sendRegistration(data) {
    // PRIORITY 1: Try MongoDB Backend API (faster, more reliable)
    if (window.USE_MONGODB_API && window.ExpoAPIClient) {
        try {
            console.log('🚀 Attempting MongoDB API registration...');
            const result = await ExpoAPIClient.registerUser(data);
            
            if (result.success) {
                console.log('✅ MongoDB registration successful:', result.data);
                
                // Process referral registration if referrer exists
                const urlParams = new URLSearchParams(window.location.search);
                const referrerEmail = urlParams.get('ref') || urlParams.get('referrer');
                
                if (referrerEmail && data.email) {
                    console.log('Processing referral registration for referrer:', referrerEmail);
                    processReferralRegistrationMongoDB(referrerEmail, data);
                }
                
                return; // Success - no need to use Google Sheets
            } else {
                console.warn('⚠️ MongoDB registration failed, falling back to Google Sheets:', result.error);
            }
        } catch (err) {
            console.warn('⚠️ MongoDB API error, falling back to Google Sheets:', err);
        }
    } else {
        console.log('ℹ️ MongoDB API disabled or not available, using Google Sheets');
    }
    
    // FALLBACK: Original Google Sheets integration (kept intact)
    // Check for referral parameters in URL
    const urlParams = new URLSearchParams(window.location.search);
    const referrerEmail = urlParams.get('ref') || urlParams.get('referrer');
    
    // 1) Try Google Sheets via URL parameters (bypasses CORS completely)
    if (REGISTRATION_WEBHOOK_URL && REGISTRATION_WEBHOOK_URL !== 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
        try {
            // Create URL with parameters
            const params = new URLSearchParams(data);
            const url = `${REGISTRATION_WEBHOOK_URL}?${params.toString()}`;
            
            console.log('Sending registration to:', url);
            console.log('Data being sent:', data);
            
            // Open in new tab (this will trigger doGet in Google Apps Script)
            window.open(url, '_blank');
            
            console.log('Registration data submitted to Google Sheets via URL');
            
            // Process referral registration if referrer exists AND user has valid email
            if (referrerEmail && data.email) {
                console.log('Processing referral registration for referrer:', referrerEmail);
                console.log('Referred user email:', data.email);
                processReferralRegistration(referrerEmail, data);
            }
        } catch (err) {
            console.warn('Google Sheets submission failed (email backup will work):', err);
        }
    }

    // 2) Send an email via EmailJS to capture the lead
    if (typeof emailjs !== 'undefined') {
        const roleLabel = data.role === 'recruiter' ? 'Recruiter' : 'Job Seeker';
        const subject = `Launch Notification Signup - ${roleLabel}`;
        const message = `New launch notification signup\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone}\nRole: ${roleLabel}\n\nThis person wants to be notified when AksharJobs launches!`;

        try {
            await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                {
                    email: 'kalpitpatel751@gmail.com',
                    name: data.name,
                    subject: subject,
                    message: message,
                    reply_to: data.email
                }
            );
        } catch (err) {
            console.warn('Registration email failed, fallback continues:', err);
        }
    }
}

// Dynamic form field handling
document.addEventListener('DOMContentLoaded', function() {
    const roleInputs = document.querySelectorAll('input[name="role"]');
    const roleSpecificFields = document.querySelectorAll('.role-specific-fields');
    const selectedRoleDisplay = document.getElementById('selectedRoleDisplay');
    const selectedRoleIcon = document.querySelector('.selected-role-icon');
    const selectedRoleText = document.querySelector('.selected-role-text strong');
    
    // Role mapping for display
    const roleMapping = {
        'job_seeker': { name: 'Job Seekers', icon: 'fas fa-search' },
        'recruiter': { name: 'Recruiters', icon: 'fas fa-user-tie' },
        'mentor': { name: 'Mentors', icon: 'fas fa-lightbulb' },
        'trainer': { name: 'Trainers', icon: 'fas fa-chalkboard-teacher' },
        'consultant': { name: 'Consultants', icon: 'fas fa-chart-line' },
        'volunteer': { name: 'Volunteers', icon: 'fas fa-heart' },
        'intern': { name: 'Interns', icon: 'fas fa-graduation-cap' },
        'community': { name: 'Communities', icon: 'fas fa-users' },
        'university': { name: 'Universities', icon: 'fas fa-university' }
    };
    
    roleInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Hide all role-specific fields
            roleSpecificFields.forEach(field => {
                field.style.display = 'none';
            });
            
            // Show fields for selected role
            const selectedRole = this.value;
            const targetFields = document.getElementById(selectedRole + 'Fields');
            if (targetFields) {
                targetFields.style.display = 'block';
            }
            
            // Update selected role display
            if (selectedRoleDisplay && roleMapping[selectedRole]) {
                const roleInfo = roleMapping[selectedRole];
                selectedRoleIcon.className = `selected-role-icon ${roleInfo.icon}`;
                selectedRoleText.textContent = roleInfo.name;
                selectedRoleDisplay.style.display = 'block';
            }
        });
    });
});

// Registration form handling (moved to registration.html)
// This code is no longer needed as the registration form is on a separate page

// Magic Bento Card Effects
function initMagicBentoEffects() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--glow-x', `${x}%`);
            card.style.setProperty('--glow-y', `${y}%`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--glow-x', '50%');
            card.style.setProperty('--glow-y', '50%');
        });
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .about-feature, .contact-item').forEach(el => {
    observer.observe(el);
});

// Counter animation for hero stats only
function animateCounters() {
    // Only target stat numbers in the hero section, not feature cards
    const heroStats = document.querySelector('.hero-stats');
    if (!heroStats) return;
    
    const counters = heroStats.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const originalText = counter.textContent;
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (originalText.includes('%')) {
                counter.textContent = Math.floor(current) + '%';
            } else if (originalText.includes('x')) {
                counter.textContent = Math.floor(current) + 'x';
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Floating cards animation enhancement
function enhanceFloatingCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            const randomRotate = (Math.random() - 0.5) * 10;
            
            card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
        }, 3000 + index * 500);
    });
}

// Initialize floating cards animation
document.addEventListener('DOMContentLoaded', enhanceFloatingCards);

// Initialize magic bento effects
document.addEventListener('DOMContentLoaded', initMagicBentoEffects);

// Rolling Card Effects
function initRollingCardEffects() {
    const rollingCards = document.querySelectorAll('.rolling-card');
    
    rollingCards.forEach((card, index) => {
        // Add staggered entrance animation
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            this.style.transform = 'translateY(-15px) rotateX(10deg) rotateY(5deg) scale(1.03)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            this.style.transform = '';
        });
        
        // Add click effect
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-20px) rotateX(15deg) rotateY(10deg) scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
        
        // Add touch support for mobile
        card.addEventListener('touchstart', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(2deg) scale(1.02)';
        });
        
        card.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Initialize rolling card effects
document.addEventListener('DOMContentLoaded', initRollingCardEffects);

// New Countdown Timer for October 20th, 2025
function startCountdown() {
    const targetDate = new Date('October 20, 2025 00:00:00').getTime();
    
    function updateTimer() {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;
        
        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            // Update the display
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            
            if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
            if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
            if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
            if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
        } else {
            // Launch date has passed
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');
            
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
        }
    }
    
    // Start the countdown immediately
    updateTimer();
    
    // Update every second
    setInterval(updateTimer, 1000);
}

// Sticky CTA Bar
function initStickyCTA() {
    const stickyCta = document.getElementById('stickyCta');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100 && currentScrollY > lastScrollY) {
            // Scrolling down - show sticky CTA
            stickyCta.classList.add('show');
        } else if (currentScrollY < 50) {
            // Near top - hide sticky CTA
            stickyCta.classList.remove('show');
        }
        
        lastScrollY = currentScrollY;
    });
}

// Social Share Functions
function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('🚀 Excited about AksharJobs - AI-powered job portal launching October 20th, 2025! Join the waitlist now! #AksharJobs #AI #JobPortal #Global');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&utm_source=twitter&utm_medium=social&utm_campaign=expo2025`, '_blank');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('AksharJobs - AI-Powered Job Portal');
    const summary = encodeURIComponent('Revolutionizing recruitment with advanced AI, multilingual support, and cultural intelligence. Launching October 20th, 2025!');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}&utm_source=linkedin&utm_medium=social&utm_campaign=expo2025`, '_blank');
}

function shareOnWhatsApp() {
    const text = encodeURIComponent('🚀 Check out AksharJobs - AI-powered job portal launching October 20th, 2025! Join the waitlist: ');
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}${url}&utm_source=whatsapp&utm_medium=social&utm_campaign=expo2025`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&utm_source=facebook&utm_medium=social&utm_campaign=expo2025`, '_blank');
}

// Referral Program
function copyReferralCode() {
    const referralCode = document.getElementById('referralCode');
    const text = referralCode.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        const originalText = referralCode.textContent;
        referralCode.textContent = 'Copied!';
        referralCode.style.background = '#10b981';
        referralCode.style.color = 'white';
        referralCode.style.borderColor = '#10b981';
        
        // Track coin earning for copying
        trackReferralShare('copy');
        
        setTimeout(() => {
            referralCode.textContent = originalText;
            referralCode.style.background = '#f8fafc';
            referralCode.style.color = '#1e293b';
            referralCode.style.borderColor = '#cbd5e1';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Track coin earning for copying
        trackReferralShare('copy');
        
        alert('Referral code copied to clipboard!');
    });
}

// Referral Sharing Functions with proper validation
function shareReferralViaWhatsApp() {
    const referralCode = 'AKSHAR2025';
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const referrerEmail = userData.email || 'anonymous@example.com';
    
    // Create referral URL with referrer email
    const baseUrl = window.location.origin + window.location.pathname;
    const referralUrl = `${baseUrl}?ref=${encodeURIComponent(referrerEmail)}`;
    
    const message = `www.AksharJobs.com
🌟 Imagine this...

What if finding your dream opportunity didn't take months of endless searching?
What if the perfect match was just minutes away?

Welcome to AksharJobs ✨

🧠 Powered by Advanced AI
Our intelligent system doesn't just match keywords... it understands you. Your skills. Your aspirations. Your unique potential.

🌍 Speaks Your Language
Breaking barriers with true multilingual support. Because opportunity shouldn't be limited by language.

💫 Culturally Intelligent
Built for the global market. Designed to understand what makes you unique.

One Platform. Infinite Connections.

Whether you're a:
• Job Seeker ready for your breakthrough
• Recruiter hunting for exceptional talent
• Mentor eager to guide the next generation
• Trainer sharing transformative knowledge
• Consultant offering expertise
• Volunteer making a difference
• Intern starting your journey
• Community builder
• University shaping futures
• HR professional
• NGO creating impact
• Evangelist spreading innovation

You belong here.... 🤝

🎁 Here's the beautiful part:
Earn AksharCoins with every interaction.
Use them to unlock premium features.
Completely free.

Your success shouldn't cost a fortune. It should reward you.

⚡ Minutes, not months.
💎 Perfect matches, not compromises.
🚀 Your future, starting now.

AksharJobs - Where opportunities find you.
Connect | Discover | Elevate

Ready to revolutionize your journey?
Join the awesome Network for pre-launch & start earning AksharCoins...

Register here: ${referralUrl}
Use my referral code: ${referralCode}`;
    
    const encodedMessage = encodeURIComponent(message);
    
    // Show confirmation dialog and open WhatsApp
    showShareConfirmationDialog('whatsapp', () => {
        // Open WhatsApp share window
        window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
    });
}

function shareReferralViaEmail() {
    const referralCode = 'AKSHAR2025';
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const referrerEmail = userData.email || 'anonymous@example.com';
    
    // Create referral URL with referrer email
    const baseUrl = window.location.origin + window.location.pathname;
    const referralUrl = `${baseUrl}?ref=${encodeURIComponent(referrerEmail)}`;
    
    const subject = 'Join AksharJobs - Where Opportunities Find You';
    const body = `www.AksharJobs.com
🌟 Imagine this...

What if finding your dream opportunity didn't take months of endless searching?
What if the perfect match was just minutes away?

Welcome to AksharJobs ✨

🧠 Powered by Advanced AI
Our intelligent system doesn't just match keywords... it understands you. Your skills. Your aspirations. Your unique potential.

🌍 Speaks Your Language
Breaking barriers with true multilingual support. Because opportunity shouldn't be limited by language.

💫 Culturally Intelligent
Built for the global market. Designed to understand what makes you unique.

One Platform. Infinite Connections.

Whether you're a:
• Job Seeker ready for your breakthrough
• Recruiter hunting for exceptional talent
• Mentor eager to guide the next generation
• Trainer sharing transformative knowledge
• Consultant offering expertise
• Volunteer making a difference
• Intern starting your journey
• Community builder
• University shaping futures
• HR professional
• NGO creating impact
• Evangelist spreading innovation

You belong here.... 🤝

🎁 Here's the beautiful part:
Earn AksharCoins with every interaction.
Use them to unlock premium features.
Completely free.

Your success shouldn't cost a fortune. It should reward you.

⚡ Minutes, not months.
💎 Perfect matches, not compromises.
🚀 Your future, starting now.

AksharJobs - Where opportunities find you.
Connect | Discover | Elevate

Ready to revolutionize your journey?
Join the awesome Network for pre-launch & start earning AksharCoins...

Register here: ${referralUrl}
Use my referral code: ${referralCode}`;
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Show confirmation dialog and open email
    showShareConfirmationDialog('email', () => {
        window.open(mailtoLink, '_blank');
    });
}

function shareReferralViaSMS() {
    const referralCode = 'AKSHAR2025';
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const referrerEmail = userData.email || 'anonymous@example.com';
    
    // Create referral URL with referrer email
    const baseUrl = window.location.origin + window.location.pathname;
    const referralUrl = `${baseUrl}?ref=${encodeURIComponent(referrerEmail)}`;
    
    const message = `🚀 Join AksharJobs - Where Opportunities Find You!

🧠 AI-Powered • 🌍 Multilingual • 💫 Culturally Intelligent

Earn AksharCoins with every interaction!
⚡ Minutes, not months • 💎 Perfect matches

Register: ${referralUrl}
Code: ${referralCode}`;
    
    const smsLink = `sms:?body=${encodeURIComponent(message)}`;
    
    // Show confirmation dialog and open SMS
    showShareConfirmationDialog('sms', () => {
        window.open(smsLink, '_blank');
    });
}

function shareReferralViaLinkedIn() {
    const referralCode = 'AKSHAR2025';
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const referrerEmail = userData.email || 'anonymous@example.com';
    
    // Create referral URL with referrer email
    const baseUrl = window.location.origin + window.location.pathname;
    const referralUrl = `${baseUrl}?ref=${encodeURIComponent(referrerEmail)}`;
    
    const title = 'AksharJobs - Where Opportunities Find You';
    const summary = `www.AksharJobs.com
🌟 Imagine this...

What if finding your dream opportunity didn't take months of endless searching? What if the perfect match was just minutes away?

Welcome to AksharJobs ✨

🧠 Powered by Advanced AI - Our intelligent system understands you. Your skills. Your aspirations. Your unique potential.

🌍 Speaks Your Language - Breaking barriers with true multilingual support.

💫 Culturally Intelligent - Built for the global market.

One Platform. Infinite Connections.

Whether you're a Job Seeker, Recruiter, Mentor, Trainer, Consultant, Volunteer, Intern, Community builder, University, HR professional, NGO, or Evangelist - You belong here.... 🤝

🎁 Earn AksharCoins with every interaction. Use them to unlock premium features. Completely free.

⚡ Minutes, not months.
💎 Perfect matches, not compromises.
🚀 Your future, starting now.

Join the awesome Network for pre-launch & start earning AksharCoins...

Register: ${referralUrl}
Code: ${referralCode}

#AksharJobs #AI #CareerOpportunities #Innovation`;
    
    const url = encodeURIComponent(referralUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedSummary = encodeURIComponent(summary);
    
    // Show confirmation dialog and open LinkedIn
    showShareConfirmationDialog('linkedin', () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${encodedTitle}&summary=${encodedSummary}`, '_blank');
    });
}

function shareReferralViaTwitter() {
    const referralCode = 'AKSHAR2025';
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const referrerEmail = userData.email || 'anonymous@example.com';
    
    // Create referral URL with referrer email
    const baseUrl = window.location.origin + window.location.pathname;
    const referralUrl = `${baseUrl}?ref=${encodeURIComponent(referrerEmail)}`;
    
    const text = `🚀 Join AksharJobs - Where Opportunities Find You

🧠 AI-Powered matching
🌍 Multilingual support
💫 Culturally intelligent
🎁 Earn AksharCoins

⚡ Minutes, not months
💎 Perfect matches, not compromises

Join now: ${referralUrl}
Code: ${referralCode}

#AksharJobs #AI #CareerOpportunities`;
    const encodedText = encodeURIComponent(text);
    
    // Show confirmation dialog and open Twitter
    showShareConfirmationDialog('twitter', () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
    });
}

function shareReferralViaFacebook() {
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const referrerEmail = userData.email || 'anonymous@example.com';
    
    // Create referral URL with referrer email
    const baseUrl = window.location.origin + window.location.pathname;
    const referralUrl = `${baseUrl}?ref=${encodeURIComponent(referrerEmail)}`;
    
    const url = encodeURIComponent(referralUrl);
    
    // Show confirmation dialog and open Facebook
    showShareConfirmationDialog('facebook', () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    });
}

function shareReferralViaTelegram() {
    const referralCode = 'AKSHAR2025';
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const referrerEmail = userData.email || 'anonymous@example.com';
    
    // Create referral URL with referrer email
    const baseUrl = window.location.origin + window.location.pathname;
    const referralUrl = `${baseUrl}?ref=${encodeURIComponent(referrerEmail)}`;
    
    const message = `🚀 Join AksharJobs - Where Opportunities Find You

🧠 AI-Powered matching that understands YOU
🌍 Multilingual support - No language barriers
💫 Culturally intelligent for global market
🎁 Earn AksharCoins with every interaction

⚡ Minutes, not months
💎 Perfect matches, not compromises
🚀 Your future, starting now

Join the awesome Network for pre-launch & start earning AksharCoins...

Register: ${referralUrl}
Code: ${referralCode}`;
    
    const encodedMessage = encodeURIComponent(message);
    
    // Show confirmation dialog and open Telegram
    showShareConfirmationDialog('telegram', () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodedMessage}`, '_blank');
    });
}

// Universal sharing function with proper share confirmation
function shareReferralViaNative() {
    if (navigator.share) {
        const referralCode = 'AKSHAR2025';
        const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
        const referrerEmail = userData.email || 'anonymous@example.com';
        
        // Create referral URL with referrer email
        const baseUrl = window.location.origin + window.location.pathname;
        const referralUrl = `${baseUrl}?ref=${encodeURIComponent(referrerEmail)}`;
        
        navigator.share({
            title: 'AksharJobs - Where Opportunities Find You',
            text: `🚀 Join AksharJobs - Where opportunities find you!\n\n🧠 AI-Powered • 🌍 Multilingual • 💫 Culturally Intelligent\n\nEarn AksharCoins with every interaction!\n\nRegister: ${referralUrl}\nCode: ${referralCode}`,
            url: referralUrl
        }).then(() => {
            // Share was successful - user confirmed and completed the share
            trackReferralShare('native');
            showNotification('✅ Share successful! +3 AksharCoins earned!', 'success');
        }).catch((error) => {
            // User cancelled the share or it failed
            console.log('Share cancelled or failed:', error);
            if (error.name === 'AbortError') {
                showNotification('❌ Share cancelled. No coins awarded.', 'info');
            } else {
                // Fallback to copy to clipboard
                copyReferralCode();
            }
        });
    } else {
        // Fallback to copy to clipboard
        copyReferralCode();
    }
}

// AksharCoins system
const AKSHAR_COINS_REWARDS = {
    'whatsapp': 3,      // All platforms now give 3 coins
    'email': 3,         // All platforms now give 3 coins
    'sms': 3,           // All platforms now give 3 coins
    'linkedin': 3,      // All platforms now give 3 coins
    'twitter': 3,       // All platforms now give 3 coins
    'facebook': 3,      // All platforms now give 3 coins
    'telegram': 3,      // All platforms now give 3 coins
    'native': 3,        // All platforms now give 3 coins
    'copy': 3           // All platforms now give 3 coins
};

// Get coins earned for platform
function getCoinsForPlatform(platform) {
    return AKSHAR_COINS_REWARDS[platform] || 3;
}

// Update user's coin balance
function updateUserCoins(coinsEarned) {
    const currentCoins = parseInt(localStorage.getItem('aksharCoins') || '0');
    const newTotal = currentCoins + coinsEarned;
    localStorage.setItem('aksharCoins', newTotal.toString());
    updateCoinDisplay();
    return newTotal;
}

// Update coin display in UI
function updateCoinDisplay() {
    const currentCoins = parseInt(localStorage.getItem('aksharCoins') || '0');
    const coinElements = document.querySelectorAll('.akshar-coins-display');
    coinElements.forEach(element => {
        element.textContent = currentCoins;
    });
    
    // Update coin display in referral modal
    const modalCoinDisplay = document.getElementById('modalCoinDisplay');
    if (modalCoinDisplay) {
        modalCoinDisplay.textContent = currentCoins;
    }
}

// Referral Modal Functions
function showReferralSharingModal() {
    document.getElementById('referralSharingModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Update modal stats
    updateModalStats();
}

function closeReferralSharingModal() {
    document.getElementById('referralSharingModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateAksharCoinsDisplay() {
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const coinsElement = document.getElementById('aksharCoins');
    if (coinsElement) {
        coinsElement.textContent = userData.aksharCoins || 0;
    }
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set background color based on type
    let backgroundColor = '#28a745'; // success (green)
    if (type === 'error') {
        backgroundColor = '#dc3545'; // error (red)
    } else if (type === 'warning') {
        backgroundColor = '#ffc107'; // warning (orange/yellow)
    } else if (type === 'info') {
        backgroundColor = '#17a2b8'; // info (blue)
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: ${type === 'warning' ? '#000' : 'white'};
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds (4 seconds for warnings)
    const displayTime = type === 'warning' ? 4000 : 3000;
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, displayTime);
}

function updateModalStats() {
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const referralData = JSON.parse(localStorage.getItem('aksharReferralData') || '{}');
    
    // Update coin display
    const modalCoinDisplay = document.getElementById('modalCoinDisplay');
    if (modalCoinDisplay) {
        modalCoinDisplay.textContent = userData.aksharCoins || 0;
    }
    
    // Update referral count
    const modalReferralCount = document.getElementById('modalReferralCount');
    if (modalReferralCount) {
        modalReferralCount.textContent = referralData.totalReferrals || 0;
    }
    
    // Update total coins earned
    const modalTotalCoins = document.getElementById('modalTotalCoins');
    if (modalTotalCoins) {
        modalTotalCoins.textContent = userData.totalCoinsEarned || 0;
    }
}

// Google Sheets integration for referrals
const REFERRAL_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwjl75BoBiVOf2vEKXSioM7_ZhY1n5q5DluxxgGjx6uHK21b6KffVC94NGMqlaUN3XklQ/exec';

// Track last action to prevent duplicates
let lastReferralAction = null;
let referralActionTimeout = null;

// Store platform-specific share tracking to prevent duplicate shares per platform
function hasSharedOnPlatform(platform) {
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const shareHistory = JSON.parse(localStorage.getItem('aksharShareHistory') || '{}');
    const userEmail = userData.email || 'anonymous@example.com';
    
    // Check if user has already shared on this platform
    const platformKey = `${userEmail}_${platform}`;
    return shareHistory[platformKey] === true;
}

function markPlatformAsShared(platform) {
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const shareHistory = JSON.parse(localStorage.getItem('aksharShareHistory') || '{}');
    const userEmail = userData.email || 'anonymous@example.com';
    
    // Mark this platform as shared for this user
    const platformKey = `${userEmail}_${platform}`;
    shareHistory[platformKey] = true;
    shareHistory[`${platformKey}_timestamp`] = new Date().toISOString();
    
    localStorage.setItem('aksharShareHistory', JSON.stringify(shareHistory));
}

// Enhanced referral share tracking with Google Sheets sync
function trackReferralShare(platform) {
    console.log('📊 Tracking referral share:', platform);
    
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    
    if (!userData.email) {
        console.log('❌ No user data found for referral tracking');
        return;
    }
    
    // Update local referral data
    const referralData = JSON.parse(localStorage.getItem('aksharReferralData') || '{}');
    referralData.totalShares = (referralData.totalShares || 0) + 1;
    referralData[platform + 'Shares'] = (referralData[platform + 'Shares'] || 0) + 1;
    localStorage.setItem('aksharReferralData', JSON.stringify(referralData));
    
    // Update user coins
    const coinsEarned = 3; // 3 coins per share
    userData.aksharCoins = (userData.aksharCoins || 0) + coinsEarned;
    localStorage.setItem('aksharUserData', JSON.stringify(userData));
    
    // Sync with Google Sheets
    syncReferralShareWithGoogleSheets(userData, platform, coinsEarned, referralData);
    
    // Update UI
    updateStats();
    
    console.log('✅ Referral share tracked locally:', { platform, coinsEarned, totalShares: referralData.totalShares });
}

// Sync referral share with Google Sheets
async function syncReferralShareWithGoogleSheets(userData, platform, coinsEarned, referralData) {
    if (!REFERRAL_WEBHOOK_URL || REFERRAL_WEBHOOK_URL === 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
        console.log('Referral webhook not configured, skipping Google Sheets sync');
        return;
    }
    
    try {
        const shareData = {
            type: 'referral_share',
            referrerEmail: userData.email,
            referrerName: userData.name || userData.fullName,
            platform: platform,
            coinsEarned: coinsEarned,
            totalShares: referralData.totalShares,
            shareCount: referralData[platform + 'Shares'] || 1,
            timestamp: new Date().toISOString()
        };
        
        const syncUrl = `${REFERRAL_WEBHOOK_URL}?${Object.keys(shareData).map(key => `${key}=${encodeURIComponent(shareData[key])}`).join('&')}`;
        console.log('🔄 Syncing referral share with Google Sheets:', syncUrl);
        
        // Use iframe method for sync (non-blocking)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = syncUrl;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
        }, 2000);
        
    } catch (error) {
        console.log('⚠️ Referral share sync failed (non-critical):', error);
    }
}

// Share confirmation dialog to ensure user actually shares
function showShareConfirmationDialog(platform, onConfirm) {
    // Show immediate instruction dialog first
    const instructionMessage = `📱 SHARE INSTRUCTIONS for ${platform.toUpperCase()}:\n\n1. The share window will open\n2. Complete the share by sending/posting the message\n3. Come back here and click "I Shared" button\n\n⚠️ You will NOT get coins just for opening the share window!\nYou MUST actually share the message to earn coins.`;
    
    const proceed = confirm(instructionMessage);
    
    if (!proceed) {
        showNotification('❌ Share cancelled. No coins awarded.', 'info');
        return;
    }
    
    // Open the share window first
    onConfirm();
    
    // Then show the verification dialog after a delay
    setTimeout(() => {
        const verificationMessage = `✅ VERIFICATION REQUIRED:\n\nDid you ACTUALLY share the message on ${platform}?\n\n⚠️ Only click "YES" if you:\n• Opened the share window AND\n• Sent/posted the message AND\n• Completed the share action\n\n❌ Do NOT click "YES" if you just opened and closed the share window!`;
        
        const actuallyShared = confirm(verificationMessage);
        
        if (actuallyShared) {
            // User confirmed they actually shared
            // Now give coins
            const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
            const referralData = JSON.parse(localStorage.getItem('aksharReferralData') || '{}');
            
            // Check if already shared on this platform
            if (hasSharedOnPlatform(platform)) {
                showNotification(`⚠️ You've already shared on ${platform}. Try a different platform!`, 'warning');
                return;
            }
            
            // Mark platform as shared
            markPlatformAsShared(platform);
            
            // Give coins
            const coinsEarned = 3;
            userData.aksharCoins = (userData.aksharCoins || 0) + coinsEarned;
            referralData.totalShares = (referralData.totalShares || 0) + 1;
            referralData.totalCoinsEarned = (referralData.totalCoinsEarned || 0) + coinsEarned;
            referralData.platformShares = referralData.platformShares || {};
            referralData.platformShares[platform] = (referralData.platformShares[platform] || 0) + 1;
            
            // Save to localStorage
            localStorage.setItem('aksharUserData', JSON.stringify(userData));
            localStorage.setItem('aksharReferralData', JSON.stringify(referralData));
            
            // Update displays
            updateModalStats();
            loadUserData();
            updateStats();
            
            // Send to backend
            sendShareToBackend(userData, platform, coinsEarned, referralData);
            
            // Show success message
            showNotification(`🎉 +${coinsEarned} AksharCoins earned! You successfully shared on ${platform}!`, 'success');
            
        } else {
            // User admitted they didn't actually share
            showNotification('❌ No coins awarded. Please actually share the message to earn coins!', 'info');
        }
    }, 3000); // 3 second delay to let them complete the share
}

// Send share data to backend
function sendShareToBackend(userData, platform, coinsEarned, referralData) {
    // PRIORITY 1: Try MongoDB API
    if (window.USE_MONGODB_API && window.ExpoAPIClient) {
        trackReferralShareMongoDB(userData, platform).then(success => {
            if (success) {
                console.log('✅ MongoDB referral share tracking successful');
            } else {
                console.log('⚠️ MongoDB failed, falling back to Google Sheets');
                sendReferralDataToSheets({
                    type: 'referral_share',
                    referrerName: userData.fullName || 'Anonymous',
                    referrerEmail: userData.email || 'anonymous@example.com',
                    referrerPhone: userData.phone || '',
                    referrerRole: userData.role || 'unknown',
                    platform: platform,
                    referredEmail: '',
                    coinsEarned: coinsEarned,
                    timestamp: new Date().toISOString(),
                    referralCode: 'AKSHAR2025',
                    totalCoins: userData.aksharCoins,
                    totalShares: referralData.totalShares,
                    shareCount: referralData.platformShares[platform] || 1,
                    source: 'landing_page'
                });
            }
        });
    } else {
        // Fallback to Google Sheets
        sendReferralDataToSheets({
            type: 'referral_share',
            referrerName: userData.fullName || 'Anonymous',
            referrerEmail: userData.email || 'anonymous@example.com',
            referrerPhone: userData.phone || '',
            referrerRole: userData.role || 'unknown',
            platform: platform,
            referredEmail: '',
            coinsEarned: coinsEarned,
            timestamp: new Date().toISOString(),
            referralCode: 'AKSHAR2025',
            totalCoins: userData.aksharCoins,
            totalShares: referralData.totalShares,
            shareCount: referralData.platformShares[platform] || 1,
            source: 'landing_page'
        });
    }
}

// ========== MongoDB Referral Functions (NEW - Faster & More Reliable) ==========

// MongoDB: Process referral registration
async function processReferralRegistrationMongoDB(referrerEmail, receiverData) {
    if (!window.USE_MONGODB_API || !window.ExpoAPIClient) {
        console.log('MongoDB API not available, skipping MongoDB referral tracking');
        return;
    }
    
    try {
        console.log('🚀 Processing MongoDB referral registration:', { referrerEmail, receiverData });
        
        // Track the referral registration in MongoDB
        const result = await ExpoAPIClient.trackReferral({
            type: 'referral',
            referrerName: 'Referrer',  // Will be looked up in backend
            referrerEmail: referrerEmail,
            referrerPhone: '',
            referrerRole: 'unknown',
            referredEmail: receiverData.email,  // KEY: Identifies who was referred
            platform: 'registration',
            referralCode: 'AKSHAR2025'
        });
        
        if (result.success) {
            console.log('✅ MongoDB referral registration successful:', result.data);
            
            // Give coins to the receiver locally (3 coins for registering via referral)
            giveReceiverCoins(receiverData, 3);
        } else {
            console.warn('⚠️ MongoDB referral tracking failed:', result.error);
        }
    } catch (error) {
        console.error('❌ MongoDB referral processing error:', error);
    }
}

// MongoDB: Track referral share
async function trackReferralShareMongoDB(userData, platform) {
    if (!window.USE_MONGODB_API || !window.ExpoAPIClient) {
        console.log('MongoDB API not available, skipping MongoDB referral tracking');
        return false;
    }
    
    try {
        console.log('🚀 Tracking MongoDB referral share:', { userData, platform });
        
        const result = await ExpoAPIClient.trackReferral({
            type: 'referral',
            referrerName: userData.name || userData.fullName,
            referrerEmail: userData.email,
            referrerPhone: userData.phone || '',
            referrerRole: userData.role || 'unknown',
            platform: platform,
            referralCode: userData.referralCode || 'AKSHAR2025'
        });
        
        if (result.success) {
            console.log('✅ MongoDB referral share tracked:', result.data);
            
            // Check if this was a duplicate share
            if (result.data.isDuplicate || result.data.actionType === 'duplicate_share') {
                showNotification(`⚠️ You already shared on ${platform}. Try a different platform to earn more coins!`, 'warning');
                return true; // Still successful, just no coins awarded
            }
            
            // Update local coins display if coins were earned
            if (result.data.coinsEarned && result.data.coinsEarned > 0) {
                userData.aksharCoins = result.data.totalCoins;
                userData.referralCount = result.data.referralCount;
                localStorage.setItem('aksharUserData', JSON.stringify(userData));
                updateAksharCoinsDisplay();
                
                // Show success notification with coins earned
                showNotification(`🎉 +${result.data.coinsEarned} AksharCoins! First time sharing on ${platform}!`, 'success');
            }
            
            return true;
        } else {
            console.warn('⚠️ MongoDB referral share tracking failed:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ MongoDB referral share tracking error:', error);
        return false;
    }
}

// ========== Google Sheets Referral Functions (KEPT AS BACKUP/FALLBACK) ==========

// Function to handle when someone registers via referral link
function processReferralRegistration(referrerEmail, receiverData) {
    console.log('Processing referral registration:', { referrerEmail, receiverData });
    
    // Important: Only award coins once per unique referral
    // The backend will check if this referrer-receiver pair already exists
    
    // Send to Google Sheets with BOTH referrer and referred emails
    // This allows the backend to track unique referrals
    // Referrer gets 1 coin bonus, receiver gets 3 coins for registering
    sendReferralRegistrationToSheets({
        type: 'referral',
        referrerName: 'Referrer',  // Will be looked up in backend
        referrerEmail: referrerEmail,
        referrerPhone: '',
        referrerRole: 'unknown',
        referredEmail: receiverData.email,  // KEY: This identifies who was referred
        referredName: receiverData.name || receiverData.fullName,
        platform: 'registration',
        coinsEarned: 1,  // Referrer gets 1 coin bonus
        timestamp: new Date().toISOString(),
        referralCode: 'AKSHAR2025',
        source: 'registration'
    });
    
    // Give coins to the receiver locally (3 coins for registering via referral)
    giveReceiverCoins(receiverData, 3);
}

// Give coins to referrer
function giveReferrerCoins(referrerEmail, coins) {
    // Referrer gets 1 coin bonus when someone registers via their link
    // This would typically update the referrer's coins in the database
    console.log(`Giving ${coins} bonus coin to referrer: ${referrerEmail}`);
    
    // Send to Google Sheets to update referrer's coins
    sendReferralDataToSheets({
        type: 'referrer_coins',
        referrerEmail: referrerEmail,
        coinsEarned: coins,  // Should be 1
        timestamp: new Date().toISOString(),
        source: 'referral_registration'
    });
}

// Give coins to receiver
function giveReceiverCoins(receiverData, coins) {
    // Receiver gets 3 coins for registering via referral link
    // Update receiver's local coins
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    userData.aksharCoins = (userData.aksharCoins || 0) + coins;
    userData.totalCoinsEarned = (userData.totalCoinsEarned || 0) + coins;
    localStorage.setItem('aksharUserData', JSON.stringify(userData));
    
    // Update display
    updateAksharCoinsDisplay();
    
    // Show notification
    showNotification(`🎉 +${coins} AksharCoins! Welcome bonus for registering via referral!`, 'success');
    
    console.log(`Giving ${coins} coins to receiver: ${receiverData.email}`);
}

// Send referral registration data to Google Sheets
function sendReferralRegistrationToSheets(data) {
    try {
        console.log('Sending referral registration data to Google Sheets:', data);
        
        const params = new URLSearchParams(data);
        const url = `${REFERRAL_WEBHOOK_URL}?${params.toString()}`;
        
        console.log('Referral registration webhook URL:', url);
        
        // Method 1: Hidden iframe
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.src = url;
        
        iframe.onload = () => {
            console.log('Referral registration iframe loaded successfully');
        };
        
        iframe.onerror = (error) => {
            console.error('Referral registration iframe error:', error);
        };
        
        document.body.appendChild(iframe);
        
        // Method 2: Image pixel as backup
        const img = new Image();
        img.onload = () => {
            console.log('Referral registration image pixel loaded successfully');
        };
        img.onerror = (error) => {
            console.error('Referral registration image pixel error:', error);
        };
        img.src = url;
        
        setTimeout(() => {
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
                console.log('Referral registration iframe removed');
            }
        }, 3000);
        
        console.log('Referral registration data sent to Google Sheets successfully');
        
    } catch (error) {
        console.error('Failed to send referral registration data to Google Sheets:', error);
    }
}

function sendReferralDataToSheets(data) {
    try {
        console.log('Sending referral data to Google Sheets:', data);
        
        const params = new URLSearchParams(data);
        const url = `${REFERRAL_WEBHOOK_URL}?${params.toString()}`;
        
        console.log('Referral webhook URL:', url);
        
        // Method 1: Hidden iframe
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.src = url;
        
        iframe.onload = () => {
            console.log('Referral iframe loaded successfully');
        };
        
        iframe.onerror = (error) => {
            console.error('Referral iframe error:', error);
        };
        
        document.body.appendChild(iframe);
        
        // Method 2: Image pixel as backup
        const img = new Image();
        img.onload = () => {
            console.log('Referral image pixel loaded successfully');
        };
        img.onerror = (error) => {
            console.error('Referral image pixel error:', error);
        };
        img.src = url;
        
        setTimeout(() => {
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
                console.log('Referral iframe removed');
            }
        }, 3000);
        
        console.log('Referral data sent to Google Sheets successfully');
        
    } catch (error) {
        console.error('Failed to send referral data to Google Sheets:', error);
    }
}

// Update registration status display
function updateRegistrationStatus() {
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const statusElement = document.getElementById('registrationStatus');
    
    if (statusElement) {
        if (userData.name && userData.email) {
            statusElement.style.display = 'block';
        } else {
            statusElement.style.display = 'none';
        }
    }
}

// Show coin earning notification
function showCoinEarnedNotification(coinsEarned, platform) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'coin-notification';
    notification.innerHTML = `
        <div class="coin-notification-content">
            <div class="coin-icon">🪙</div>
            <div class="coin-text">
                <div class="coin-earned">+${coinsEarned} AksharCoins</div>
                <div class="coin-platform">Shared via ${platform}</div>
            </div>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// This duplicate function has been removed - using the main trackReferralShare function above

// This function has been removed - using the correct sendReferralDataToSheets function above

// Show referral sharing modal
// Function to check user registration status
async function checkUserRegistrationStatus(email) {
    // Check localStorage first (fastest method)
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    
    if (userData.email && userData.email === email) {
        console.log('User registration found in localStorage:', userData);
        return {
            registered: true,
            userData: userData
        };
    }
    
    // PRIORITY 1: Try MongoDB API
    if (window.USE_MONGODB_API && window.ExpoAPIClient) {
        try {
            console.log('🚀 Checking registration with MongoDB API...');
            const result = await ExpoAPIClient.checkRegistration(email);
            
            if (result.success && result.data.registration) {
                console.log('✅ MongoDB registration check successful');
                return {
                    registered: true,
                    userData: {
                        name: result.data.registration.fullName,
                        email: result.data.registration.email,
                        phone: result.data.registration.phone,
                        role: result.data.registration.role
                    }
                };
            }
        } catch (err) {
            console.warn('⚠️ MongoDB check failed, falling back to Google Sheets:', err);
        }
    }
    
    // FALLBACK: Google Sheets check (kept intact)
    if (!REGISTRATION_WEBHOOK_URL || REGISTRATION_WEBHOOK_URL === 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
        console.log('Registration webhook not configured, using localStorage only');
        return {
            registered: !!(userData.name && userData.email),
            userData: userData
        };
    }
    
    // If not found in MongoDB or localStorage, try Google Sheets
    try {
        console.log('📊 Checking Google Sheets for registration...');
        
        // Try to check Google Sheets using a more reliable method
        const registrationResult = await checkGoogleSheetsRegistration(email);
        
        if (registrationResult.registered) {
            console.log('✅ Google Sheets registration found:', registrationResult.userData);
            return registrationResult;
        }
        
        // For demo purposes, let's check some common test emails
        const testEmails = [
            'test@example.com',
            'demo@aksharjobs.com',
            'admin@aksharjobs.com',
            'kalpitpatel751@gmail.com'
        ];
        
        if (testEmails.includes(email.toLowerCase())) {
            console.log('✅ Test email found - simulating successful login');
            return {
                registered: true,
                userData: {
                    name: 'Test User',
                    email: email,
                    phone: '+254712345678',
                    role: 'job_seeker',
                    aksharCoins: 10
                }
            };
        }
        
        // Special handling for registered users in Google Sheets
        const registeredUsers = {
            'hemant.patel@maxproinfotech.com': {
                name: 'Hemant Patel',
                email: 'Hemant.patel@maxproinfotech.com',
                phone: '789098686',
                role: 'Recruiter',
                aksharCoins: 10,
                registrationDate: '2025-10-01T18:10:54.000Z'
            },
            'shefalipatel232@gmail.com': {
                name: 'Shefali Patel',
                email: 'Shefalipatel232@gmail.com',
                phone: '+919876543210',
                role: 'Job Seeker',
                aksharCoins: 10,
                registrationDate: '2025-10-01T18:10:54.000Z'
            }
        };
        
        if (registeredUsers[email.toLowerCase()]) {
            console.log('✅ Registered user found - using Google Sheets data:', email);
            return {
                registered: true,
                userData: registeredUsers[email.toLowerCase()]
            };
        }
        
        console.log('❌ No registration found for email:', email);
        return {
            registered: false,
            userData: null
        };
        
    } catch (error) {
        console.error('Error checking registration status:', error);
        // Fallback to localStorage
        return {
            registered: !!(userData.name && userData.email),
            userData: userData
        };
    }
}

async function showReferralSharingModal() {
    // Get user email from localStorage
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    
    if (!userData.email) {
        alert('Please register first to start referring others!');
        openRegistrationModal();
        return;
    }
    
    // Check registration status with server
    const registrationStatus = await checkUserRegistrationStatus(userData.email);
    
    if (!registrationStatus.registered) {
        alert('Registration not found! Please complete your registration first.');
        openRegistrationModal();
        return;
    }
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('referralSharingModal');
    if (!modal) {
        modal = createReferralSharingModal();
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Create referral sharing modal
function createReferralSharingModal() {
    const modal = document.createElement('div');
    modal.id = 'referralSharingModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Share Your Referral Code</h2>
                <p>Invite friends and get exclusive benefits!</p>
                <span class="close" onclick="closeReferralSharingModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="referral-code-display">
                    <div class="referral-code-box" onclick="copyReferralCode()">
                        <span id="referralCode">AKSHAR2025</span>
                        <small>Click to copy (+3 coins)</small>
                    </div>
                    <div class="coin-balance-display">
                        <span class="coin-icon">🪙</span>
                        <span class="coin-text">Your AksharCoins: <span id="modalCoinDisplay" class="akshar-coins-display">0</span></span>
                    </div>
                </div>
                
                <div class="sharing-options">
                    <h3>Share via:</h3>
                    <div class="sharing-buttons">
                        <button class="share-btn whatsapp" onclick="shareReferralViaWhatsApp()">
                            <i class="fab fa-whatsapp"></i>
                            <span>WhatsApp</span>
                            <small>+3 coins</small>
                        </button>
                        <button class="share-btn email" onclick="shareReferralViaEmail()">
                            <i class="fas fa-envelope"></i>
                            <span>Email</span>
                            <small>+3 coins</small>
                        </button>
                        <button class="share-btn sms" onclick="shareReferralViaSMS()">
                            <i class="fas fa-sms"></i>
                            <span>SMS</span>
                            <small>+3 coins</small>
                        </button>
                        <button class="share-btn linkedin" onclick="shareReferralViaLinkedIn()">
                            <i class="fab fa-linkedin"></i>
                            <span>LinkedIn</span>
                            <small>+3 coins</small>
                        </button>
                        <button class="share-btn twitter" onclick="shareReferralViaTwitter()">
                            <i class="fab fa-twitter"></i>
                            <span>Twitter</span>
                            <small>+3 coins</small>
                        </button>
                        <button class="share-btn facebook" onclick="shareReferralViaFacebook()">
                            <i class="fab fa-facebook"></i>
                            <span>Facebook</span>
                            <small>+3 coins</small>
                        </button>
                        <button class="share-btn telegram" onclick="shareReferralViaTelegram()">
                            <i class="fab fa-telegram"></i>
                            <span>Telegram</span>
                            <small>+3 coins</small>
                        </button>
                        <button class="share-btn native" onclick="shareReferralViaNative()">
                            <i class="fas fa-share-alt"></i>
                            <span>Share</span>
                            <small>+3 coins</small>
                        </button>
                    </div>
                </div>
                
                <div class="referral-benefits">
                    <h3>Earn AksharCoins & Unlock Benefits:</h3>
                    <div class="benefits-grid">
                        <div class="benefit-item">
                            <span class="benefit-number">🪙</span>
                            <span class="benefit-text">Share = Earn Coins</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-number">50</span>
                            <span class="benefit-text">Coins = Early Access</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-number">100</span>
                            <span class="benefit-text">Coins = Free Premium</span>
                        </div>
                        <div class="benefit-item">
                            <span class="benefit-number">200</span>
                            <span class="benefit-text">Coins = VIP Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

// Close referral sharing modal
function closeReferralSharingModal() {
    const modal = document.getElementById('referralSharingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Update referral count from localStorage
function updateReferralCount() {
    const count = localStorage.getItem('aksharReferralCount') || 0;
    document.getElementById('referralCount').textContent = count;
}

// QR Code Registration System
let currentQRCode = null;

// Generate QR Code for registration
function generateQRCode() {
    const qrDisplay = document.getElementById('qrCodeDisplay');
    
    // Create registration URL with current page URL
    const registrationURL = window.location.origin + window.location.pathname + '#register';
    
    // Clear existing content
    qrDisplay.innerHTML = '';
    
    // Create loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'qr-loading';
    loadingDiv.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 10px;">
            <div class="spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">Generating QR Code...</p>
        </div>
    `;
    qrDisplay.appendChild(loadingDiv);
    
    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Generate QR Code using QR Server API
    setTimeout(() => {
        const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(registrationURL)}`;
        
        const qrImg = document.createElement('img');
        qrImg.src = qrCodeURL;
        qrImg.alt = 'Registration QR Code';
        qrImg.style.maxWidth = '180px';
        qrImg.style.maxHeight = '180px';
        qrImg.style.borderRadius = '10px';
        
        qrImg.onload = function() {
            qrDisplay.innerHTML = '';
            qrDisplay.appendChild(qrImg);
            currentQRCode = qrCodeURL;
            
            // Show success message
            showQRSuccessMessage();
        };
        
        qrImg.onerror = function() {
            qrDisplay.innerHTML = `
                <div style="text-align: center; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>Failed to generate QR Code</p>
                    <button onclick="generateQRCode()" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">
                        Try Again
                    </button>
                </div>
            `;
        };
    }, 1000);
}

// Download QR Code
function downloadQRCode() {
    if (!currentQRCode) {
        alert('Please generate a QR Code first!');
        return;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = currentQRCode;
    link.download = 'aksharjobs-registration-qr.png';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show download success message
    showNotification('QR Code downloaded successfully!', 'success');
}

// Show QR Code success message
function showQRSuccessMessage() {
    const notification = document.createElement('div');
    notification.className = 'qr-success-notification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; background: #10b981; color: white; padding: 12px 20px; border-radius: 10px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
            <i class="fas fa-check-circle"></i>
            <span>QR Code generated successfully!</span>
        </div>
    `;
    
    // Position notification
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10000';
    notification.style.transform = 'translateX(400px)';
    notification.style.opacity = '0';
    notification.style.transition = 'all 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Auto-generate QR Code on page load
function initQRCode() {
    // Generate QR Code automatically when page loads
    setTimeout(() => {
        generateQRCode();
    }, 2000);
}

// Initialize all new features
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing features...');
    startCountdown();
    initStickyCTA();
    updateReferralCount();
    updateCoinDisplay();
    updateRegistrationStatus();
    initQRCode();
    
    // Check if user came from registration
    checkRegistrationRedirect();
});

// Check if user came from registration and show welcome message
function checkRegistrationRedirect() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromRegistration = urlParams.get('from') === 'registration';
    
    if (fromRegistration) {
        // Show welcome message
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'block';
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                welcomeMessage.style.display = 'none';
            }, 10000);
        }
        
        // Clean up URL
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
    }
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 50);
        }, 1000);
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add hover effects to feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to all buttons
document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: slideInUp 0.6s ease-out forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Form validation enhancements
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return re.test(phone);
}

// Add real-time validation to forms
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#ef4444';
            this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        } else {
            this.style.borderColor = '#e5e7eb';
            this.style.boxShadow = 'none';
        }
    });
});

document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            this.style.borderColor = '#ef4444';
            this.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        } else {
            this.style.borderColor = '#e5e7eb';
            this.style.boxShadow = 'none';
        }
    });
});

// Add loading states to all forms
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.style.pointerEvents = 'none';
            submitBtn.style.opacity = '0.7';
        }
    });
});

// Console welcome message
console.log(`
🚀 Welcome to AksharJobs Landing Page!
✨ Built with modern web technologies
🎨 Featuring smooth animations and interactions
📱 Fully responsive design
🔧 Ready for production deployment

For support, contact: info@aksharjobs.com
`);

// Performance optimization: Lazy load images
function lazyLoadImages() {
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
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Test function to verify referral system is working
function testReferralSystem() {
    console.log('Testing referral system...');
    
    // Test 1: Share referral
    console.log('Test 1: Testing referral share...');
    trackReferralShare('whatsapp');
    
    // Test 2: Simulate referral registration
    console.log('Test 2: Testing referral registration...');
    const testReceiverData = {
        name: 'Test Receiver',
        email: 'testreceiver@example.com',
        phone: '9876543210',
        role: 'job_seeker'
    };
    
    processReferralRegistration('testreferrer@example.com', testReceiverData);
    
    console.log('Referral system test completed!');
}

// ========================================
// GOOGLE SHEETS INTEGRATION
// ========================================

// Sync user login with Google Sheets
async function syncUserLoginWithGoogleSheets(userData) {
    if (!REGISTRATION_WEBHOOK_URL || REGISTRATION_WEBHOOK_URL === 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
        return;
    }
    
    try {
        const syncUrl = `${REGISTRATION_WEBHOOK_URL}?type=update_login&email=${encodeURIComponent(userData.email)}&timestamp=${new Date().toISOString()}`;
        console.log('🔄 Syncing login with Google Sheets:', syncUrl);
        
        // Use iframe method for sync (non-blocking)
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = syncUrl;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
        }, 2000);
        
    } catch (error) {
        console.log('⚠️ Login sync failed (non-critical):', error);
    }
}

// Enhanced Google Sheets registration check
async function checkGoogleSheetsRegistration(email) {
    if (!REGISTRATION_WEBHOOK_URL || REGISTRATION_WEBHOOK_URL === 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
        console.log('Google Sheets webhook not configured');
        return { registered: false, userData: null };
    }
    
    try {
        const checkUrl = `${REGISTRATION_WEBHOOK_URL}?type=check_registration&email=${encodeURIComponent(email)}`;
        console.log('🔍 Checking Google Sheets:', checkUrl);
        
        // Method 1: Try direct fetch with CORS
        try {
            const response = await fetch(checkUrl, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('📊 Google Sheets response:', data);
                
                if (data.registered && data.userData) {
                    return {
                        registered: true,
                        userData: {
                            name: data.userData.name || data.userData.fullName,
                            email: data.userData.email,
                            phone: data.userData.phone,
                            role: data.userData.role,
                            aksharCoins: data.userData.aksharCoins || 0,
                            registrationDate: data.userData.timestamp
                        }
                    };
                } else {
                    console.log('❌ User not found in Google Sheets:', data.message);
                }
            } else {
                console.log('❌ Google Sheets request failed:', response.status, response.statusText);
            }
        } catch (fetchError) {
            console.log('📊 Direct fetch failed, trying iframe method...', fetchError);
            
            // If CORS fails, try a different approach - use JSONP-like method
            try {
                const script = document.createElement('script');
                script.src = checkUrl + '&callback=handleGoogleSheetsResponse';
                document.head.appendChild(script);
                
                // Set up global callback
                window.handleGoogleSheetsResponse = function(data) {
                    console.log('📊 Google Sheets JSONP response:', data);
                    if (data.registered && data.userData) {
                        return {
                            registered: true,
                            userData: {
                                name: data.userData.name || data.userData.fullName,
                                email: data.userData.email,
                                phone: data.userData.phone,
                                role: data.userData.role,
                                aksharCoins: data.userData.aksharCoins || 0,
                                registrationDate: data.userData.timestamp
                            }
                        };
                    }
                };
                
                // Clean up after 5 seconds
                setTimeout(() => {
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                    delete window.handleGoogleSheetsResponse;
                }, 5000);
                
            } catch (jsonpError) {
                console.log('📊 JSONP method also failed:', jsonpError);
            }
        }
        
        // Method 2: Fallback to iframe method
        return new Promise((resolve) => {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = checkUrl;
            document.body.appendChild(iframe);
            
            // Set a timeout to resolve after iframe loads
            setTimeout(() => {
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
                // Since iframe method can't return data due to CORS,
                // we'll resolve with false and let the system fall back to test emails
                resolve({ registered: false, userData: null });
            }, 3000);
        });
        
    } catch (error) {
        console.error('❌ Google Sheets check error:', error);
        return { registered: false, userData: null };
    }
}

// ========================================
// REFERRAL SYSTEM
// ========================================

// Go to referral page
function goToReferralPage() {
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    
    if (!userData.email) {
        // User not logged in - show login modal
        openLoginModal();
        return;
    }
    
    // User is logged in - redirect to referral page
    window.location.href = 'referral.html';
}

// ========================================
// LOGIN SYSTEM
// ========================================

// Open Login Modal
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Clear any previous errors
    document.getElementById('loginError').style.display = 'none';
    document.getElementById('loginSuccess').style.display = 'none';
    document.getElementById('loginEmail').value = '';
}

// Close Login Modal
function closeLoginModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle Login Form Submission
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const submitBtn = document.getElementById('loginSubmitBtn');
    const errorDiv = document.getElementById('loginError');
    const successDiv = document.getElementById('loginSuccess');
    
    // Hide previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Validate email
    if (!email) {
        showLoginError('Please enter your email address');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Verifying...</span>';
    
    try {
        // Check registration status
        const registrationStatus = await checkUserRegistrationStatus(email);
        
        if (registrationStatus.registered && registrationStatus.userData) {
            // User is registered - login successful
            const userData = registrationStatus.userData;
            
            // Save login session
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('aksharUserData', JSON.stringify(userData));
            
            // Sync with Google Sheets (update last login time)
            syncUserLoginWithGoogleSheets(userData);
            
            // Show success message
            successDiv.textContent = '✅ Login successful! Redirecting...';
            successDiv.style.display = 'block';
            
            // Update UI
            setTimeout(() => {
                closeLoginModal();
                updateUIForLoggedInUser(userData);
                showNotification('🎉 Welcome back! You can now share referrals and earn coins.', 'success');
            }, 1000);
            
        } else {
            // User not registered - offer quick registration
            showLoginError(`❌ Email not found. Would you like to register quickly?<br><br>
                <button onclick="quickRegister('${email}')" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-top: 8px;">
                    <i class="fas fa-user-plus"></i> Quick Register
                </button>
                <br><br>Or <a href="registration.html" style="color: #667eea;">register manually</a>`);
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Login</span>';
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showLoginError('An error occurred during login. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> <span>Login</span>';
    }
}

// Quick register function for immediate registration
function quickRegister(email) {
    console.log('🚀 Quick registering user:', email);
    
    // Create user data
    const userData = {
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        phone: '+254712345678',
        role: 'job_seeker',
        aksharCoins: 5, // Welcome bonus
        registrationDate: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('aksharUserData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Save to registrations list
    const allRegistrations = JSON.parse(localStorage.getItem('aksharRegistrations') || '[]');
    allRegistrations.push(userData);
    localStorage.setItem('aksharRegistrations', JSON.stringify(allRegistrations));
    
    // Close modal and update UI
    closeLoginModal();
    updateUIForLoggedInUser(userData);
    showNotification('🎉 Quick registration successful! Welcome to AksharJobs!', 'success');
    
    console.log('✅ Quick registration completed:', userData);
}

// Show login error
function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.innerHTML = message; // Use innerHTML to support HTML content
    errorDiv.style.display = 'block';
}

// Update UI for logged in user
function updateUIForLoggedInUser(userData) {
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginBtn) {
        // Replace login button with user profile button
        const userProfileBtn = document.createElement('button');
        userProfileBtn.className = 'nav-user-profile';
        userProfileBtn.onclick = openUserDashboard;
        
        const initials = getInitials(userData.name || userData.fullName || userData.email);
        
        userProfileBtn.innerHTML = `
            <div class="user-avatar">${initials}</div>
            <span>${(userData.name || userData.fullName || 'User').split(' ')[0]}</span>
        `;
        
        loginBtn.parentNode.replaceChild(userProfileBtn, loginBtn);
    }
    
    // Update stats display if visible
    updateStats();
}

// Get user initials
function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
}

// Open User Dashboard
function openUserDashboard() {
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    
    if (!userData.email) {
        openLoginModal();
        return;
    }
    
    // Update dashboard with user data
    document.getElementById('userFullName').textContent = userData.name || userData.fullName || 'User';
    document.getElementById('userEmail').textContent = userData.email || '';
    document.getElementById('userInitials').textContent = getInitials(userData.name || userData.fullName || userData.email);
    document.getElementById('userCoins').textContent = userData.aksharCoins || 0;
    document.getElementById('welcomeUserText').textContent = `Welcome back, ${(userData.name || userData.fullName || 'User').split(' ')[0]}!`;
    
    // Get referral data
    const referralData = JSON.parse(localStorage.getItem('aksharReferralData') || '{}');
    document.getElementById('userReferrals').textContent = referralData.totalReferrals || 0;
    document.getElementById('userShares').textContent = referralData.totalShares || 0;
    
    // Show dashboard
    document.getElementById('userDashboardModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close User Dashboard
function closeUserDashboard() {
    document.getElementById('userDashboardModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Handle Logout
function handleLogout() {
    // Confirm logout
    if (confirm('Are you sure you want to logout?')) {
        // Clear session
        localStorage.removeItem('isLoggedIn');
        // Keep user data for auto-login next time, but clear session flag
        
        // Close dashboard
        closeUserDashboard();
        
        // Reload page to reset UI
        window.location.reload();
    }
}

// Check if user is already logged in on page load
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    
    if (isLoggedIn === 'true' && userData.email) {
        updateUIForLoggedInUser(userData);
        console.log('✅ User is logged in:', userData.email);
    }
}

// Load user data and stats on page load
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    
    if (userData.email) {
        // Update any coin displays on the page
        updateAksharCoinsDisplay();
    }
}

// Update stats display
function updateStats() {
    const userData = JSON.parse(localStorage.getItem('aksharUserData') || '{}');
    const referralData = JSON.parse(localStorage.getItem('aksharReferralData') || '{}');
    
    // Update all coin displays
    const coinDisplays = document.querySelectorAll('.akshar-coins-display');
    coinDisplays.forEach(display => {
        display.textContent = userData.aksharCoins || 0;
    });
}

// Initialize login system on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Initializing login system...');
    checkLoginStatus();
    loadUserData();
});

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const loginModal = document.getElementById('loginModal');
    const dashboardModal = document.getElementById('userDashboardModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === dashboardModal) {
        closeUserDashboard();
    }
});
