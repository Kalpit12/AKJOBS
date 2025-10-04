/**
 * Live Visitor Tracker for AksharJobs Expo Landing Page
 * Tracks unique visitors and displays live count
 */

class LiveVisitorTracker {
    constructor() {
        this.apiUrl = 'https://script.google.com/macros/s/AKfycbzz_UfgCiRRU1j2hD3pX-72j-z-YzaG_wHu-ADwX3s50tCx28MtRVlcHWkvfKMDckH9PA/exec';
        this.sheetName = 'Live_Visitor_Tracking';
        this.visitorId = this.generateVisitorId();
        this.sessionId = this.generateSessionId();
        this.isNewVisitor = false;
        this.startTime = Date.now();
        
        this.init();
    }
    
    generateVisitorId() {
        // Generate a unique visitor ID based on browser fingerprint
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Visitor fingerprint', 2, 2);
        
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|');
        
        // Create a simple hash
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        
        return 'visitor_' + Math.abs(hash).toString(36);
    }
    
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    async init() {
        console.log('🚀 Live Visitor Tracker initialized');
        
        // Check if this is a new visitor
        this.isNewVisitor = this.checkIfNewVisitor();
        
        // Track the visit immediately (this happens for ALL visitors)
        await this.trackVisit();
        
        // Track page load event
        await this.trackPageLoad();
        
        // Set up comprehensive tracking
        this.setupComprehensiveTracking();
        
        // Set up periodic updates
        this.setupPeriodicUpdates();
        
        // Track page visibility changes
        this.trackPageVisibility();
        
        // Track user interactions
        this.trackUserInteractions();
        
        // Track navigation and link clicks
        this.trackNavigationEvents();
    }
    
    checkIfNewVisitor() {
        const lastVisit = localStorage.getItem('akshar_last_visit');
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        
        if (!lastVisit || (now - parseInt(lastVisit)) > oneDay) {
            localStorage.setItem('akshar_last_visit', now.toString());
            return true;
        }
        
        return false;
    }
    
    async trackVisit() {
        try {
            const visitData = {
                type: 'visitor_tracking',
                action: 'track_visit',
                visitorId: this.visitorId,
                sessionId: this.sessionId,
                isNewVisitor: this.isNewVisitor,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                language: navigator.language,
                screenResolution: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                referrer: document.referrer || 'direct',
                url: window.location.href,
                pageTitle: document.title
            };
            
            console.log('📊 Tracking visit:', visitData);
            
            // Send to Google Sheets
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(visitData)
            });
            
            if (response.ok) {
                console.log('✅ Visit tracked successfully');
                await this.updateLiveCount();
            } else {
                console.warn('⚠️ Failed to track visit');
            }
            
        } catch (error) {
            console.error('❌ Error tracking visit:', error);
        }
    }
    
    async trackPageLoad() {
        try {
            const pageLoadData = {
                type: 'visitor_tracking',
                action: 'page_load',
                visitorId: this.visitorId,
                sessionId: this.sessionId,
                isNewVisitor: this.isNewVisitor,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                language: navigator.language,
                screenResolution: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                referrer: document.referrer || 'direct',
                url: window.location.href,
                pageTitle: document.title,
                loadTime: performance.now(),
                connectionType: navigator.connection ? navigator.connection.effectiveType : 'unknown'
            };
            
            console.log('📄 Tracking page load:', pageLoadData);
            
            await this.sendTrackingData(pageLoadData);
        } catch (error) {
            console.error('❌ Error tracking page load:', error);
        }
    }
    
    setupComprehensiveTracking() {
        // Track any link clicks (internal or external)
        document.addEventListener('click', (event) => {
            const target = event.target;
            const link = target.closest('a');
            
            if (link) {
                this.trackLinkClick(link);
            }
        });
        
        // Track form submissions
        document.addEventListener('submit', (event) => {
            this.trackFormSubmission(event.target);
        });
        
        // Track scroll depth
        this.trackScrollDepth();
        
        // Track time on page
        this.trackTimeOnPage();
    }
    
    async trackLinkClick(link) {
        try {
            const linkData = {
                type: 'visitor_tracking',
                action: 'link_click',
                visitorId: this.visitorId,
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                linkUrl: link.href,
                linkText: link.textContent.trim(),
                linkTarget: link.target || '_self',
                isExternal: !link.href.startsWith(window.location.origin),
                referrer: document.referrer || 'direct',
                url: window.location.href,
                pageTitle: document.title
            };
            
            console.log('🔗 Tracking link click:', linkData);
            await this.sendTrackingData(linkData);
        } catch (error) {
            console.error('❌ Error tracking link click:', error);
        }
    }
    
    async trackFormSubmission(form) {
        try {
            const formData = {
                type: 'visitor_tracking',
                action: 'form_submission',
                visitorId: this.visitorId,
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                formAction: form.action,
                formMethod: form.method,
                formId: form.id || 'unnamed',
                formClass: form.className,
                referrer: document.referrer || 'direct',
                url: window.location.href,
                pageTitle: document.title
            };
            
            console.log('📝 Tracking form submission:', formData);
            await this.sendTrackingData(formData);
        } catch (error) {
            console.error('❌ Error tracking form submission:', error);
        }
    }
    
    trackScrollDepth() {
        let maxScrollDepth = 0;
        const scrollThresholds = [25, 50, 75, 90, 100];
        const reportedThresholds = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = Math.round((scrollTop / documentHeight) * 100);
            
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                
                // Report when reaching specific thresholds
                scrollThresholds.forEach(threshold => {
                    if (scrollPercent >= threshold && !reportedThresholds.has(threshold)) {
                        reportedThresholds.add(threshold);
                        this.trackScrollEvent(threshold);
                    }
                });
            }
        });
    }
    
    async trackScrollEvent(scrollPercent) {
        try {
            const scrollData = {
                type: 'visitor_tracking',
                action: 'scroll_depth',
                visitorId: this.visitorId,
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                scrollPercent: scrollPercent,
                referrer: document.referrer || 'direct',
                url: window.location.href,
                pageTitle: document.title
            };
            
            console.log('📜 Tracking scroll depth:', scrollData);
            await this.sendTrackingData(scrollData);
        } catch (error) {
            console.error('❌ Error tracking scroll depth:', error);
        }
    }
    
    trackTimeOnPage() {
        const startTime = Date.now();
        const timeThresholds = [10, 30, 60, 120, 300]; // seconds
        const reportedTimes = new Set();
        
        // Report time milestones
        timeThresholds.forEach(seconds => {
            setTimeout(() => {
                if (!reportedTimes.has(seconds)) {
                    reportedTimes.add(seconds);
                    this.trackTimeEvent(seconds);
                }
            }, seconds * 1000);
        });
        
        // Track when user leaves the page
        window.addEventListener('beforeunload', () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            this.trackTimeEvent(timeSpent, true); // true indicates page exit
        });
    }
    
    async trackTimeEvent(seconds, isExit = false) {
        try {
            const timeData = {
                type: 'visitor_tracking',
                action: isExit ? 'page_exit' : 'time_on_page',
                visitorId: this.visitorId,
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                timeSpent: seconds,
                referrer: document.referrer || 'direct',
                url: window.location.href,
                pageTitle: document.title
            };
            
            console.log('⏱️ Tracking time event:', timeData);
            await this.sendTrackingData(timeData);
        } catch (error) {
            console.error('❌ Error tracking time event:', error);
        }
    }
    
    trackNavigationEvents() {
        // Track any navigation events
        window.addEventListener('popstate', () => {
            this.trackNavigationEvent('popstate');
        });
        
        // Track if user tries to navigate away
        window.addEventListener('beforeunload', () => {
            this.trackNavigationEvent('beforeunload');
        });
        
        // Track page focus/blur
        window.addEventListener('focus', () => {
            this.trackPageFocusEvent(true);
        });
        
        window.addEventListener('blur', () => {
            this.trackPageFocusEvent(false);
        });
    }
    
    async trackNavigationEvent(eventType) {
        try {
            const navData = {
                type: 'visitor_tracking',
                action: 'navigation_event',
                visitorId: this.visitorId,
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                eventType: eventType,
                referrer: document.referrer || 'direct',
                url: window.location.href,
                pageTitle: document.title
            };
            
            console.log('🧭 Tracking navigation event:', navData);
            await this.sendTrackingData(navData);
        } catch (error) {
            console.error('❌ Error tracking navigation event:', error);
        }
    }
    
    async trackPageFocusEvent(hasFocus) {
        try {
            const focusData = {
                type: 'visitor_tracking',
                action: hasFocus ? 'page_focus' : 'page_blur',
                visitorId: this.visitorId,
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                hasFocus: hasFocus,
                referrer: document.referrer || 'direct',
                url: window.location.href,
                pageTitle: document.title
            };
            
            console.log('👁️ Tracking page focus:', focusData);
            await this.sendTrackingData(focusData);
        } catch (error) {
            console.error('❌ Error tracking page focus:', error);
        }
    }
    
    async updateLiveCount() {
        try {
            const response = await fetch(`${this.apiUrl}?action=get_live_count`, {
                method: 'GET',
                mode: 'cors'
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.displayLiveCount(data.liveCount, data.totalVisitors, data.newVisitorsToday);
                }
            }
        } catch (error) {
            console.error('❌ Error updating live count:', error);
        }
    }
    
    displayLiveCount(liveCount, totalVisitors, newVisitorsToday) {
        // Find or create the live counter element
        let counterElement = document.getElementById('liveVisitorCounter');
        
        if (!counterElement) {
            // Create the counter element
            counterElement = document.createElement('div');
            counterElement.id = 'liveVisitorCounter';
            counterElement.className = 'live-visitor-counter';
            counterElement.innerHTML = `
                <div class="live-counter-content">
                    <div class="live-indicator">
                        <span class="pulse-dot"></span>
                        <span class="live-text">LIVE</span>
                    </div>
                    <div class="counter-stats">
                        <div class="stat-item">
                            <span class="stat-number" id="liveCount">${liveCount}</span>
                            <span class="stat-label">Online Now</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="totalVisitors">${totalVisitors}</span>
                            <span class="stat-label">Total Visitors</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="newVisitorsToday">${newVisitorsToday}</span>
                            <span class="stat-label">New Today</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Add styles
            this.addCounterStyles();
            
            // Insert at the top of the page
            const header = document.querySelector('header') || document.querySelector('.header') || document.body.firstChild;
            if (header) {
                header.parentNode.insertBefore(counterElement, header);
            } else {
                document.body.insertBefore(counterElement, document.body.firstChild);
            }
        } else {
            // Update existing counter
            document.getElementById('liveCount').textContent = liveCount;
            document.getElementById('totalVisitors').textContent = totalVisitors;
            document.getElementById('newVisitorsToday').textContent = newVisitorsToday;
        }
    }
    
    addCounterStyles() {
        if (document.getElementById('liveTrackerStyles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'liveTrackerStyles';
        styles.textContent = `
            .live-visitor-counter {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
                z-index: 1000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                animation: slideInRight 0.5s ease-out;
            }
            
            .live-counter-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }
            
            .live-indicator {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .pulse-dot {
                width: 8px;
                height: 8px;
                background: #10b981;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            
            .counter-stats {
                display: flex;
                gap: 20px;
                align-items: center;
            }
            
            .stat-item {
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .stat-number {
                font-size: 18px;
                font-weight: 700;
                line-height: 1;
                color: #fbbf24;
            }
            
            .stat-label {
                font-size: 10px;
                opacity: 0.8;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-top: 2px;
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                50% {
                    transform: scale(1.2);
                    opacity: 0.7;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @media (max-width: 768px) {
                .live-visitor-counter {
                    top: 10px;
                    right: 10px;
                    padding: 12px 15px;
                    font-size: 14px;
                }
                
                .counter-stats {
                    gap: 15px;
                }
                
                .stat-number {
                    font-size: 16px;
                }
                
                .stat-label {
                    font-size: 9px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    setupPeriodicUpdates() {
        // Update live count every 30 seconds
        setInterval(() => {
            this.updateLiveCount();
        }, 30000);
        
        // Track session duration every minute
        setInterval(() => {
            this.trackSessionDuration();
        }, 60000);
    }
    
    async trackSessionDuration() {
        const duration = Math.floor((Date.now() - this.startTime) / 1000); // seconds
        
        try {
            const sessionData = {
                type: 'visitor_tracking',
                action: 'update_session',
                sessionId: this.sessionId,
                duration: duration,
                timestamp: new Date().toISOString()
            };
            
            await fetch(this.apiUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sessionData)
            });
            
        } catch (error) {
            console.error('❌ Error tracking session duration:', error);
        }
    }
    
    trackPageVisibility() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, track exit
                this.trackExit();
            } else {
                // Page is visible again, track return
                this.trackReturn();
            }
        });
        
        // Track when user leaves the page
        window.addEventListener('beforeunload', () => {
            this.trackExit();
        });
    }
    
    async trackExit() {
        try {
            const duration = Math.floor((Date.now() - this.startTime) / 1000);
            
            const exitData = {
                type: 'visitor_tracking',
                action: 'track_exit',
                sessionId: this.sessionId,
                duration: duration,
                timestamp: new Date().toISOString()
            };
            
            // Use sendBeacon for reliable tracking on page unload
            if (navigator.sendBeacon) {
                navigator.sendBeacon(this.apiUrl, JSON.stringify(exitData));
            } else {
                fetch(this.apiUrl, {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(exitData)
                });
            }
            
        } catch (error) {
            console.error('❌ Error tracking exit:', error);
        }
    }
    
    async trackReturn() {
        try {
            const returnData = {
                type: 'visitor_tracking',
                action: 'track_return',
                sessionId: this.sessionId,
                timestamp: new Date().toISOString()
            };
            
            await fetch(this.apiUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(returnData)
            });
            
        } catch (error) {
            console.error('❌ Error tracking return:', error);
        }
    }
    
    trackUserInteractions() {
        let interactionCount = 0;
        
        // Track clicks
        document.addEventListener('click', () => {
            interactionCount++;
            if (interactionCount % 5 === 0) { // Track every 5 interactions
                this.trackInteraction('click', interactionCount);
            }
        });
        
        // Track scrolls
        let scrollCount = 0;
        window.addEventListener('scroll', () => {
            scrollCount++;
            if (scrollCount % 10 === 0) { // Track every 10 scroll events
                this.trackInteraction('scroll', scrollCount);
            }
        });
        
        // Track form interactions
        document.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.trackInteraction('form_input', 1);
            }
        });
    }
    
    async trackInteraction(type, count) {
        try {
            const interactionData = {
                type: 'visitor_tracking',
                action: 'track_interaction',
                sessionId: this.sessionId,
                interactionType: type,
                interactionCount: count,
                timestamp: new Date().toISOString()
            };
            
            await fetch(this.apiUrl, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(interactionData)
            });
            
        } catch (error) {
            console.error('❌ Error tracking interaction:', error);
        }
    }
}

// Initialize the live tracker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Initializing Live Visitor Tracker...');
    new LiveVisitorTracker();
});

// Export for use in other scripts
window.LiveVisitorTracker = LiveVisitorTracker;
