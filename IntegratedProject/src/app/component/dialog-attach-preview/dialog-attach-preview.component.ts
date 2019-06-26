import { Component, OnInit, Inject, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AttachmentService } from '../../service/attachment/attachment.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { MatSnackBar } from '@angular/material';
import { FeedbackComponent } from '../../component/feedback/feedback.component';
import { LangService } from '../../service/lang/lang.service'

import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-attach-preview',
  templateUrl: './dialog-attach-preview.component.html',
  styleUrls: ['./dialog-attach-preview.component.scss']
})
export class DialogAttachPreviewComponent implements OnInit, OnDestroy {

  public startIndex: number;
  public downloadObs = [];
  public getUrlsObs;

  constructor(
    public thisDialogRef: MatDialogRef<DialogAttachPreviewComponent>, 
    @Inject(MAT_DIALOG_DATA) public data,
    public AttachmentService:AttachmentService,
    public DomSanitizer:DomSanitizer,
    public feedback: MatSnackBar,
    public LangService: LangService,
  ) { }

  ngOnInit() {

    //get start index based on file clicked
    this.startIndex = this.data.fileList.findIndex((element)=>{
      return element['Id'] == this.data.start.Id;
    });

    let observArr  = [];
    for (let index = 0; index < this.data.fileList.length; index++) {
      const attachment = this.data.fileList[index];
      this.data.fileList[index].progress = 0;
      this.data.fileList[index].blob = null;
      this.data.fileList[index].url = null;
      observArr.push(this.AttachmentService.genGetSignedUrl(attachment.Id));
    }
    
    this.getUrlsObs = Observable.forkJoin(observArr).subscribe(
      (data)=>{
        for (let index = 0; index < data.length; index++) {
          if(this.data.fileList[index].Type == 'doc'){
            var encodedUrl = encodeURIComponent(data[index].toString());
            this.data.fileList[index].link = this.DomSanitizer.bypassSecurityTrustResourceUrl('https://view.officeapps.live.com/op/view.aspx?src=' + encodedUrl);
          }else{
            this.data.fileList[index].link = data[index];
          }

        }
        
      },
      (error)=>{
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.attachFail,progress:false}, duration:3500});
      }
    )

    Observable.forkJoin(observArr).subscribe(
      (attachRespArr)=>{

        for (let index = 0; index < attachRespArr.length; index++) {

          if(this.data.fileList[index].Type == 'doc'){
            var encodedUrl = encodeURIComponent(attachRespArr[index].toString());
            this.data.fileList[index].url = this.DomSanitizer.bypassSecurityTrustResourceUrl('https://view.officeapps.live.com/op/view.aspx?src=' + encodedUrl);
          }else{

            const dlUrl = attachRespArr[index];
            

            this.downloadObs.push(
              this.AttachmentService.downloadAttach(dlUrl.toString()).subscribe(
              
                (event) => {
                  if (event.type === HttpEventType.DownloadProgress) {
                    this.data.fileList[index].progress = Math.round(100 * event.loaded / event.total);
                    //console.log(Math.round(100 * event.loaded / event.total));
                  } else if (event instanceof HttpResponse) {

                    let blob = new Blob([event.body]);
                    this.data.fileList[index].url = this.DomSanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));

                  }else if(event['ok'] == false ){
                    this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.attachFail,progress:false}, duration:3500});
                  }
                }

              )
            );
          }
          
        }

      }
    )
    //testing

  }

  getFileSrc(aid) {
    this.AttachmentService.genGetSignedUrl(aid).first().subscribe(
      (data)=>{
        return data;
      },
      (error)=>{
        return null;
      }
    )
  }

  ngOnDestroy() {
    this.getUrlsObs.unsubscribe();
    this.downloadObs.forEach(element => {
      element.unsubscribe();
    });
  }

}
