import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTransferService } from '../../service/data-transfer/data-transfer.service';
import { MatDialog, MatDialogRef, MatDatepicker, MAT_DIALOG_DATA, MatChipInputEvent } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { LangService } from '../../service/lang/lang.service'

@Component({
  selector: 'app-dialog-create-event',
  templateUrl: './dialog-create-event.component.html',
  styleUrls: ['./dialog-create-event.component.scss']
})
export class DialogCreateEventComponent implements OnInit {

  @ViewChild('datePicker') datePicker: MatDatepicker<string>;

  firstFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  public timelineId = null;
  public existingValues = null;
  public parentId;

  public beforeTimeLimit = null;
  public afterTimeLimit = null;
  public minDate;
  public maxDate;
  
  public startViewLat: number = 0;
  public startViewLng: number = 0;
  public startViewZoom: number = 2;

  public lat = null;
  public lng = null;
  public locationDisabled = false;

  public existingDateTime = null;
  public existingHours = null;

  public dateTimestamp: number = 0;
  public timeTimestamp: number = 0;
  public timeString = '00:00';

  public mapStyles = [];

  public tags = [];

  createOrUpdate: string;

  constructor(
    private _formBuilder: FormBuilder,
    public thisDialogRef: MatDialogRef<DialogCreateEventComponent>,
    public DataTransferService:DataTransferService,
    public LangService: LangService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  disableLocationChange(e){
    this.lat = null
    this.lng = null;
    if(e.checked){
      this.thirdFormGroup.setValue({
        latitudeCtrl: 'null', 
        longitudeCtrl: 'null'
      });
    }else{
      this.thirdFormGroup.setValue({
        latitudeCtrl: '', 
        longitudeCtrl: ''
      });
    }
  }

  ngOnInit() {
    this.timelineId = this.data.timelineId;
    this.existingValues = this.data.existingValues;

    if(this.existingValues == null) {
      this.existingValues = {};
      this.existingValues.Title = '';
      this.existingValues.Description = '';
      this.existingValues.Severity = 'Low';
      this.existingValues.Tags = '';
      this.existingValues.LocationLat = '';
      this.existingValues.LocationLng = '';
      this.existingValues.EventDateTime = '';
    }else{
      this.existingDateTime = new Date(this.existingValues.EventDateTime);
      this.existingHours = ('0'+this.existingDateTime.getHours()).slice(-2)+':'+ ('0'+this.existingDateTime.getMinutes()).slice(-2)
      this.timeString = this.existingHours;
      var splitMinsHours = this.existingHours.split(':');
      this.timeTimestamp = splitMinsHours[0] * 3600000 + splitMinsHours[1] * 60000; 
      this.dateTimestamp = this.existingDateTime.getTime()-this.timeTimestamp;
      this.tags = this.existingValues.Tags;

      if(this.existingValues.LocationLat == 'null'){
        this.locationDisabled = true
      }else{
        this.lat = this.existingValues.LocationLat;
        this.lng = this.existingValues.LocationLat;
      }
    }

    //set up date stuff
    this.parentId = this.data.parentId;
    console.log(this.parentId);
    for (let index = 0; index < this.DataTransferService.activeTimelines[this.timelineId].TimelineEvents.length; index++) {
      const event = this.DataTransferService.activeTimelines[this.timelineId].TimelineEvents[index];

      //if event being edited find children to get before date limit
      if(this.data.existingValues && this.existingValues.Id == event.LinkedTimelineEventIds[0]){
        (this.beforeTimeLimit == null || event.EventDateTime < this.beforeTimeLimit)?this.beforeTimeLimit = event.EventDateTime:null;
      }

      //find parent to get after date limit
      if(this.parentId && this.parentId == event.Id){
        this.afterTimeLimit = event.EventDateTime
      }
    }

    this.firstFormGroup = new FormGroup({
      titleCtrl: new FormControl(this.existingValues.Title, [
        Validators.required,
        Validators.minLength(1)
      ]),
      descriptionCtrl: new FormControl(this.existingValues.Description, [
        Validators.required,
        Validators.minLength(1)
      ]),
      severityCtrl: new FormControl(this.existingValues.Severity)
    });

    this.thirdFormGroup = new FormGroup({
      latitudeCtrl: new FormControl(this.existingValues.LocationLat, [
        Validators.required,
        Validators.max(85),
        Validators.min(-85)
      ]),
      longitudeCtrl: new FormControl(this.existingValues.LocationLng, [
        Validators.required,
        Validators.max(180),
        Validators.min(-180)
      ]),
    });

    this.fourthFormGroup = new FormGroup({
      dateTimeCtrl: new FormControl(this.existingValues.EventDateTime, [
        Validators.required,
        Validators.max(this.beforeTimeLimit),
        Validators.min(this.afterTimeLimit)
      ])
    });

    if(this.data.existingValues == null) { 
      this.createOrUpdate='create'
    }else{
      this.createOrUpdate='update';
    }

    //map styles
    this.DataTransferService.currentTheme.subscribe(
      (data)=>{
        if(data == 'pink-bluegrey' || data == 'purple-green'){
          this.mapStyles = darkstyles;
        }else{
          this.mapStyles = [];
        }
      }
    );

    this.minDate = (this.afterTimeLimit) ? new Date(this.afterTimeLimit) : null;
    this.maxDate = (this.beforeTimeLimit) ? new Date(this.beforeTimeLimit) : null;

  }

  public dateError = null;
  dateEvent(event){
    this.dateTimestamp = new Date(event.value).getTime();

    if(this.dateTimestamp+this.timeTimestamp > -2084140800000){ // check time doesnt predate flight
      this.fourthFormGroup.setValue({
        dateTimeCtrl: this.dateTimestamp+this.timeTimestamp,
      });
    }else{
      this.fourthFormGroup.setValue({
        dateTimeCtrl: '',
      });
    }

  }
  timeEvent(event){
    var splitMinsHours = event.target.value.split(':');
    this.timeTimestamp = splitMinsHours[0] * 3600000 + splitMinsHours[1] * 60000; 

    if(this.dateTimestamp+this.timeTimestamp > -2084140800000){ // check time doesnt predate flight
      this.fourthFormGroup.setValue({
        dateTimeCtrl: this.dateTimestamp+this.timeTimestamp,
      });
    }else{
      this.fourthFormGroup.setValue({
        dateTimeCtrl: '',
      });
    }

  }

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;
    // Add tags
    if ((value || '').trim()) {
      this.tags.push({ name: value.trim() });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  remove(tag: any): void {
    let index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  mapManualInput() {
    this.lat = this.thirdFormGroup.value.latitudeCtrl;
    this.lng = this.thirdFormGroup.value.longitudeCtrl;
  }

  onChooseLocation(event) {
    this.lat = event.coords.lat;
    this.lng = event.coords.lng;
    this.thirdFormGroup.setValue({
      latitudeCtrl: this.lat, 
      longitudeCtrl: this.lng
    });
  }

  onCloseConfirm() {
    this.thisDialogRef.close({
      result: this.createOrUpdate,
      title : this.firstFormGroup.value.titleCtrl,
      description : this.firstFormGroup.value.descriptionCtrl,
      severity : this.firstFormGroup.value.severityCtrl,
      tags : this.tags,
      lat : this.thirdFormGroup.value.latitudeCtrl,
      lng : this.thirdFormGroup.value.longitudeCtrl,
      dateTime : this.fourthFormGroup.value.dateTimeCtrl
    });
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