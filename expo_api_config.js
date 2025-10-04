/**
 * ========================================
 * AksharJobs Expo - Integration Configuration
 * ========================================
 * 
 * QUICK SETUP (Recommended - 5 minutes):
 * ✅ Uses Google Sheets (FREE, no server needed)
 * 
 * See GOOGLE_SHEETS_INTEGRATION_GUIDE.md for step-by-step setup!
 * 
 * ADVANCED SETUP (Optional - 30 minutes):
 * 🔧 Uses MongoDB + Backend API (requires server deployment)
 * 
 * See EXPO_DEPLOYMENT_SIMPLE.md for MongoDB setup
 */

// ========================================
// OPTION 1: GOOGLE SHEETS (Default - Recommended)
// ========================================

/**
 * STEP 1: Deploy Google Apps Script
 * 1. Go to your Google Sheet
 * 2. Extensions → Apps Script
 * 3. Copy code from google_sheets_integration.gs
 * 4. Update SHEET_ID (line 15 in that file)
 * 5. Deploy as Web App (Anyone access)
 * 6. Copy the Web App URL below
 */
const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxSKL04akfo3W_XiUfQJQg0dg3ded6EwsbEEg6VsW1SD5eVoEDV-3EoxH-IgZy-ccEMsQ/exec';

// ========================================
// OPTION 2: MONGODB API (Advanced - Optional)
// ========================================

/**
 * MongoDB Backend API URL
 * Only used if USE_MONGODB_API = true
 * 
 * Local development: http://localhost:3002/api/expo
 * Production (Render): https://your-app.onrender.com/api/expo
 */
const MONGO_API_BASE_URL = 'http://localhost:3002/api/expo';

// ========================================
// FEATURE FLAG: Choose Your Integration
// ========================================

/**
 * Which backend to use?
 * 
 * false = Google Sheets (RECOMMENDED for quick setup)
 *         ✅ FREE forever
 *         ✅ No server needed
 *         ✅ 5 minute setup
 *         ✅ Stores 50,000+ registrations
 *         ✅ Perfect for expos
 * 
 * true = MongoDB API (Advanced users only)
 *        🔧 Requires backend server
 *        🔧 Requires MongoDB database
 *        🔧 30 minute setup
 *        ✅ Better for large scale (10,000+ users)
 *        ✅ Real-time analytics
 */
const USE_MONGODB_API = false;

/**
 * MongoDB API Client
 */
class ExpoAPIClient {
    
    /**
     * Make an API request with error handling
     */
    static async request(endpoint, options = {}) {
        if (!USE_MONGODB_API) {
            throw new Error('MongoDB API is disabled');
        }
        
        const url = `${MONGO_API_BASE_URL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        
        const config = { ...defaultOptions, ...options };
        
        try {
            console.log(`📡 MongoDB API Request: ${options.method || 'GET'} ${url}`);
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                console.error('❌ MongoDB API Error:', data);
                throw new Error(data.error || data.message || 'API request failed');
            }
            
            console.log('✅ MongoDB API Response:', data);
            return data;
        } catch (error) {
            console.error('❌ MongoDB API Request Failed:', error);
            throw error;
        }
    }
    
    /**
     * Register for the expo
     */
    static async registerUser(registrationData) {
        try {
            const response = await this.request('/register', {
                method: 'POST',
                body: JSON.stringify(registrationData)
            });
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Check if user is registered by email
     */
    static async checkRegistration(email) {
        try {
            const response = await this.request(`/registration/${encodeURIComponent(email)}`);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Get all registrations (optionally filtered by role)
     */
    static async getRegistrations(role = null, limit = 100) {
        try {
            const params = new URLSearchParams();
            if (role) params.append('role', role);
            if (limit) params.append('limit', limit);
            
            const query = params.toString() ? `?${params.toString()}` : '';
            const response = await this.request(`/registrations${query}`);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Get registration statistics
     */
    static async getRegistrationStats() {
        try {
            const response = await this.request('/registrations/stats');
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Track referral (share or registration)
     */
    static async trackReferral(referralData) {
        try {
            const response = await this.request('/referral/track', {
                method: 'POST',
                body: JSON.stringify(referralData)
            });
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Get referral data for a user
     */
    static async getReferralData(email = null) {
        try {
            const query = email ? `?email=${encodeURIComponent(email)}` : '';
            const response = await this.request(`/referral/data${query}`);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Get referral leaderboard
     */
    static async getLeaderboard(limit = 50) {
        try {
            const response = await this.request(`/referral/leaderboard?limit=${limit}`);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Get detailed stats for a specific user
     */
    static async getUserStats(email) {
        try {
            const response = await this.request(`/referral/stats/${encodeURIComponent(email)}`);
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Check API health
     */
    static async checkHealth() {
        try {
            const response = await this.request('/health');
            return { success: true, data: response };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

/**
 * Google Sheets API Client (Simplified)
 * Makes direct calls to Google Apps Script Web App
 */
class GoogleSheetsAPIClient {
    
    /**
     * Make a request to Google Sheets Web App
     */
    static async request(data) {
        if (GOOGLE_SHEETS_WEB_APP_URL === 'YOUR_WEB_APP_URL_HERE') {
            throw new Error('Please configure GOOGLE_SHEETS_WEB_APP_URL first! See GOOGLE_SHEETS_QUICK_SETUP.md');
        }
        
        try {
            console.log(`📡 Google Sheets Request:`, data);
            const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors', // Google Apps Script requires no-cors
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            // Note: no-cors mode doesn't allow reading response, but it works
            console.log('✅ Google Sheets Request sent successfully');
            return { success: true, message: 'Data sent to Google Sheets' };
        } catch (error) {
            console.error('❌ Google Sheets Request Failed:', error);
            throw error;
        }
    }
    
    /**
     * Register for the expo
     */
    static async registerUser(registrationData) {
        try {
            await this.request(registrationData);
            return { success: true, message: 'Registration saved to Google Sheets' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Track referral
     */
    static async trackReferral(referralData) {
        try {
            await this.request(referralData);
            return { success: true, message: 'Referral tracked in Google Sheets' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    /**
     * Check API health
     */
    static async checkHealth() {
        try {
            const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
                method: 'GET',
            });
            return { success: true, message: 'Google Sheets Web App is accessible' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.ExpoAPIClient = ExpoAPIClient; // MongoDB client (disabled)
    window.GoogleSheetsAPIClient = GoogleSheetsAPIClient; // Google Sheets client (active)
    window.USE_MONGODB_API = USE_MONGODB_API;
    window.GOOGLE_SHEETS_WEB_APP_URL = GOOGLE_SHEETS_WEB_APP_URL;
    window.MONGO_API_BASE_URL = MONGO_API_BASE_URL;
}

console.log('✅ Expo API Client loaded');
console.log(`🔧 MongoDB API: ${USE_MONGODB_API ? 'ENABLED' : 'DISABLED'}`);
console.log(`📊 Google Sheets: ${!USE_MONGODB_API ? 'ENABLED' : 'DISABLED'}`);
if (!USE_MONGODB_API) {
    console.log(`📍 Google Sheets URL: ${GOOGLE_SHEETS_WEB_APP_URL}`);
} else {
    console.log(`📍 MongoDB URL: ${MONGO_API_BASE_URL}`);
}

