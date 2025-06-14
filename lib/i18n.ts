"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        common: {
          back: "Back",
          submit: "Submit",
          cancel: "Cancel",
          save: "Save",
          delete: "Delete",
          edit: "Edit",
          submitting: "Submitting...",
        },
        login: {
          title: "Welcome to EVE Employee",
          description: "Sign in with your Microsoft account to continue",
          email: "Email",
          password: "Password",
          signIn: "Sign In",
          signingIn: "Signing In...",
          signInWithMicrosoft: "Sign in with Microsoft",
        },
        home: {
          welcome: "Welcome",
          subtitle: "Your AI-powered virtual assistant platform",
          createEve: "Create Your EVE",
          createEveDesc: "Set up your personal AI assistant",
          createEveButton: "Get Started",
          chatWithEve: "Chat with EVE",
          chatWithEveDesc: "Talk to your personal AI assistant",
          chatWithEveButton: "Start Chat",
          createEveFirst: "Create EVE First",
          virtualOffice: "Virtual Office",
          virtualOfficeDesc: "Interact with other EVE employees",
          virtualOfficeButton: "Enter Office",
          talkToEve: "Talk to Your EVE",
          talkToEveDesc: "Chat with your personal AI assistant",
          startChat: "Start Chat",
          talkToOthers: "Virtual Office",
          talkToOthersDesc: "Interact with other EVE employees",
          enterOffice: "Enter Office",
          logout: "Sign Out",
          loggingOut: "Signing Out...",
        },
        createEve: {
          title: "Create Your EVE Employee",
          description: "Customize your AI assistant with the details below",
          name: "EVE Name",
          namePlaceholder: "Enter a name for your EVE",
          department: "Department",
          departmentPlaceholder: "Select a department",
          gender: "Gender",
          male: "Male",
          female: "Female",
          introduction: "Introduction",
          introductionPlaceholder:
            "Write an introduction for your EVE employee...",
          uploadPhoto: "Upload Photo",
          submit: "Create EVE",
          success: "EVE Created Successfully",
          successDesc:
            "Your EVE employee has been created and is ready to assist you.",
          error: "Error Creating EVE",
          errorDesc:
            "There was a problem creating your EVE employee. Please try again.",
        },
        chat: {
          activeChat: "Chat",
          history: "History",
          typeMessage: "Type a message...",
          recording: "Recording voice...",
          send: "Send",
          noHistory: "No chat history available",
          selectedFiles: "Selected Files",
          upload: "Upload",
          attachments: "Attachments",
          voiceMessage: "Voice Message",
        },
        virtualOffice: {
          title: "Virtual Office",
          loggedInAs: "Logged in as",
          reception: "Reception",
          meetingRoom: "Meeting Room",
          chatWith: "Chat with",
          callWith: "Call",
          departments: "Departments",
        },
        departments: {
          hr: "HR Department",
          it: "IT Department",
          qa: "QA Department",
        },
        navigation: {
          home: "Home",
          createEve: "Create EVE",
          chatWithEve: "Chat with EVE",
          virtualOffice: "Virtual Office",
          signOut: "Sign Out",
        },
      },
    },
    ar: {
      translation: {
        common: {
          back: "رجوع",
          submit: "إرسال",
          cancel: "إلغاء",
          save: "حفظ",
          delete: "حذف",
          edit: "تعديل",
          submitting: "جاري الإرسال...",
        },
        login: {
          title: "مرحبًا بك في موظف EVE",
          description: "قم بتسجيل الدخول باستخدام حساب Microsoft للمتابعة",
          email: "البريد الإلكتروني",
          password: "كلمة المرور",
          signIn: "تسجيل الدخول",
          signingIn: "جاري تسجيل الدخول...",
          signInWithMicrosoft: "تسجيل الدخول باستخدام Microsoft",
        },
        home: {
          welcome: "مرحبًا",
          subtitle: "منصة المساعد الافتراضي المدعومة بالذكاء الاصطناعي",
          createEve: "إنشاء EVE الخاص بك",
          createEveDesc: "قم بإعداد مساعدك الشخصي بالذكاء الاصطناعي",
          createEveButton: "البدء",
          chatWithEve: "التحدث مع EVE",
          chatWithEveDesc: "تحدث مع مساعدك الشخصي بالذكاء الاصطناعي",
          chatWithEveButton: "بدء الدردشة",
          createEveFirst: "قم بإنشاء EVE أولاً",
          virtualOffice: "المكتب الافتراضي",
          virtualOfficeDesc: "تفاعل مع موظفي EVE الآخرين",
          virtualOfficeButton: "دخول المكتب",
          talkToEve: "التحدث مع EVE الخاص بك",
          talkToEveDesc: "الدردشة مع مساعدك الشخصي بالذكاء الاصطناعي",
          startChat: "بدء الدردشة",
          talkToOthers: "المكتب الافتراضي",
          talkToOthersDesc: "تفاعل مع موظفي EVE الآخرين",
          enterOffice: "دخول المكتب",
          logout: "تسجيل الخروج",
          loggingOut: "جاري تسجيل الخروج...",
        },
        createEve: {
          title: "إنشاء موظف EVE الخاص بك",
          description: "قم بتخصيص مساعدك بالذكاء الاصطناعي بالتفاصيل أدناه",
          name: "اسم EVE",
          namePlaceholder: "أدخل اسمًا لـ EVE الخاص بك",
          department: "القسم",
          departmentPlaceholder: "اختر قسمًا",
          gender: "الجنس",
          male: "ذكر",
          female: "أنثى",
          introduction: "المقدمة",
          introductionPlaceholder: "اكتب مقدمة لموظف EVE الخاص بك...",
          uploadPhoto: "تحميل صورة",
          submit: "إنشاء EVE",
          success: "تم إنشاء EVE بنجاح",
          successDesc: "تم إنشاء موظف EVE الخاص بك وهو جاهز لمساعدتك.",
          error: "خطأ في إنشاء EVE",
          errorDesc:
            "حدثت مشكلة أثناء إنشاء موظف EVE الخاص بك. يرجى المحاولة مرة أخرى.",
        },
        chat: {
          activeChat: "الدردشة",
          history: "السجل",
          typeMessage: "اكتب رسالة...",
          recording: "جاري تسجيل الصوت...",
          send: "إرسال",
          noHistory: "لا يوجد سجل دردشة متاح",
          selectedFiles: "الملفات المحددة",
          upload: "تحميل",
          attachments: "المرفقات",
          voiceMessage: "رسالة صوتية",
        },
        virtualOffice: {
          title: "المكتب الافتراضي",
          loggedInAs: "تم تسجيل الدخول باسم",
          reception: "الاستقبال",
          meetingRoom: "غرفة الاجتماعات",
          chatWith: "دردشة مع",
          callWith: "اتصال",
          departments: "الأقسام",
        },
        departments: {
          hr: "قسم الموارد البشرية",
          it: "قسم تكنولوجيا المعلومات",
          qa: "قسم ضمان الجودة",
        },
        navigation: {
          home: "الرئيسية",
          createEve: "إنشاء EVE",
          chatWithEve: "التحدث مع EVE",
          virtualOffice: "المكتب الافتراضي",
          signOut: "تسجيل الخروج",
        },
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
