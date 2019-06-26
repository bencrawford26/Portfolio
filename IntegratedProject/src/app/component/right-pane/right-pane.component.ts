import { Component, OnInit, ViewChild, ViewChildren, ElementRef, AfterViewInit, QueryList, Input, animate, keyframes, style, trigger, transition, state } from '@angular/core';
import { DataTransferService } from '../../service/data-transfer/data-transfer.service';
import { TimelineService } from '../../service/timeline/timeline.service';
import { LangService } from '../../service/lang/lang.service';
import { EventService } from '../../service/event/event.service';
import { AttachmentService } from '../../service/attachment/attachment.service';
import { FeedbackComponent } from '../../component/feedback/feedback.component';
import { MatSnackBar } from '@angular/material';

import { DialogCreateEventComponent } from '../../component/dialog-create-event/dialog-create-event.component';
import { DialogConfirmComponent } from '../../component/dialog-confirm/dialog-confirm.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { stringify } from 'querystring';
import { tryParse } from 'selenium-webdriver/http';

import { TimelineListItem } from '../../interface/timeline-list-item'

@Component({
  selector: 'app-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['./right-pane.component.scss'],
  animations: []
})
export class RightPaneComponent implements OnInit {

  eventToolsExpanded: boolean = false;
  
  constructor(
    public DataTransferService:DataTransferService, 
    private AttachmentService:AttachmentService, 
    private TimelineService:TimelineService,
    private EventService:EventService,
    public LangService: LangService,
    public feedback: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  public eventSearch: string;
  public timelineLoading: boolean = false;
  @Input() timelineId;

  ngOnInit(){
    if (this.DataTransferService.activeTimelines[this.timelineId].TimelineEvents.length == 0) { // if timeline has no events
      setTimeout(()=>{// small delay so event dialog doesnt pop up instantly
        this.openEventDialog();
      }, 350);
    }
  }

  stopPropagation(e){
    e.stopPropagation();
  }

  // event dialog box code
  openEventDialog() {
    let dialogRef = this.dialog.open(DialogCreateEventComponent, {
      width: '800px',
      data: { clickedEvent:null, existingValues:null, timelineId:this.timelineId, parentId:null }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(typeof result != 'undefined' && result.result == 'create') {

        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackCreatingEvent,progress:true}});

        let newEvent = {
          Description: result.description,
          EventDateTime: result.dateTime,
          Id: null,
          LinkedTimelineEventIds: [],
          LocationLat: result.lat,
          LocationLng: result.lng,
          Severity: result.severity,
          Tags: result.tags,
          Title: result.title,
        }

        this.EventService.createEvent(
          newEvent,'0','0','0'
        ).subscribe(
          (data)=>{
            console.log(data);
            let eventResponseObject = data;
            this.TimelineService.linkEvent(this.timelineId, eventResponseObject.Id).subscribe(
              (data)=>{
                newEvent.Id = eventResponseObject['Id'];
                newEvent['Attachments'] = [];
                this.DataTransferService.addTimelineEvent(this.timelineId, newEvent);

                this.timelineLoading = false;
                console.log(this.timelineId)
                this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackEventCreated,progress:false}, duration:3500});
                    
              },
              (error)=>{
                this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackTlLinkFail,progress:false}, duration:3500});
              }
            )

          },
          (error)=>{
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackCreateEventFail,progress:false}, duration:3500});
          }
        )
      }
    });
  }
}