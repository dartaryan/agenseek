/**
 * Hebrew Locale Strings
 *
 * ⚠️ CRITICAL POLICY: ALL UI text MUST be in Hebrew
 * Exception: "Agenseek" brand name only
 *
 * Centralized Hebrew translations for the entire application.
 * RTL (Right-to-Left) text direction is handled by CSS (dir="rtl").
 */

export interface LocaleStrings {
  // Navigation
  nav: {
    dashboard: string;
    guides: string;
    notes: string;
    tasks: string;
    profile: string;
    settings: string;
    admin: string;
  };

  // Sections
  sections: {
    administration: string;
    help: string;
    quickLinks: string;
  };

  // Common actions
  actions: {
    logout: string;
    login: string;
    register: string;
    search: string;
    browseGuides: string;
    back: string;
    next: string;
    submit: string;
    cancel: string;
    skip: string;
  };

  // Help section
  help: {
    title: string;
    description: string;
    browseLink: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    welcomeBack: string;
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    yourProgress: string;
    progressDescription: string;
    progressPlaceholder: string;
    guidesCompleted: string;
    guidesInProgress: string;
    totalGuides: string;
    viewAllProgress: string;
    achievements: string;
    achievementsDescription: string;
    badgesPlaceholder: string;
    earnedBadges: string;
    lockedBadges: string;
    viewAllBadges: string;
    continueLearning: string;
    continueReading: string;
    continueReadingDescription: string;
    recentGuidesDescription: string;
    noInProgressGuides: string;
    startNewGuide: string;
    lastReadAt: string;
    lastSection: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    quickActions: string;
    quickActionsDescription: string;
    browseGuides: string;
    createNote: string;
    addTask: string;
    viewProfile: string;
    recentActivity: string;
    recentActivityDescription: string;
    noRecentActivity: string;
    viewAllActivity: string;
    // Story 5.5 - Activity Feed Day Grouping
    activityToday: string;
    activityYesterday: string;
    activityThisWeek: string;
    activityEarlier: string;
    // Story 5.6 - Statistics
    statistics: string;
    statisticsDescription: string;
    totalReadingTime: string;
    notesCreated: string;
    tasksCompleted: string;
    currentStreak: string;
    days: string;
    hours: string;
    minutes: string;
    trendUp: string;
    trendDown: string;
    // Story 5.2 - Category breakdown
    categoryBreakdown: string;
    categoryCore: string;
    categoryRecommended: string;
    categoryInterests: string;
    categoryOptional: string;
    categoryCompleted: string;
    categoryProgress: string;
    // Story 5.7 - Popular Guides Widget
    popularGuides: string;
  };

  // Pages
  pages: {
    guides: {
      title: string;
      description: string;
      placeholder: string;
    };
    progress: {
      title: string;
      description: string;
      heroTitle: string;
      heroDescription: string;
      overallProgress: string;
      categoryBreakdown: string;
      allGuides: string;
      filterAll: string;
      filterInProgress: string;
      filterCompleted: string;
      filterNotStarted: string;
      statusNotStarted: string;
      statusInProgress: string;
      statusCompleted: string;
      timeSpent: string;
      completedOn: string;
      actionStart: string;
      actionResume: string;
      actionReview: string;
      noGuides: string;
      noGuidesDescription: string;
      guidesCount: string;
      exportPdf: string;
    };
    notes: {
      title: string;
      description: string;
      placeholder: string;
      // Story 6.1 - Note Editor
      newNote: string;
      editNote: string;
      noteTitle: string;
      noteTitlePlaceholder: string;
      noteContent: string;
      noteContentPlaceholder: string;
      tags: string;
      tagsPlaceholder: string;
      associatedGuide: string;
      noGuide: string;
      selectGuide: string;
      saving: string;
      saved: string;
      notSaved: string;
      saveAndClose: string;
      saveNote: string;
      deleteNote: string;
      confirmDelete: string;
      confirmDeleteMessage: string;
      noteCreated: string;
      noteUpdated: string;
      noteDeleted: string;
      noNotes: string;
      noNotesDescription: string;
      searchNotes: string;
      filterByGuide: string;
      filterByTags: string;
      sortByRecent: string;
      sortByCreated: string;
      sortByAlphabetical: string;
      sortByGuide: string;
      notesCount: string;
      // Story 6.3 - Quick Note
      addNote: string;
      addToNote: string;
      quickNote: string;
      textSelected: string;
    };
    tasks: {
      title: string;
      description: string;
      placeholder: string;
      newTask: string;
      tasksCount: string;
      noTasks: string;
      noTasksDescription: string;
      // Tabs
      allTasks: string;
      byGuide: string;
      kanban: string;
      byPriority: string;
      // Status counts
      statusCounts: string;
      todoCount: string;
      inProgressCount: string;
      doneCount: string;
      // Views
      listView: string;
      kanbanView: string;
      priorityView: string;
      // Empty states
      noTasksInStatus: string;
    };
    profile: {
      title: string;
      description: string;
      settings: string;
      settingsDescription: string;
    };
    settings: {
      title: string;
      description: string;
      placeholder: string;
    };
    admin: {
      title: string;
      description: string;
      totalUsers: string;
      guidesCompleted: string;
      activeUsers: string;
      placeholder: string;
    };
  };

  // Auth
  auth: {
    // Brand & Headings
    brandName: string;
    brandSubtitle: string;
    welcomeBack: string;
    loginToAccount: string;
    registerTitle: string;
    createAccount: string;
    createAccountSubtitle: string;
    forgotPasswordTitle: string;
    resetPasswordTitle: string;
    setNewPasswordTitle: string;

    // Form Fields
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordPlaceholder: string;
    newPassword: string;
    newPasswordPlaceholder: string;
    confirmPassword: string;
    confirmPasswordPlaceholder: string;
    displayName: string;
    displayNamePlaceholder: string;

    // Buttons & Actions
    loginButton: string;
    loginButtonLoading: string;
    registerButton: string;
    registerButtonLoading: string;
    sendResetLink: string;
    sendResetLinkLoading: string;
    resetPasswordButton: string;
    resetPasswordButtonLoading: string;
    rememberMe: string;

    // Links & Navigation
    forgotPassword: string;
    noAccount: string;
    registerLink: string;
    haveAccount: string;
    loginLink: string;
    backToLogin: string;
    backToLoginWithIcon: string;

    // Password Reset Flow
    forgotPasswordSubtitle: string;
    forgotPasswordSuccess: string;
    resetLinkSent: string;
    checkEmail: string;
    checkEmailDescription: string;
    emailExpiryNote: string;
    didntReceiveEmail: string;
    resendLink: string;
    setNewPasswordSubtitle: string;
    verifyingLink: string;

    // Success Messages
    loginSuccess: string;
    loginSuccessDescription: string;
    registerSuccess: string;
    registerSuccessDescription: string;
    resetSuccess: string;
    resetSuccessDescription: string;
    resetLinkSentSuccess: string;
    resetLinkSentDescription: string;

    // Error Messages
    loginFailed: string;
    registerFailed: string;
    resetFailed: string;
    tokenInvalid: string;
    tokenInvalidDescription: string;
    tokenExpiredNote: string;
    invalidEmail: string;
    invalidPassword: string;
    emailAlreadyExists: string;
    passwordsDontMatch: string;
    passwordTooShort: string;
    passwordNoUppercase: string;
    passwordNoLowercase: string;
    passwordNoNumber: string;
    unexpectedError: string;

    // Password Strength
    passwordStrength: string;
    passwordStrengthWeak: string;
    passwordStrengthMedium: string;
    passwordStrengthStrong: string;

    // Password Requirements
    passwordRequirements: string;
    requirementLength: string;
    requirementUppercase: string;
    requirementLowercase: string;
    requirementNumber: string;

    // OAuth (placeholder for future)
    continueWithGoogle: string;
    orContinueWith: string;

    // Misc
    invalidResetLink: string;
    requestNewResetLink: string;
    rememberPassword: string;
    sentResetLinkTo: string;
    loading: string;
  };

  // Account Deletion
  accountDeletion: {
    title: string;
    warningTitle: string;
    warningIrreversible: string;
    warningDataLoss: string;
    whatWillBeDeleted: string;
    dataUserProfile: string;
    dataLearningProgress: string;
    dataNotesAndTasks: string;
    dataCommentsAndQuestions: string;
    dataBookmarksAndAchievements: string;
    deleteAccountButton: string;
    confirmDialogTitle: string;
    confirmDialogWarning: string;
    confirmInputLabel: string;
    confirmInputPlaceholder: string;
    confirmDeleteButton: string;
    deleteAccountLoading: string;
    deleteSuccessMessage: string;
    deleteErrorMessage: string;
    confirmTextHebrew: string;
    confirmTextEnglish: string;
  };

  // Onboarding
  onboarding: {
    welcome: string;
    welcomeHebrew: string;
    description: string;
    letsPersonalize: string;
    skipLater: string;
    skipDescription: string;
    step2Title: string;
    step2Description: string;
    step3Title: string;
    step3Description: string;
    step4Title: string;
    step4Description: string;
    step5Title: string;
    step5Description: string;
    complete: string;
    stepsInfo: string;
    timeInfo: string;
    personalizedInfo: string;
  };

  // Roles
  roles: {
    developer: string;
    developerDesc: string;
    productManager: string;
    productManagerDesc: string;
    designer: string;
    designerDesc: string;
    architect: string;
    architectDesc: string;
    projectManager: string;
    projectManagerDesc: string;
    qaEngineer: string;
    qaEngineerDesc: string;
    executive: string;
    executiveDesc: string;
    gameDeveloper: string;
    gameDeveloperDesc: string;
    nonTechnical: string;
    nonTechnicalDesc: string;
  };
}

export const hebrewLocale: LocaleStrings = {
  nav: {
    dashboard: 'לוח בקרה',
    guides: 'מדריכים',
    notes: 'הערות',
    tasks: 'משימות',
    profile: 'פרופיל',
    settings: 'הגדרות',
    admin: 'ניהול',
  },

  sections: {
    administration: 'ניהול',
    help: 'עזרה',
    quickLinks: 'קישורים מהירים',
  },

  actions: {
    logout: 'התנתקות',
    login: 'התחברות',
    register: 'הרשמה',
    search: 'חיפוש מדריכים...',
    browseGuides: 'עיון במדריכים',
    back: 'חזור',
    next: 'הבא',
    submit: 'שלח',
    cancel: 'ביטול',
    skip: 'דלג',
  },

  help: {
    title: 'צריכים עזרה?',
    description: 'עיינו במדריכים או שאלו את הקהילה',
    browseLink: 'עיון במדריכים ←',
  },

  dashboard: {
    title: 'לוח בקרה',
    welcomeBack: 'ברוכים השבים',
    goodMorning: 'בוקר טוב',
    goodAfternoon: 'צהריים טובים',
    goodEvening: 'ערב טוב',
    yourProgress: 'ההתקדמות שלך',
    progressDescription: 'המשך במקום שהפסקת',
    progressPlaceholder: 'תרשימי התקדמות',
    guidesCompleted: 'מדריכים שהושלמו',
    guidesInProgress: 'מדריכים בתהליך',
    totalGuides: 'סך המדריכים',
    viewAllProgress: 'צפה בכל ההתקדמות',
    achievements: 'הישגים',
    achievementsDescription: 'התגים שלך וההישגים האחרונים',
    badgesPlaceholder: 'אוסף תגים',
    earnedBadges: 'תגים שהושגו',
    lockedBadges: 'תגים נעולים',
    viewAllBadges: 'צפה בכל התגים',
    continueLearning: 'המשך למידה',
    continueReading: 'המשך קריאה',
    continueReadingDescription: 'חזור למדריכים שהתחלת',
    recentGuidesDescription: 'המדריכים האחרונים יוצגו כאן',
    noInProgressGuides: 'אין מדריכים בתהליך',
    startNewGuide: 'התחל מדריך חדש',
    lastReadAt: 'קריאה אחרונה',
    lastSection: 'בפרק',
    minutesAgo: 'לפני דקות',
    hoursAgo: 'לפני שעות',
    daysAgo: 'לפני ימים',
    quickActions: 'פעולות מהירות',
    quickActionsDescription: 'גישה מהירה לפעולות נפוצות',
    browseGuides: 'עיון במדריכים',
    createNote: 'צור הערה',
    addTask: 'הוסף משימה',
    viewProfile: 'צפה בפרופיל',
    recentActivity: 'פעילות אחרונה',
    recentActivityDescription: 'מה קרה לאחרונה',
    noRecentActivity: 'אין פעילות אחרונה',
    viewAllActivity: 'צפה בכל הפעילות',
    // Story 5.5 - Activity Feed Day Grouping
    activityToday: 'היום',
    activityYesterday: 'אתמול',
    activityThisWeek: 'השבוע',
    activityEarlier: 'קודם לכן',
    statistics: 'סטטיסטיקות',
    statisticsDescription: 'נתוני השימוש שלך',
    totalReadingTime: 'זמן קריאה כולל',
    notesCreated: 'הערות שנוצרו',
    tasksCompleted: 'משימות שהושלמו',
    currentStreak: 'רצף נוכחי',
    days: 'ימים',
    hours: 'שעות',
    minutes: 'דקות',
    trendUp: 'עלייה',
    trendDown: 'ירידה',
    // Story 5.2 - Category breakdown
    categoryBreakdown: 'התקדמות לפי קטגוריות',
    categoryCore: 'מדריכי יסוד',
    categoryRecommended: 'מומלצים לתפקידך',
    categoryInterests: 'תחומי העניין שלך',
    categoryOptional: 'אופציונלי',
    categoryCompleted: 'הושלם',
    categoryProgress: 'מתוך',
    // Story 5.7 - Popular Guides Widget
    popularGuides: 'מדריכים פופולריים',
  },

  pages: {
    guides: {
      title: 'מדריכי למידה',
      description: 'גלה מדריכים המותאמים אישית עבורך',
      placeholder: 'ספריית המדריכים תיושם בשלב 4',
    },
    progress: {
      title: 'ההתקדמות שלי',
      description: 'מעקב אחר מסע הלמידה שלך',
      heroTitle: 'מסע הלמידה שלך',
      heroDescription: 'עקוב אחר ההתקדמות שלך בכל המדריכים',
      overallProgress: 'התקדמות כללית',
      categoryBreakdown: 'חלוקה לפי קטגוריות',
      allGuides: 'כל המדריכים',
      filterAll: 'הכל',
      filterInProgress: 'בתהליך',
      filterCompleted: 'הושלמו',
      filterNotStarted: 'טרם התחילו',
      statusNotStarted: 'טרם התחלת',
      statusInProgress: 'בתהליך',
      statusCompleted: 'הושלם',
      timeSpent: 'זמן קריאה',
      completedOn: 'הושלם ב-',
      actionStart: 'התחל',
      actionResume: 'המשך',
      actionReview: 'סקור שנית',
      noGuides: 'לא נמצאו מדריכים',
      noGuidesDescription: 'נסה לשנות את המסננים',
      guidesCount: 'מדריכים',
      exportPdf: 'ייצא כ-PDF',
    },
    notes: {
      title: 'ההערות שלי',
      description: 'נהל את ההערות שלך',
      placeholder: 'מערכת הערות תיושם בשלב 6',
      // Story 6.1 - Note Editor
      newNote: 'הערה חדשה',
      editNote: 'עריכת הערה',
      noteTitle: 'כותרת ההערה',
      noteTitlePlaceholder: 'הזן כותרת להערה',
      noteContent: 'תוכן ההערה',
      noteContentPlaceholder: 'התחל לכתוב את ההערה שלך כאן...',
      tags: 'תגיות',
      tagsPlaceholder: 'הוסף תגיות (הקש Enter להוספה)',
      associatedGuide: 'מדריך משוייך',
      noGuide: 'ללא מדריך משוייך',
      selectGuide: 'בחר מדריך',
      saving: 'שומר...',
      saved: 'נשמר',
      notSaved: 'לא נשמר',
      saveAndClose: 'שמור וסגור',
      saveNote: 'שמור הערה',
      deleteNote: 'מחק הערה',
      confirmDelete: 'האם למחוק?',
      confirmDeleteMessage: 'האם אתה בטוח שברצונך למחוק הערה זו? פעולה זו אינה הפיכה.',
      noteCreated: 'ההערה נוצרה בהצלחה',
      noteUpdated: 'ההערה עודכנה בהצלחה',
      noteDeleted: 'ההערה נמחקה בהצלחה',
      noNotes: 'אין לך הערות',
      noNotesDescription: 'התחל ליצור הערות למדריכים',
      searchNotes: 'חפש הערות...',
      filterByGuide: 'סנן לפי מדריך',
      filterByTags: 'סנן לפי תגיות',
      sortByRecent: 'מעודכנים לאחרונה',
      sortByCreated: 'נוצרו לאחרונה',
      sortByAlphabetical: 'א-ת',
      sortByGuide: 'לפי מדריך',
      notesCount: 'הערות',
      // Story 6.3 - Quick Note
      addNote: 'הוסף הערה',
      addToNote: 'הוסף להערה',
      quickNote: 'הערה מהירה',
      textSelected: 'טקסט נבחר',
    },
    tasks: {
      title: 'המשימות שלי',
      description: 'עקוב אחר המשימות שלך',
      placeholder: 'מערכת משימות תיושם בשלב 6',
      newTask: 'משימה חדשה',
      tasksCount: 'משימות',
      noTasks: 'אין לך משימות עדיין',
      noTasksDescription: 'צור משימה חדשה כדי להתחיל לעקוב אחר הלמידה שלך',
      // Tabs
      allTasks: 'כל המשימות',
      byGuide: 'לפי מדריך',
      kanban: 'לוח קאנבן',
      byPriority: 'לפי עדיפות',
      // Status counts
      statusCounts: 'לביצוע ({todo}) / בתהליך ({inProgress}) / הושלם ({done})',
      todoCount: 'לביצוע',
      inProgressCount: 'בתהליך',
      doneCount: 'הושלם',
      // Views
      listView: 'תצוגת רשימה',
      kanbanView: 'תצוגת קאנבן',
      priorityView: 'תצוגת עדיפות',
      // Empty states
      noTasksInStatus: 'אין משימות בסטטוס זה',
    },
    profile: {
      title: 'פרופיל',
      description: 'נהל את הפרופיל שלך',
      settings: 'הגדרות פרופיל',
      settingsDescription: 'התאמה אישית של פרופיל תיושם בשלב 2',
    },
    settings: {
      title: 'הגדרות',
      description: 'נהל את העדפותיך',
      placeholder: 'הגדרות תיושמנה בשלב 10',
    },
    admin: {
      title: 'לוח בקרה לניהול',
      description: 'נהל את המערכת',
      totalUsers: 'סך המשתמשים',
      guidesCompleted: 'מדריכים שהושלמו',
      activeUsers: 'משתמשים פעילים',
      placeholder: 'לוח בקרה לניהול ייושם בשלב 9',
    },
  },

  auth: {
    // Brand & Headings
    brandName: 'Agenseek',
    brandSubtitle: 'מרכז הלמידה של BMAD',
    welcomeBack: 'ברוכים השבים',
    loginToAccount: 'התחבר לחשבון שלך',
    registerTitle: 'יצירת חשבון חדש',
    createAccount: 'הצטרף ל-Agenseek',
    createAccountSubtitle: 'התחל את מסע הלמידה שלך היום',
    forgotPasswordTitle: 'שכחת סיסמה?',
    resetPasswordTitle: 'איפוס סיסמה',
    setNewPasswordTitle: 'הגדר סיסמה חדשה',

    // Form Fields
    email: 'אימייל',
    emailPlaceholder: 'הזן את האימייל שלך',
    password: 'סיסמה',
    passwordPlaceholder: 'הזן סיסמה',
    newPassword: 'סיסמה חדשה',
    newPasswordPlaceholder: '••••••••',
    confirmPassword: 'אמת סיסמה',
    confirmPasswordPlaceholder: '••••••••',
    displayName: 'שם מלא',
    displayNamePlaceholder: 'יוסי כהן',

    // Buttons & Actions
    loginButton: 'התחבר',
    loginButtonLoading: 'מתחבר...',
    registerButton: 'הירשם',
    registerButtonLoading: 'יוצר חשבון...',
    sendResetLink: 'שלח קישור לאיפוס',
    sendResetLinkLoading: 'שולח קישור...',
    resetPasswordButton: 'אפס סיסמה',
    resetPasswordButtonLoading: 'מאפס סיסמה...',
    rememberMe: 'זכור אותי',

    // Links & Navigation
    forgotPassword: 'שכחת סיסמה?',
    noAccount: 'אין לך חשבון?',
    registerLink: 'הירשם',
    haveAccount: 'כבר יש לך חשבון?',
    loginLink: 'התחבר',
    backToLogin: 'חזרה להתחברות',
    backToLoginWithIcon: '← חזרה להתחברות',

    // Password Reset Flow
    forgotPasswordSubtitle: 'הזן את האימייל שלך כדי לקבל קישור לאיפוס סיסמה',
    forgotPasswordSuccess: 'בדוק את האימייל שלך לקבלת קישור לאיפוס',
    resetLinkSent: 'קישור איפוס נשלח!',
    checkEmail: 'בדוק את האימייל שלך',
    checkEmailDescription: 'בדוק את האימייל שלך לקבלת קישור לאיפוס',
    emailExpiryNote: 'לחץ על הקישור במייל כדי לאפס את הסיסמה שלך. הקישור יפוג תוקפו בעוד שעה.',
    didntReceiveEmail: 'לא קיבלת מייל? לחץ לשליחה מחדש',
    resendLink: 'שלח שוב',
    setNewPasswordSubtitle: 'הזן את הסיסמה החדשה שלך למטה',
    verifyingLink: 'מאמת קישור איפוס...',

    // Success Messages
    loginSuccess: 'ברוכים השבים!',
    loginSuccessDescription: 'התחברת בהצלחה',
    registerSuccess: 'החשבון נוצר בהצלחה!',
    registerSuccessDescription: 'בדוק את המייל שלך לאישור החשבון, לאחר מכן התחבר.',
    resetSuccess: 'הסיסמה אופסה בהצלחה!',
    resetSuccessDescription: 'כעת אתה יכול להתחבר עם הסיסמה החדשה שלך',
    resetLinkSentSuccess: 'קישור איפוס נשלח!',
    resetLinkSentDescription: 'בדוק את האימייל שלך לקבלת קישור לאיפוס הסיסמה',

    // Error Messages
    loginFailed: 'ההתחברות נכשלה',
    registerFailed: 'ההרשמה נכשלה',
    resetFailed: 'איפוס הסיסמה נכשל',
    tokenInvalid: 'קישור איפוס לא תקף',
    tokenInvalidDescription: 'קישור איפוס הסיסמה הזה אינו תקף או פג תוקפו.',
    tokenExpiredNote: 'קישורי איפוס סיסמה פגים תוקף אחרי שעה מטעמי אבטחה.',
    invalidEmail: 'אימייל לא תקין',
    invalidPassword: 'אימייל או סיסמה שגויים',
    emailAlreadyExists: 'האימייל כבר קיים',
    passwordsDontMatch: 'הסיסמאות לא תואמות',
    passwordTooShort: 'הסיסמה חייבת להכיל לפחות 8 תווים',
    passwordNoUppercase: 'הסיסמה חייבת להכיל לפחות אות גדולה אחת',
    passwordNoLowercase: 'הסיסמה חייבת להכיל לפחות אות קטנה אחת',
    passwordNoNumber: 'הסיסמה חייבת להכיל לפחות ספרה אחת',
    unexpectedError: 'אירעה שגיאה בלתי צפויה. אנא נסה שוב.',

    // Password Strength
    passwordStrength: 'חוזק סיסמה:',
    passwordStrengthWeak: 'חלשה',
    passwordStrengthMedium: 'בינונית',
    passwordStrengthStrong: 'חזקה',

    // Password Requirements
    passwordRequirements: 'דרישות סיסמה:',
    requirementLength: 'לפחות 8 תווים',
    requirementUppercase: 'אות גדולה',
    requirementLowercase: 'אות קטנה',
    requirementNumber: 'ספרה',

    // OAuth (placeholder for future)
    continueWithGoogle: 'התחבר עם Google',
    orContinueWith: 'או המשך עם',

    // Misc
    invalidResetLink: 'קישור איפוס לא תקף',
    requestNewResetLink: 'בקש קישור איפוס חדש',
    rememberPassword: 'זוכר את הסיסמה שלך?',
    sentResetLinkTo: 'שלחנו קישור לאיפוס סיסמה אל:',
    loading: 'טוען...',
  },

  accountDeletion: {
    title: 'מחיקת חשבון',
    warningTitle: 'אזהרה: פעולה זו בלתי הפיכה',
    warningIrreversible: 'אזהרה: פעולה זו בלתי הפיכה',
    warningDataLoss: 'כל הנתונים שלך יימחקו לצמיתות',
    whatWillBeDeleted: 'מה יימחק:',
    dataUserProfile: 'פרופיל המשתמש',
    dataLearningProgress: 'התקדמות בלמידה',
    dataNotesAndTasks: 'הערות ומשימות',
    dataCommentsAndQuestions: 'תגובות ושאלות',
    dataBookmarksAndAchievements: 'סימניות והישגים',
    deleteAccountButton: 'מחק את החשבון שלי',
    confirmDialogTitle: 'האם אתה בטוח?',
    confirmDialogWarning: 'פעולה זו תמחק את כל הנתונים שלך ולא ניתן לשחזרם',
    confirmInputLabel: "הקלד 'מחק' כדי לאשר",
    confirmInputPlaceholder: "הקלד 'מחק' או 'DELETE'",
    confirmDeleteButton: 'מחק לצמיתות',
    deleteAccountLoading: 'מוחק חשבון...',
    deleteSuccessMessage: 'החשבון נמחק בהצלחה. להתראות!',
    deleteErrorMessage: 'מחיקת החשבון נכשלה. אנא נסה שוב.',
    confirmTextHebrew: 'מחק',
    confirmTextEnglish: 'DELETE',
  },

  onboarding: {
    welcome: 'ברוכים הבאים ל-Agenseek!',
    welcomeHebrew: 'ברוכים הבאים ל-Agenseek!',
    description: 'מסע הלמידה המותאם אישית שלך ב-BMAD מתחיל כאן',
    letsPersonalize: 'בואו נתאים אישית את המסע שלכם',
    skipLater: 'אעשה זאת מאוחר יותר',
    skipDescription: 'תוכל להשלים את הפרופיל שלך בכל עת מההגדרות',
    step2Title: 'מה התפקיד שלך?',
    step2Description: 'זה עוזר לנו להמליץ על תוכן רלוונטי עבורך',
    step3Title: 'מה מעניין אותך?',
    step3Description: 'בחר נושאים שמעניינים אותך',
    step4Title: 'מה רמת הניסיון שלך?',
    step4Description: 'עזור לנו להתאים את התוכן לרמתך',
    step5Title: 'מסלול הלמידה שלך',
    step5Description: 'בנינו מסלול מותאם אישית עבורך',
    complete: 'השלמת את תהליך ההכנה!',
    stepsInfo: '5 שלבים מהירים',
    timeInfo: '2 דקות',
    personalizedInfo: 'מותאם אישית עבורך',
  },

  roles: {
    developer: 'מפתח',
    developerDesc: 'בניית ויישום פתרונות תוכנה',
    productManager: 'מנהל מוצר',
    productManagerDesc: 'הגדרת חזון ואסטרטגיית מוצר',
    designer: 'מעצב UX/UI',
    designerDesc: 'עיצוב חוויות ממשקים למשתמש',
    architect: 'ארכיטקט',
    architectDesc: 'תכנון ארכיטקטורת מערכת ותבניות',
    projectManager: 'מנהל פרויקט',
    projectManagerDesc: 'תיאום פרויקטים וצוותים',
    qaEngineer: 'מהנדס QA',
    qaEngineerDesc: 'הבטחת איכות באמצעות בדיקות',
    executive: 'מנהל בכיר',
    executiveDesc: 'הובלת יוזמות אסטרטגיות',
    gameDeveloper: 'מפתח משחקים',
    gameDeveloperDesc: 'יצירת חוויות משחק אינטראקטיביות',
    nonTechnical: 'תפקיד לא-טכני',
    nonTechnicalDesc: 'תמיכה בצוותים טכניים בתפקידים אחרים',
  },
};
