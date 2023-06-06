// USA
export const locale = {
  lang: 'en',
  data: {
    TRANSLATOR: {
      SELECT: 'Select your language',
    },
    MENU: {
      NEW: "new",
      ACTIONS: "Actions",
      CREATE_POST: "Create New Post",
      PAGES: "Sayfalar",
      FEATURES: "Yenilik",
      APPS: "Apps",
      DASHBOARD: 'Overwiev',
      PROFIL: "Profile",
      PROFIL_SUB: {
        GECISLERIM: "My Transitions",
        SURELERIM: "My Durations",
        IZINLERIM: "My Permission",
        TALEP_EDILENLER: "Requested Things",
        TALEPLERIM: "My Demands",
        ZIYARETCI_TALEPLERIM: "My Visitor Requests",
        MOBIL_LOKASYON: "Mobile Location",
        TASK_LISTEM: "My Task List",
        TAKIMIM: "My Team",
      },
      Access: "Access",
      AccessSub: {
        Dashboard: "Genel Bakış",
        Definitions: "Tanımlamalar",
        Reports: "Raporlar",
        Person: "Personel Listesi",
        DeviceList: "Cihaz Listesi",
        GatewayList: "Gateway Listesi",
      },
    },
    AUTH: {
      GENERAL: {
        OR: 'Or',
        SUBMIT_BUTTON: 'Submit',
        NO_ACCOUNT: 'Don\'t have an account?',
        SIGNUP_BUTTON: 'Sign Up',
        FORGOT_BUTTON: 'Forgot Password',
        BACK_BUTTON: 'Back',
        PRIVACY: 'Privacy',
        LEGAL: 'Legal',
        CONTACT: 'Contact',
      },
      LOGIN: {
        TITLE: 'Login Account',
        BUTTON: 'Sign In',
        USERNAME: "Username",
        PASSWORD: "Password",
        APP_LIST : "APP List"
      },
      LOGIN_FAILED : {
        PASSWORD_REQUIRED : "Şifre gerekli!",
        USERNAME_REQUIRED : "Kullanıcı adı gerekli!",
        APP_REQUIRED : "Uygulama gerekli!",
        MIN_LENGTH_3 : "Şifre en az 3 karakter içermelidir!"
      },
      FORGOT: {
        TITLE: 'Forgotten Password?',
        DESC: 'Enter your email to reset your password',
        SUCCESS: 'Your account has been successfully reset.'
      },
      REGISTER: {
        TITLE: 'Sign Up',
        DESC: 'Enter your details to create your account',
        SUCCESS: 'Your account has been successfuly registered.'
      },
      INPUT: {
        EMAIL: 'Email',
        FULLNAME: 'Fullname',
        PASSWORD: 'Password',
        CONFIRM_PASSWORD: 'Confirm Password',
        USERNAME: 'Username'
      },
      VALIDATION: {
        INVALID: '{{name}} is not valid',
        REQUIRED: '{{name}} is required',
        MIN_LENGTH: '{{name}} minimum length is {{min}}',
        AGREEMENT_REQUIRED: 'Accepting terms & conditions are required',
        NOT_FOUND: 'The requested {{name}} is not found',
        INVALID_LOGIN: 'The login detail is incorrect',
        REQUIRED_FIELD: 'Required field',
        MIN_LENGTH_FIELD: 'Minimum field length:',
        MAX_LENGTH_FIELD: 'Maximum field length:',
        INVALID_FIELD: 'Field is not valid',
      }
    },
    ECOMMERCE: {
      COMMON: {
        SELECTED_RECORDS_COUNT: 'Selected records count: ',
        ALL: 'All',
        SUSPENDED: 'Suspended',
        ACTIVE: 'Active',
        FILTER: 'Filter',
        BY_STATUS: 'by Status',
        BY_TYPE: 'by Type',
        BUSINESS: 'Business',
        INDIVIDUAL: 'Individual',
        SEARCH: 'Search',
        IN_ALL_FIELDS: 'in all fields'
      },
      ECOMMERCE: 'eCommerce',
      CUSTOMERS: {
        CUSTOMERS: 'Customers',
        CUSTOMERS_LIST: 'Customers list',
        NEW_CUSTOMER: 'New Customer',
        DELETE_CUSTOMER_SIMPLE: {
          TITLE: 'Customer Delete',
          DESCRIPTION: 'Are you sure to permanently delete this customer?',
          WAIT_DESCRIPTION: 'Customer is deleting...',
          MESSAGE: 'Customer has been deleted'
        },
        DELETE_CUSTOMER_MULTY: {
          TITLE: 'Customers Delete',
          DESCRIPTION: 'Are you sure to permanently delete selected customers?',
          WAIT_DESCRIPTION: 'Customers are deleting...',
          MESSAGE: 'Selected customers have been deleted'
        },
        UPDATE_STATUS: {
          TITLE: 'Status has been updated for selected customers',
          MESSAGE: 'Selected customers status have successfully been updated'
        },
        EDIT: {
          UPDATE_MESSAGE: 'Customer has been updated',
          ADD_MESSAGE: 'Customer has been created'
        }
      }
    },

    PUBLIC : {
      GUNLUK : "Daily",
      HAFTALIK : "Weekly",
      AYLIK : "Monthly",
      DATA_NOT_FOUND : 'Data Not Found!',
    },

    MY_DURATION : {
      TABLE_TITLE : {
        TARIH : "Date",
        GIRIS : "In",
        CIKIS : "Out",
        NORMAL_SURE : "Normal Time",
        ARA_SURE : "Break Times",
        IZIN_SURE : "Leave Time",
        FAZLA_SURE : "Too Long",
        EKSIK_SURE : "Absents",
      }
    },
    
    MY_VACATION : {
      TABLE_TITLE : {
        IZIN_TIPI : "Vacation Type",
        SAATLIK_GUNLUK : "Hourly/Daily",
        BASLANGIC : "Start Date",
        BITIS : "End Date",
        IZINLI_SURE : "Leave Time"
      }
    },

    DEMANDED : {
      TAB_GROUP : {
        BEKLEYEN_FORMLAR : "Form Pending Approval",
        ONAYLANANLAR : "Approved Forms",
        REDDEDILENLER : "Rejected Forms"
      },
      SUB_MENU : {
        IZIN : "Vacation",
        FAZLA_MESAI : "Overtime",
        ZIYARETCI : "Visitor",
        TUMU : "All"
      },

      WARNING_LIST : {
        TALEP_SECMELISINIZ : "You Must Select Demand Type"
      },

      BUTTON_TEXT : {
        TUMUNU_SEC : "Select all",
        SECILENLERI_ONAYLA : "Confirm Selected",
        SECILENLERI_REDDET : "Reject Selected",
        DETAYLI_ARAMA : "Detailed Search",
        ONAY : "Approve",
        RED : "Reject",
        SUREC : "Process",
        FORM : "Form",
        GONDER : "Send",
        VAZGEC : "Cancel",
        KAPAT : "Close",

      },

      DEMAND : {
        NEDENI : "Reason",
        BASLANGIC : "Start",
        BITIS_IS_BASI : "Finish/Start of Work",
        ACIKLAMA : "Description",
        SON : "End",
      },

      RED_DIALOG : {
        HEADER : "Request Decline",
      },

      SUREC_DIALOG : {
        HEADER : "Request Process",
      },

      ARAMA_DIALOG : {
        HEADER : "Detail Search",
        FORM_TITLE : {
          KISISEL_BILGILER : "Personal Information",
          FIRMA_BILGILER : "Company Information",
          OKOD_BILGILER : "Custom Code Information",
          TALEP_BILGILER : "Request Information"
        },
        FORM : {
          AD : "Name",
          SOYAD : "Surname",
          SICIL_NO : "Register No",
          PERSONEL_NO : "Person No",
          FIRMA : "Company",
          BOLUM : "Department",
          POZISYON : "Position",
          GOREV : "Job",
          ALT_FIRMA : "Sub Company",
          YAKA : "Collar",
          DIREKTORLUK : "Directorship",
          ARALIK_BASLANGIC : "Start Date",
          ARALIK_BITIS : "End Date",
          IZIN_TIPI : "Vacation Type",
          FAZLA_MESAI_TURU : "Overtime Reason"
        }
      }
    },
    IZIN_TALEP_DIALOG : {
      HEADER : "Leave Request Form",
      FORM : {
        IZIN_TIPI : "Type of Leave",
        IZIN_HAKKI : "Entitlement to Leave",
        GUNLUK_SAATLIK : "Daily-Hourly",
        GUNLUK : "Daily",
        SAATLIK : "Hourly",
        IZIN_ADRESI : "Leave Address",
        BASLANGIC_TARIHI : "Start Date",
        BASLANGIC_SAATI : "Start Time",
        BITIS_TARIHI  :"End Date",
        BITIS_SAATI : "End Time",
        HESAPLANAN_SURE : "Calculated Leave Duration",
        ACIKLAMA : "Description",
        GONDER : "Send",
        IZIN_TIPI_SECINIZ : 'Select A Vacation Type',
        ACIKLAMA_GIRINIZ : 'Enter Description',
        ADRES_GIRINIZ : 'Enter Adress'
      }
    },
    FM_TALEP_DIALOG : {
      HEADER : "Overtime Request Form",
      FORM : {
        FM_TIPI : "Type of Overtime",
        ULASIM : 'Transport',
        YEMEK : 'Food',
        BASLANGIC_TARIHI : "Start Date",
        BASLANGIC_SAATI : "Start Time",
        BITIS_TARIHI  :"End Date",
        BITIS_SAATI : "End Time",
        ACIKLAMA : "Description",
        GONDER : "Send",
        FM_TIPI_SECINIZ : 'Select A Overtime Type',
        ACIKLAMA_GIRINIZ : 'Enter Description',
        YEMEK_SECINIZ : 'Select A Food',
        ULASIM_SECINIZ : 'Select A Transport'
      }
    },
  }
};
