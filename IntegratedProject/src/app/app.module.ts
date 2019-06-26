import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { environment } from '../environments/environment';

import { 
  MatMenuModule,
  MatButtonModule,
  MatToolbarModule, 
  MatIconModule, 
  MatCardModule, 
  MatInputModule, 
  MatNativeDateModule, 
  MatTableModule,
  MatCheckboxModule,
  MatTabsModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatDialogModule,
  MatStepperModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatSortModule,
  MatSnackBarModule,
  MatListModule,
  MatTooltipModule,
  MatSelectModule,
  MatChipsModule,
  MatGridListModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';

import { IdentityBarComponent } from './component/identity-bar/identity-bar.component';
import { LeftPaneComponent } from './component/left-pane/left-pane.component';
import { RightPaneComponent } from './component/right-pane/right-pane.component';
import { FeedbackComponent } from './component/feedback/feedback.component';
import { TreeViewComponent } from './component/tree-view/tree-view.component';
import { TreePartComponent } from './component/tree-part/tree-part.component';
import { DateViewComponent } from './component/date-view/date-view.component';
import { MapViewComponent } from './component/map-view/map-view.component';
import { EventItemComponent } from './component/event-item/event-item.component';

import { DialogTextInputComponent } from './component/dialog-text-input/dialog-text-input.component';
import { DialogConfirmComponent } from './component/dialog-confirm/dialog-confirm.component';
import { DialogCreateEventComponent } from './component/dialog-create-event/dialog-create-event.component';
import { DialogUploadComponent } from './component/dialog-upload/dialog-upload.component';
import { DialogAttachPreviewComponent } from './component/dialog-attach-preview/dialog-attach-preview.component';
import { DialogDownloadComponent } from './component/dialog-download/dialog-download.component';

import { DataTransferService } from './service/data-transfer/data-transfer.service';
import { TimelineService } from './service/timeline/timeline.service';
import { AttachmentService } from './service/attachment/attachment.service';
import { EventService } from './service/event/event.service';
import { LangService } from './service/lang/lang.service';

import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    IdentityBarComponent,
    LeftPaneComponent,
    RightPaneComponent,
    FeedbackComponent,
    EventItemComponent,
    TreePartComponent,
    TreeViewComponent,
    MapViewComponent,
    DateViewComponent,
    DialogTextInputComponent,
    DialogConfirmComponent,
    DialogCreateEventComponent,
    DialogUploadComponent,
    DialogDownloadComponent,
    DialogAttachPreviewComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    // service worker for offline operation
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    //angular material
    MatButtonModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatStepperModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSortModule,
    MatSnackBarModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatSelectModule,
    MatChipsModule,
    MatGridListModule,
    //angular maps
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyATnLGtXnnQ2LhmZectMIQnd8iJqWAzxKI'
    }),
    AgmSnazzyInfoWindowModule
  ],
  providers: [
    DataTransferService,
    TimelineService,
    EventService,
    AttachmentService,
    LangService,
    {
      provide: MAT_DATE_LOCALE, 
      useValue: 'en-GB'
    },
    {
      provide: DateAdapter, 
      useClass: MomentDateAdapter, 
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS, 
      useValue: MAT_MOMENT_DATE_FORMATS
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogTextInputComponent,
    DialogConfirmComponent,
    DialogCreateEventComponent,
    DialogUploadComponent,
    FeedbackComponent,
    DialogAttachPreviewComponent,
    DialogDownloadComponent
  ]
})
export class AppModule { }
