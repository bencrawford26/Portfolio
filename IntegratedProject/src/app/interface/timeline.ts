import { Observable } from 'rxjs/Rx';

export interface Timeline {
  CreationTimeStamp: string;
  Id: string;
  IsDeleted: boolean;
  TimelineEvents: Array<any>
  Title: string;
  deleteEventObs: Observable<null>;
  noEvents: number;
  eventSearchTerm: string;
  newEventObs: Observable<null>;
  viewOption: string;
}