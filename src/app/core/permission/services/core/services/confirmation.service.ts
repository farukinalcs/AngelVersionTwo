import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  constructor() {}

  /** Silme gibi riskli işler için */
  confirmDelete(itemName: string, title?: string) {
    return Swal.fire({
      title: title ? title : `Seçilen "${itemName}" kaldırılsın mı?`,
      icon: 'warning',
      iconColor: '#ed1b24',
      showCancelButton: true,
      confirmButtonColor: '#ed1b24',
      cancelButtonColor: '#6c757d',
      cancelButtonText: 'Hayır',
      confirmButtonText: 'Evet',
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false,
      customClass: {
        popup: 'swal-on-top',
      },
    });
  }

  confirmWarning(message: string, title?: string) {
  return Swal.fire({
    title: title ?? 'Uyarı',
    text: message,
    icon: 'warning',
    iconColor: '#ed1b24',
    showCancelButton: true,
    confirmButtonColor: '#ed1b24',
    cancelButtonColor: '#6c757d',
    cancelButtonText: 'Hayır',
    confirmButtonText: 'Evet',
    allowOutsideClick: false,
    allowEscapeKey: false,
    heightAuto: false,
    customClass: {
      popup: 'swal-on-top',
    },
  });
}

  /** Genel onay için (pozitif) */
  confirmAction(message: string, title?: string) {
    return Swal.fire({
      title: title ? title : 'Onay',
      text: message,
      icon: 'question',
      iconColor: '#28a745',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      cancelButtonText: 'İptal',
      confirmButtonText: 'Tamam',
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false,
      customClass: {
        popup: 'swal-on-top',
      },
    });
  }

  success(message: string) {
    return Swal.fire({
      title: message,
      icon: 'success',
      iconColor: '#28a745', // yeşil
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Kapat',
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false,
      customClass: {
        popup: 'swal-on-top',
      },
    });
  }

  error(message: string) {
    return Swal.fire({
      title: message,
      icon: 'error',
      iconColor: '#ed1b24',
      confirmButtonColor: '#ed1b24',
      confirmButtonText: 'Kapat',
      allowOutsideClick: false,
      allowEscapeKey: false,
      heightAuto: false,
      customClass: {
        popup: 'swal-on-top',
      },
    });
  }
}
