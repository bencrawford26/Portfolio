import { Component, OnInit, Input } from '@angular/core';
import { DataTransferService } from '../../service/data-transfer/data-transfer.service';


@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})
export class TreeViewComponent implements OnInit {

  @Input() timelineId;
  public rootEvents = [];
  public deleteEventObsSub;
  public newEventObsSub;

  constructor(public DataTransferService: DataTransferService) { }

  ngOnInit() {

    this.findRootEvents();

    // when new event is added to timeline if it is linked to this event add it to childevents so it displays on screen
    this.newEventObsSub = this.DataTransferService.activeTimelines[this.timelineId].newEventObs.subscribe(
      (data)=>{
        if(data && (data.LinkedTimelineEventIds.length == 0 || data.LinkedTimelineEventIds[0] == null)){
          if(this.rootEvents.includes(data)) return;
          this.rootEvents.push(data)
        }
      }
    )

    this.deleteEventObsSub = this.DataTransferService.activeTimelines[this.timelineId].deleteEventObs.subscribe(
      (eventId)=>{
        for (let index = 0; index < this.rootEvents.length; index++) {
          const event = this.rootEvents[index];
          if(event.Id == eventId){
            this.rootEvents.splice(index,1);
          }
        }
      }
    )

  }

  findRootEvents(){
    this.rootEvents = [];
    if(!this.DataTransferService.activeTimelines[this.timelineId]){return}
    let events = this.DataTransferService.activeTimelines[this.timelineId].TimelineEvents;
    for (let index = 0; index < events.length; index++) {
      const event = events[index];
      if(event.LinkedTimelineEventIds[0] == null){
        this.rootEvents.push(event);
      }
    }
  }

/* ---------------------------------------- panzoom ----------------------------------------- */

  isMouseDown:boolean = false;
  mouseDownXPos:number;
  mouseDownYPos:number;
  transformX:number;
  transformY:number;
  transformScale:number;
  touchInProgress:boolean;
  pinchZoomLength:number;
  treeEle: any;

  rightEl = document.querySelector("#pane-container");

  refreshIntervalId = setInterval(()=>{// cant use recentre here as it breaks for some reason
    if(document.getElementById(this.timelineId+'-widthGetEle') != null && document.getElementById(this.timelineId+"-pan-zoom") != null) {
      clearInterval(this.refreshIntervalId);
      //this.timelineLoading = false;
      this.treeEle = document.getElementById(this.timelineId+"-pan-zoom");
      this.treeEle.style.transformOrigin = '0 0 0';
      this.transformScale = 0.6;
      this.transformX = ((this.rightEl.clientWidth/2) - (document.getElementById(this.timelineId+'-widthGetEle').clientWidth/2)*this.transformScale)-25;
      this.transformY = (100)*this.transformScale;
      this.treeEle.style.transform = 'matrix(' + this.transformScale + ', 0, 0, ' + this.transformScale + ', ' + this.transformX + ', ' + this.transformY + ')';
    }
  }, 100);

  mouseDown(e) {
    this.mouseDownXPos = e.clientX;
    this.mouseDownYPos = e.clientY;
    this.isMouseDown = true;
  }
  mouseChange(isMouseDown) {
    this.isMouseDown = isMouseDown;
  }

  wheelMove(e){
    e.preventDefault();
    let scaleMultiplier;
    (e.deltaY > 0) ? scaleMultiplier = 0.95 : scaleMultiplier = 1.05;
    if (scaleMultiplier !== 1) {
  
      let newScale = this.transformScale * scaleMultiplier

      // --------- these lines adjust for offset important -------- //
      let y = e.clientY - 130;
      // --------- these lines adjust for offset important -------- //

      this.transformX = e.clientX - scaleMultiplier * (e.clientX - this.transformX);
      this.transformY = y - scaleMultiplier * (y - this.transformY);

      this.transformScale *= scaleMultiplier
      this.treeEle = document.getElementById(this.timelineId+"-pan-zoom");

      this.treeEle.style.transformOrigin = '0 0 0';
      this.treeEle.style.transform = 'matrix(' + this.transformScale + ', 0, 0, ' + this.transformScale + ', ' + this.transformX + ', ' + this.transformY + ')'

    }
  }

  touchStart(e){
    if (e.touches.length === 1) {
      e.stopPropagation()
      e.preventDefault()
      let touch = e.touches[0]
      this.mouseDownXPos = touch.clientX
      this.mouseDownYPos = touch.clientY
      this.touchInProgress = true;
    } else if (e.touches.length === 2) {
      // handleTouchMove() will care about pinch zoom.
      e.stopPropagation()
      e.preventDefault()
      this.pinchZoomLength = this.getPinchZoomLength(e.touches[0], e.touches[1])
    }
  }

  oldx;
  oldy;

  mouseMove(e) {
    if(this.isMouseDown){
      let diffX = e.clientX - this.mouseDownXPos;
      let diffY = e.clientY - this.mouseDownYPos;
      this.mouseDownXPos = e.clientX;
      this.mouseDownYPos = e.clientY;

      this.transformX = this.transformX + diffX;
      this.transformY = this.transformY + diffY;
  
      this.treeEle = document.getElementById(this.timelineId+"-pan-zoom");
      this.treeEle.style.transform = 'matrix(' + this.transformScale + ', 0, 0, ' + this.transformScale + ', ' + this.transformX + ', ' + this.transformY + ')';
    }
  }

  touchMove(e){
    if (e.touches.length === 1) {
      e.stopPropagation()
      let touch = e.touches[0]

      let diffX = touch.clientX - this.mouseDownXPos
      let diffY = touch.clientY - this.mouseDownYPos

      if(this.oldx != this.mouseDownXPos || this.oldy != this.mouseDownYPos){
        diffX = 0;
        diffY = 0;
      }

      this.oldx = e.touches[0].clientX;
      this.oldy = e.touches[0].clientY;

      this.mouseDownXPos = touch.clientX
      this.mouseDownYPos = touch.clientY

      this.transformX = this.transformX + diffX;
      this.transformY = this.transformY + diffY;

      this.treeEle = document.getElementById(this.timelineId+"-pan-zoom");
      this.treeEle.style.transform = 'matrix(' + this.transformScale + ', 0, 0, ' + this.transformScale + ', ' + this.transformX + ', ' + this.transformY + ')';

    }else if (e.touches.length === 2) {
      // it's a zoom, let's find direction
      var t1 = e.touches[0]
      var t2 = e.touches[1]
      var currentPinchLength = this.getPinchZoomLength(t1, t2)

      var scaleMultiplier = 1
      scaleMultiplier = currentPinchLength / this.pinchZoomLength;

      this.mouseDownXPos = (t1.clientX + t2.clientX)/2
      this.mouseDownYPos = (t1.clientY + t2.clientY)/2

      // --------- these lines adjust for offset important -------- //
      let y = this.mouseDownYPos - 100;
      // --------- these lines adjust for offset important -------- //

      this.transformX = this.mouseDownXPos - scaleMultiplier * (this.mouseDownXPos - this.transformX);
      this.transformY = y - scaleMultiplier * (y - this.transformY);

      this.transformScale *= scaleMultiplier

      this.treeEle = document.getElementById(this.timelineId+"-pan-zoom");

      this.treeEle.style.transform = 'matrix(' + this.transformScale + ', 0, 0, ' + this.transformScale + ', ' + this.transformX + ', ' + this.transformY + ')';

      this.pinchZoomLength = currentPinchLength
      e.stopPropagation()
      e.preventDefault()
      
    }
  }
  getPinchZoomLength(finger1, finger2) {
    return Math.sqrt((finger1.clientX - finger2.clientX) * (finger1.clientX - finger2.clientX) + (finger1.clientY - finger2.clientY) * (finger1.clientY - finger2.clientY))
  }
  
  setTransform(scale, tranX, tranY){
    let refreshIntervalId = setInterval(()=>{
      if(document.getElementById(this.timelineId+'-widthGetEle') != null) {
        clearInterval(refreshIntervalId);
        this.transformScale = scale;
        this.transformY = tranY;
        //this.timelineLoading = false;
        this.treeEle = document.getElementById(this.timelineId+"-pan-zoom");
        if(tranX == 'center'){
          this.transformX = ((this.rightEl.clientWidth/2) - (document.getElementById(this.timelineId+'-widthGetEle').clientWidth/2)*this.transformScale)-25;
        }else{
          this.transformX = tranX*this.transformScale;
        }
        this.treeEle.style.transformOrigin = '0 0 0';
        this.treeEle.style.transform = 'matrix(' + scale + ', 0, 0, ' + scale + ', ' + this.transformX + ', ' + this.transformY + ')';

      }
    }, 100);
  }

  switchBackTreeTransform(){
    let refreshIntervalId = setInterval(()=>{
      if(document.getElementById(this.timelineId+'-widthGetEle') != null) {
        clearInterval(refreshIntervalId);
        this.treeEle = document.getElementById(this.timelineId+"-pan-zoom");
        this.treeEle.style.transformOrigin = '0 0 0';
        this.treeEle.style.transform = 'matrix(' + this.transformScale + ', 0, 0, ' + this.transformScale + ', ' + this.transformX + ', ' + this.transformY + ')'
      }
    }, 1000);
  }

  stopPropagation(e){// prevents panzoom messing up touch scrolling and other touch things
    e.stopPropagation();
  }
    
}