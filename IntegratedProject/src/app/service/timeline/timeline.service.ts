import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class TimelineService {

  private baseUrl = 'https://gcu.ideagen-development.com/Timeline/';
  
  constructor(private http: HttpClient) { }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  getTimelines() :Observable<any[]> {
    const cmd = 'GetTimelines';
    const httpOptions = {
      headers: new HttpHeaders({'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766'})
    };
    
    return this.http.get<any[]>(this.baseUrl+cmd, httpOptions);
  }

  getAllTimelinesEvents() :Observable<any[]> {
    const cmd = 'GetAllTimelinesAndEvent';
    const httpOptions = {
      headers: new HttpHeaders({'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766'})
    };
    
    return this.http.get<any[]>(this.baseUrl+cmd, httpOptions);
  }

  getTimeline(id: string) :Observable<any>{
    const cmd = 'GetTimeline';
    const httpOptions = {
      headers: new HttpHeaders({'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineId': id 
      })
    };

    return this.http.get(this.baseUrl+cmd, httpOptions);
  }

  getEvents(id: string) :Observable<any>{
    const cmd = 'GetEvents';
    const httpOptions = {
      headers: new HttpHeaders({'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineId': id
      })
    };

    return this.http.get(this.baseUrl+cmd, httpOptions);
  }

  createTimeline(t: string) :Observable<any>{
    const cmd = 'Create';
    const bod = {
      TenantId : "Team15",
      AuthToken : "727162e6-460d-44cf-925e-8f1ae74b2766",
      Title : t,
      TimelineId : this.guid()
    }

    return this.http.put(this.baseUrl+cmd, bod);
  }
  
  deleteTimeline(id: string) :Observable<any>{
    const cmd = 'Delete';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineId': id
    };

    return this.http.put(this.baseUrl+cmd, bod);
  }
  
  editTitle(id: string, t: string) :Observable<any>{
    const cmd = 'EditTitle';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineId': id,
      'Title': t
    };

    return this.http.put(this.baseUrl+cmd, bod);
  }
  
  linkEvent(id: string, eid: string) :Observable<any>{
    const cmd = 'LinkEvent';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineId': id,
      'EventId': eid
    };

    return this.http.put(this.baseUrl+cmd, bod);
  }

  unlinkEvent(id: string, eid: string) :Observable<any>{
    const cmd = 'UnlinkEvent';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineId': id,
      'EventId': eid
    };

    return this.http.put(this.baseUrl+cmd, bod);
  }
}
