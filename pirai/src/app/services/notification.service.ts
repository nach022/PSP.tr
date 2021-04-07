import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GlobalConstants } from '../common/global.constants';


@Injectable({
  providedIn: 'root',
})

export class NotificationService {

  constructor(private toastr: ToastrService, private snackBar: MatSnackBar) { }

  clear() {
    this.toastr.clear();
  }


  error(message: string) {
    this.toastr.error(message, '', {
      disableTimeOut: true
    });
  }

  warning(message: string) {
    this.toastr.warning(message, '', {
      disableTimeOut: true
    });
  }

  info(message: string) {
    this.snackBar.open(message, '', {
      duration: GlobalConstants.APP_NOTIF_DURATION,
    });
  }

  success(message: string) {
    this.toastr.success(message, '');
  }

}
