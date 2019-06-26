import { Component, OnInit } from '@angular/core';
import { DataTransferService } from '../../service/data-transfer/data-transfer.service'
import { LangService } from '../../service/lang/lang.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogConfirmComponent } from '../../component/dialog-confirm/dialog-confirm.component';
import { FeedbackComponent } from '../../component/feedback/feedback.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-identity-bar',
  templateUrl: './identity-bar.component.html',
  styleUrls: ['./identity-bar.component.scss']
})

export class IdentityBarComponent implements OnInit {

  fullScreenActive: boolean = false;
  htmlTag = document.getElementById('html-tag');
  
  constructor(
    public DataTransferService:DataTransferService,
    public dialog: MatDialog, 
    public LangService:LangService,
    public feedback: MatSnackBar
  ) { }

  ngOnInit() {}

  toggleFullScreen() {

    this.fullScreenActive = !this.fullScreenActive;
    if(!this.fullScreenActive){
      if(document.webkitExitFullscreen){
        document.webkitExitFullscreen();
      }else if (document['mozCancelFullScreen']) {
        document['mozCancelFullScreen']();
      } else if(document.exitFullscreen){
        document.exitFullscreen();
      }

    }else{
      if(this.htmlTag.webkitRequestFullscreen){
        this.htmlTag.webkitRequestFullscreen();
      }else if (this.htmlTag['mozRequestFullScreen']) {
        this.htmlTag['mozRequestFullScreen']();
      } else if(this.htmlTag.requestFullscreen){
        this.htmlTag.requestFullscreen();
      }
    }
  }

  resetAppConfirm() {
    let dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '400px',
      data: {question:this.LangService.activeLanguage.identityResetAppQ}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'confirm'){

        this.DataTransferService.activeTimelineKeys = [];
        this.DataTransferService.activeTimelines = [];
        this.DataTransferService.timelineRegisterVisibleSource.next(true);
        this.DataTransferService.moveData.moveActive = false;

        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.identityAppReset,progress:false}, duration:3500});

      }
    })
  }

}