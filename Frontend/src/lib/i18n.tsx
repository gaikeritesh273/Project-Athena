'use client';
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // General & Branding
    brandName: 'ATHENA',
    tagline: "Don't just know what to believe. Learn how to evaluate.",
    unescoBadge: 'UNESCO Youth Hackathon 2026 Entry',
    investigateCTA: 'Investigate Content',
    tryDemoCTA: 'Try Demo Investigation',
    howItWorks: 'Four Pillars of Media Literacy',
    navInvestigate: 'Workspace',
    navDashboard: 'Dashboard',
    navClaimChecker: 'Claim Checker',
    navBiasDetector: 'Bias Detector',
    navSourceScorer: 'Source Scorer',
    navTrainer: 'Tutor & Trainer',

    // Workspace & Ingestion
    workspaceTitle: 'AI-Powered Investigation Workspace',
    workspaceSubtitle: 'Paste suspicious digital content or try our pitch demo to generate an objective Trust Passport and learning challenge.',
    inputPlaceholder: 'Paste article headline, viral social media post, or digital claim text here...',
    analyzingText: 'Analyzing Content across 5 Literacy Dimensions...',
    stepExtract: '1. Extracting Primary Claim...',
    stepEvidence: '2. Cross-referencing Evidence Sources...',
    stepContext: '3. Evaluating Missing Context & Emotional Framing...',
    stepPerspectives: '4. Mapping Multi-Source Perspectives...',
    stepPassport: '5. Generating Trust Passport & Tutor Challenge...',

    // Tabs
    tabOverview: 'Overview',
    tabPassport: 'Trust Passport',
    tabPerspectives: 'Perspective Explorer',
    tabNarrative: 'Narrative Memory',
    tabTutor: 'AI Tutor & Quiz',
    tabProfile: 'Literacy Profile',

    // Trust Passport
    tpClaimTitle: 'Extracted Primary Claim',
    tpSourceTitle: 'Source & Origin Analysis',
    tpEvidenceTitle: 'Evidence Matrix',
    tpSupporting: 'Supporting Evidence',
    tpConflicting: 'Conflicting Evidence',
    tpUnverified: 'Unverified Signals',
    tpContextTitle: 'Missing Context & Historical Precedent',
    tpLanguageTitle: 'Language & Emotional Framing',
    tpAITitle: 'AI Generation & Synthetic Indicators',
    tpAssessmentTitle: 'Epistemological Assessment',
    tpSuggestedActions: 'Recommended Verification Steps',

    // Perspective Explorer
    peTitle: 'Multi-Source Perspective Comparison',
    peSubtitle: 'Explore how different categories frame the exact same claim. Identify common ground vs points of tension.',
    peCommonGround: 'What Credible Sources Agree On',
    peKeyDifferences: 'Where Perspectives Diverge',
    peUncertainties: 'What Remains Uncertain',

    // Narrative Memory
    nmTitle: 'Narrative Memory & Claim Evolution Timeline',
    nmSubtitle: 'Trace how this piece of information transformed over time across the digital ecosystem.',

    // AI Tutor
    tutorTitle: 'AI Media Literacy Tutor',
    tutorSubtitle: 'Learn WHY this content may be misleading and test your critical-thinking skills.',
    tutorWhyMisleading: 'Why This Content Deserves Critical Scrutiny',
    tutorTakeQuiz: 'Take 2-Minute Verification Challenge',
    quizCorrect: 'Correct! Great critical thinking.',
    quizIncorrect: 'Not quite. Here is the reasoning:',

    // Literacy Profile
    profileTitle: 'Your Media Literacy Journey',
    profileSubtitle: 'Track your growth across 5 critical-thinking skills. Powered by completed investigation challenges.',
  },
  hi: {
    // General & Branding
    brandName: 'ATHENA',
    tagline: 'केवल यह न जानें कि क्या मानना है। मूल्यांकन करना सीखें।',
    unescoBadge: 'यूनेस्को युवा हैकथॉन 2026 प्रविष्टि',
    investigateCTA: 'सामग्री की जांच करें',
    tryDemoCTA: 'डेमो जांच का प्रयास करें',
    howItWorks: 'मीडिया साक्षरता के चार स्तंभ',
    navInvestigate: 'जांच कार्यस्थल',
    navDashboard: 'डैशबोर्ड',
    navClaimChecker: 'दावा जांचकर्ता',
    navBiasDetector: 'पूर्वाग्रह डिटेक्टर',
    navSourceScorer: 'स्रोत स्कोरर',
    navTrainer: 'ट्यूटर और क्विज़',

    // Workspace & Ingestion
    workspaceTitle: 'एआई-संचालित जांच कार्यस्थल',
    workspaceSubtitle: 'संदिग्ध डिजिटल सामग्री पेस्ट करें या एक उद्देश्यपूर्ण ट्रस्ट पासपोर्ट बनाने के लिए हमारे डेमो का प्रयास करें।',
    inputPlaceholder: 'यहां लेख का शीर्षक, सोशल मीडिया पोस्ट या दावा पेस्ट करें...',
    analyzingText: '5 साक्षरता आयामों में सामग्री का विश्लेषण किया जा रहा है...',
    stepExtract: '1. मुख्य दावे का निष्कर्षण...',
    stepEvidence: '2. साक्ष्य स्रोतों का मिलान...',
    stepContext: '3. लापता संदर्भ और भावनात्मक भाषा का मूल्यांकन...',
    stepPerspectives: '4. बहु-स्रोत दृष्टिकोणों का मानचित्रण...',
    stepPassport: '5. ट्रस्ट पासपोर्ट और ट्यूटर चुनौती तैयार की जा रही है...',

    // Tabs
    tabOverview: 'अवलोकन',
    tabPassport: 'ट्रस्ट पासपोर्ट',
    tabPerspectives: 'दृष्टिकोण अन्वेषक',
    tabNarrative: 'नैरेटिव मेमोरी',
    tabTutor: 'एआई ट्यूटर और क्विज़',
    tabProfile: 'साक्षरता प्रोफ़ाइल',

    // Trust Passport
    tpClaimTitle: 'प्राथमिक दावा',
    tpSourceTitle: 'स्रोत और उत्पत्ति विश्लेषण',
    tpEvidenceTitle: 'साक्ष्य मैट्रिक्स',
    tpSupporting: 'समर्थक साक्ष्य',
    tpConflicting: 'विरोधाभासी साक्ष्य',
    tpUnverified: 'असत्यापित संकेत',
    tpContextTitle: 'लापता संदर्भ और ऐतिहासिक मिसाल',
    tpLanguageTitle: 'भाषा और भावनात्मक ढांचा',
    tpAITitle: 'एआई निर्माण संकेत',
    tpAssessmentTitle: 'ज्ञानमीमांसीय मूल्यांकन',
    tpSuggestedActions: 'अनुशंसित सत्यापन कदम',

    // Perspective Explorer
    peTitle: 'बहु-स्रोत दृष्टिकोण तुलना',
    peSubtitle: 'देखें कि विभिन्न श्रेणियां एक ही दावे को कैसे प्रस्तुत करती हैं।',
    peCommonGround: 'विश्वसनीय स्रोत किस पर सहमत हैं',
    peKeyDifferences: 'दृष्टिकोण कहाँ भिन्न हैं',
    peUncertainties: 'क्या अनिश्चित बना रहता है',

    // Narrative Memory
    nmTitle: 'नैरेटिव मेमोरी और समयरेखा',
    nmSubtitle: 'जानें कि समय के साथ यह जानकारी कैसे विकसित हुई।',

    // AI Tutor
    tutorTitle: 'एआई मीडिया साक्षरता ट्यूटर',
    tutorSubtitle: 'समझें कि यह सामग्री भ्रामक क्यों हो सकती है और अपने कौशल का परीक्षण करें।',
    tutorWhyMisleading: 'यह सामग्री आलोचनात्मक जांच की हकदार क्यों है',
    tutorTakeQuiz: 'चुनौती में भाग लें',
    quizCorrect: 'सही! उत्कृष्ट आलोचनात्मक सोच।',
    quizIncorrect: 'बिल्कुल नहीं। तर्क इस प्रकार है:',

    // Literacy Profile
    profileTitle: 'आपकी मीडिया साक्षरता यात्रा',
    profileSubtitle: '5 आलोचनात्मक-सोच कौशलों में अपनी वृद्धि को ट्रैक करें।',
  },
};

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
