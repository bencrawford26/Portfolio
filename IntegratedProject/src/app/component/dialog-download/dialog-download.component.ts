import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AttachmentService } from '../../service/attachment/attachment.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { LangService } from '../../service/lang/lang.service'
import { MatSnackBar } from '@angular/material';
import { FeedbackComponent } from '../../component/feedback/feedback.component';

@Component({
  selector: 'app-dialog-download',
  templateUrl: './dialog-download.component.html',
  styleUrls: ['./dialog-download.component.scss']
})
export class DialogDownloadComponent implements OnInit, OnDestroy {

  public fileList: any;

  public downloadObs = [];
  public getUrlsObs;

  constructor(
    public thisDialogRef: MatDialogRef<DialogDownloadComponent>, 
    @Inject(MAT_DIALOG_DATA) public data,
    private AttachmentService:AttachmentService,
    public LangService: LangService,
    public feedback: MatSnackBar,
  ) { }

  ngOnInit() {
    this.fileList = this.data.selectedFiles
    this.downloadFiles();
  }

  public finished: boolean = false; // turns to true once all downloads have finished

  public totalProg: number = 0;
  public totalLoaded: number = 0;
  public totalToLoad: number = 0;

  public timeLeft: string = '';
  public downSpeed: number = 0;

  // down speed arr used to get average downspeed for more accurate time prediction
  public downSpeedArr = [];
  public secondsElapsed = 0;
  trackProgress(){
    let prevLoaded = 0;

    let progressInterval = setInterval(()=>{
      this.secondsElapsed++;
      let allDone = true;

      // if arr greater than 10 in length cut first value to keep accuracy
      (this.downSpeedArr.length > 10)?  this.downSpeedArr.shift():null;

      this.downSpeedArr.push(this.totalLoaded - prevLoaded);
      let totalDownspeedArr = 0
      for (let index = 0; index < this.downSpeedArr.length; index++) {
        totalDownspeedArr += this.downSpeedArr[index];
      }

      for (let index = 0; index < this.fileList.length; index++) { 
        if(this.fileList[index].Status == 0){allDone = false}
      }

      this.downSpeed = totalDownspeedArr/this.downSpeedArr.length;
      let remainingData = this.totalToLoad - this.totalLoaded;

      (this.downSpeed>0) ? this.timeLeft = ": "+(remainingData/this.downSpeed).toFixed(0)+"s": this.timeLeft='';

      prevLoaded = this.totalLoaded;

      if(allDone){// if all done clear the interval
        clearInterval(progressInterval);
        this.finished = true;
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:"All files have finished downloading",progress:false}, duration:3500});
      }
    }, 1000);
  }

  downloadFiles(){

    this.totalProg = 0;
    let attachObsArr = [];

    for (let index = 0; index < this.fileList.length; index++) {
      const attachId = this.fileList[index].Id;
      attachObsArr.push(this.AttachmentService.genGetSignedUrl(attachId));
      this.fileList[index].progress = 0;
      this.fileList[index].Total = 0;
      this.fileList[index].Loaded = 0;
      this.fileList[index].Status = 0; // 1 = done, 2 = error
    }

    this.getUrlsObs = Observable.forkJoin(attachObsArr).subscribe(
      (attachRespArr)=>{
        this.trackProgress();// once have links ot files start tracking progress

        for (let index = 0; index < attachRespArr.length; index++) {
          const dlUrl = attachRespArr[index];

          this.downloadObs.push(
            this.AttachmentService.downloadAttach(dlUrl.toString()).subscribe(
              
              (event) => {
                if (event.type === HttpEventType.DownloadProgress) {

                  this.fileList[index].Loaded = (event.loaded/1024)/1024 ;
                  this.fileList[index].Total = (event.total/1024)/1024;
                  this.fileList[index].progress = Math.round(100 * event.loaded / event.total);

                  let sum = 0;

                  this.totalToLoad = 0;
                  this.totalLoaded = 0;
                  for (let index = 0; index < this.fileList.length; index++) { 
                    this.totalLoaded += this.fileList[index].Loaded;
                    if(this.fileList[index].Status != 2){ // dont include error files
                      this.totalToLoad += this.fileList[index].Total;
                    }
                    this.totalProg = Math.round(100 * this.totalLoaded / this.totalToLoad);
                  }

                } else if (event instanceof HttpResponse) {
                  this.fileList[index].Status = 1; // 1 status meens succesfuly complete
                  let blob = new Blob([event.body]);
                  let url = window.URL.createObjectURL(blob);
                  let a = document.createElement("a");
                  a.style.display = 'none';  
                  document.body.appendChild(a);
                  a.href = url;
                  a.download = this.fileList[index].Title;
                  a.click();
                  setTimeout(()=>{
                    window.URL.revokeObjectURL(url);
                  }, 100); 

                }else if(event['ok'] == false ){
                  this.fileList[index].Status = 2; // 2 status meens error
                  this.feedback.openFromComponent(FeedbackComponent, {data: {msg:"There was an error downloading one or more files, check connection and try again",progress:false}, duration:3500});
                }
              }

            )
          )
          
        }
      },
      (error)=>{
        console.log(error);
      }
    )

  }

  public areSureQuestion: boolean = false;
  onClose() {
    if(this.areSureQuestion || this.finished) {
      this.thisDialogRef.close();
    }else{
      this.areSureQuestion = true;
    }
  }

  ngOnDestroy(){
    this.getUrlsObs.unsubscribe();
    this.downloadObs.forEach(element => {
      element.unsubscribe();
    });
  }

}
