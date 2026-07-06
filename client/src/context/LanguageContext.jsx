import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navigation
    navHome: "Home",
    navAbout: "About",
    navSkills: "Skills",
    navBecomeTrainer: "Become a Trainer",
    navFindTrainer: "Find a Trainer",
    navCourses: "Courses",
    navCommunity: "Community",
    navContact: "Contact",
    navLogin: "Login",
    navRegister: "Register",
    navLogout: "Logout",
    navDashboard: "Dashboard",

    // Hero
    heroTitle: "Skill Sharing Among Villagers",
    heroSubtitle: "Learn Locally, Earn Locally, Grow Together.",
    heroIntro: "A community platform bringing rural talents together. Share your traditional or modern skills, teach your neighbors, earn locally, and build a stronger self-reliant village economy.",
    heroBtnGetStarted: "Get Started",
    heroBtnExplore: "Explore Skills",

    // Stats
    statsTrainers: "Active Trainers",
    statsLearners: "Enrolled Learners",
    statsSkills: "Skills Taught",
    statsVillages: "Impacted Villages",

    // Skills
    skillsTitle: "Popular Village Skills",
    skillsSubtitle: "Choose from 18 highly demanded traditional and modern skills. Connect with qualified local mentors.",
    skillsSearchPlaceholder: "Search skills (e.g. Farming, Tailoring)...",
    skillsTrainersAvailable: "Trainers available",
    skillsLearnMore: "Learn More",
    skillsNoTrainers: "No trainers available yet. Be the first!",

    // Skill Names & Desc
    skillTailoringName: "Tailoring & Stitching",
    skillTailoringDesc: "Learn dress design, stitching, hand embroidery, and modern apparel design patterns.",
    skillSpokenEnglishName: "Spoken English",
    skillSpokenEnglishDesc: "Improve conversational English, vocabulary, daily greetings, and job interview confidence.",
    skillTuitionTeachingName: "Tuition Teaching",
    skillTuitionTeachingDesc: "Core school subjects (Math, Science, Social) tutoring methods for rural educators.",
    skillComputerBasicsName: "Computer Basics",
    skillComputerBasicsDesc: "MS Office, web browsing, online utility payments, and digital safety practices.",
    skillFarmingTechniquesName: "Farming Techniques",
    skillFarmingTechniquesDesc: "Modern sowing, crop rotation, soil health testing, and efficient water management.",
    skillOrganicFarmingName: "Organic Farming",
    skillOrganicFarmingDesc: "Natural pest control, organic composting, zero-budget farming, and direct marketing.",
    skillHandicraftsName: "Handicrafts & Decor",
    skillHandicraftsDesc: "Bamboo crafting, clay pottery, jute bags, and local decor production.",
    skillCookingName: "Cooking & Baking",
    skillCookingDesc: "Traditional recipes, baking basics, commercial snacks preservation, and nutrition.",
    skillDanceName: "Classical & Folk Dance",
    skillDanceDesc: "Traditional dance forms, local folk steps, and coordination training.",
    skillMusicName: "Vocal & Instrumental Music",
    skillMusicDesc: "Learn devotional songs, classical notes, harmonium, or flute play.",
    skillMobileRepairName: "Mobile Phone Repairing",
    skillMobileRepairDesc: "Hardware repair, screen replacement, software flash, and component diagnosis.",
    skillCodingName: "Coding & Web Basics",
    skillCodingDesc: "Introduction to HTML, CSS, JavaScript, and building simple online portals.",
    skillDigitalMarketingName: "Digital Marketing",
    skillDigitalMarketingDesc: "Selling village products on social media, WhatsApp groups, and online marketplaces.",
    skillGraphicDesignName: "Graphic Design",
    skillGraphicDesignDesc: "Learn design tools, wedding card editing, local banners, and photo retouching.",
    skillBeautyMakeupName: "Beauty & Bridal Makeup",
    skillBeautyMakeupDesc: "Bridal makeup, skin care, hair styling, and organic herbal beauty products.",
    skillCarpentryName: "Woodwork & Carpentry",
    skillCarpentryDesc: "Furniture making, wooden joints, polishing, and restoration work.",
    skillElectricalWorkName: "Electrical Work",
    skillElectricalWorkDesc: "House wiring, fan assembly, appliance repairs, and safety precautions.",
    skillPlumbingName: "Plumbing & Piping",
    skillPlumbingDesc: "Leak fixes, pump maintenance, pipe installations, and rainwater harvest connection.",

    // Trainer Directory
    directoryTitle: "Trainer Directory",
    directorySubtitle: "Search and contact verified local instructors near your village.",
    dirSearchSkill: "Search by Skill",
    dirSearchVillage: "Search by Village",
    dirFilterLang: "Filter by Language",
    dirAllLangs: "All Languages",
    dirBtnContact: "Contact Now",
    dirBtnProfile: "View Profile",
    dirNoTrainers: "No trainers match your search parameters. Try expanding your filters.",

    // Trainer Profile Detail
    profExperience: "years of experience",
    profLanguages: "Languages",
    profTimings: "Preferred Timings",
    profFee: "Training Fee",
    profBookingBtn: "Book Training Slot",
    profReviews: "Learner Reviews",
    profNoReviews: "No reviews yet. Be the first to write a review!",
    profAddReview: "Add your Review",
    profRatingLabel: "Rating",
    profReviewTextPlaceholder: "Share your learning experience with this trainer...",
    profSubmitReview: "Submit Review",

    // Booking Modal
    bookTitle: "Request Skill Training",
    bookDate: "Select Preferred Date",
    bookTime: "Select Preferred Time Slot",
    bookSendBtn: "Send Training Request",
    bookSuccess: "Booking request sent successfully! You can track status on your dashboard.",
    bookFail: "Failed to send request. Please try again.",

    // Auth
    authLoginTitle: "Welcome Back",
    authLoginSubtitle: "Login to check bookings and message your trainers.",
    authRegisterTitle: "Join Our Community",
    authRegisterSubtitle: "Create an account to start sharing or learning skills.",
    authForgotTitle: "Reset Password",
    authForgotSubtitle: "Enter your registered email and choose a new password.",
    authRoleSelection: "Who are you?",
    authRoleLearner: "Learner (I want to learn skills)",
    authRoleTrainer: "Trainer (I want to teach skills)",
    authRoleAdmin: "Admin (Platform Coordinator)",
    authName: "Full Name",
    authEmail: "Email Address",
    authPhone: "Phone Number",
    authVillage: "Village Name",
    authPassword: "Password",
    authConfirmPassword: "Confirm Password",
    authSubmitLogin: "Login",
    authSubmitRegister: "Register",
    authSubmitReset: "Reset Password",
    authAlreadyHaveAcc: "Already have an account? Login",
    authNoAcc: "New to the platform? Register here",
    authForgotPasswordBtn: "Forgot Password?",
    authVerifyMsg: "Trainers require administrative verification before appearing in search.",

    // Dashboards
    dashTrainerTitle: "Trainer Dashboard",
    dashLearnerTitle: "Learner Dashboard",
    dashAdminTitle: "Admin Panel",
    dashOverview: "Overview",
    dashMyRequests: "Student Requests",
    dashEnrolledSkills: "My Enrolled Skills",
    dashRequestedTrainings: "Requested Trainings",
    dashFavTrainers: "Favorite Trainers",
    dashManageUsers: "Manage Users",
    dashTrainerVerification: "Trainer Verification",
    dashEarnings: "Earnings Estimate",
    dashNotifications: "Notifications",
    dashAnnouncements: "Community Announcements",
    dashPublishEvent: "Publish Workshop/Event",
    dashStatsTrainers: "Total Trainers",
    dashStatsLearners: "Total Learners",
    dashStatsBookings: "Total Bookings",
    dashVerifyBtn: "Verify & Approve",
    dashDeleteBtn: "Delete User",

    // Common Buttons / Statuses
    statusPending: "Pending Approval",
    statusApproved: "Approved / Scheduled",
    statusRejected: "Declined",
    statusCompleted: "Training Completed",
    btnApprove: "Approve Request",
    btnDecline: "Decline Request",
    btnComplete: "Mark Completed",

    // Community Page
    commTitle: "Village Community Center",
    commSubtitle: "Explore local workshops, accomplishments, announcements, and success stories.",
    commStories: "Success Stories",
    commWorkshops: "Workshops & Events",
    commAnnounce: "Announcements",
    commAddPost: "Create a Post",
    commGallery: "Village Gallery",
    commLikeBtn: "Like",

    // Footer & About
    aboutTitle: "About Our Platform",
    aboutPara1: "The 'Skill Sharing Among Villagers' project was conceived to address the gap in accessible education and employment in rural areas. By mapping local expertise to community learning desires, we empower villagers to learn locally and earn locally.",
    aboutPara2: "Whether it is traditional handicrafts or modern software coding, our platform encourages self-reliance, community networking, and sustainable village development.",
    contactTitle: "Get in Touch",
    contactSubtitle: "Have questions? Reach out to our village community coordinators.",
    contactSendBtn: "Send Message",
    contactSuccess: "Your message has been sent. We will get back to you soon!",
    footerRights: "All Rights Reserved. Community Service Project."
  },
  te: {
    // Navigation
    navHome: "హోమ్",
    navAbout: "గురించి",
    navSkills: "నైపుణ్యాలు",
    navBecomeTrainer: "శిక్షకులు అవ్వండి",
    navFindTrainer: "శిక్షకుడిని వెతకండి",
    navCourses: "కోర్సులు",
    navCommunity: "కమ్యూనిటీ",
    navContact: "సంప్రదించండి",
    navLogin: "లాగిన్",
    navRegister: "రిజిస్టర్",
    navLogout: "లాగౌట్",
    navDashboard: "డ్యాష్‌బోర్డ్",

    // Hero
    heroTitle: "గ్రామీణ నైపుణ్యాల భాగస్వామ్యం",
    heroSubtitle: "స్థానికంగా నేర్చుకోండి, స్థానికంగా సంపాదించండి, కలిసి ఎదగండి.",
    heroIntro: "గ్రామీణ ప్రతిభను ఒకచోట చేర్చే కమ్యూనిటీ వేదిక. మీ సాంప్రదాయ లేదా ఆధునిక నైపుణ్యాలను పంచుకోండి, మీ పొరుగువారికి బోధించండి, స్థానికంగా సంపాదించండి మరియు స్వయం సమృద్ధి గల గ్రామ ఆర్థిక వ్యవస్థను నిర్మించండి.",
    heroBtnGetStarted: "ప్రారంభించండి",
    heroBtnExplore: "నైపుణ్యాలను అన్వేషించండి",

    // Stats
    statsTrainers: "క్రియాశీల శిక్షకులు",
    statsLearners: "నమోదైన విద్యార్థులు",
    statsSkills: "నేర్పిస్తున్న నైపుణ్యాలు",
    statsVillages: "ప్రభావిత గ్రామాలు",

    // Skills
    skillsTitle: "ప్రసిద్ధ గ్రామీణ నైపుణ్యాలు",
    skillsSubtitle: "అత్యధిక ప్రజాదరణ ఉన్న 18 సాంప్రదాయ మరియు ఆధునిక నైపుణ్యాల నుండి ఎంచుకోండి. స్థానిక శిక్షకులతో కనెక్ట్ అవ్వండి.",
    skillsSearchPlaceholder: "నైపుణ్యాలను వెతకండి (ఉదా. వ్యవసాయం, కుట్టుపని)...",
    skillsTrainersAvailable: "అందుబాటులో ఉన్న శిక్షకులు",
    skillsLearnMore: "మరింత సమాచారం",
    skillsNoTrainers: "ఇంకా ఏ శిక్షకులు అందుబాటులో లేరు. మీరే మొదటి వ్యక్తి అవ్వండి!",

    // Skill Names & Desc
    skillTailoringName: "కుట్టుపని & ఎంబ్రాయిడరీ",
    skillTailoringDesc: "డ్రెస్ డిజైనింగ్, స్టిచింగ్, హ్యాండ్ ఎంబ్రాయిడరీ మరియు ఆధునిక దుస్తుల రూపకల్పన నేర్చుకోండి.",
    skillSpokenEnglishName: "స్పోకెన్ ఇంగ్లీష్",
    skillSpokenEnglishDesc: "ఇంగ్లీష్ సంభాషణలు, పదజాలం, రోజువారీ శుభాకాంక్షలు మరియు ఉద్యోగ ఇంటర్వ్యూలపై నమ్మకాన్ని పెంచుకోండి.",
    skillTuitionTeachingName: "ట్యూషన్ బోధన",
    skillTuitionTeachingDesc: "గ్రామీణ ఉపాధ్యాయుల కోసం ప్రాథమిక పాఠశాల సబ్జెక్టుల (గణితం, సైన్స్, సోషల్) బోధనా పద్ధతులు.",
    skillComputerBasicsName: "కంప్యూటర్ ప్రాథమికాలు",
    skillComputerBasicsDesc: "MS ఆఫీస్, వెబ్ బ్రౌజింగ్, ఆన్‌లైన్ బిల్లుల చెల్లింపులు మరియు డిజిటల్ భద్రతా పద్ధతులు.",
    skillFarmingTechniquesName: "వ్యవసాయ పద్ధతులు",
    skillFarmingTechniquesDesc: "ఆధునిక విత్తన పద్ధతులు, పంట మార్పిడి, నేల పరీక్షలు మరియు సమర్థవంతమైన నీటి యాజమాన్యం.",
    skillOrganicFarmingName: "సేంద్రీయ వ్యవసాయం",
    skillOrganicFarmingDesc: "సహజ కీటక నివారణ, జీవ ఎరువుల తయారీ, పెట్టుబడి లేని వ్యవసాయం మరియు మార్కెటింగ్.",
    skillHandicraftsName: "హస్తకళలు & అలంకరణ",
    skillHandicraftsDesc: "వెదురు వస్తువులు, మట్టి పాత్రలు, జనపనార సంచులు మరియు స్థానిక అలంకరణ వస్తువుల తయారీ.",
    skillCookingName: "వంట & బేకింగ్",
    skillCookingDesc: "సాంప్రదాయ వంటకాలు, బేకింగ్ ప్రాథమికాలు, వ్యాపార పరమైన స్నాక్స్ నిల్వ పద్ధతులు మరియు పోషకాహారం.",
    skillDanceName: "శాస్త్రీయ & జానపద నృత్యం",
    skillDanceDesc: "సాంప్రదాయ నృత్య రూపాలు, స్థానిక జానపద నృత్యాలు మరియు సమన్వయ శిక్షణ.",
    skillMusicName: "గాత్రం & వాయిద్య సంగీతం",
    skillMusicDesc: "భక్తి గీతాలు, శాస్త్రీయ స్వరాలు, హార్మోనియం లేదా వేణువు వాయించడం నేర్చుకోండి.",
    skillMobileRepairName: "మొబైల్ ఫోన్ రిపేరింగ్",
    skillMobileRepairDesc: "హార్డ్‌వేర్ మరమ్మత్తు, స్క్రీన్ మార్పిడి, సాఫ్ట్‌వేర్ ఫ్లాష్ మరియు మొబైల్ విడిభాగాల పరీక్ష.",
    skillCodingName: "కోడింగ్ & వెబ్ ప్రాథమికాలు",
    skillCodingDesc: "HTML, CSS, జావాస్క్రిప్ట్ పరిచయం మరియు సాధారణ వెబ్ పోర్టల్స్ నిర్మాణం.",
    skillDigitalMarketingName: "డిజిటల్ మార్కెటింగ్",
    skillDigitalMarketingDesc: "సోషల్ మీడియా, వాట్సాప్ గ్రూపులు మరియు ఆన్‌లైన్ మార్కెట్‌లలో గ్రామ ఉత్పత్తుల విక్రయం.",
    skillGraphicDesignName: "గ్రాఫిక్ డిజైన్",
    skillGraphicDesignDesc: "డిజైన్ టూల్స్, పెళ్లి పత్రికల ఎడిటింగ్, స్థానిక బ్యానర్లు మరియు ఫోటో ఎడిటింగ్ నేర్చుకోండి.",
    skillBeautyMakeupName: "బ్యూటీ & బ్రైడల్ మేకప్",
    skillBeautyMakeupDesc: "పెళ్లికూతురు మేకప్, చర్మ సంరక్షణ, హెయిర్ స్టైలింగ్ మరియు సహజ మూలికా సౌందర్య ఉత్పత్తులు.",
    skillCarpentryName: "వడ్రంగి పని (కార్పెంట్రీ)",
    skillCarpentryDesc: "ఫర్నిచర్ తయారీ, చెక్క కీళ్ళు, పాలిషింగ్ మరియు పాత వస్తువుల పునరుద్ధరణ పనులు.",
    skillElectricalWorkName: "ఎలక్ట్రికల్ పని",
    skillElectricalWorkDesc: "ఇంటి వైరింగ్, ఫ్యాన్ అసెంబ్లీ, గృహోపకరణాల మరమ్మతులు మరియు భద్రతా జాగ్రత్తలు.",
    skillPlumbingName: "ప్లంబింగ్ పని",
    skillPlumbingDesc: "పైపుల లీకేజీ మరమ్మతులు, పంపుల నిర్వహణ మరియు వర్షపు నీటి నిల్వ కనెక్షన్లు.",

    // Trainer Directory
    directoryTitle: "శిక్షకుల డైరెక్టరీ",
    directorySubtitle: "మీ గ్రామానికి దగ్గరలో ఉన్న ధృవీకరించబడిన స్థానిక శిక్షకులను వెతకండి మరియు సంప్రదించండి.",
    dirSearchSkill: "నైపుణ్యం ద్వారా వెతకండి",
    dirSearchVillage: "గ్రామం ద్వారా వెతకండి",
    dirFilterLang: "భాష ద్వారా వడపోత",
    dirAllLangs: "అన్ని భాషలు",
    dirBtnContact: "ఇప్పుడే సంప్రదించండి",
    dirBtnProfile: "ప్రొఫైల్ చూడండి",
    dirNoTrainers: "మీ శోధనకు తగిన శిక్షకులు లేరు. దయచేసి వడపోతలను మార్చండి.",

    // Trainer Profile Detail
    profExperience: "సంవత్సరాల అనుభవం",
    profLanguages: "భాషలు",
    profTimings: "అనుకూల సమయాలు",
    profFee: "శిక్షణ రుసుము",
    profBookingBtn: "శిక్షణ సమయాన్ని బుక్ చేయండి",
    profReviews: "విద్యార్థుల సమీక్షలు",
    profNoReviews: "ఇంకా సమీక్షలు లేవు. మొదటి సమీక్ష మీరే రాయండి!",
    profAddReview: "మీ సమీక్షను జోడించండి",
    profRatingLabel: "రేటింగ్",
    profReviewTextPlaceholder: "ఈ శిక్షకుడితో మీ అభ్యాస అనుభవాన్ని పంచుకోండి...",
    profSubmitReview: "సమీక్షను సమర్పించండి",

    // Booking Modal
    bookTitle: "నైపుణ్య శిక్షణ కోసం అభ్యర్థన",
    bookDate: "కావాల్సిన తేదీని ఎంచుకోండి",
    bookTime: "కావాల్సిన సమయాన్ని ఎంచుకోండి",
    bookSendBtn: "శిక్షణ అభ్యర్థనను పంపండి",
    bookSuccess: "అభ్యర్థన విజయవంతంగా పంపబడింది! డ్యాష్‌బోర్డ్‌లో దీని స్థితిని చూడవచ్చు.",
    bookFail: "అభ్యర్థన పంపడం విఫలమైంది. మళ్ళీ ప్రయత్నించండి.",

    // Auth
    authLoginTitle: "తిరిగి స్వాగతం",
    authLoginSubtitle: "మీ బుకింగ్స్ మరియు శిక్షకులతో సందేశాలను తనిఖీ చేయడానికి లాగిన్ చేయండి.",
    authRegisterTitle: "మా కమ్యూనిటీలో చేరండి",
    authRegisterSubtitle: "నైపుణ్యాలను పంచుకోవడానికి లేదా నేర్చుకోవడానికి ఖాతాను సృష్టించండి.",
    authForgotTitle: "పాస్‌వర్డ్ రీసెట్",
    authForgotSubtitle: "మీ నమోదిత ఈమెయిల్ ఎంటర్ చేసి కొత్త పాస్‌వర్డ్ ఎంచుకోండి.",
    authRoleSelection: "మీరు ఎవరు?",
    authRoleLearner: "నేర్చుకునేవారు (నేను నైపుణ్యాలు నేర్చుకోవాలనుకుంటున్నాను)",
    authRoleTrainer: "శిక్షకులు (నేను ఇతరులకు నేర్పించాలనుకుంటున్నాను)",
    authRoleAdmin: "అడ్మిన్ (ప్లాట్‌ఫారమ్ సమన్వయకర్త)",
    authName: "పూర్తి పేరు",
    authEmail: "ఈమెయిల్ చిరునామా",
    authPhone: "ఫోన్ నంబర్",
    authVillage: "గ్రామం పేరు",
    authPassword: "పాస్‌వర్డ్",
    authConfirmPassword: "పాస్‌వర్డ్ నిర్ధారణ",
    authSubmitLogin: "లాగిన్",
    authSubmitRegister: "రిజిస్టర్",
    authSubmitReset: "పాస్‌వర్డ్ మార్చు",
    authAlreadyHaveAcc: "ఇప్పటికే ఖాతా ఉందా? లాగిన్ చేయండి",
    authNoAcc: "కొత్త యూజరా? ఇక్కడ రిజిస్టర్ అవ్వండి",
    authForgotPasswordBtn: "పాస్‌వర్డ్ మర్చిపోయారా?",
    authVerifyMsg: "శిక్షకుల వివరాలు డైరెక్టరీలో కనిపించడానికి ముందు అడ్మిన్ నిర్ధారణ అవసరం.",

    // Dashboards
    dashTrainerTitle: "శిక్షకుల డ్యాష్‌బోర్డ్",
    dashLearnerTitle: "విద్యార్థి డ్యాష్‌బోర్డ్",
    dashAdminTitle: "అడ్మిన్ ప్యానెల్",
    dashOverview: "అవలోకనం",
    dashMyRequests: "విద్యార్థి అభ్యర్థనలు",
    dashEnrolledSkills: "నేర్చుకుంటున్న నైపుణ్యాలు",
    dashRequestedTrainings: "అభ్యర్థించిన శిక్షణలు",
    dashFavTrainers: "ఇష్టమైన శిక్షకులు",
    dashManageUsers: "వినియోగదారుల నిర్వహణ",
    dashTrainerVerification: "శిక్షకుల ధృవీకరణ",
    dashEarnings: "అంచనా ఆదాయం",
    dashNotifications: "నోటిఫికేషన్లు",
    dashAnnouncements: "కమ్యూనిటీ ప్రకటనలు",
    dashPublishEvent: "వర్క్‌షాప్/ఈవెంట్ ప్రచురించు",
    dashStatsTrainers: "మొత్తం శిక్షకులు",
    dashStatsLearners: "మొత్తం విద్యార్థులు",
    dashStatsBookings: "మొత్తం బుకింగ్స్",
    dashVerifyBtn: "ధృవీకరించు & ఆమోదించు",
    dashDeleteBtn: "ఖాతాను తొలగించు",

    // Common Buttons / Statuses
    statusPending: "పరిశీలనలో ఉంది",
    statusApproved: "ఆమోదించబడింది / ఖరారైంది",
    statusRejected: "తిరస్కరించబడింది",
    statusCompleted: "శిక్షణ పూర్తయింది",
    btnApprove: "అభ్యర్థనను ఆమోదించు",
    btnDecline: "అభ్యర్థనను తిరస్కరించు",
    btnComplete: "పూర్తయినట్లు గుర్తు పెట్టు",

    // Community Page
    commTitle: "గ్రామ కమ్యూనిటీ సెంటర్",
    commSubtitle: "స్థానిక వర్క్‌షాప్‌లు, విజయాలు, ప్రకటనలు మరియు విజయగాథలను అన్వేషించండి.",
    commStories: "విజయగాథలు",
    commWorkshops: "వర్క్‌షాప్‌లు & ఈవెంట్‌లు",
    commAnnounce: "ప్రకటనలు",
    commAddPost: "కొత్త పోస్ట్ రాయండి",
    commGallery: "గ్రామ చిత్రాలు",
    commLikeBtn: "లైక్",

    // Footer & About
    aboutTitle: "మా ప్లాట్‌ఫారమ్ గురించి",
    aboutPara1: "గ్రామీణ ప్రాంతాలలో అందుబాటులో ఉండే విద్య మరియు ఉపాధి కొరతను తీర్చడానికి 'గ్రామీణ నైపుణ్యాల భాగస్వామ్యం' ప్రాజెక్ట్ రూపొందించబడింది. స్థానిక నైపుణ్యాలను అవసరమైన వారికి చేర్చడం ద్వారా, గ్రామస్థులు స్థానికంగానే నేర్చుకోవడానికి మరియు సంపాదించడానికి మేము సహాయపడుతున్నాము.",
    aboutPara2: "సాంప్రదాయ హస్తకళలైనా లేదా ఆధునిక కంప్యూటర్ కోడింగ్ అయినా, మా ప్లాట్‌ఫారమ్ స్వయం సమృద్ధిని, సామాజిక అనుబంధాన్ని మరియు స్థిరమైన గ్రామ అభివృద్ధిని ప్రోత్సహిస్తుంది.",
    contactTitle: "మమ్మల్ని సంప్రదించండి",
    contactSubtitle: "ఏవైనా ప్రశ్నలు ఉన్నాయా? మా గ్రామ కమ్యూనిటీ నిర్వాహకులను సంప్రదించండి.",
    contactSendBtn: "సందేశాన్ని పంపండి",
    contactSuccess: "మీ సందేశం పంపబడింది. మేము మిమ్మల్ని త్వరలో సంప్రదిస్తాము!",
    footerRights: "అన్ని హక్కులు ప్రత్యేకించబడ్డాయి. కమ్యూనిటీ సర్వీస్ ప్రాజెక్ట్."
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
