import { Component, OnInit, ViewChild, ElementRef, animate, keyframes, style, trigger, transition } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatTable } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DataTransferService } from '../../service/data-transfer/data-transfer.service'
import { TimelineService } from '../../service/timeline/timeline.service'
import { EventService } from '../../service/event/event.service'
import { LangService } from '../../service/lang/lang.service'

import { DialogTextInputComponent } from '../../component/dialog-text-input/dialog-text-input.component';
import { FeedbackComponent } from '../../component/feedback/feedback.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSort, MatSnackBar } from '@angular/material';
import { DialogConfirmComponent } from '../../component/dialog-confirm/dialog-confirm.component';
import { Observable } from 'rxjs/Rx';

import { Timeline } from '../../interface/timeline'

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.scss'],
  animations: [
    trigger('appearDisappear', [
      transition(':enter', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
          style({minHeight: '0px', overflow: 'hidden',  height: '0px'}),
          style({minHeight: '*', overflow: 'visible',  height: '*'}),
        ]))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
          style({minHeight: '*', overflow: 'visible',  height: '*'}),
          style({minHeight: '0px', overflow: 'hidden',  height: '0px'}),
        ]))
      ])
    ])
  ]
})

export class LeftPaneComponent implements OnInit {

  tableDataLoaded: boolean = false;
  filter: string;
  timelineRetrieveErr;

  @ViewChild(MatTable) tableElement: MatTable<0>
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private TimelineService:TimelineService, 
    private EventService:EventService, 
    public DataTransferService:DataTransferService, 
    public LangService: LangService,
    public dialog: MatDialog, 
    public feedback: MatSnackBar
  ) { }

  ngOnInit() {
    this.DataTransferService.recountObs.subscribe(
      ()=>{this.recountEvents()}
    )
    this.paginator.page.subscribe(() => {document.getElementById('tableElement').scrollTop = 0});

    this.retrieveTimelines();
    
  }

  retrieveTimelines() {
    this.timelineRetrieveErr = false;
    this.TimelineService.getAllTimelinesEvents().subscribe(
      (data)=>{
        for (let index = 0; index < data['Timelines'].length; index++) {
          const timeline: Timeline = data['Timelines'][index];

          // c sharp timestamp starts at the year 1. so this conevrts it to js timestamp by subtracting seconds between the year 1 and 1970
          timeline.CreationTimeStamp = (parseInt(timeline.CreationTimeStamp)-621355968000000000).toString().slice(0, -4);
          timeline.noEvents = timeline.TimelineEvents.length;

          for (let eventIndex = 0; eventIndex < timeline.TimelineEvents.length; eventIndex++) { // de serialize date and location

            let Attachments = timeline.TimelineEvents[eventIndex].Attachments;

            timeline.TimelineEvents[eventIndex] = JSON.parse(timeline.TimelineEvents[eventIndex].Title) 
            timeline.TimelineEvents[eventIndex].Attachments = Attachments

          }

          // add element to array to make it display on table
          ELEMENT_DATA.unshift(timeline);
        }
        console.log(ELEMENT_DATA);
          
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg: this.LangService.activeLanguage.feedBackTimelinesLoaded,progress:false},duration:3500});
        this.reRenderTable();
        this.sort.disableClear = true;
        this.dataSource.sort = this.sort;
      },
      (error)=>{
        this.timelineRetrieveErr = true;
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg: this.LangService.activeLanguage.feedBackTimelinesGetFailed,progress:false},duration:3500});
      }
    );
  }

  recountEvents() { //used to count no events since arr.length doesnt work inside the table when sorting 
    for (let index = 0; index < ELEMENT_DATA.length; index++) {
      ELEMENT_DATA[index].noEvents = ELEMENT_DATA[index].TimelineEvents.length;
      this.reRenderTable();
    }
  }

  // uses filter text input above table to filter ELEMENT_DATA
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  // re renders the table after data added or removed
  reRenderTable(){
    this.tableElement.renderRows();
    this.dataSource.paginator = this.paginator;
    this.tableDataLoaded = true;
  }

  openAddDialog(dialogTitle, currentText, createOrUpdate, tlId) {
    let dialogRef = this.dialog.open(DialogTextInputComponent, {
      width: '400px',
      data: {existingText: currentText, dialogTitle: dialogTitle}
    });
    dialogRef.afterClosed().subscribe((result) => {

      if(typeof result != 'undefined' && result.confirm &&createOrUpdate == 'create'){

        this.tableDataLoaded = false;
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg: this.LangService.activeLanguage.feedBackAddingTimeline + result.text,progress:true}});

        this.TimelineService.createTimeline(result.text).subscribe(
          (data)=>{
            let newTimeline = data;
            newTimeline.CreationTimeStamp = (newTimeline.CreationTimeStamp-621355968000000000).toString().slice(0, -4);
            newTimeline.TimelineEvents = [];
            newTimeline.noEvents = 0;
            ELEMENT_DATA.unshift(newTimeline);
            setTimeout(()=>{// small delay so event dialog doesnt pop up instantly
              this.DataTransferService.timelineRegisterVisibleSource.next(false);
            }, 350);
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg: this.LangService.activeLanguage.feedBackTimelineAdded + result.text,progress:false}, duration: 3500});
            this.reRenderTable()
            this.DataTransferService.addActiveTimeline(newTimeline.Id, newTimeline);
          },
          (error)=>{
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackAddTimelineErr + result.text,progress:false}, duration: 3500});
            this.reRenderTable()
          }
        );

      }else if(typeof result != 'undefined' && result.confirm && createOrUpdate == 'update'){

        this.tableDataLoaded = false;
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg: this.LangService.activeLanguage.feedBackEditingTimeline + result.text,progress:true}});
        
        this.TimelineService.editTitle(tlId, result.text).subscribe(
          (data)=>{
            for (let i=ELEMENT_DATA.length-1; i>=0; i--) {
              if (ELEMENT_DATA[i].Id === tlId) {
                ELEMENT_DATA[i].Title = result.text;
                this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackEditedTimeline + result.text,progress:false}, duration: 3500});
                break; // stop loop once found element
              }
            }
            this.reRenderTable()
          },
          (error)=>{
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackEditTimelineErr,progress:false}, duration: 3500});
            this.reRenderTable()
          }
        );

      }

    })
  }

  // confirm dialog box code
  openConfirmDialog() {
    let dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '400px',
      data: {question:this.LangService.activeLanguage.confirmDeleteTimeline}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'confirm'){
        

        this.tableDataLoaded = false;
        this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackDeletingTimeline,progress:true}});

        // if confirm dialog loop through each selected timeline and delete them
        let deleteObservArr = []
        for (let index = 0; index < this.selection.selected.length; index++) {
          deleteObservArr.push(this.TimelineService.deleteTimeline(this.selection.selected[index].Id));
        }

        Observable.forkJoin(deleteObservArr).subscribe(
          (data)=>{

            for (let index = 0; index < this.selection.selected.length; index++) {
              for (let i=ELEMENT_DATA.length-1; i>=0; i--) {
                if (ELEMENT_DATA[i].Id === this.selection.selected[index].Id) {
                  console.log(this.DataTransferService.activeTimelineKeys)
                  console.log(this.DataTransferService.activeTimelines)
                  // remove timeline from active timelines list
                  let delIndex = this.DataTransferService.activeTimelineKeys.indexOf(ELEMENT_DATA[i].Id);
                  if(delIndex != -1){
                    this.DataTransferService.activeTimelineKeys.splice(delIndex, 1);
                  }
                  //this.DataTransferService.activeTimelines[ELEMENT_DATA[i].Id] = null;
                  
                  ELEMENT_DATA.splice(i, 1);
                  break; // stop loop once found element
                }
              }
            }
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackDeletedTimeline,progress:false}, duration: 3500});

          },
          (error)=>{
            this.feedback.openFromComponent(FeedbackComponent, {data: {msg:this.LangService.activeLanguage.feedBackDeleteTimelineErr + result.text,progress:false}});
          },
          ()=>{
            this.tableElement.renderRows();
            this.dataSource.paginator = this.paginator;
            this.tableDataLoaded = true;
            this.selection.clear(); // TODO: quick fix to sort strange selection behavior should prolly fix
          },
        )


      }
    })
  }

  timelineRowClick(e, row){
    this.DataTransferService.addActiveTimeline(row.Id, row);
    if(!e.ctrlKey){
      this.DataTransferService.toggleRegisterExpanded();
    }
  }
  
  displayedColumns = ['select', 'Title', 'CreationTimeStamp', 'noEvents'];
  dataSource = new MatTableDataSource<Timeline>(ELEMENT_DATA);
  selection = new SelectionModel<Timeline>(true, []);

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

}

let ELEMENT_DATA: Timeline[] = []