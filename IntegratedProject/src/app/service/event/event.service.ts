import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class EventService {

  private baseUrl = 'https://gcu.ideagen-development.com/TimelineEvent/';

  constructor(private http: HttpClient) { }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }


  getEvent(id: string) :Observable<any>{
    const cmd = 'GetTimelineEvent';
    const httpOptions = {
      headers: new HttpHeaders({'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineEventId': id
      })
    };
    
    return this.http.get(this.baseUrl+cmd, httpOptions);
  }

  getLinkedEvents(id: string) :Observable<any>{
    const cmd = 'GetLinkedTimelineEvents';
    const httpOptions = {
      headers: new HttpHeaders({'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineEventId': id
      })
    };
    
    return this.http.get(this.baseUrl+cmd, httpOptions);
  }

  createEvent(t: object, d: string, edt: string, l: string) :Observable<any> {
    const cmd = 'Create';
    const guid = this.guid();
    t['Id'] = guid
    const fakeTitle = JSON.stringify(t); // faketitle holds all event data to get around api edit overwrite bug
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineEventId': guid,
      'Title': fakeTitle,
      'Description': d,
      'EventDateTime': edt,
      'Location': l
    };
    
    return this.http.put(this.baseUrl+cmd, bod);
  }

  editEventTitle(id: string, t: string) :Observable<any> {
    const cmd = 'EditTitle';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineEventId': id,
      'Title': t
    };
    
    return this.http.put(this.baseUrl+cmd, bod);
  }

  editEventDescription(id: string, d: string) :Observable<any> {
    const cmd = 'EditDescription';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineEventId': id,
      'Description': d
    };
    
    return this.http.put(this.baseUrl+cmd, bod);
  }

  editEventLocation(id: string, l: string) :Observable<any> {
    const cmd = 'EditLocation';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineEventId': id,
      'Location': l
    };
    
    return this.http.put(this.baseUrl+cmd, bod);
  }

  editEventDateTime(id: string, edt: string) :Observable<any> {
    const cmd = 'EditEventDateTime';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineEventId': id,
      'EventDateTime': edt
    };
    
    return this.http.put(this.baseUrl+cmd, bod);
  }

  deleteEvent(id: string) :Observable<any> {
    const cmd = 'Delete';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineEventId': id
    };
    
    return this.http.put(this.baseUrl+cmd, bod);
  }

  linkEvents(id: string, id1: string) :Observable<any> {
    const cmd = 'LinkEvents';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineEventId': id,
      'LinkedToTimelineEventId': id1
    };
    
    return this.http.put(this.baseUrl+cmd, bod);
  }

  unlinkEvents(id: string, id1: string) :Observable<any> {
    const cmd = 'UnlinkEvents';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineEventId': id,
      'UnlinkedFromTimelineEventId': id1
    }
    
    return this.http.put(this.baseUrl+cmd, bod);
  }

}
