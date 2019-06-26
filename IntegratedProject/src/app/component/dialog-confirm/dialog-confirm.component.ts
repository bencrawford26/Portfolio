import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LangService } from '../../service/lang/lang.service'

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {

  otherTheme: boolean = false;

  constructor(
    public thisDialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public LangService: LangService,
  ) {}

  ngOnInit() {}

  onCloseConfirm(result) {
    this.thisDialogRef.close(result);
  }

  onCloseCancel() {
    this.thisDialogRef.close('cancel');
  }

}
