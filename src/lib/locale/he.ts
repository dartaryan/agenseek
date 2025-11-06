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
    yourProgress: string;
    progressDescription: string;
    progressPlaceholder: string;
    achievements: string;
    achievementsDescription: string;
    badgesPlaceholder: string;
    continueLearning: string;
    recentGuidesDescription: string;
  };

  // Pages
  pages: {
    guides: {
      title: string;
      description: string;
      placeholder: string;
    };
    notes: {
      title: string;
      description: string;
      placeholder: string;
    };
    tasks: {
      title: string;
      description: string;
      placeholder: string;
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
    welcomeBack: string;
    loginToAccount: string;
    email: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    loginButton: string;
    noAccount: string;
    registerLink: string;
    registerTitle: string;
    createAccount: string;
    displayName: string;
    confirmPassword: string;
    registerButton: string;
    haveAccount: string;
    loginLink: string;
    resetPassword: string;
    backToLogin: string;
    sendResetLink: string;
    checkEmail: string;
    didntReceiveEmail: string;
    resendLink: string;
    newPassword: string;
    resetSuccess: string;
    tokenInvalid: string;
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
    yourProgress: 'ההתקדמות שלך',
    progressDescription: 'מעקב אחר התקדמות ייושם בשלב 5',
    progressPlaceholder: 'תרשימי התקדמות',
    achievements: 'הישגים',
    achievementsDescription: 'תגים והישגים יגיעו בשלב 5',
    badgesPlaceholder: 'אוסף תגים',
    continueLearning: 'המשך למידה',
    recentGuidesDescription: 'המדריכים האחרונים יוצגו כאן',
  },

  pages: {
    guides: {
      title: 'מדריכי למידה',
      description: 'גלה מדריכים המותאמים אישית עבורך',
      placeholder: 'ספריית המדריכים תיושם בשלב 4',
    },
    notes: {
      title: 'ההערות שלי',
      description: 'נהל את ההערות שלך',
      placeholder: 'מערכת הערות תיושם בשלב 6',
    },
    tasks: {
      title: 'המשימות שלי',
      description: 'עקוב אחר המשימות שלך',
      placeholder: 'מערכת משימות תיושם בשלב 6',
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
    welcomeBack: 'ברוכים השבים',
    loginToAccount: 'התחבר לחשבון שלך',
    email: 'דואר אלקטרוני',
    password: 'סיסמה',
    rememberMe: 'זכור אותי',
    forgotPassword: 'שכחת סיסמה?',
    loginButton: 'התחברות',
    noAccount: 'אין לך חשבון?',
    registerLink: 'הרשמה',
    registerTitle: 'יצירת חשבון חדש',
    createAccount: 'הצטרף ל-Agenseek',
    displayName: 'שם תצוגה',
    confirmPassword: 'אימות סיסמה',
    registerButton: 'הרשמה',
    haveAccount: 'יש לך כבר חשבון?',
    loginLink: 'התחברות',
    resetPassword: 'איפוס סיסמה',
    backToLogin: 'חזרה להתחברות',
    sendResetLink: 'שלח קישור איפוס',
    checkEmail: 'בדוק את המייל שלך',
    didntReceiveEmail: 'לא קיבלת מייל?',
    resendLink: 'שלח שוב',
    newPassword: 'סיסמה חדשה',
    resetSuccess: 'הסיסמה אופסה בהצלחה',
    tokenInvalid: 'הקישור אינו תקף או פג תוקפו',
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

