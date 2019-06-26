import { Output, EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { TimelineListItem } from '../../interface/timeline-list-item'

@Injectable()
export class DataTransferService {

  public onlineObs: Observable<boolean>; // observable that lets check wether online or not

  //used when moving events
  // stores event being moved and list of ids of event being moved and id's of children
  public moveData = {
    moveActive:false,
    event: {},
    idList: []
  };

  constructor() {
    this.onlineObs = Observable.merge(
      Observable.of(navigator.onLine),
      Observable.fromEvent(window, 'online').mapTo(true),
      Observable.fromEvent(window, 'offline').mapTo(false)
    )
  }


  themeSource = new BehaviorSubject<string>((localStorage.getItem("theme")) ? localStorage.getItem("theme") : "indigo-pink");
  // theme switching data transfer function
  currentTheme = this.themeSource.asObservable();
  setTheme(newTheme) {
    this.themeSource.next(newTheme);
  }

  timelineRegisterVisibleSource = new BehaviorSubject<boolean>(true);
  currentTimelineVisible = this.timelineRegisterVisibleSource.asObservable();
  //TODO: this breaks the tieline table  by duplicating data. figure it out
  toggleRegisterExpanded() {
    if(this.timelineRegisterVisibleSource.getValue()){
      this.timelineRegisterVisibleSource.next(false);
    }else{
      this.timelineRegisterVisibleSource.next(true);
    }
  }

  //vars used for panzoom
  onMap: boolean = false;
  headingTouch: boolean = false;


  // active timelines array
  activeTimelines = [];
  timelineKeyObs = new BehaviorSubject(null);
  addActiveTimeline(timelineId, timelineData){
    if(this.activeTimelines[timelineId] == null || typeof this.activeTimelines[timelineId] === undefined){
      this.activeTimelines[timelineId] = timelineData;
      this.activeTimelines[timelineId]['eventSearchTerm'] = '';
      this.activeTimelines[timelineId]['viewOption'] = 'Tree';
      timelineData.newEventObs = new BehaviorSubject(null);// create observable to allow listening for added events
      timelineData.deleteEventObs = new BehaviorSubject(null);// create observable to allow listening for deleted events
      this.timelineKeyObs.next({timelineId:timelineId,type:'add'});
    }
  }
  deleteActiveTimeline(timelineId){
    if(this.activeTimelines[timelineId] != null || typeof this.activeTimelines[timelineId] !== undefined){
      this.activeTimelines[timelineId]['eventSearchTerm'] = '';
      this.activeTimelines[timelineId]['eventTagSearchTerm'] = '';
      this.activeTimelines[timelineId]['eventBeforeDate'] = '';
      this.activeTimelines[timelineId]['eventAfterDate'] = '';
      this.activeTimelines[timelineId]['viewOption'] = 'Tree';
      this.activeTimelines[timelineId] = null;
      this.timelineKeyObs.next({timelineId:timelineId,type:'del'});
    }
  }


  // observer used to recount event no in left pane after event added or deleted 
  public recountObs = new Subject();
  addTimelineEvent(timelineId, event){
    this.activeTimelines[timelineId].TimelineEvents.push(event);
    this.activeTimelines[timelineId].newEventObs.next(event);
    this.recountObs.next();
  };

  deleteTimelineEvent(timelineId, eventId){
    for (let index = 0; index < this.activeTimelines[timelineId].TimelineEvents.length; index++) {
      const element = this.activeTimelines[timelineId].TimelineEvents[index];
      if(element.Id == eventId){
        this.activeTimelines[timelineId].TimelineEvents.splice(index,1);
      }
    }
    this.activeTimelines[timelineId].deleteEventObs.next(eventId)
    this.recountObs.next();
  };

  // ids of active timelines
  public activeTimelineKeys: string[] = [];

  getTimelineEventById(timelineEventId, timelineId) {
    for (let index = 0; index < this.activeTimelines[timelineId].TimelineEvents.length; index++) {
      const event = this.activeTimelines[timelineId].TimelineEvents[index];
      if(event.Id == timelineEventId) {
        return event;
      }
    }
    return null;
  };

}