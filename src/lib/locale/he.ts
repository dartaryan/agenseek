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

  // Sidebar
  sidebar: {
    navigation: string;
    collapseSidebar: string;
    expandSidebar: string;
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
      // Story 6.5: Sub-tasks
      subTasks: string;
      subTasksCount: string;
      addSubTask: string;
      addSubTaskPlaceholder: string;
      noSubTasks: string;
    };
    profile: {
      title: string;
      description: string;
      settings: string;
      settingsDescription: string;
      editDisplayName: string;
      currentName: string;
      newHebrewName: string;
      enterHebrewName: string;
      nameSaved: string;
      nameUpdateFailed: string;
      exampleName: string;
      nameRequiresHebrew: string;
    };
    banners: {
      hebrewNameSuggestion: string;
      hebrewNameAccept: string;
      hebrewNameDismiss: string;
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
      totalGuidesViewed: string;
      avgCompletionRate: string;
      activeUsersLast30Days: string;
      activityGraph: string;
      dailyActiveUsers: string;
      guideViewsPerDay: string;
      popularGuides: string;
      recentActivity: string;
      dateRange: string;
      exportCSV: string;
      guideTitle: string;
      views: string;
      uniqueViewers: string;
      avgTime: string;
      completionRate: string;
      actions: string;
      activityType: string;
      user: string;
      target: string;
      timestamp: string;
      last7Days: string;
      last30Days: string;
      last90Days: string;
      allTime: string;
      noData: string;
      loading: string;
      // Story 9.2 - User Management
      userManagement: string;
      userManagementDescription: string;
      searchUsers: string;
      name: string;
      email: string;
      role: string;
      joinedDate: string;
      lastActive: string;
      progress: string;
      viewDetails: string;
      hideDetails: string;
      viewAsUser: string;
      deleteUser: string;
      confirmDeleteUser: string;
      confirmDeleteUserMessage: string;
      userDeleted: string;
      userDeleteFailed: string;
      usersPerPage: string;
      prevPage: string;
      nextPage: string;
      pageOf: string;
      sortBy: string;
      sortByName: string;
      sortByEmail: string;
      sortByJoined: string;
      sortByProgress: string;
      profileDetails: string;
      progressDetails: string;
      activityDetails: string;
      notesCount: string;
      tasksCount: string;
      commentsCount: string;
      totalProgress: string;
      userGuidesCompleted: string;
      userGuidesInProgress: string;
      lastActivityDate: string;
      neverActive: string;
      adminRole: string;
      regularUser: string;
      // Story 9.3 - Content Analytics
      analytics: {
        title: string;
        subtitle: string;
        totalNotes: string;
        totalTasks: string;
        totalComments: string;
        avgSessionDuration: string;
        minutes: string;
        categoryPerformance: string;
        filterByCategory: string;
        allCategories: string;
        guidePerformance: string;
        category: string;
        helpfulVotes: string;
        comments: string;
        engagement: string;
        high: string;
        medium: string;
        low: string;
        exportCSV: string;
        loading: string;
        noData: string;
        views: string;
        uniqueViewers: string;
        avgTime: string;
        completionRate: string;
        guideTitle: string;
      };
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

    // OAuth - Story 2.4
    googleSignIn: string;
    googleSignUp: string;
    googleSignInError: string;
    googleSignUpError: string;
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

  // Comments
  comments: {
    title: string;
    noComments: string;
    beFirstToComment: string;
    addComment: string;
    writeComment: string;
    writeReply: string;
    postComment: string;
    postReply: string;
    reply: string;
    edit: string;
    delete: string;
    deleteConfirm: string;
    deleteSuccess: string;
    deleteError: string;
    edited: string;
    save: string;
    editSuccess: string;
    editError: string;
    commentDeleted: string;
    helpful: string;
    markAsHelpful: string;
    markAsQuestion: string;
    markAsSolution: string;
    question: string;
    solution: string;
    replies: string;
    replyTo: string;
    replyingTo: string;
    loadMore: string;
    sortBy: string;
    sortRecent: string;
    sortMostHelpful: string;
    sortOldest: string;
    commentCount_zero: string;
    commentCount_one: string;
    commentCount_two: string;
    commentCount_many: string;
    replyCount_zero: string;
    replyCount_one: string;
    replyCount_two: string;
    replyCount_many: string;
    viewReplies: string;
    hideReplies: string;
    submitting: string;
    loadingComments: string;
    errorLoadingComments: string;
    // Story 8.2: Comment Form
    write: string;
    preview: string;
    comment: string;
    markdownGuide: string;
    characterCount: string;
    characterLimitExceeded: string;
    commentPosted: string;
    replyPosted: string;
    errorPostingComment: string;
    errorNotAuthenticated: string;
    emptyComment: string;
    submitComment: string;
    submitReply: string;
    submitQuestion: string;
    cancel: string;
    noPreview: string;
    // Story 8.3: Comment Voting
    voteError: string;
    loginToVote: string;
    cannotVoteOwnComment: string;
    voteErrorGeneric: string;
    // Story 8.4: Q&A Functionality
    unmarkSolution: string;
    solutionMarked: string;
    solutionUnmarked: string;
    onlyQuestions: string;
    allComments: string;
    unansweredQuestions: string;
    answeredQuestions: string;
    noUnansweredQuestions: string;
    noAnsweredQuestions: string;
    solutionError: string;
    notQuestionAuthor: string;
    answered: string;
  };

  // Notifications
  notifications: {
    title: string;
    noNotifications: string;
    markAllRead: string;
    repliedToYourComment: string;
    markedYourAnswerAsSolution: string;
    viewComment: string;
    newNotification: string;
    allRead: string;
  };

  // Avatar (Story 0.3)
  avatar: {
    change: string;
    select: string;
    preview: string;
    save: string;
    cancel: string;
    success: string;
    error: string;
    style: string;
    profileAvatar: string;
    editProfile: string;
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

  sidebar: {
    navigation: 'ניווט',
    collapseSidebar: 'כווץ סרגל צד',
    expandSidebar: 'הרחב סרגל צד',
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
      // Story 6.5: Sub-tasks
      subTasks: 'משימות משנה (אופציונלי)',
      subTasksCount: 'משימות משנה',
      addSubTask: 'הוסף משימת משנה',
      addSubTaskPlaceholder: 'הוסף משימת משנה...',
      noSubTasks: 'לא נוספו משימות משנה. השתמש בשדה למעלה כדי להוסיף.',
    },
    profile: {
      title: 'פרופיל',
      description: 'נהל את הפרופיל שלך',
      settings: 'הגדרות פרופיל',
      settingsDescription: 'התאמה אישית של פרופיל תיושם בשלב 2',
      editDisplayName: 'ערוך שם',
      currentName: 'שם נוכחי',
      newHebrewName: 'שם חדש בעברית',
      enterHebrewName: 'הזן את שמך בעברית',
      nameSaved: 'השם עודכן בהצלחה',
      nameUpdateFailed: 'שגיאה בשמירת השם. אנא נסה שוב.',
      exampleName: 'למשל: יוסי כהן',
      nameRequiresHebrew: 'השם חייב להכיל תווים בעברית',
    },
    banners: {
      hebrewNameSuggestion: 'שמנו לב שהשם שלך באנגלית. האם תרצה לשנות אותו לעברית?',
      hebrewNameAccept: 'כן, עדכן',
      hebrewNameDismiss: 'אל תציג שוב',
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
      totalGuidesViewed: 'סך צפיות במדריכים',
      avgCompletionRate: 'שיעור השלמה ממוצע',
      activeUsersLast30Days: 'משתמשים פעילים (30 יום)',
      activityGraph: 'גרף פעילות',
      dailyActiveUsers: 'משתמשים פעילים יומי',
      guideViewsPerDay: 'צפיות במדריכים ליום',
      popularGuides: 'מדריכים פופולריים',
      recentActivity: 'פעילות אחרונה',
      dateRange: 'טווח תאריכים',
      exportCSV: 'ייצא CSV',
      guideTitle: 'כותרת',
      views: 'צפיות',
      uniqueViewers: 'צופים ייחודיים',
      avgTime: 'זמן ממוצע',
      completionRate: 'שיעור השלמה',
      actions: 'פעולות',
      activityType: 'סוג פעילות',
      user: 'משתמש',
      target: 'יעד',
      timestamp: 'זמן',
      last7Days: '7 ימים אחרונים',
      last30Days: '30 ימים אחרונים',
      last90Days: '90 ימים אחרונים',
      allTime: 'כל הזמן',
      noData: 'אין נתונים',
      loading: 'טוען...',
      // Story 9.2 - User Management
      userManagement: 'ניהול משתמשים',
      userManagementDescription: 'נהל משתמשים ופרופילים',
      searchUsers: 'חפש משתמשים...',
      name: 'שם',
      email: 'אימייל',
      role: 'תפקיד',
      joinedDate: 'תאריך הצטרפות',
      lastActive: 'פעיל לאחרונה',
      progress: 'התקדמות',
      viewDetails: 'הצג פרטים',
      hideDetails: 'הסתר פרטים',
      viewAsUser: 'צפה כמשתמש',
      deleteUser: 'מחק משתמש',
      confirmDeleteUser: 'האם למחוק משתמש?',
      confirmDeleteUserMessage: 'האם אתה בטוח שברצונך למחוק משתמש זה? פעולה זו תמחק את כל הנתונים המשוייכים למשתמש ואינה הפיכה.',
      userDeleted: 'המשתמש נמחק בהצלחה',
      userDeleteFailed: 'שגיאה במחיקת המשתמש',
      usersPerPage: '50 משתמשים לדף',
      prevPage: 'הקודם',
      nextPage: 'הבא',
      pageOf: 'דף {current} מתוך {total}',
      sortBy: 'מיין לפי',
      sortByName: 'שם',
      sortByEmail: 'אימייל',
      sortByJoined: 'תאריך הצטרפות',
      sortByProgress: 'התקדמות',
      profileDetails: 'פרטי פרופיל',
      progressDetails: 'פרטי התקדמות',
      activityDetails: 'פרטי פעילות',
      notesCount: 'הערות',
      tasksCount: 'משימות',
      commentsCount: 'תגובות',
      totalProgress: 'התקדמות כוללת',
      userGuidesCompleted: 'מדריכים שהושלמו',
      userGuidesInProgress: 'מדריכים בתהליך',
      lastActivityDate: 'תאריך פעילות אחרונה',
      neverActive: 'מעולם לא היה פעיל',
      adminRole: 'מנהל',
      regularUser: 'משתמש רגיל',
      // Story 9.3 - Content Analytics
      analytics: {
        title: 'ניתוח ביצועי תוכן',
        subtitle: 'צפה בביצועי המדריכים והמעורבות של המשתמשים',
        totalNotes: 'סה״כ הערות',
        totalTasks: 'סה״כ משימות',
        totalComments: 'סה״כ תגובות',
        avgSessionDuration: 'משך ממוצע לישיבה',
        minutes: 'דקות',
        categoryPerformance: 'ביצועים לפי קטגוריה',
        filterByCategory: 'סינון לפי קטגוריה',
        allCategories: 'כל הקטגוריות',
        guidePerformance: 'ביצועי מדריכים',
        category: 'קטגוריה',
        helpfulVotes: 'הצבעות מועילות',
        comments: 'תגובות',
        engagement: 'מעורבות',
        high: 'גבוהה',
        medium: 'בינונית',
        low: 'נמוכה',
        exportCSV: 'ייצא CSV',
        loading: 'טוען...',
        noData: 'אין נתונים',
        views: 'צפיות',
        uniqueViewers: 'צופים ייחודיים',
        avgTime: 'זמן ממוצע',
        completionRate: 'שיעור השלמה',
        guideTitle: 'כותרת',
      },
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

    // OAuth - Story 2.4
    googleSignIn: 'התחבר עם Google',
    googleSignUp: 'הירשם עם Google',
    googleSignInError: 'שגיאה בהתחברות עם Google',
    googleSignUpError: 'שגיאה בהרשמה עם Google',
    continueWithGoogle: 'התחבר עם Google',
    orContinueWith: 'או',

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

  // Comments
  comments: {
    title: 'תגובות',
    noComments: 'אין תגובות עדיין',
    beFirstToComment: 'היה הראשון להגיב!',
    addComment: 'הוסף תגובה',
    writeComment: 'כתוב תגובה...',
    writeReply: 'כתוב תשובה...',
    postComment: 'פרסם תגובה',
    postReply: 'פרסם תשובה',
    reply: 'השב',
    edit: 'ערוך',
    delete: 'מחק',
    deleteConfirm: 'למחוק תגובה? לא ניתן לבטל פעולה זו.',
    deleteSuccess: 'התגובה נמחקה בהצלחה',
    deleteError: 'שגיאה במחיקת התגובה',
    edited: '(נערך)',
    save: 'שמור',
    editSuccess: 'התגובה עודכנה בהצלחה',
    editError: 'שגיאה בעדכון התגובה',
    commentDeleted: '[התגובה נמחקה]',
    helpful: 'מועיל',
    markAsHelpful: 'סמן כמועיל',
    markAsQuestion: 'סמן כשאלה',
    markAsSolution: 'סמן כפתרון',
    question: 'שאלה',
    solution: 'פתרון',
    replies: 'תשובות',
    replyTo: 'השב ל',
    replyingTo: 'משיב ל-{name}',
    loadMore: 'טען תגובות נוספות',
    sortBy: 'מיין לפי',
    sortRecent: 'חדשות ביותר',
    sortMostHelpful: 'הכי מועילות',
    sortOldest: 'הישנות ביותר',
    commentCount_zero: 'אין תגובות',
    commentCount_one: 'תגובה אחת',
    commentCount_two: 'שתי תגובות',
    commentCount_many: '{count} תגובות',
    replyCount_zero: 'אין תשובות',
    replyCount_one: 'תשובה אחת',
    replyCount_two: 'שתי תשובות',
    replyCount_many: '{count} תשובות',
    viewReplies: 'צפה בתשובות',
    hideReplies: 'הסתר תשובות',
    submitting: 'שולח...',
    loadingComments: 'טוען תגובות...',
    errorLoadingComments: 'שגיאה בטעינת תגובות',
    // Story 8.2: Comment Form
    write: 'כתיבה',
    preview: 'תצוגה מקדימה',
    comment: 'תגובה',
    markdownGuide: 'מדריך עיצוב',
    characterCount: '{current} / {max}',
    characterLimitExceeded: 'חרגת ממספר התווים המותר',
    commentPosted: 'התגובה פורסמה בהצלחה',
    replyPosted: 'התשובה פורסמה בהצלחה',
    errorPostingComment: 'שגיאה בפרסום התגובה',
    errorNotAuthenticated: 'יש להתחבר כדי לפרסם תגובה',
    emptyComment: 'התגובה לא יכולה להיות ריקה',
    submitComment: 'פרסם תגובה',
    submitReply: 'פרסם תשובה',
    submitQuestion: 'פרסם שאלה',
    cancel: 'ביטול',
    noPreview: 'אין תוכן לתצוגה מקדימה',
    // Story 8.3: Comment Voting
    voteError: 'שגיאה בהצבעה',
    loginToVote: 'יש להתחבר כדי להצביע',
    cannotVoteOwnComment: 'לא ניתן להצביע לתגובה שלך',
    voteErrorGeneric: 'שגיאה בהצבעה, נסה שוב',
    // Story 8.4: Q&A Functionality
    unmarkSolution: 'הסר סימון פתרון',
    solutionMarked: 'הפתרון סומן בהצלחה',
    solutionUnmarked: 'סימון הפתרון הוסר',
    onlyQuestions: 'הצג שאלות בלבד',
    allComments: 'כל התגובות',
    unansweredQuestions: 'שאלות ללא תשובה',
    answeredQuestions: 'שאלות שנענו',
    noUnansweredQuestions: 'אין שאלות ללא תשובה',
    noAnsweredQuestions: 'אין שאלות שנענו',
    solutionError: 'שגיאה בסימון פתרון',
    notQuestionAuthor: 'רק מחבר השאלה יכול לסמן פתרון',
    answered: 'נענתה',
  },

  // Notifications
  notifications: {
    title: 'התראות',
    noNotifications: 'אין התראות חדשות',
    markAllRead: 'סמן הכל כנקרא',
    repliedToYourComment: 'השיב לתגובה שלך',
    markedYourAnswerAsSolution: 'סימן את התשובה שלך כפתרון',
    viewComment: 'צפה בתגובה',
    newNotification: 'התראה חדשה',
    allRead: 'כל ההתראות נקראו',
  },

  // Avatar (Story 0.3)
  avatar: {
    change: 'שנה אווטר',
    select: 'בחר אווטר',
    preview: 'תצוגה מקדימה',
    save: 'שמור אווטר',
    cancel: 'ביטול',
    success: 'האווטר עודכן בהצלחה',
    error: 'שגיאה בשמירת אווטר',
    style: 'סגנון אווטר',
    profileAvatar: 'אווטר פרופיל',
    editProfile: 'ערוך פרופיל ואווטר',
  },
};
