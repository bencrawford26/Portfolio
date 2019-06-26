import { Component, Input, ViewChild, ViewChildren, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, transition, animate, style, keyframes } from '@angular/animations';
import { DataTransferService } from '../../service/data-transfer/data-transfer.service';
import { EventService } from '../../service/event/event.service';
import { TimelineService } from '../../service/timeline/timeline.service';
import { AttachmentService } from '../../service/attachment/attachment.service';
import { MatSnackBar } from '@angular/material';
import { FeedbackComponent } from '../../component/feedback/feedback.component';
import { SelectionModel } from '@angular/cdk/collections';
import { LangService } from '../../service/lang/lang.service'

import { DialogCreateEventComponent } from '../../component/dialog-create-event/dialog-create-event.component';
import { DialogConfirmComponent } from '../../component/dialog-confirm/dialog-confirm.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Rx';

import { HttpEventType,HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-tree-part',
  templateUrl: './tree-part.component.html',
  styleUrls: ['./tree-part.component.scss']
})
export class TreePartComponent implements OnInit, OnDestroy  {

  @Input() timelineId;
  @Input() componentEvent;
  public childEvents = [];
  public panelOpenState;
  public deleteEventObsSub;
  public newEventObsSub;

  constructor(
    public DataTransferService: DataTransferService,
    public feedback: MatSnackBar,
    private EventService:EventService,
    public LangService: LangService
  ) {}

  ngOnInit(){

    this.populateChildEvents();

    // when new event is added to timeline if it is linked to this event add it to childevents so it displays on screen
    this.newEventObsSub = this.DataTransferService.activeTimelines[this.timelineId].newEventObs.subscribe(
      (data)=>{
        if(data && this.componentEvent.Id == data.LinkedTimelineEventIds){
          if(this.childEvents.includes(data)) return;
          this.childEvents.push(data)
        }
      }
    )

    this.deleteEventObsSub = this.DataTransferService.activeTimelines[this.timelineId].deleteEventObs.subscribe(
      (eventId)=>{
        if(!eventId) return;
        for (let index = 0; index < this.childEvents.length; index++) {
          const childEvent = this.childEvents[index];
          if(childEvent.Id == eventId){
            this.childEvents.splice(index,1);
          }
        }

      }
    )
  }

  populateChildEvents() {
    let events = this.DataTransferService.activeTimelines[this.timelineId].TimelineEvents;
    this.childEvents = [];
    for (let index = 0; index < events.length; index++) {
      const event = events[index];
      if(event.LinkedTimelineEventIds[0] == this.componentEvent.Id){
        this.childEvents.push(event);
      }
    }
  }

  moveEvent(e) {

    this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.treePartMoving,progress:true}});
    e.preventDefault();
    e.stopPropagation();

    let linkId = this.componentEvent.Id;
    if(this.componentEvent.Id == this.DataTransferService.moveData.event['Id']){
      linkId = null;
    }

    let eventCopy = JSON.parse(JSON.stringify(this.DataTransferService.moveData.event));
    eventCopy['LinkedTimelineEventIds'][0] = linkId;

    this.EventService.editEventTitle(this.DataTransferService.moveData.event['Id'], JSON.stringify(eventCopy)).subscribe(
      (data)=>{
        this.DataTransferService.moveData.event['LinkedTimelineEventIds'][0] = linkId;
        this.DataTransferService.deleteTimelineEvent(this.timelineId, this.DataTransferService.moveData.event['Id']);
        this.DataTransferService.addTimelineEvent(this.timelineId, this.DataTransferService.moveData.event);
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.treePartMoved,progress:false}, duration:3500});
      },
      (error)=>{
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.treePartMoveFail,progress:false}, duration:3500});
      },
      ()=>{
        this.DataTransferService.moveData.moveActive = false;
      }
    );

  }

  search(){
    let beforeDate = new Date(this.DataTransferService.activeTimelines[this.timelineId].eventBeforeDate).getTime();
    let afterDate = new Date(this.DataTransferService.activeTimelines[this.timelineId].eventAfterDate).getTime();
    if(
      !this.DataTransferService.moveData.moveActive// if move isnt active
      &&
      (
        this.DataTransferService.activeTimelines[this.timelineId].eventSearchTerm
        ||
        this.DataTransferService.activeTimelines[this.timelineId].eventTagSearchTerm
        ||
        this.DataTransferService.activeTimelines[this.timelineId].eventBeforeDate
        ||
        this.DataTransferService.activeTimelines[this.timelineId].eventAfterDate
      )
      &&
      ( // searching part
        (  // search for title
          this.componentEvent.Title.toLowerCase().includes(this.DataTransferService.activeTimelines[this.timelineId].eventSearchTerm.toLowerCase())
          ||
          typeof this.DataTransferService.activeTimelines[this.timelineId].eventSearchTerm == 'undefined'
        )
        &&
        (  // search for tags
          JSON.stringify(this.componentEvent.Tags).toLowerCase().includes(this.DataTransferService.activeTimelines[this.timelineId].eventTagSearchTerm)
          ||
          typeof this.DataTransferService.activeTimelines[this.timelineId].eventTagSearchTerm == 'undefined'
        )
        &&
        ( // check before date
          beforeDate >= this.componentEvent.EventDateTime
          ||
          !beforeDate
        )
        &&
        ( // check after date
          afterDate <= this.componentEvent.EventDateTime
          ||
          !afterDate
        )
      )
    ){
      return true;
    }else{
      return false;
    }

  }

  cancelMove() {
    this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.treePartMoveNot,progress:false}, duration:3500});
    this.DataTransferService.moveData.moveActive = false;
  }

  stopPropagation(e){// prevents panzoom messing up touch scrolling and other touch things
    e.stopPropagation();
  }

  ngOnDestroy() {
    this.deleteEventObsSub.unsubscribe();
    this.newEventObsSub.unsubscribe();
  }

}