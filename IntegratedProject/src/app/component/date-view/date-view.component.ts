import { Component, OnInit, Input } from '@angular/core';
import { DataTransferService } from '../../service/data-transfer/data-transfer.service'

@Component({
  selector: 'app-date-view',
  templateUrl: './date-view.component.html',
  styleUrls: ['./date-view.component.scss']
})
export class DateViewComponent implements OnInit {

  @Input() timelineId;
  public eventsCopy;
  public sortedTimelineData = [];
  public panelOpenState = [];
  
  constructor(
    private DataTransferService:DataTransferService
  ) { }

  ngOnInit() {
    let events = this.DataTransferService.activeTimelines[this.timelineId].TimelineEvents;
    this.eventsCopy = JSON.parse(JSON.stringify(events))
    let changes:boolean;

    do{// sort events by date
      changes = false;
      for (let index = 0; index < this.eventsCopy.length; index++) {
        const element = this.eventsCopy[index];
        let previousDate;
        if(index > 0){
          previousDate = this.eventsCopy[index-1].EventDateTime;
        }
        const dateDiff = element.EventDateTime - previousDate
        if(dateDiff < 0){
          changes = true;
          const tempStore = this.eventsCopy[index-1];
          this.eventsCopy[index-1] = element;
          this.eventsCopy[index] = tempStore;
        }
      }
    }while(changes)
    this.sortedTimelineData = this.eventsCopy;
  }

  search(event){
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
          event.Title.toLowerCase().includes(this.DataTransferService.activeTimelines[this.timelineId].eventSearchTerm.toLowerCase())
          ||
          typeof this.DataTransferService.activeTimelines[this.timelineId].eventSearchTerm == 'undefined'
        )
        &&
        (  // search for tags
          JSON.stringify(event.Tags).toLowerCase().includes(this.DataTransferService.activeTimelines[this.timelineId].eventTagSearchTerm)
          ||
          typeof this.DataTransferService.activeTimelines[this.timelineId].eventTagSearchTerm == 'undefined'
        )
        &&
        ( // check before date
          beforeDate >= event.EventDateTime
          ||
          !beforeDate
        )
        &&
        ( // check after date
          afterDate <= event.EventDateTime
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
}