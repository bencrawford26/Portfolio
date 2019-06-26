import { Component, OnInit, Input } from '@angular/core';
import { DataTransferService } from '../../service/data-transfer/data-transfer.service'

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  @Input() timelineId;
  public eventsCopy;
  public sortedTimelineData = [];
  public mapStyles = [];

  constructor(
    private DataTransferService:DataTransferService
  ) { }

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