import { Component, OnInit, Inject  } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LangService } from '../../service/lang/lang.service'

@Component({
  selector: 'app-dialog-create-timeline',
  templateUrl: './dialog-text-input.component.html',
  styleUrls: ['./dialog-text-input.component.scss']
})
export class DialogTextInputComponent implements OnInit {

  public existingText;
  public suffix;

  constructor(
    public thisDialogRef: MatDialogRef<DialogTextInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data, 
    private _formBuilder: FormBuilder,
    public LangService: LangService,
  ) {}

  ngOnInit() {
    this.existingText = this.data.existingText || '';
    this.suffix = this.data.suffix || '';
    this.firstFormGroup = this._formBuilder.group({
      textCtrl: [this.existingText, Validators.required]
    });
  }

  onCloseConfirm() {
    this.thisDialogRef.close({
      confirm: true,
      text: this.firstFormGroup.value.textCtrl+this.suffix
    });
  }

  onCloseCancel() {
    this.thisDialogRef.close({
      confirm: false,
      text: null
    });
  }

  //figure out what formgroups are
  firstFormGroup: FormGroup;

}
