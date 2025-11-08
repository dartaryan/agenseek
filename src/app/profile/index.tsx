import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { hebrewLocale } from '../../lib/locale/he';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../hooks/use-toast';
import { EditDisplayNameModal } from '../../components/profile/EditDisplayNameModal';
import { isEnglishName } from '../../lib/utils/detectLanguage';
import { UserAvatar } from '../../components/ui/user-avatar';
import { AvatarSelector } from '../../components/avatar-selector';
import { getDefaultAvatarConfig, type AvatarConfig } from '../../lib/avatar';
import {
  IconCode,
  IconChartBar,
  IconPalette,
  IconBuildingBridge,
  IconClipboardList,
  IconTestPipe,
  IconTie,
  IconDeviceGamepad,
  IconBulb,
  IconRobotFace,
  IconSchema,
  IconCodeDots,
  IconCheckbox,
  IconUsersGroup,
  IconChartArrows,
  IconStar,
  IconStarHalfFilled,
  IconStarsFilled,
  IconCheck,
  IconLoader2,
  IconSparkles,
  IconEdit,
} from '@tabler/icons-react';

// Role definitions (same as onboarding)
interface Role {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const ROLES: Role[] = [
  {
    id: 'developer',
    icon: IconCode,
    title: 'מפתח',
    description: 'בניה ויישום פתרונות תוכנה',
  },
  {
    id: 'product-manager',
    icon: IconChartBar,
    title: 'מנהל מוצר',
    description: 'הגדרת חזון ואסטרטגיה של מוצר',
  },
  {
    id: 'designer',
    icon: IconPalette,
    title: 'מעצב UX/UI',
    description: 'עיצוב חוויות משתמש וממשקים',
  },
  {
    id: 'architect',
    icon: IconBuildingBridge,
    title: 'ארכיטקט',
    description: 'תכנון ארכיטקטורת מערכת ותבניות',
  },
  {
    id: 'project-manager',
    icon: IconClipboardList,
    title: 'מנהל פרויקטים',
    description: 'תיאום פרויקטים וצוותים',
  },
  {
    id: 'qa-engineer',
    icon: IconTestPipe,
    title: 'מהנדס QA',
    description: 'הבטחת איכות באמצעות בדיקות',
  },
  {
    id: 'executive',
    icon: IconTie,
    title: 'מנהל בכיר',
    description: 'הובלת יוזמות אסטרטגיות',
  },
  {
    id: 'game-developer',
    icon: IconDeviceGamepad,
    title: 'מפתח משחקים',
    description: 'יצירת חוויות משחק אינטראקטיביות',
  },
  {
    id: 'non-technical',
    icon: IconBulb,
    title: 'לא טכני',
    description: 'תמיכה בצוותים טכניים בתפקידים אחרים',
  },
];

// Interest definitions (same as onboarding)
interface Interest {
  id: string;
  icon: React.ElementType;
  title: string;
}

const INTERESTS: Interest[] = [
  {
    id: 'agents-workflows',
    icon: IconRobotFace,
    title: 'סוכנים וזרימות עבודה',
  },
  {
    id: 'architecture-design',
    icon: IconSchema,
    title: 'ארכיטקטורה ועיצוב',
  },
  {
    id: 'implementation-development',
    icon: IconCodeDots,
    title: 'יישום ופיתוח',
  },
  {
    id: 'testing-quality',
    icon: IconCheckbox,
    title: 'בדיקות ואיכות',
  },
  {
    id: 'game-development',
    icon: IconDeviceGamepad,
    title: 'פיתוח משחקים',
  },
  {
    id: 'creative-processes',
    icon: IconChartArrows,
    title: 'תהליכים יצירתיים',
  },
  {
    id: 'team-collaboration',
    icon: IconUsersGroup,
    title: 'שיתוף פעולה צוותי',
  },
  {
    id: 'project-management',
    icon: IconClipboardList,
    title: 'ניהול פרויקטים',
  },
];

// Experience levels (same as onboarding)
interface ExperienceLevel {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  {
    id: 'beginner',
    icon: IconStar,
    title: 'מתחיל',
    description: 'אני חדש ב-BMAD ורוצה להתחיל מהיסודות',
    color: 'text-blue-500',
  },
  {
    id: 'intermediate',
    icon: IconStarHalfFilled,
    title: 'בינוני',
    description: 'יש לי ניסיון מסוים ורוצה להעמיק את הידע שלי',
    color: 'text-emerald-500',
  },
  {
    id: 'advanced',
    icon: IconStarsFilled,
    title: 'מתקדם',
    description: 'אני מנוסה ומחפש מושגים מתקדמים',
    color: 'text-purple-500',
  },
];

/**
 * Profile Page with Learning Preferences Editor
 */
export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);

  // Form state
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);

  // Avatar state
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig | null>(null);

  // Load current preferences from profile
  useEffect(() => {
    if (profile) {
      setSelectedRole(profile.role || null);
      setSelectedInterests(profile.interests || []);
      setSelectedExperience(profile.experience_level || null);
    }
  }, [profile]);

  // Load avatar configuration from profile
  useEffect(() => {
    async function loadAvatar() {
      if (!user?.id) return;

      const { data } = await supabase
        .from('profiles')
        .select('avatar_style, avatar_seed, avatar_options')
        .eq('id', user.id)
        .single();

      if (data?.avatar_style) {
        setAvatarConfig({
          style: data.avatar_style as any,
          seed: data.avatar_seed || user.id,
          options: data.avatar_options || {},
        });
      }
    }
    loadAvatar();
  }, [user?.id]);

  // Check if we should open display name edit modal from query param
  useEffect(() => {
    if (searchParams.get('edit') === 'display_name') {
      setIsEditingDisplayName(true);
      // Remove query param
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const handleToggleInterest = (interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId) ? prev.filter((id) => id !== interestId) : [...prev, interestId]
    );
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: selectedRole,
          interests: selectedInterests,
          experience_level: selectedExperience as 'beginner' | 'intermediate' | 'advanced' | null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile in auth context
      await refreshProfile();

      toast({
        title: 'העדפות עודכנו בהצלחה',
        description: 'נתיב הלמידה שלך עודכן על פי ההעדפות החדשות',
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'שגיאה',
        description: 'שמירת ההעדפות נכשלה. אנא נסה שוב.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to current profile values
    if (profile) {
      setSelectedRole(profile.role || null);
      setSelectedInterests(profile.interests || []);
      setSelectedExperience(profile.experience_level || null);
    }
    setIsEditing(false);
  };

  const handleRerunOnboarding = async () => {
    if (!user?.id) return;

    try {
      // Mark onboarding as incomplete so user can go through it again
      const { error } = await supabase
        .from('profiles')
        .update({
          completed_onboarding: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile
      await refreshProfile();

      // Navigate to onboarding
      navigate('/onboarding');
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      toast({
        title: 'שגיאה',
        description: 'לא ניתן לאפס את ההונחיה. אנא נסה שוב.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateDisplayName = async (newName: string) => {
    if (!user?.id) return;

    try {
      // Check if name is being changed from Hebrew to English
      const oldName = profile?.display_name || '';
      const isChangingToEnglish = !isEnglishName(oldName) && isEnglishName(newName);

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: newName,
          // Reset flag if changing to English name
          hebrew_name_suggestion_dismissed: isChangingToEnglish ? false : profile?.hebrew_name_suggestion_dismissed,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();

      toast({
        title: 'השם עודכן בהצלחה',
        description: 'שם התצוגה שלך עודכן',
      });
    } catch (error) {
      console.error('Error updating display name:', error);
      throw error;
    }
  };

  const handleSaveAvatar = async (config: AvatarConfig) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          avatar_style: config.style,
          avatar_seed: config.seed,
          avatar_options: config.options,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setAvatarConfig(config);
      toast({
        title: 'האווטר עודכן בהצלחה',
        description: 'האווטר שלך שונה',
      });
    } catch (error) {
      console.error('Error saving avatar:', error);
      toast({
        variant: 'destructive',
        title: 'שגיאה בשמירת אווטר',
        description: 'אנא נסה שוב',
      });
    }
  };

  return (
    <>
      {/* Edit Display Name Modal - Story X.X */}
      <EditDisplayNameModal
        currentName={profile?.display_name || ''}
        userId={user?.id || ''}
        isOpen={isEditingDisplayName}
        onClose={() => setIsEditingDisplayName(false)}
        onSave={handleUpdateDisplayName}
      />

      {/* Avatar Selector - Story 0.3 */}
      {user?.id && (
        <AvatarSelector
          open={showAvatarSelector}
          onClose={() => setShowAvatarSelector(false)}
          currentConfig={avatarConfig || getDefaultAvatarConfig(user.id)}
          onSave={handleSaveAvatar}
          userId={user.id}
        />
      )}

      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {hebrewLocale.pages.profile.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {hebrewLocale.pages.profile.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Details */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">פרטי חשבון</h3>
                <Button
                  onClick={() => setIsEditingDisplayName(true)}
                  variant="outline"
                  size="sm"
                >
                  ערוך שם
                </Button>
              </div>

              {/* Avatar Display and Edit - Story 0.3 */}
              <div className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <UserAvatar
                  config={avatarConfig}
                  userId={user?.id}
                  size="xl"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    אווטר פרופיל
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAvatarSelector(true)}
                  >
                    <IconEdit className="w-4 h-4 ml-2" />
                    שנה אווטר
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <p>
                  <strong>שם תצוגה:</strong> {profile?.display_name || 'לא הוגדר'}
                </p>
                <p>
                  <strong>{hebrewLocale.auth.email}:</strong> {user?.email}
                </p>
                <p>
                  <strong>נוצר:</strong>{' '}
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('he-IL') : 'לא זמין'}
                </p>
              </div>
            </Card>

          {/* Learning Preferences */}
          <Card className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                העדפות למידה
              </h3>
              {!isEditing && (
                <div className="flex gap-2">
                  <Button onClick={handleRerunOnboarding} variant="outline" size="sm">
                    <IconSparkles className="w-4 h-4 ml-2" />
                    חזור להונחיה
                  </Button>
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    ערוך העדפות
                  </Button>
                </div>
              )}
            </div>

            {!isEditing ? (
              /* Display Mode */
              <div className="space-y-4">
                {/* Role */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    תפקיד
                  </h4>
                  {selectedRole ? (
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg">
                      {(() => {
                        const role = ROLES.find((r) => r.id === selectedRole);
                        if (!role) return selectedRole;
                        const Icon = role.icon;
                        return (
                          <>
                            <Icon className="w-4 h-4" />
                            <span>{role.title}</span>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">לא נבחר</p>
                  )}
                </div>

                {/* Interests */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    תחומי עניין
                  </h4>
                  {selectedInterests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedInterests.map((interestId) => {
                        const interest = INTERESTS.find((i) => i.id === interestId);
                        if (!interest) return null;
                        const Icon = interest.icon;
                        return (
                          <div
                            key={interestId}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm"
                          >
                            <Icon className="w-4 h-4" />
                            <span>{interest.title}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">לא נבחרו</p>
                  )}
                </div>

                {/* Experience */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    רמת ניסיון
                  </h4>
                  {selectedExperience ? (
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg">
                      {(() => {
                        const exp = EXPERIENCE_LEVELS.find((e) => e.id === selectedExperience);
                        if (!exp) return selectedExperience;
                        const Icon = exp.icon;
                        return (
                          <>
                            <Icon className="w-4 h-4" />
                            <span>{exp.title}</span>
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">לא נבחר</p>
                  )}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                  <IconCheck className="w-4 h-4 inline ml-1" />
                  ההעדפות שלך משפיעות על המלצות המדריכים בדף הבית ובמעקב התקדמות
                </p>
              </div>
            ) : (
              /* Edit Mode */
              <div className="space-y-6">
                {/* Role Selection */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    תפקיד
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ROLES.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.id;
                      return (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className={`p-3 rounded-lg text-right transition-all duration-200 ${
                            isSelected
                              ? 'bg-primary/10 border-2 border-primary'
                              : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div
                              className={`p-1.5 rounded-md ${
                                isSelected
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5
                                className={`font-medium text-sm ${
                                  isSelected
                                    ? 'text-primary'
                                    : 'text-gray-900 dark:text-white'
                                }`}
                              >
                                {role.title}
                              </h5>
                              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                {role.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Interests Selection */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    תחומי עניין
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {INTERESTS.map((interest) => {
                      const Icon = interest.icon;
                      const isSelected = selectedInterests.includes(interest.id);
                      return (
                        <button
                          key={interest.id}
                          onClick={() => handleToggleInterest(interest.id)}
                          className={`p-3 rounded-lg text-center transition-all duration-200 ${
                            isSelected
                              ? 'bg-primary text-white'
                              : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className={`p-2 rounded-md ${
                                isSelected ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                              }`}
                            >
                              <Icon
                                className={`w-5 h-5 ${
                                  isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                                }`}
                              />
                            </div>
                            <span
                              className={`text-xs font-medium ${
                                isSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                              }`}
                            >
                              {interest.title}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience Selection */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    רמת ניסיון
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {EXPERIENCE_LEVELS.map((level) => {
                      const Icon = level.icon;
                      const isSelected = selectedExperience === level.id;
                      return (
                        <button
                          key={level.id}
                          onClick={() => setSelectedExperience(level.id)}
                          className={`p-4 rounded-lg text-center transition-all duration-200 ${
                            isSelected
                              ? 'bg-primary/10 border-2 border-primary'
                              : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-3">
                            <div
                              className={`p-3 rounded-lg ${
                                isSelected ? 'bg-primary/20' : 'bg-gray-100 dark:bg-gray-700'
                              }`}
                            >
                              <Icon
                                className={`w-8 h-8 ${
                                  isSelected ? 'text-primary' : level.color
                                }`}
                              />
                            </div>
                            <div>
                              <h5
                                className={`font-bold ${
                                  isSelected
                                    ? 'text-primary'
                                    : 'text-gray-900 dark:text-white'
                                }`}
                              >
                                {level.title}
                              </h5>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {level.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <IconLoader2 className="w-4 h-4 ml-2 animate-spin" />
                        שומר...
                      </>
                    ) : (
                      <>
                        <IconCheck className="w-4 h-4 ml-2" />
                        שמור שינויים
                      </>
                    )}
                  </Button>
                  <Button onClick={handleCancel} variant="outline" disabled={isSaving}>
                    ביטול
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}
