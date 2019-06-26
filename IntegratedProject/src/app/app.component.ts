import { Component,trigger,transition,style,animate, OnInit, state, ViewEncapsulation } from '@angular/core';
import { DataTransferService } from './service/data-transfer/data-transfer.service';
import { LangService } from './service/lang/lang.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('inactive', style({
        transform: 'translateY(0%)'
      })),
      state('active',   style({
        transform: 'translateY(-100%)'
      })),
      transition('inactive => active', animate('225ms ease-in-out')),
      transition('active => inactive', animate('225ms ease-in-out'))
    ])
  ]
})

export class AppComponent {

  public timelineRegisterExpanded: boolean = true;
  public registerVisible;
  public selectedTabIndex;

  constructor(
    public DataTransferService:DataTransferService,
    public LangService: LangService,
  ){}

  ngOnInit() {

    this.DataTransferService.timelineRegisterVisibleSource.subscribe(
      (data)=>{
        (data === true) ? this.registerVisible = 'inactive' : this.registerVisible = 'active';
      }
    )

    // everytime active timelines are changed
    this.DataTransferService.timelineKeyObs.subscribe(
      (data) => {
        if(data && data.type == 'add'){ // when adding timeline if not already on the list add it
          let tlId = data.timelineId;
          if(this.DataTransferService.activeTimelineKeys.indexOf(tlId) == -1){
            (data) ? this.DataTransferService.activeTimelineKeys.push(tlId) : null;
            this.selectedTabIndex = this.DataTransferService.activeTimelineKeys.length-1;
          }

        }else if(data && data.type == 'del'){ // when deleting timeline if on the list find and delete

          let tlId = data.timelineId;
          let delIndex = this.DataTransferService.activeTimelineKeys.indexOf(tlId);
          if(delIndex != -1){
            this.DataTransferService.activeTimelineKeys.splice(delIndex, 1);
            delete this.DataTransferService.activeTimelines[tlId];
          }

        }
      }
    )

    // theme observable subscriber here
    this.DataTransferService.currentTheme.subscribe(
      (selectedTheme)=>{
        localStorage.setItem("theme", selectedTheme);
        for (let index = 0; index < document.getElementsByTagName('link').length; index++) {
          const link = document.getElementsByTagName('link')[index];
          if(link.href.indexOf('/assets/css/') !== -1 && link.href.indexOf(selectedTheme) === -1){
            setTimeout(()=>{
            },100)
          }
        }

        var head = document.head;
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = './assets/css/'+selectedTheme+'.css';
        head.appendChild(link)
      }
    )
  }

  timelineTabClose(e, timelineKey){
    e.stopPropagation();
    delete this.DataTransferService.activeTimelines[timelineKey];
    let delIndex = this.DataTransferService.activeTimelineKeys.indexOf(timelineKey);
    this.DataTransferService.activeTimelineKeys.splice(delIndex, 1);
    this.DataTransferService.deleteActiveTimeline(timelineKey);
  }
  
}
