/**
 * Google Apps Script for AksharJobs Expo Registration
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Create a new Google Sheet and note the Sheet ID
 * 5. Update the SHEET_ID variable below with your Sheet ID
 * 6. Deploy as Web App with "Anyone" access
 * 7. Copy the Web App URL and update REGISTRATION_WEBHOOK_URL in expo_landing.js
 */

// Replace with your Google Sheet ID (found in the URL)
const SHEET_ID = '14gfIXPlZQGuYYAWiW1RHlcDlBf_Tm63JMRrJ-4pyqwk';

// Sheet names where data will be stored
const REGISTRATION_SHEET_NAME = 'AksharJobs Expo Registration Data';
const REFERRAL_SHEET_NAME = 'Referral_Tracking';
const REFERRAL_CLICKS_SHEET_NAME = 'Referral_Clicks';

// Role-specific sheet names
const ROLE_SHEETS = {
  'job_seeker': 'Job_Seekers',
  'recruiter': 'Recruiters', 
  'mentor': 'Mentors',
  'trainer': 'Trainers',
  'consultant': 'Consultants',
  'volunteer': 'Volunteers',
  'intern': 'Interns',
  'community': 'Community',
  'university': 'Universities',
  'evangelist': 'Evangelists'
};

function doPost(e) {
  try {
    console.log('doPost called with:', e);
    console.log('doPost event type:', typeof e);
    console.log('doPost has postData:', !!e.postData);
    console.log('doPost has parameters:', !!e.parameters);
    
    // Handle case where e is undefined or null
    if (!e) {
      console.log('No event object received, treating as test call');
      return ContentService
        .createTextOutput(JSON.stringify({
          message: 'doPost function called without event object',
          timestamp: new Date().toISOString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse the incoming data (handle both JSON and form data)
    let data = {};
    try {
      console.log('Event object structure:', {
        hasPostData: !!e.postData,
        postDataType: e.postData ? e.postData.type : 'none',
        hasParameters: !!e.parameters,
        parametersKeys: e.parameters ? Object.keys(e.parameters) : 'none'
      });
      
      if (e.postData && e.postData.type === 'application/json') {
        console.log('Parsing JSON data:', e.postData.contents);
        data = JSON.parse(e.postData.contents);
      } else if (e.postData && e.postData.contents) {
        console.log('Parsing postData contents as form data');
        // Try to parse as form data
        const formData = e.postData.contents;
        const pairs = formData.split('&');
        pairs.forEach(pair => {
          const [key, value] = pair.split('=');
          if (key && value) {
            data[decodeURIComponent(key)] = decodeURIComponent(value);
          }
        });
      } else if (e.parameters) {
        console.log('Using parameters directly');
        data = e.parameters;
        // Convert arrays to single values (form data comes as arrays)
        Object.keys(data).forEach(key => {
          if (Array.isArray(data[key]) && data[key].length === 1) {
            data[key] = data[key][0];
          }
        });
      } else {
        console.log('No data found in request');
        data = {};
      }
      
      console.log('Parsed data:', data);
      console.log('Data type:', typeof data);
      console.log('Data keys:', data ? Object.keys(data) : 'data is null/undefined');
      
    } catch (parseError) {
      console.error('Error parsing data:', parseError);
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Failed to parse request data',
          details: parseError.toString(),
          received: e
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validate that we have data before processing
    if (!data || Object.keys(data).length === 0) {
      console.error('No data received for processing');
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'No data received',
          received: e
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Check if this is a referral tracking request
    if (data.type === 'referral' || data.type === 'referral_share') {
      return processReferralTracking(data);
    } else if (data.type === 'referral_registration') {
      return processReferralRegistration(data);
    } else if (data.type === 'referrer_coins') {
      return processReferrerCoins(data);
    } else {
      // Process the registration
      return processRegistration(data);
    }
      
  } catch (error) {
    console.error('Error in doPost:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Failed to process registration',
        details: error.toString(),
        eventObject: e ? 'present' : 'missing',
        postData: e && e.postData ? e.postData.contents : 'none',
        parameters: e && e.parameters ? e.parameters : 'none'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Common function to process registration data
function processRegistration(data) {
  console.log('=== processRegistration function entry ===');
  console.log('Arguments received:', arguments);
  console.log('Arguments length:', arguments.length);
  console.log('First argument:', arguments[0]);
  console.log('Data parameter:', data);
  console.log('Data type:', typeof data);
  console.log('Data is null:', data === null);
  console.log('Data is undefined:', data === undefined);
  
  try {
    console.log('processRegistration called with data:', data);
    console.log('Data type:', typeof data);
    console.log('Data keys:', data ? Object.keys(data) : 'data is null/undefined');
    console.log('Stack trace:', new Error().stack);
    
    // Check if data is valid
    if (!data || typeof data !== 'object') {
      console.error('Invalid data object:', data);
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Invalid data object',
          received: data
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validate required fields (check both name and fullName)
    if ((!data.name && !data.fullName) || !data.email || !data.phone || !data.role) {
      console.error('Missing required fields:', {
        name: data.name,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role
      });
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Missing required fields',
          received: {
            name: data.name,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            role: data.role
          }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Open the Google Sheet
    let spreadsheet, sheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      sheet = spreadsheet.getSheetByName(REGISTRATION_SHEET_NAME);
      
      // Create sheet if it doesn't exist
      if (!sheet) {
        sheet = spreadsheet.insertSheet(REGISTRATION_SHEET_NAME);
        console.log('Created new sheet:', REGISTRATION_SHEET_NAME);
      }
    } catch (error) {
      console.error('Error accessing Google Sheet:', error);
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Failed to access Google Sheet',
          details: error.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Create comprehensive headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'Full Name', 'Email', 'Phone', 'Role',
        // Job Seeker fields
        'Experience', 'Skills', 'Location', 'Job Type', 'Industry',
        // Recruiter fields
        'Company', 'Position', 'Industry', 'Company Size', 'Hiring Volume',
        // Mentor fields
        'Expertise', 'Mentorship Type', 'Bio',
        // Trainer fields
        'Specialization', 'Training Format', 'Certifications',
        // Consultant fields
        'Consultant Specialization', 'Consultant Experience', 'Consultant Type', 'Industry Focus',
        // Volunteer fields
        'Volunteer Interests', 'Volunteer Availability', 'Volunteer Motivation',
        // Intern fields
        'University', 'Field', 'Internship Type', 'Graduation Year',
        // Community fields
        'Community Organization', 'Community Interests', 'Community Role', 'Community Experience', 'Community Description',
        // University fields
        'University Name', 'Department', 'University Type', 'Student Count',
        // Common additional fields
        'Notification Status', 'Registration Type'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      console.log('Added comprehensive headers to sheet');
    }
    
    // Check for duplicate email registration
    const emailToCheck = data.email.toLowerCase().trim();
    console.log('Checking for duplicate email:', emailToCheck);
    
    if (sheet.getLastRow() > 0) {
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      // Check all rows (skip header row at index 0)
      for (let i = 1; i < values.length; i++) {
        const existingEmail = values[i][2]; // Email is in column C (index 2)
        
        if (existingEmail && existingEmail.toString().toLowerCase().trim() === emailToCheck) {
          console.log('Duplicate registration detected for email:', emailToCheck);
          console.log('Existing record at row:', i + 1);
          
          return ContentService
            .createTextOutput(JSON.stringify({
              error: 'Email already registered',
              message: 'This email address is already registered. Please use a different email or contact support if you need help.',
              duplicate: true,
              existingEmail: emailToCheck,
              existingName: values[i][1], // Full Name from column B
              registeredAt: values[i][0]  // Timestamp from column A
            }))
            .setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    console.log('No duplicate found, proceeding with registration');
    
    // Prepare comprehensive registration data
    const timestamp = new Date();
    const roleLabels = {
      'job_seeker': 'Job Seeker',
      'recruiter': 'Recruiter', 
      'mentor': 'Mentor',
      'trainer': 'Trainer',
      'consultant': 'Consultant',
      'volunteer': 'Volunteer',
      'intern': 'Intern',
      'community': 'Community',
      'university': 'University',
      'evangelist': 'Evangelist'
    };
    
    // Create a comprehensive row with all possible fields
    const newRow = [
      timestamp,
      data.fullName || data.name || '',
      data.email || '',
      data.phone || '',
      roleLabels[data.role] || data.role || '',
      // Job Seeker fields
      data.experience || '',
      data.skills || '',
      data.location || '',
      data.jobType || '',
      data.industry || '',
      // Recruiter fields
      data.company || '',
      data.position || '',
      data.industry || '',
      data.companySize || '',
      data.hiringVolume || '',
      // Mentor fields
      data.expertise || '',
      data.mentorshipType || '',
      data.bio || '',
      // Trainer fields
      data.specialization || '',
      data.trainingFormat || '',
      data.certifications || '',
      // Consultant fields
      data.consultantSpecialization || '',
      data.consultantExperience || '',
      data.consultantType || '',
      data.industryFocus || '',
      // Volunteer fields
      data.volunteerInterests || '',
      data.volunteerAvailability || '',
      data.volunteerMotivation || '',
      // Intern fields
      data.university || '',
      data.field || '',
      data.internshipType || '',
      data.graduationYear || '',
      // Community fields
      data.communityOrganization || '',
      data.communityInterests || '',
      data.communityRole || '',
      data.communityExperience || '',
      data.communityDescription || '',
      // University fields
      data.universityName || '',
      data.department || '',
      data.universityType || '',
      data.studentCount || '',
      // Common additional fields
      'Pending Notification',
      data.type || 'registration'
    ];
    
    sheet.appendRow(newRow);
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, newRow.length);
    
    // Save to role-specific sheet
    try {
      const roleSheetName = ROLE_SHEETS[data.role];
      if (roleSheetName) {
        let roleSheet = spreadsheet.getSheetByName(roleSheetName);
        
        // Create role-specific sheet if it doesn't exist
        if (!roleSheet) {
          roleSheet = spreadsheet.insertSheet(roleSheetName);
          console.log('Created new role-specific sheet:', roleSheetName);
        }
        
        // Add headers if sheet is empty
        if (roleSheet.getLastRow() === 0) {
          const headers = [
            'Timestamp', 'Full Name', 'Email', 'Phone', 'Role',
            // Job Seeker fields
            'Experience', 'Skills', 'Location', 'Job Type', 'Industry',
            // Recruiter fields
            'Company', 'Position', 'Industry', 'Company Size', 'Hiring Volume',
            // Mentor fields
            'Expertise', 'Mentorship Type', 'Bio',
            // Trainer fields
            'Specialization', 'Training Format', 'Certifications',
            // Consultant fields
            'Consultant Specialization', 'Consultant Experience', 'Consultant Type', 'Industry Focus',
            // Volunteer fields
            'Volunteer Interests', 'Volunteer Availability', 'Volunteer Motivation',
            // Intern fields
            'University', 'Field', 'Internship Type', 'Graduation Year',
            // Community fields
            'Community Organization', 'Community Interests', 'Community Role', 'Community Experience', 'Community Description',
            // University fields
            'University Name', 'Department', 'University Type', 'Student Count',
            // Common additional fields
            'Notification Status', 'Registration Type'
          ];
          
          roleSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
          roleSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
          console.log('Added headers to role-specific sheet:', roleSheetName);
        }
        
        // Append the same data to role-specific sheet
        roleSheet.appendRow(newRow);
        roleSheet.autoResizeColumns(1, newRow.length);
        console.log('Saved registration to role-specific sheet:', roleSheetName);
      } else {
        console.log('No role-specific sheet defined for role:', data.role);
      }
    } catch (roleSheetError) {
      console.error('Error saving to role-specific sheet:', roleSheetError);
      // Don't fail the entire registration if role-specific sheet fails
    }
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Registration saved successfully',
        timestamp: timestamp.toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing registration:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Failed to save registration',
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to get coins earned for sharing on different platforms
function getCoinsForSharing(platform) {
  const shareRewards = {
    'whatsapp': 3,      // 3 coins for sharing
    'email': 3,         // 3 coins for sharing
    'sms': 3,           // 3 coins for sharing
    'linkedin': 3,      // 3 coins for sharing
    'twitter': 3,       // 3 coins for sharing
    'facebook': 3,      // 3 coins for sharing
    'telegram': 3,      // 3 coins for sharing
    'native': 3,        // 3 coins for sharing
    'copy': 3           // 3 coins for sharing
  };
  
  return shareRewards[platform] || 3; // Default 3 coins for sharing
}

// Function to get coins earned when someone registers via referral
function getCoinsForRegistration() {
  return 1; // 1 coin bonus when someone registers via referral link
}

// Function to check if user is registered
function checkUserRegistration(email) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REGISTRATION_SHEET_NAME);
    
    if (!sheet) {
      console.log('Registration sheet not found');
      return { registered: false, message: 'Registration sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Check if email exists in registration sheet
    for (let i = 1; i < data.length; i++) {
      if (data[i][2] === email) { // Email is in column 3 (index 2)
        return {
          registered: true,
          message: 'User is registered',
          userData: {
            name: data[i][1],
            email: data[i][2],
            phone: data[i][3],
            role: data[i][4],
            timestamp: data[i][0]
          }
        };
      }
    }
    
    return { registered: false, message: 'User not found in registration sheet' };
    
  } catch (error) {
    console.error('Error checking user registration:', error);
    return { registered: false, message: 'Error checking registration: ' + error.toString() };
  }
}

// Function to check if this specific referral click has already been processed
function hasReferralBeenProcessed(referrerEmail, referredEmail) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let clicksSheet = spreadsheet.getSheetByName(REFERRAL_CLICKS_SHEET_NAME);
    
    // Create sheet if it doesn't exist
    if (!clicksSheet) {
      clicksSheet = spreadsheet.insertSheet(REFERRAL_CLICKS_SHEET_NAME);
      clicksSheet.getRange(1, 1, 1, 4).setValues([
        ['Referrer Email', 'Referred Email', 'Timestamp', 'Coins Awarded']
      ]);
      clicksSheet.getRange(1, 1, 1, 4).setFontWeight('bold');
      console.log('Created new referral clicks tracking sheet');
      return false;
    }
    
    const data = clicksSheet.getDataRange().getValues();
    
    // Check if this referrer-referred pair already exists
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === referrerEmail && data[i][1] === referredEmail) {
        console.log('Referral already processed:', { referrerEmail, referredEmail });
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking referral status:', error);
    return false; // If error, allow the referral to proceed
  }
}

// Function to record a processed referral click
function recordReferralClick(referrerEmail, referredEmail, coinsAwarded) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let clicksSheet = spreadsheet.getSheetByName(REFERRAL_CLICKS_SHEET_NAME);
    
    if (!clicksSheet) {
      clicksSheet = spreadsheet.insertSheet(REFERRAL_CLICKS_SHEET_NAME);
      clicksSheet.getRange(1, 1, 1, 4).setValues([
        ['Referrer Email', 'Referred Email', 'Timestamp', 'Coins Awarded']
      ]);
      clicksSheet.getRange(1, 1, 1, 4).setFontWeight('bold');
    }
    
    const timestamp = new Date();
    clicksSheet.appendRow([referrerEmail, referredEmail, timestamp, coinsAwarded]);
    console.log('Recorded referral click:', { referrerEmail, referredEmail, coinsAwarded });
  } catch (error) {
    console.error('Error recording referral click:', error);
  }
}

// Function to process referral tracking data
function processReferralTracking(data) {
  try {
    console.log('processReferralTracking called with data:', data);
    console.log('Data type:', typeof data);
    console.log('Data keys:', data ? Object.keys(data) : 'data is null/undefined');
    
    // Validate required fields for referral tracking
    if (!data.referrerName || !data.referrerEmail || !data.platform) {
      console.error('Missing required fields for referral tracking:', {
        referrerName: data.referrerName,
        referrerEmail: data.referrerEmail,
        platform: data.platform
      });
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Missing required fields for referral tracking',
          received: {
            referrerName: data.referrerName,
            referrerEmail: data.referrerEmail,
            platform: data.platform
          }
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // If this is a referral click (someone visiting via referral link), check if already processed
    if (data.referredEmail && data.referredEmail !== '' && data.referredEmail !== 'unknown') {
      console.log('Checking if referral already processed for:', {
        referrer: data.referrerEmail,
        referred: data.referredEmail
      });
      
      if (hasReferralBeenProcessed(data.referrerEmail, data.referredEmail)) {
        console.log('Referral already processed, skipping coin award');
        return ContentService
          .createTextOutput(JSON.stringify({
            success: true,
            message: 'Referral already processed',
            alreadyProcessed: true,
            timestamp: new Date().toISOString()
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Open the Google Sheet
    let spreadsheet, sheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SHEET_ID);
      sheet = spreadsheet.getSheetByName(REFERRAL_SHEET_NAME);
      
      // Create sheet if it doesn't exist
      if (!sheet) {
        sheet = spreadsheet.insertSheet(REFERRAL_SHEET_NAME);
        console.log('Created new referral tracking sheet:', REFERRAL_SHEET_NAME);
      }
    } catch (error) {
      console.error('Error accessing Google Sheet for referral tracking:', error);
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Failed to access Google Sheet',
          details: error.toString()
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 9).setValues([
        ['Referrer Name', 'Referrer Email', 'Referrer Phone', 'Referrer Role', 'Referrer Count', 'Akshar coins', 'Time stamp', 'Referral Code', 'Platform']
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
      console.log('Added headers to referral tracking sheet');
    }
    
    console.log('Referral tracking sheet has', sheet.getLastRow(), 'rows');
    
    // Get existing data
    const existingRows = sheet.getDataRange().getValues();
    let userRowIndex = -1;
    let currentReferralCount = 0;
    let currentTotalCoins = 0;
    
    // Find existing user record (case-insensitive, trimmed)
    const searchEmail = (data.referrerEmail || '').toString().toLowerCase().trim();
    console.log('Looking for existing user with email:', searchEmail);
    
    for (let i = 1; i < existingRows.length; i++) {
      const rowEmail = (existingRows[i][1] || '').toString().toLowerCase().trim();
      console.log('Checking row', i, 'email:', rowEmail);
      
      if (rowEmail === searchEmail) { // Email is in column 2 (index 1)
        userRowIndex = i + 1; // +1 because sheet rows are 1-indexed
        currentReferralCount = parseInt(existingRows[i][4]) || 0; // Referrer Count column (index 4)
        currentTotalCoins = parseInt(existingRows[i][5]) || 0; // Akshar coins column (index 5)
        console.log('Found existing user at row', userRowIndex, 'with', currentReferralCount, 'referrals and', currentTotalCoins, 'coins');
        break;
      }
    }
    
    if (userRowIndex === -1) {
      console.log('No existing user found, will create new record');
    }
    
    // Calculate coins based on action type
    let coinsToAward = 0;
    let shouldIncrementReferralCount = false;
    let actionType = '';
    
    // Scenario 1: User is sharing the referral link (no referredEmail)
    // Award 3 coins immediately for sharing
    if (!data.referredEmail || data.referredEmail === '' || data.referredEmail === 'unknown') {
      coinsToAward = getCoinsForSharing(data.platform);
      shouldIncrementReferralCount = false;
      actionType = 'share';
      console.log('Awarding coins for SHARING:', coinsToAward);
    }
    // Scenario 2: Someone registered via their referral link (has referredEmail)
    // Award 1 additional coin and increment referral count
    else {
      coinsToAward = getCoinsForRegistration();
      shouldIncrementReferralCount = true;
      actionType = 'registration';
      
      // Record this referral click to prevent duplicates
      recordReferralClick(data.referrerEmail, data.referredEmail, coinsToAward);
      console.log('Awarding coins for REGISTRATION:', coinsToAward);
    }
    
    const newReferralCount = shouldIncrementReferralCount ? currentReferralCount + 1 : currentReferralCount;
    const newTotalCoins = currentTotalCoins + coinsToAward;
    const timestamp = new Date();
    
    console.log('Coins calculation:', {
      actionType: actionType,
      platform: data.platform,
      coinsToAward: coinsToAward,
      shouldIncrementCount: shouldIncrementReferralCount,
      referredEmail: data.referredEmail || 'none',
      currentReferralCount: currentReferralCount,
      newReferralCount: newReferralCount,
      currentTotalCoins: currentTotalCoins,
      newTotalCoins: newTotalCoins
    });
    
    if (userRowIndex > 0) {
      // Update existing user record
      const updateData = [
        data.referrerName,
        data.referrerEmail,
        data.referrerPhone || '',
        data.referrerRole || 'unknown',
        newReferralCount,
        newTotalCoins,
        timestamp,
        data.referralCode || 'AKSHAR2025',
        data.platform
      ];
      console.log('Updating existing user record with data:', updateData);
      sheet.getRange(userRowIndex, 1, 1, 9).setValues([updateData]);
      console.log(`Updated existing user record for ${data.referrerEmail}`);
    } else {
      // Create new user record
      const newData = [
        data.referrerName,
        data.referrerEmail,
        data.referrerPhone || '',
        data.referrerRole || 'unknown',
        newReferralCount,
        newTotalCoins,
        timestamp,
        data.referralCode || 'AKSHAR2025',
        data.platform
      ];
      console.log('Creating new user record with data:', newData);
      sheet.appendRow(newData);
      console.log(`Created new user record for ${data.referrerEmail}`);
    }
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 9);
    
    // Return success response
    let message = '';
    if (actionType === 'share') {
      message = `Referral shared via ${data.platform}! You earned ${coinsToAward} coins for sharing.`;
    } else if (actionType === 'registration') {
      message = `Someone registered via your referral! You earned ${coinsToAward} bonus coin.`;
    } else {
      message = 'Referral tracking updated successfully';
    }
    
    const response = {
      success: true,
      message: message,
      actionType: actionType,
      timestamp: timestamp.toISOString(),
      coinsEarned: coinsToAward,
      totalCoins: newTotalCoins,
      referralCount: newReferralCount,
      sheetName: REFERRAL_SHEET_NAME
    };
    
    console.log('Referral tracking result:', response);
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing referral tracking:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Failed to save referral tracking',
        details: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    console.log('doGet called with:', e);
    console.log('doGet event type:', typeof e);
    console.log('doGet has parameters:', !!e.parameters);
    console.log('doGet parameters keys:', e.parameters ? Object.keys(e.parameters) : 'none');
    
    // Helper function to get parameter value (handles both string and array)
    function getParam(key) {
      if (!e.parameters || !e.parameters[key]) return null;
      return Array.isArray(e.parameters[key]) ? e.parameters[key][0] : e.parameters[key];
    }
    
    // Check if this is a referral tracking request
    const requestType = getParam('type');
    if (e.parameters && (requestType === 'referral' || requestType === 'referral_share') && e.parameters.referrerName && e.parameters.referrerEmail) {
      // This is a referral tracking request via GET
      const data = {};
      Object.keys(e.parameters).forEach(key => {
        if (Array.isArray(e.parameters[key]) && e.parameters[key].length === 1) {
          data[key] = e.parameters[key][0];
        } else {
          data[key] = e.parameters[key];
        }
      });
      
      console.log('Received referral tracking data:', data);
      
      // Process the referral tracking
      return processReferralTracking(data);
    } else if (e.parameters && getParam('action') === 'get_referrals') {
      // This is a request to get referral data
      const email = getParam('email');
      console.log('Getting referral data for email:', email);
      
      const result = getReferralData(email);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } else if (e.parameters && getParam('action') === 'get_referral_clicks') {
      // This is a request to get referral clicks (who registered via user's link)
      const referrerEmail = getParam('referrer');
      console.log('Getting referral clicks for referrer:', referrerEmail);
      
      const result = getReferralClicks(referrerEmail);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } else if (e.parameters && getParam('type') === 'check_registration' && e.parameters.email) {
      // This is a registration check request via GET
      const email = getParam('email');
      console.log('Checking registration for email:', email);
      
      const result = checkUserRegistration(email);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } else if (e.parameters && (getParam('name') || getParam('fullName')) && e.parameters.email && e.parameters.phone && e.parameters.role) {
      // This is a registration request via GET
      const data = {};
      Object.keys(e.parameters).forEach(key => {
        if (Array.isArray(e.parameters[key]) && e.parameters[key].length === 1) {
          data[key] = e.parameters[key][0];
        } else {
          data[key] = e.parameters[key];
        }
      });
      
      console.log('Received registration data via GET:', data);
      console.log('Data type:', typeof data);
      console.log('Data keys:', data ? Object.keys(data) : 'data is null/undefined');
      
      // Validate data before processing
      if (!data || Object.keys(data).length === 0) {
        console.error('No data received for processing via GET');
        return ContentService
          .createTextOutput(JSON.stringify({
            error: 'No data received via GET',
            received: e.parameters
          }))
          .setMimeType(ContentService.MimeType.JSON);
      }
      
      // Process the registration
      return processRegistration(data);
    } else {
      // This is just a test request
      return ContentService
        .createTextOutput(JSON.stringify({
          message: 'AksharJobs Expo Registration & Referral API is running',
          timestamp: new Date().toISOString(),
          received_parameters: e.parameters || 'none'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Failed to process request',
        details: error.toString(),
        parameters_received: e.parameters || 'none'
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify setup
function testSetup() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    console.log('✅ Google Sheet access successful');
    console.log('Sheet URL:', `https://docs.google.com/spreadsheets/d/${SHEET_ID}`);
    
    // Check if the registration sheet exists, create if not
    let regSheet = spreadsheet.getSheetByName(REGISTRATION_SHEET_NAME);
    if (!regSheet) {
      regSheet = spreadsheet.insertSheet(REGISTRATION_SHEET_NAME);
      console.log('✅ Created new registration sheet:', REGISTRATION_SHEET_NAME);
    } else {
      console.log('✅ Registration sheet exists:', REGISTRATION_SHEET_NAME);
    }
    
    // Check if the referral tracking sheet exists, create if not
    let refSheet = spreadsheet.getSheetByName(REFERRAL_SHEET_NAME);
    if (!refSheet) {
      refSheet = spreadsheet.insertSheet(REFERRAL_SHEET_NAME);
      console.log('✅ Created new referral tracking sheet:', REFERRAL_SHEET_NAME);
    } else {
      console.log('✅ Referral tracking sheet exists:', REFERRAL_SHEET_NAME);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Google Sheet setup error:', error);
    return false;
  }
}

// Test function to simulate a registration
function testRegistration() {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    role: 'job_seeker'
  };
  
  console.log('Testing registration with data:', testData);
  const result = processRegistration(testData);
  console.log('Registration result:', result.getContent());
  return result;
}

// Test function to simulate referral tracking
function testReferralTracking() {
  const testData = {
    type: 'referral',
    referrerName: 'Test Referrer',
    referrerEmail: 'referrer@example.com',
    referrerPhone: '1234567890',
    referrerRole: 'job_seeker',
    platform: 'whatsapp',
    referralCode: 'AKSHAR2025'
  };
  
  console.log('Testing referral tracking with data:', testData);
  console.log('Coins that would be earned for sharing:', getCoinsForSharing(testData.platform));
  const result = processReferralTracking(testData);
  console.log('Referral tracking result:', result.getContent());
  return result;
}

// Test function to simulate referral tracking from website
function testReferralTrackingFromWebsite() {
  const testData = {
    type: 'referral',
    referrerName: 'Test User',
    referrerEmail: 'testv2@example.com',
    referrerPhone: '9876543210',
    referrerRole: 'job_seeker',
    platform: 'whatsapp',
    coinsEarned: 5,
    totalCoins: 5,
    referralCode: 'AKSHAR2025',
    shareCount: 1,
    source: 'test'
  };
  
  console.log('Testing referral tracking from website with data:', testData);
  const result = processReferralTracking(testData);
  console.log('Referral tracking result:', result.getContent());
  return result;
}

// Test function to debug registration processing
function testRegistrationProcessing() {
  console.log('testRegistrationProcessing function called');
  
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    role: 'job_seeker'
  };
  
  console.log('Testing registration processing with data:', testData);
  console.log('Test data type:', typeof testData);
  console.log('Test data keys:', Object.keys(testData));
  
  try {
    const result = processRegistration(testData);
    console.log('Registration result:', result.getContent());
    return result;
  } catch (error) {
    console.error('Error in testRegistrationProcessing:', error);
    return null;
  }
}

// Simple test function to debug processRegistration directly
function testProcessRegistrationDirect() {
  console.log('testProcessRegistrationDirect function called');
  
  // Create test data directly
  const testData = {
    name: 'Direct Test User',
    email: 'direct@example.com',
    phone: '9876543210',
    role: 'recruiter'
  };
  
  console.log('About to call processRegistration with:', testData);
  console.log('Data is valid:', testData && typeof testData === 'object');
  console.log('Data has required fields:', testData.name && testData.email && testData.phone && testData.role);
  
  // Call processRegistration directly
  return processRegistration(testData);
}

// Function to clean up and convert existing referral tracking data
function cleanupReferralTrackingSheet() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(REFERRAL_SHEET_NAME);
    
    if (!sheet) {
      console.log('Referral tracking sheet not found');
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      console.log('No data to clean up');
      return;
    }
    
    // Create a new sheet for cleaned data
    const newSheetName = REFERRAL_SHEET_NAME + '_Cleaned';
    let newSheet = spreadsheet.getSheetByName(newSheetName);
    if (newSheet) {
      spreadsheet.deleteSheet(newSheet);
    }
    newSheet = spreadsheet.insertSheet(newSheetName);
    
    // Set headers
    newSheet.getRange(1, 1, 1, 9).setValues([
      ['Referrer Name', 'Referrer Email', 'Referrer Phone', 'Referrer Role', 'Referrer Count', 'Akshar coins', 'Time stamp', 'Referral Code', 'Platform']
    ]);
    newSheet.getRange(1, 1, 1, 9).setFontWeight('bold');
    
    // Process existing data and consolidate by user
    const userMap = new Map();
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const email = row[2]; // Email column
      
      if (!email) continue;
      
      if (userMap.has(email)) {
        // Update existing user
        const user = userMap.get(email);
        user.totalReferrals++;
        if (row[8]) { // Coins Earned column
          user.totalCoins += parseInt(row[8]) || 0;
        }
        if (row[0] > user.lastUpdated) { // Timestamp column
          user.lastUpdated = row[0];
        }
      } else {
        // Create new user entry
        userMap.set(email, {
          name: row[1],
          email: row[2],
          phone: row[3],
          role: row[4],
          totalReferrals: 1,
          totalCoins: parseInt(row[8]) || 0,
          lastUpdated: row[0],
          referralCode: row[7] || 'AKSHAR2025',
          platform: row[5] || ''
        });
      }
    }
    
    // Write consolidated data to new sheet
    const consolidatedData = Array.from(userMap.values()).map(user => [
      user.name,
      user.email,
      user.phone,
      user.role,
      user.totalReferrals,
      user.totalCoins,
      user.lastUpdated,
      user.referralCode,
      user.platform
    ]);
    
    if (consolidatedData.length > 0) {
      newSheet.getRange(2, 1, consolidatedData.length, 9).setValues(consolidatedData);
    }
    
    newSheet.autoResizeColumns(1, 9);
    
    console.log(`Cleaned up referral data: ${data.length - 1} rows consolidated into ${consolidatedData.length} unique users`);
    console.log(`New sheet created: ${newSheetName}`);
    
    return {
      success: true,
      originalRows: data.length - 1,
      consolidatedUsers: consolidatedData.length,
      newSheetName: newSheetName
    };
    
  } catch (error) {
    console.error('Error cleaning up referral tracking sheet:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

// Test function to simulate a POST request
function testPostRequest() {
  // Simulate different types of POST requests
  const testCases = [
    {
      name: 'JSON POST request',
      event: {
        postData: {
          type: 'application/json',
          contents: JSON.stringify({
            name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            role: 'job_seeker'
          })
        }
      }
    },
    {
      name: 'Form data POST request',
      event: {
        postData: {
          type: 'application/x-www-form-urlencoded',
          contents: 'name=Test%20User&email=test%40example.com&phone=1234567890&role=job_seeker'
        }
      }
    },
    {
      name: 'Parameters only request',
      event: {
        parameters: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          role: 'job_seeker'
        }
      }
    }
  ];
  
  testCases.forEach(testCase => {
    console.log(`\n=== Testing ${testCase.name} ===`);
    try {
      const result = doPost(testCase.event);
      console.log('Result:', result.getContent());
    } catch (error) {
      console.error('Error:', error);
    }
  });
}

// Process referral registration (when someone registers via referral link)
function processReferralRegistration(data) {
  try {
    console.log('processReferralRegistration called with data:', data);
    
    const timestamp = new Date();
    
    // Get the referral tracking sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REFERRAL_SHEET_NAME);
    if (!sheet) {
      throw new Error(`Sheet ${REFERRAL_SHEET_NAME} not found`);
    }
    
    // Add referral registration record
    const newRow = [
      data.referrerEmail || '',
      data.receiverName || '',
      data.receiverEmail || '',
      data.receiverPhone || '',
      data.receiverRole || '',
      'referral_registration',
      data.referrerCoinsEarned || 3,
      data.receiverCoinsEarned || 3,
      timestamp,
      data.referralCode || 'AKSHAR2025',
      data.source || 'registration'
    ];
    
    sheet.appendRow(newRow);
    
    // Update referrer's coins
    updateReferrerCoins(data.referrerEmail, data.referrerCoinsEarned || 3);
    
    // Update receiver's coins (if they have a record)
    updateReceiverCoins(data.receiverEmail, data.receiverCoinsEarned || 3);
    
    const response = {
      success: true,
      message: 'Referral registration processed successfully',
      timestamp: timestamp.toISOString(),
      referrerCoinsEarned: data.referrerCoinsEarned || 3,
      receiverCoinsEarned: data.receiverCoinsEarned || 3
    };
    
    console.log('Referral registration result:', response);
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in processReferralRegistration:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Process referrer coins update
function processReferrerCoins(data) {
  try {
    console.log('processReferrerCoins called with data:', data);
    
    // Update referrer's coins
    updateReferrerCoins(data.referrerEmail, data.coinsEarned || 3);
    
    const response = {
      success: true,
      message: 'Referrer coins updated successfully',
      timestamp: new Date().toISOString(),
      coinsEarned: data.coinsEarned || 3
    };
    
    console.log('Referrer coins result:', response);
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in processReferrerCoins:', error);
    
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Update referrer's coins in the referral tracking sheet
function updateReferrerCoins(referrerEmail, coinsToAdd) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REFERRAL_SHEET_NAME);
    if (!sheet) {
      console.error('Referral tracking sheet not found');
      return;
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Find the referrer's record
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row[1] === referrerEmail) { // Email is in column B
        const currentCoins = row[5] || 0; // Total coins in column F
        const newTotalCoins = currentCoins + coinsToAdd;
        
        // Update the total coins
        sheet.getRange(i + 1, 6).setValue(newTotalCoins);
        
        console.log(`Updated referrer ${referrerEmail} coins: ${currentCoins} + ${coinsToAdd} = ${newTotalCoins}`);
        break;
      }
    }
  } catch (error) {
    console.error('Error updating referrer coins:', error);
  }
}

// Update receiver's coins in the referral tracking sheet
function updateReceiverCoins(receiverEmail, coinsToAdd) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(REFERRAL_SHEET_NAME);
    if (!sheet) {
      console.error('Referral tracking sheet not found');
      return;
    }
    
    // Add a new record for the receiver
    const timestamp = new Date();
    const newRow = [
      receiverEmail, // Referrer email (same as receiver for self-referral)
      '', // Referrer name
      receiverEmail, // Receiver email
      '', // Receiver phone
      '', // Receiver role
      'receiver_coins',
      coinsToAdd, // Coins earned
      coinsToAdd, // Total coins
      timestamp,
      'AKSHAR2025',
      'referral_registration'
    ];
    
    sheet.appendRow(newRow);
    
    console.log(`Added ${coinsToAdd} coins for receiver ${receiverEmail}`);
  } catch (error) {
    console.error('Error updating receiver coins:', error);
  }
}

// Get referral data from the referral tracking sheet
function getReferralData(email) {
  try {
    console.log('getReferralData called for email:', email);
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(REFERRAL_SHEET_NAME);
    
    if (!sheet) {
      console.log('Referral tracking sheet not found');
      return {
        success: false,
        error: 'Referral tracking sheet not found'
      };
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      console.log('No referral data found');
      return {
        success: true,
        message: 'No referral data found',
        records: []
      };
    }
    
    // Get headers
    const headers = data[0];
    console.log('Headers:', headers);
    
    // Filter records by email if provided, otherwise return all
    const records = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // If email is provided, filter by email
      if (email && email !== 'anonymous@example.com') {
        // Check if email matches in any of the email columns (index 1 is Referrer Email)
        if (row[1] && row[1].toString().toLowerCase() === email.toLowerCase()) {
          records.push({
            name: row[0] || '',
            email: row[1] || '',
            phone: row[2] || '',
            role: row[3] || '',
            referralCount: row[4] || 0,
            totalCoins: row[5] || 0,
            timestamp: row[6] || '',
            referralCode: row[7] || '',
            platform: row[8] || ''
          });
        }
      } else {
        // Return all records (limited to last 50 for performance)
        if (records.length < 50) {
          records.push({
            name: row[0] || '',
            email: row[1] || '',
            phone: row[2] || '',
            role: row[3] || '',
            referralCount: row[4] || 0,
            totalCoins: row[5] || 0,
            timestamp: row[6] || '',
            referralCode: row[7] || '',
            platform: row[8] || ''
          });
        }
      }
    }
    
    console.log(`Found ${records.length} referral records`);
    
    return {
      success: true,
      message: `Found ${records.length} referral record(s)`,
      records: records,
      totalRecords: data.length - 1,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${SHEET_ID}`
    };
    
  } catch (error) {
    console.error('Error getting referral data:', error);
    return {
      success: false,
      error: error.toString(),
      details: 'Failed to retrieve referral data from Google Sheets'
    };
  }
}

// Test function to get referral data
function testGetReferralData() {
  const result = getReferralData(null);
  console.log('Test result:', JSON.stringify(result, null, 2));
  return result;
}

// Get referral clicks from the Referral_Clicks sheet
function getReferralClicks(referrerEmail) {
  try {
    console.log('getReferralClicks called for referrer:', referrerEmail);
    
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(REFERRAL_CLICKS_SHEET_NAME);
    
    if (!sheet) {
      console.log('Referral clicks sheet not found');
      return {
        success: true,
        message: 'No referral clicks sheet found',
        clicks: []
      };
    }
    
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      console.log('No referral clicks found');
      return {
        success: true,
        message: 'No referral clicks yet',
        clicks: []
      };
    }
    
    // Filter clicks for this referrer
    const clicks = [];
    const searchEmail = (referrerEmail || '').toString().toLowerCase().trim();
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowReferrerEmail = (row[0] || '').toString().toLowerCase().trim();
      
      // Check if this click belongs to the referrer
      if (rowReferrerEmail === searchEmail) {
        clicks.push({
          referrerEmail: row[0] || '',
          referredEmail: row[1] || '',
          referredName: row[1] ? row[1].split('@')[0] : 'User', // Use email prefix as name
          timestamp: row[2] || '',
          coinsAwarded: row[3] || 1
        });
      }
    }
    
    console.log(`Found ${clicks.length} referral clicks for ${referrerEmail}`);
    
    return {
      success: true,
      message: `Found ${clicks.length} referral click(s)`,
      clicks: clicks,
      totalClicks: clicks.length
    };
    
  } catch (error) {
    console.error('Error getting referral clicks:', error);
    return {
      success: false,
      error: error.toString(),
      clicks: []
    };
  }
}

// Function to clean up duplicate user rows and merge them
function cleanupDuplicateUsers() {
  try {
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    const sheet = spreadsheet.getSheetByName(REFERRAL_SHEET_NAME);
    
    if (!sheet) {
      console.log('Referral tracking sheet not found');
      return { success: false, message: 'Sheet not found' };
    }
    
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) {
      console.log('No data to clean up');
      return { success: true, message: 'No duplicates found' };
    }
    
    // Create a map to merge duplicate users
    const userMap = new Map();
    
    // Process all rows (skip header at index 0)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const email = (row[1] || '').toString().toLowerCase().trim(); // Column B (index 1)
      
      if (!email) continue;
      
      if (userMap.has(email)) {
        // Merge with existing entry
        const user = userMap.get(email);
        user.totalCoins += parseInt(row[5]) || 0; // Add coins from this row
        user.referralCount = Math.max(user.referralCount, parseInt(row[4]) || 0); // Use highest count
        if (row[6] > user.lastUpdated) { // Check timestamp (Column G, index 6)
          user.lastUpdated = row[6];
        }
      } else {
        // Create new entry
        userMap.set(email, {
          name: row[0] || '',
          email: email,
          phone: row[2] || '',
          role: row[3] || '',
          referralCount: parseInt(row[4]) || 0,
          totalCoins: parseInt(row[5]) || 0,
          lastUpdated: row[6] || new Date(),
          referralCode: row[7] || 'AKSHAR2025',
          platform: row[8] || ''
        });
      }
    }
    
    // Clear all data except headers
    if (data.length > 1) {
      sheet.deleteRows(2, data.length - 1);
    }
    
    // Write merged data back
    const mergedData = Array.from(userMap.values()).map(user => [
      user.name,
      user.email,
      user.phone,
      user.role,
      user.referralCount,
      user.totalCoins,
      user.lastUpdated,
      user.referralCode,
      user.platform
    ]);
    
    if (mergedData.length > 0) {
      sheet.getRange(2, 1, mergedData.length, 9).setValues(mergedData);
    }
    
    console.log(`Cleaned up: ${data.length - 1} rows merged into ${mergedData.length} unique users`);
    
    return {
      success: true,
      message: `Merged ${data.length - 1} rows into ${mergedData.length} unique users`,
      originalRows: data.length - 1,
      mergedUsers: mergedData.length
    };
    
  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}