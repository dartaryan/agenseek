/**
 * Journey CTA Component - Story 0.10.1
 *
 * Motivational call-to-action at the bottom of the journey page.
 * Encourages users to continue their learning journey.
 */

import { useNavigate } from 'react-router-dom';
import { IconRocket, IconTrophy } from '@tabler/icons-react';

interface JourneyCTAProps {
  completedGuides: number;
  totalGuides: number;
  currentPhase: 'core' | 'recommended' | 'interests' | 'optional';
}

export function JourneyCTA({ completedGuides, totalGuides }: JourneyCTAProps) {
  const navigate = useNavigate();
  const percentage = Math.round((completedGuides / totalGuides) * 100);

  // Different messages based on progress
  const getMessage = () => {
    if (percentage === 100) {
      return {
        title: 'כל הכבוד! השלמת את כל המדריכים!',
        subtitle: 'אתה מומחה מוסמך ב-BMAD. המשך להתעדכן במדריכים חדשים.',
        icon: <IconTrophy className="w-8 h-8" />,
        buttonText: 'חזור למרכז הלמידה',
        buttonAction: () => navigate('/guides'),
      };
    }

    if (percentage >= 75) {
      return {
        title: 'אתה כמעט שם! עוד קצת ואתה מומחה!',
        subtitle: 'השלמת את רוב המסלול. המשך במרץ!',
        icon: <IconRocket className="w-8 h-8" />,
        buttonText: 'המשך במסלול',
        buttonAction: () => navigate('/guides'),
      };
    }

    if (percentage >= 50) {
      return {
        title: 'התקדמות מצוינת!',
        subtitle: 'אתה באמצע הדרך. המשך לקרוא ולהתפתח!',
        icon: <IconRocket className="w-8 h-8" />,
        buttonText: 'המשך במסלול',
        buttonAction: () => navigate('/guides'),
      };
    }

    if (percentage >= 25) {
      return {
        title: 'יופי של התחלה!',
        subtitle: 'אתה על הדרך הנכונה. המשך לקרוא ולהתפתח!',
        icon: <IconRocket className="w-8 h-8" />,
        buttonText: 'המשך במסלול',
        buttonAction: () => navigate('/guides'),
      };
    }

    return {
      title: 'מוכן להתחיל את המסע?',
      subtitle: 'מסלול הלמידה שלך מחכה לך. בוא נתחיל!',
      icon: <IconRocket className="w-8 h-8" />,
      buttonText: 'התחל במסלול',
      buttonAction: () => navigate('/guides'),
    };
  };

  const message = getMessage();

  return (
    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-8 text-white text-center">
      <div className="flex justify-center mb-4">{message.icon}</div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{message.title}</h2>
      <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">{message.subtitle}</p>
      <button
        onClick={message.buttonAction}
        className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg hover:bg-emerald-50 transition-colors shadow-md"
      >
        {message.buttonText}
      </button>
    </div>
  );
}

