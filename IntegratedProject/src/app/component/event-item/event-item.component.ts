import { Component, OnInit, Input, ViewChild, ViewChildren, ElementRef, Output } from '@angular/core';
import { trigger, state, transition, animate, style, keyframes } from '@angular/animations';
import { DataTransferService } from '../../service/data-transfer/data-transfer.service';
import { EventService } from '../../service/event/event.service';
import { TimelineService } from '../../service/timeline/timeline.service';
import { LangService } from '../../service/lang/lang.service'
import { AttachmentService } from '../../service/attachment/attachment.service';
import { MatSnackBar } from '@angular/material';
import { FeedbackComponent } from '../../component/feedback/feedback.component';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { DialogCreateEventComponent } from '../../component/dialog-create-event/dialog-create-event.component';
import { DialogConfirmComponent } from '../../component/dialog-confirm/dialog-confirm.component';
import { DialogUploadComponent } from '../../component/dialog-upload/dialog-upload.component';
import { DialogTextInputComponent } from '../../component/dialog-text-input/dialog-text-input.component';
import { DialogAttachPreviewComponent } from '../../component/dialog-attach-preview/dialog-attach-preview.component';
import { DialogDownloadComponent } from '../../component/dialog-download/dialog-download.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTable } from '@angular/material';
import { MatTableDataSource } from '@angular/material';
import { Observable } from 'rxjs/Rx';

import { Attachment } from '../../interface/attachment'
import { EventEmitter } from 'events';
import { tryParse } from 'selenium-webdriver/http';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
  animations: [
    trigger('appearDisappear', [
      transition(':enter', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
          style({minHeight: '0px', overflow: 'hidden',  height: '0px'}),
          style({minHeight: '*', overflow: 'visible',  height: '*'}),
        ]))
      ])
    ])
  ]
})
export class EventItemComponent implements OnInit {

  @ViewChild('mapElement') mapElement;
  @Input() event;
  @Input() timelineId;
  @Input() editTabVisible: boolean;
  @Input() mapTabVisible: boolean;
  @ViewChild(MatTable) tableElement: MatTable<0>

  displayedColumns = ['select', 'title', 'type'];
  ELEMENT_DATA: Attachment[] = [];
  dataSource = new MatTableDataSource<Attachment>(this.ELEMENT_DATA);
  selection = new SelectionModel<Attachment>(true, []);
  public mapStyles = [];

  constructor(
    public DataTransferService:DataTransferService,
    private dialog: MatDialog,
    private TimelineService:TimelineService,
    private EventService:EventService,
    private AttachmentService:AttachmentService,
    public feedback: MatSnackBar, 
    public LangService: LangService,
  ) {}
  
  ngOnInit() {

    this.DataTransferService.currentTheme.subscribe(
      (data)=>{
        if(data == 'pink-bluegrey' || data == 'purple-green'){
          this.mapStyles = darkstyles;
        }else{
          this.mapStyles = [];
        }
      }
    )

    // build the data for the file table once timeline data is set
    var refreshIntervalId = setInterval(()=>{
      if(typeof this.event != 'undefined') {
        clearInterval(refreshIntervalId);
        if(typeof this.event.Attachments != 'undefined'){
          this.event.Attachments.forEach((element) => {

            const lastSpaceIndex = element.Title.lastIndexOf('.');
            const type = element.Title.substr(lastSpaceIndex+1)

            const newTableRow = {
              Id: element.Id,
              Title: element.Title,
              TimelineEventId: element.TimelineEventId,
              Type: type
            };
            this.ELEMENT_DATA.unshift(newTableRow);
          });
          this.tableElement.renderRows();
        }
      }
    }, 1000);
  
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  // add and edit event dialog
  openEventDialog(existingValues) {
    let parentId;
    if(!existingValues){
      parentId = this.event.Id;
    } else{
      parentId = this.event.LinkedTimelineEventIds[0];
    }
    let dialogRef = this.dialog.open(DialogCreateEventComponent, {
      width: '800px',
      data: { clickedEvent:this.event, existingValues:existingValues, timelineId:this.timelineId, parentId:parentId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(typeof result != 'undefined' && result.result == 'create') {
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackCreatingEvent,progress:true}});

        let newEvent = {
          Attachments: [],
          Description: result.description,
          EventDateTime: result.dateTime,
          Id: null,
          LinkedTimelineEventIds: [this.event.Id],
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

            let eventResponseObject = data;
            this.TimelineService.linkEvent(this.timelineId, data.Id).subscribe(
              (data)=>{
                this.DataTransferService.addTimelineEvent(this.timelineId, newEvent);
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
      }else if(typeof result != 'undefined' && result.result == 'update'){

        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackEditingEvent,progress:true}});
        let updatedEvent = {
          Description: result.description,
          EventDateTime: result.dateTime,
          Id: this.event.Id,
          LinkedTimelineEventIds: [this.event.LinkedTimelineEventIds[0]],
          LocationLat: result.lat,
          LocationLng: result.lng,
          Severity: result.severity,
          Tags: result.tags,
          Title: result.title,
        }

        console.log(updatedEvent);

        this.EventService.editEventTitle(this.event.Id, JSON.stringify(updatedEvent)).subscribe(
          (data)=>{
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackEditedEvent,progress:false}, duration:3500});
            this.event.Title = result.title;
            this.event.Description = result.description;
            this.event.LocationLat = result.lat;
            this.event.LocationLng = result.lng;
            this.event.EventDateTime = result.dateTime;
            this.event.Severity = result.severity;
            this.event.Tags = result.tags;
          },
          (error)=>{
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackEditEventErr,progress:false}, duration:3500});
          }
        );
        
      }
    });
  }

  // edit file title dialog code
  openEditFileDialog(dialogTitle, fileName) {
    
    const lastDotIndex = fileName.lastIndexOf('.');
    const type = fileName.substr(lastDotIndex+1)
    fileName = fileName.substr(0,lastDotIndex)

    let dialogRef = this.dialog.open(DialogTextInputComponent, {
      width: '400px',
      disableClose: true,
      data: {dialogTitle: dialogTitle, existingText: fileName, suffix: '.'+type}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(typeof result != 'undefined' && result.confirm) {// if result not undefined and files in return array then add them to the table
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.textInEditingFile + result.text,progress:true}});
        this.AttachmentService.editTitle(this.selection.selected[0].Id, result.text).subscribe(
          (data)=>{
            for (let i=this.ELEMENT_DATA.length-1; i>=0; i--) {// update attachment title in the table
              if (this.ELEMENT_DATA[i].Id === this.selection.selected[0].Id) {
                this.ELEMENT_DATA[i].Title = result.text;
                break; // stop loop once found element
              }
            }
            for (let i=this.event.Attachments.length-1; i>=0; i--) {// update attachment title 
              if (this.event.Attachments[i].Id === this.selection.selected[0].Id) {
                this.event.Attachments[i].Title = result.text;
                this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackFileNameChanged + result.text,progress:false}, duration: 3500});
                break; // stop loop once found attachment
              }
            }
            this.selection.clear();
            this.tableElement.renderRows();
          },
          (error)=>{
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackFileNameChangedErr,progress:false}, duration: 3500});
          }
        )
      }
    })
  }

  // confirm file delete dialog box code
  openConfirmDialogFile(selectionArr) {
    let dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '400px',
      data: {question:this.LangService.activeLanguage.confirmDeleteFiles}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(selectionArr)
      if(result == 'confirm'){

        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackDeletingFiles,progress:true}});

        // if confirm dialog loop through each selected file and delete them
        let deleteObservArr = []
        for (let index = 0; index < selectionArr.length; index++) {
          deleteObservArr.push(this.AttachmentService.deleteAttachment(selectionArr[index].Id));
        }

        Observable.forkJoin(deleteObservArr).subscribe(
          (data)=>{

            for (let index = 0; index < selectionArr.length; index++) {
              for (let i=this.ELEMENT_DATA.length-1; i>=0; i--) {
                if (this.ELEMENT_DATA[i].Id === selectionArr[index].Id) {
                  this.ELEMENT_DATA.splice(i, 1);
                  break; // stop loop once found element
                }
              }
            }
            for (let index = 0; index < selectionArr.length; index++) {
              for (let i=this.event.Attachments.length-1; i>=0; i--) {
                if (this.event.Attachments[i].Id === selectionArr[index].Id) {
                  this.event.Attachments.splice(i, 1);
                  break; // stop loop once found element
                }
              }
            }
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackFilesDeleted,progress:false}, duration: 3500});

          },
          (error)=>{
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackDeleteFilesErr,progress:false}});
          },
          ()=>{
            this.selection.clear();
            this.tableElement.renderRows();
          }
        )

      }
    })
  }

  // confirm dialog box code
  openConfirmDialogEvent(data) {
    let idList = this.getIdList(this.event.Id); //list of all event ids below event to be deleted with event ot be delted in position 0
    let question = this.LangService.activeLanguage.confirmDeleteEvent
    if(idList.length > 1){ // if event has children change question
      question = "Delete this event only or this event and children?"
    }

    let dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '400px',
      data: {
        question:question,
        eventWithChildren:idList.length-1
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      idList = this.getIdList(this.event.Id)//get ids again just incase something changed
      if(result == 'confirm'){
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackDeletingEvents,progress:true}});

        let eventDeleteObservArr = []

        for (let index = 0; index < idList.length; index++) {
          const eventId = idList[index];
          console.log(eventId)
          eventDeleteObservArr.push(this.TimelineService.unlinkEvent(this.timelineId, eventId));
          eventDeleteObservArr.push(this.EventService.deleteEvent(eventId));
        }
        Observable.forkJoin(eventDeleteObservArr).subscribe(
          (data)=>{
            idList.forEach((eventIdToDel) => {
              this.DataTransferService.deleteTimelineEvent(this.timelineId, eventIdToDel);
            });
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackEventsDeleted,progress:false}, duration:3500});
          },
          (error)=>{
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackDeleteEventErr,progress:false}, duration:3500});
          }
        );
        
      }else if(result == 'deleteEvent'){
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackDeletingEvents,progress:true}});

        let parentEventId = this.event.LinkedTimelineEventIds[0]
        idList.splice(0,1);//remove clicked event

        // find events one lvl below event being deleted and create observables to update links
        let eventsObservArr = []
        for (let index = 0; index < this.DataTransferService.activeTimelines[this.timelineId].TimelineEvents.length; index++) {
          let childEvent = JSON.parse(JSON.stringify(this.DataTransferService.activeTimelines[this.timelineId].TimelineEvents[index])); //make copy of event
          if(childEvent.LinkedTimelineEventIds[0] == this.event.Id){
            childEvent.LinkedTimelineEventIds[0] = parentEventId;
            eventsObservArr.push(this.EventService.editEventTitle(childEvent.Id, JSON.stringify(childEvent)));
          }
        }

        eventsObservArr.push(this.TimelineService.unlinkEvent(this.timelineId, this.event.Id));
        eventsObservArr.push(this.EventService.deleteEvent(this.event.Id));

        Observable.forkJoin(eventsObservArr).subscribe(
          (data)=>{

            // now have success feedback can edit the actual event and not the copy
            for (let index = 0; index < this.DataTransferService.activeTimelines[this.timelineId].TimelineEvents.length; index++) {
              const childEvent = this.DataTransferService.activeTimelines[this.timelineId].TimelineEvents[index];
              if(childEvent.LinkedTimelineEventIds[0] == this.event.Id){
                childEvent.LinkedTimelineEventIds[0] = parentEventId;
                this.DataTransferService.addTimelineEvent(this.timelineId, childEvent);
              }
            }
            this.DataTransferService.deleteTimelineEvent(this.timelineId, this.event.Id);
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackEventsDeleted,progress:false}, duration:3500});

          },
          (error)=>{
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackDeleteEventErr,progress:false}, duration:3500});
          }
        );

      }
    })
  }

  getIdList(searchEventId){
    let childFound = false;
    let idList = [searchEventId];
    do{
      childFound = false;
      for (let index = 0; index < this.DataTransferService.activeTimelines[this.timelineId].TimelineEvents.length; index++) {
        const event = this.DataTransferService.activeTimelines[this.timelineId].TimelineEvents[index];
        if(idList.includes(event.LinkedTimelineEventIds[0]) && !idList.includes(event.Id)){
          childFound = true;
          idList.push(event.Id);
        }
      }
    }while(childFound)
    return idList;
  }

  // preview attachment dialog box code
  openPreviewDialog(clickedRow) {
    let dialogRef = this.dialog.open(DialogAttachPreviewComponent, {
      width: '900px',
      data: {
        start: clickedRow,
        fileList: this.ELEMENT_DATA
      }
    });
  }

  // upload dialog code
  openUploadDialog() {
    let dialogRef = this.dialog.open(DialogUploadComponent, {
      width: '800px',
      disableClose: true,
      data: this.event
    });
    dialogRef.afterClosed().subscribe(result => {
      if(typeof result != 'undefined' && result.length > 0) {// if result not undefined and files in return array then add them to the table
        for (let index = 0; index < result.length; index++) {
          this.selection.clear();
          this.event.Attachments.unshift(result[index])
          this.ELEMENT_DATA.unshift(result[index]);
          this.tableElement.renderRows();
          this.selection.clear()
        }
      }
    })
  }

  openDownloadDialog() {
    let dialogRef = this.dialog.open(DialogDownloadComponent, {
      width: '800px',
      disableClose: true,
      data: {
        selectedFiles: this.selection.selected
      }
    });
  }

  tryResize(e){
    try { // suppress error if map resize fails
      (this.mapTabVisible && this.event.LocationLng != 'null')?this.mapElement.triggerResize():null;
    } catch (error) {
      null;
    }
  }

  beginMove() {
    this.DataTransferService.moveData.moveActive = true;
    this.DataTransferService.moveData.idList = this.getIdList(this.event.Id);
    this.DataTransferService.moveData.event = this.event;
    this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.eventMovePt1 + this.event.Title + this.LangService.activeLanguage.eventMovePt2,progress:false}});
    console.log(this.DataTransferService.moveData);
  }

  stopPropagation(e){
    e.stopPropagation();
  }

}

let darkstyles = [
  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
  {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{color: '#263c3f'}]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{color: '#6b9a76'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{color: '#38414e'}]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{color: '#212a37'}]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{color: '#9ca5b3'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{color: '#746855'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{color: '#1f2835'}]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{color: '#f3d19c'}]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{color: '#2f3948'}]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{color: '#d59563'}]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{color: '#17263c'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{color: '#515c6d'}]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{color: '#17263c'}]
  }
]