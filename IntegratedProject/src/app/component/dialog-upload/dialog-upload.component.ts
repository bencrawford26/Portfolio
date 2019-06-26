import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AttachmentService } from '../../service/attachment/attachment.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { LangService } from '../../service/lang/lang.service';
import { MatSnackBar } from '@angular/material';
import { FeedbackComponent } from '../../component/feedback/feedback.component';

@Component({
  selector: 'app-dialog-upload',
  templateUrl: './dialog-upload.component.html',
  styleUrls: ['./dialog-upload.component.scss']
})
export class DialogUploadComponent implements OnInit, OnDestroy {


  public fileList: FileList;
  public repFileList: any = [];// properties cant be added to filelist objects so this copies the file list so prog props can be added

  private returnArr = [];
  public areSureQuestion: boolean = false;

  public obsArr = [];

  public fileError = false;

  constructor(
    public thisDialogRef: MatDialogRef<DialogUploadComponent>, 
    @Inject(MAT_DIALOG_DATA) public data,
    private AttachmentService:AttachmentService,
    public LangService: LangService,
    public feedback: MatSnackBar,
  ) { }

  ngOnInit() {}

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  fileInputChange(event){
    this.fileList = event.target.files;
    this.uploadFiles();
  }

  uploadFiles() {
    this.fileError = false;
    for (let index = 0; index < this.fileList.length; index++) {

      let extension = /(?:\.([^.]+))?$/.exec(this.fileList[index].name)[1];//regex used to get file extension
      (extension)?extension = extension.toLowerCase():null; // if file extension exists convert to lower case

      //check if file is msword or image
      if(
        (extension == 'jpg' || extension == 'jpeg' || extension == 'png' || extension == 'doc') &&
        (this.fileList[index].type == 'application/msword' || this.fileList[index].type == 'image/jpeg' || this.fileList[index].type == 'image/png') &&
        (this.fileList[index].type)
      ) {

      }else{
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:"One or more files are not of the correct type (png, jpg, doc)",progress:false}, duration:3500});
        this.fileError = true;
      }

    }

    if(!this.fileError) {
      for (let index = 0; index < this.fileList.length; index++) {

        let observArr = [];
        const guid = this.guid();

        this.repFileList[index] = {};
        this.repFileList[index].name = this.fileList[index].name.toLowerCase();
        this.repFileList[index].type = this.fileList[index].type;
        this.repFileList[index].file = this.fileList[index];
        this.repFileList[index].total = 0;
        this.repFileList[index].loaded = 0;
        this.repFileList[index].uploaded = 0;
        this.repFileList[index].status = 0;//0 = not started, 1= success, 2=error
        this.repFileList[index].progress = 0;
        observArr.push(this.AttachmentService.genUpSignedUrl(guid));
        observArr.push(this.AttachmentService.createAttachment(this.data.Id, guid, this.repFileList[index].name));
        this.obsArr.push(
          Observable.forkJoin(observArr).subscribe(
            (data)=>{
              if(index==0){this.trackProgress()}
              
              let signedUrl = data[0].toString();// index 0 holds the presigned url, index 1 holds created attachment response

              this.obsArr.push(
                this.AttachmentService.uploadAttach(signedUrl, this.repFileList[index].file, this.fileList[index].type).subscribe(
                  (event) => {
                    console.log("this.repFileList")
                    console.log(this.repFileList)
                    console.log("event")
                    console.log(event)
                    if (event.type === HttpEventType.UploadProgress) {
                      this.repFileList[index].loaded = (event.loaded/1024)/1024 ;
                      this.repFileList[index].total = (event.total/1024)/1024;
                      this.repFileList[index].progress = Math.round(100 * event.loaded / event.total);

                      this.totalToLoad = 0;
                      this.totalLoaded = 0;
                      for (let index = 0; index < this.fileList.length; index++) { 
                        this.totalLoaded += this.repFileList[index].loaded;
                        if(this.repFileList[index].status != 2){ // dont include error files
                          this.totalToLoad += this.repFileList[index].total;
                        }
                        this.totalProg = Math.round(100 * this.totalLoaded / this.totalToLoad);
                      }
                      // This is an upload progress event. Compute and show the % done:
                      this.repFileList[index].progress = Math.round(100 * event.loaded / event.total);
                    } else if (event instanceof HttpResponse) {
        
                      this.repFileList[index].status = 1;
                      // push completed file into the return array so they can be inserted into the event file table
                      const lastSpaceIndex = this.repFileList[index].name.lastIndexOf('.');
                      const type = this.repFileList[index].name.substr(lastSpaceIndex+1)
                      this.returnArr.push({
                        Id: guid,
                        Title: this.repFileList[index].name,
                        TimelineEventId: this.data.Id,
                        Type: type
                      })
        
                    }else if(event['ok'] == false ){
                      this.repFileList[index].status = 2;
                      this.feedback.openFromComponent(FeedbackComponent, {data: {msg:"There was an error uploading one or more files, check connection and try again",progress:false}, duration:3500});
                    }
                  }
                )
              )
      
            },
            (error)=>{
              this.feedback.openFromComponent(FeedbackComponent, {data: {msg:"There was an error uploading one or more files, check connection and try again",progress:false}, duration:3500});
            }
          )
        )
      }
    }
      
    
  }

  public finished: boolean = false; // turns to true once all downloads have finished

  public totalProg: number = 0;
  public totalLoaded: number = 0;
  public totalToLoad: number = 0;

  public timeLeft: string = '';
  public upSpeed: number = 0;

  // down speed arr used to get average downspeed for more accurate time prediction
  public upSpeedArr = [];
  public secondsElapsed = 0;
  trackProgress(){
    let prevLoaded = 0;
    console.log(123);
    let progressInterval = setInterval(()=>{
      console.log(1234);
      this.secondsElapsed++;
      let allDone = true;

      // if arr greater than 10 in length cut first value to keep accuracy
      (this.upSpeedArr.length > 10)?  this.upSpeedArr.shift():null;

      this.upSpeedArr.push(this.totalLoaded - prevLoaded);
      let totalDownspeedArr = 0
      for (let index = 0; index < this.upSpeedArr.length; index++) {
        totalDownspeedArr += this.upSpeedArr[index];
      }

      for (let index = 0; index < this.repFileList.length; index++) { 
        if(this.repFileList[index].status == 0){allDone = false}
      }

      this.upSpeed = totalDownspeedArr/this.upSpeedArr.length;
      let remainingData = this.totalToLoad - this.totalLoaded;

      (this.upSpeed>0) ? this.timeLeft = ": "+(remainingData/this.upSpeed).toFixed(0)+"s": this.timeLeft='';

      prevLoaded = this.totalLoaded;

      if(allDone){// if all done clear the interval
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:"All files have finished uploading",progress:false}, duration:3500});
        clearInterval(progressInterval);
        this.finished = true;
      }
    }, 1000);
  }

  onClose() {
    if(this.areSureQuestion || this.finished || typeof this.fileList == 'undefined') {
      this.thisDialogRef.close(this.returnArr);
    }else{
      this.areSureQuestion = true;
    }
  }

  ngOnDestroy() {
    this.obsArr.forEach(element => {
      element.unsubscribe();
    });
  }

}
