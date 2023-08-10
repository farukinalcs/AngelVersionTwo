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
        EKSIK_SURELERIM : "Incomplete Time"
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
        SIGN_OUT : 'Sign Out'
      },
      LOGIN: {
        TITLE: 'Login Account',
        BUTTON: 'Sign In',
        USERNAME: "Username",
        PASSWORD: "Password",
        APP_LIST : "APP List",
        WAIT : "Please Wait..."
      },
      LOGIN_FAILED : {
        LOGIN_FAILED : "The Login Details Are Incorrect",
        PASSWORD_REQUIRED : "Password required!",
        USERNAME_REQUIRED : "Username required!",
        APP_REQUIRED : "App required!",
        MIN_LENGTH_3 : "Field should have at least 3 symbols!"
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
      SEARCH : 'Search..',
      AYLAR : {
        OCAK : 'January',
        SUBAT : 'February',
        MART : 'March',
        NISAN : 'April',
        MAYIS : 'May',
        HAZIRAN : 'June',
        TEMMUZ : 'July',
        AGUSTOS : 'August',
        EYLUL : 'September',
        EKIM : 'October',
        KASIM : 'November',
        ARALIK : 'December'
      }
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
        REDDEDILENLER : "Rejected Forms",
        SURECI_DEVAM_EDEN_FORMLAR : 'Awaiting Approval'
      },
      SUB_MENU : {
        IZIN : "Vacation",
        FAZLA_MESAI : "Overtime",
        ZIYARETCI : "Visitor",
        MALZEME : "Material",
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
        IPTAL : 'Cancel',
        ONAYLANDI : 'CONFIRMED',
        REDDEDILDI : 'REJECTED'
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
        ACIKLAMA : "Description",
        ACIKLAMA_PLACEHOLDER : "Enter a description.."
      },

      SUREC_DIALOG : {
        HEADER : "Request Process"
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
          PERSONEL : "Person",
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
          FAZLA_MESAI_TURU : "Overtime Reason",
          PLACEHOLDER : 'Enter a value..',
          TIP : 'Type'
        }
      },

      ALERT : {
        ONAY_MESAJ : 'Are You Sure You Want To Approve The Selected Requests?',
        RET_MESAJ : 'Are You Sure You Want To Reject The Selected Requests?',
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
      },
      FORM_ERROR : {
        REQUIRED : "Required!"
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

    ZIYARETCI_TALEP_DIALOG : {
      HEADER : "Visitor Request Form",
      FORM : {
        AD : "Name",
        SOYAD : 'Surname',
        FIRMA : 'Company',
        GIRIS_TARIHI : "Entry Date",
        GIRIS_SAATI : "Entry Time",
        CIKIS_TARIHI  :"Exist Date",
        CIKIS_SAATI : "Exist Time",
        ACIKLAMA : "Description",
        GONDER : "Send",
        FIRMA_SEC : 'Select Company',
        ACIKLAMA_GIRINIZ : 'Enter Description',
        EMAIL : 'E-mail',
        ZIYARET_TIPI : 'Visit Type'
      }
    },

    TASK_LISTEM : {
      TABLE : {
        PROJE : 'Project',
        ACIKLAMA : 'Description',
        BASLANGIC_TARIHI : 'Start Date',
        BITIS_TARIHI : 'End Date',
        DURUM : 'State'
      }
    },

    EKSIK_SURE : {
      TABLE : {
        VARDIYA : 'Shift',
        EKSIK_SURE : 'Incomplete Time',
        MESAI_TARIHI : 'Working Date',
        GIRIS : 'Entry',
        CIKIS : 'Exit'
      },
      ZAMAN_ARALIK : {
        BIR_GUN : '1 Day',
        UC_GUN : '3 Day',
        BIR_HAFTA : '1 Week',
        IKI_HAFTA : '2 Week',
        BIR_AY : '1 Month',
        IKI_AY : '2 Month',
        ALTI_AY : '6 Month',
        BIR_YIL : '1 Year',
      }
    },
    TAKIMIM : {
      CARD : {
        BEKLEYEN_IZIN_TALEPLERI : 'Pending Permission Requests',
        BEKLEYEN_FAZLA_MESAI_TALEPLERI : 'Pending Overtime Requests',
        GEC_KALMA_SAYISI : 'Number Of Delays',
        ERKEN_CIKMA_SAYISI : 'Number of Early Exits',
        GIRIS : 'Entry',
        CIKIS : 'Exit',
        MESAJ_GONDER : 'Send Message'
      }
    },

    ZIYARETCI_TALEPLERIM : {
      TABLE : {
        AD_SOYAD : 'Full Name',
        FIRMA : 'Company',
        GIRIS_TARIHI : 'Entry Date',
        CIKIS_TARIHI : 'Exit Date',
        ZIYARET_NEDENI : 'Reason For Visit',
        DURUM : 'State'
      }
    },

    PROFIL_DASHBOARD : {
      GIRIS_TARIHI : 'Entry Date',
      TALEP_OLUSTUR : 'Create Request',
      IZIN : 'Vacation',
      FAZLA_MESAI : 'Overtime',
      ZIYARETCI : 'Visitors',
      EGITIM : 'Education',
      ARAC : 'Vehicle',
      AVANS : 'Advance Payment',
      MALZEME_ENVANTER : 'Material/Inventory',
      SERVIS : 'Shuttle Service',
      KIDEM : 'Seniority',
      IZIN_HAKKI : 'Vacation Rights',
      KULLANILAN_IZIN : 'Used Vacation',
      DEVIR : 'Transfer',
      KALAN : 'Remaining'
    },
     
    USER_INNER : {
      ACCOUNT_SETTINGS : 'Account Settings',
      LANGUAGE : 'Language',
      MY_PROJECT : 'My Project',
      MY_PROFILE : 'My Profile'
    },

    TOASTR_MESSAGE : {
      BASARILI : 'SUCCESS',
      HATA : 'ERROR',
      UYARI : 'WARNING',
      BILGI : 'INFO',
      TALEP_GONDERILDI : 'Overtime Request Sended',
      TALEP_IPTAL_EDILDI : 'Your Demand Cancelled',
      SUREC_BULUNAMADI : 'No Process Found to Display',
      TALEP_ONAYLANDI : 'Demand Comfirmed',
      ISARETLEME_YAPMALISINIZ : 'You Must Markup'
    },

    PROFILE_WIDGETS : {
      BIRTHDAY : {
        BUGUN_DOGANLAR : 'Those Born Today',
        BU_HAFTA_DOGANLAR : 'Those Born This Week',
        BU_AY_DOGANLAR : 'Those Born This Month',
        IYIKI_DOGDUN : 'Happy Birthday ',
        DOGUM_MESAJ : 'Hello {{value1}}, we wish you a happy birthday and a joyful life with your loved ones.',
        TUM_DOGUM_GUNLERI : 'All Birthdays'
      },

      KIDEM : {
        KIDEMLILER : 'Seniors',
        MESAJ : 'Happy {{value1}}. Year',
        TEBRIKLER : 'Congratulations'
      },

      NEW_PERSON : {
        HEADER : 'New Persons',
        TUM_YENILER : 'All New Persons',
        HOSGELDIN : 'Welcome',
        MESAJ : 'Welcome Among Us'
      },

      DUYURULAR : {
        HEADER : 'Announcements',
        TUM_DUYURULAR : 'All Announcements'
      },

      DOSYALARIM : {
        HEADER : 'My Files',
        YUKLE : 'Upload',
        KAYDET : 'Save',
        IPTAL : 'Cancel'
      },

      ANKET : {
        HEADER : 'Surveys',
        EVET : 'Yes',
        HAYIR : 'No',
        ANKET_OLUSTUR : 'Create Survey',
        TUM_ANKETLER : 'All Surveys'
      },

      SHARRED : {
        TUMU : 'All',
        ISIM_SOYISIM : 'Name Surname',
        DOGUM_TARIHI : 'Birth Date',
        BASLANGIC_TARIHI : 'Start Date',
        BOLUM : 'Department',
        KIDEM : 'Seniority',
        TARIH : 'Date'
      }
    }
  }
};
