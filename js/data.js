/**
 * Yatra Saarthi — Frontend Mock Data Module
 * Mirrors the structure of data/db.json for the client-side demo.
 * In production, this would be replaced by API calls to the MCP server.
 *
 * STATUS TYPES:
 *   "ontime"   — Train is running on schedule
 *   "late"     — Train is running behind schedule
 *   "critical" — Train has high cancellation risk or severe delay
 */

const YS_TRAIN_DB = {
    "12932": {
        name: "Ahmedabad Double Decker Express",
        status: "Running Late by 15 mins",
        current_station: "Surat (ST)",
        probability_cancel: "Low (12%)",
        next_stop: "Bharuch (BH)",
        platform: 3,
        statusType: "late"
    },
    "12215": {
        name: "Delhi Garibrath Express",
        status: "On Time",
        current_station: "Vadodara (BRC)",
        probability_cancel: "High (85%)",
        next_stop: "Ratlam (RTM)",
        platform: 5,
        statusType: "critical"
    },
    "12124": {
        name: "Deccan Queen",
        status: "Running Late by 45 mins",
        current_station: "Lonavala (LNL)",
        probability_cancel: "Medium (40%)",
        next_stop: "Dadar (DR)",
        platform: 1,
        statusType: "late"
    },
    "12951": {
        name: "Mumbai Rajdhani",
        status: "On Time",
        current_station: "Kota (KOTA)",
        probability_cancel: "Low (2%)",
        next_stop: "New Delhi (NDLS)",
        platform: 6,
        statusType: "ontime"
    },
    "12301": {
        name: "Howrah Rajdhani Express",
        status: "Running Late by 30 mins",
        current_station: "Allahabad (PRYJ)",
        probability_cancel: "Low (8%)",
        next_stop: "Mughal Sarai (MGS)",
        platform: 2,
        statusType: "late"
    },
    "12627": {
        name: "Karnataka Express",
        status: "On Time",
        current_station: "Raichur (RC)",
        probability_cancel: "Low (5%)",
        next_stop: "Solapur (SUR)",
        platform: 4,
        statusType: "ontime"
    },
    "12622": {
        name: "Tamil Nadu Express",
        status: "Running Late by 60 mins",
        current_station: "Vijayawada (BZA)",
        probability_cancel: "Medium (35%)",
        next_stop: "Warangal (WL)",
        platform: 7,
        statusType: "late"
    },
    "12859": {
        name: "Gitanjali Express",
        status: "On Time",
        current_station: "Nagpur (NGP)",
        probability_cancel: "Low (3%)",
        next_stop: "Bhusaval (BSL)",
        platform: 2,
        statusType: "ontime"
    },
    "12723": {
        name: "Telangana Express",
        status: "Running Late by 20 mins",
        current_station: "Balharshah (BPQ)",
        probability_cancel: "Low (10%)",
        next_stop: "Nagpur (NGP)",
        platform: 3,
        statusType: "late"
    },
    "12839": {
        name: "Chennai Mail (HWH-MAS)",
        status: "On Time",
        current_station: "Kharagpur (KGP)",
        probability_cancel: "Low (6%)",
        next_stop: "Bhubaneswar (BBS)",
        platform: 5,
        statusType: "ontime"
    }
};

/** Station data — food stalls and cab services per station code */
const YS_STATION_DB = {
    "NDLS": { name: "New Delhi",               food: ["Haldiram's", "Comesum", "Jan Aahar", "IRCTC Food Court", "Domino's"], cabs: ["Ola", "Uber", "Meru Cabs", "Delhi Metro Feeder"] },
    "BCT":  { name: "Mumbai Central",           food: ["IRCTC Food Plaza", "Comesum", "Jan Aahar", "Subway"],                cabs: ["Ola", "Uber", "Meru Cabs", "Mumbai Metro Feeder"] },
    "HWH":  { name: "Howrah Junction",          food: ["IRCTC Food Court", "Jan Aahar", "Haldiram's", "Local Stalls"],       cabs: ["Ola", "Uber", "Local Taxi Stand"] },
    "MAS":  { name: "Chennai Central",          food: ["IRCTC Food Court", "Saravana Bhavan", "Jan Aahar", "A2B"],           cabs: ["Ola", "Uber", "Chennai Metro Feeder"] },
    "SBC":  { name: "Bengaluru City Junction",  food: ["IRCTC Food Court", "Comesum", "MTR", "Jan Aahar"],                   cabs: ["Ola", "Uber", "Namma Metro Feeder", "Rapido"] },
    "SC":   { name: "Secunderabad Junction",    food: ["IRCTC Food Court", "Jan Aahar", "Paradise Biryani", "Comesum"],      cabs: ["Ola", "Uber", "Hyderabad Metro Feeder"] },
    "PUNE": { name: "Pune Junction",            food: ["IRCTC Food Court", "Jan Aahar", "Comesum"],                          cabs: ["Ola", "Uber", "Pune Metro Feeder"] },
    "ADI":  { name: "Ahmedabad Junction",       food: ["IRCTC Food Court", "Jan Aahar", "Honest Restaurant"],                cabs: ["Ola", "Uber", "Ahmedabad Metro Feeder"] }
};

/** Active delay/disruption alerts across railway zones */
const YS_DELAY_ALERTS = [
    { region: "Northern Railways",  message: "Fog advisory: Trains in Delhi-Lucknow sector may experience 30-60 min delays",    severity: "warning",  trains: ["12301", "12951"] },
    { region: "Western Railways",   message: "Track maintenance between Surat-Bharuch, trains may face 15-20 min delays",       severity: "info",     trains: ["12932", "12215"] },
    { region: "Southern Railways",  message: "Signal failure at Vijayawada Junction, expect delays of 45-90 mins",              severity: "critical", trains: ["12622", "12839"] },
    { region: "Central Railways",   message: "Heavy rain warning in Mumbai-Pune section, services may be affected",             severity: "warning",  trains: ["12124", "12627"] }
];

/**
 * Multi-lingual station keyword map.
 * Maps station codes to arrays of keywords (in all supported languages)
 * used for detecting station references in user queries.
 */
const YS_STATION_KEYWORDS = {
    "NDLS": ["delhi", "ndls", "दिल्ली", "new delhi", "नई दिल्ली", "নিউ দিল্লি", "டெல்லி", "ఢిల్లీ"],
    "BCT":  ["mumbai central", "bct", "मुंबई सेंट्रल", "मुम्बई", "mumbai", "মুম্বাই", "மும்பை", "ముంబై"],
    "HWH":  ["howrah", "hwh", "हावड़ा", "হাওড়া", "ஹவ்ரா"],
    "MAS":  ["chennai", "mas", "चेन्नई", "சென்னை", "చెన్నై", "চেন্নাই"],
    "SBC":  ["bengaluru", "bangalore", "sbc", "बेंगलुरु", "பெங்களூர்", "బెంగళూరు", "বেঙ্গালুরু"],
    "SC":   ["secunderabad", "sc", "सिकंदराबाद", "hyderabad", "హైదరాబాద్", "সিকন্দরাবাদ", "சிகந்திராபாத்"],
    "PUNE": ["pune", "पुणे", "புனே", "పూణే", "পুনে"],
    "ADI":  ["ahmedabad", "adi", "अहमदाबाद", "அகமதாபாத்", "అహ్మదాబాద్", "আহমেদাবাদ"]
};

/**
 * Multi-lingual intent detection keywords.
 * Each intent maps to an array of keywords across all supported languages.
 */
const YS_INTENT_KEYWORDS = {
    delay:    ["delay", "alert", "देरी", "अलर्ट", "उशीर", "सूचना", "தாமத", "எச்சரிக்கை", "ఆలస్యం", "హెచ్చరిక", "বিলম্ব", "সতর্কতা", "late", "cancel"],
    food:     ["food", "खाना", "जेवण", "உணவு", "భోజనం", "খাবার", "eat", "order food", "stall", "restaurant", "aahar"],
    cab:      ["cab", "taxi", "कैब", "टैक्सी", "कॅब", "கேப்", "క్యాబ్", "ক্যাব", "ola", "uber", "ride", "transport"],
    platform: ["platform", "प्लेटफॉर्म", "प्लॅटफॉर्म", "பிளாட்ஃபார்ம்", "ప్లాట్‌ఫారం", "প্ল্যাটফর্ম", "which platform", "konsa platform"]
};

/** Dynamically build regex from known train numbers */
const YS_KNOWN_TRAINS = Object.keys(YS_TRAIN_DB);
const YS_TRAIN_REGEX = new RegExp('\\b(' + YS_KNOWN_TRAINS.join('|') + ')\\b');
