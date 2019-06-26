import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AttachmentService {

  private baseUrl = 'https://gcu.ideagen-development.com/TimelineEventAttachment/';

  constructor(private http: HttpClient) { }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  createAttachment(tleid: string, aid: string, t: string) :Observable<any> {
    const cmd = 'Create';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineEventId': tleid,
      'AttachmentId': aid,
      'Title': t
    };
    
    return this.http.put(this.baseUrl+cmd, bod);
  }

  editTitle(aid: string, t: string) :Observable<any> {
    const cmd = 'EditTitle';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'AttachmentId': aid,
      'Title': t
    };
    
    return this.http.put(this.baseUrl+cmd, bod);
  }

  deleteAttachment(aid: string) :Observable<any> {
    const cmd = 'Delete';
    const bod = {'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'AttachmentId': aid
    };
    
    return this.http.put(this.baseUrl+cmd, bod);
  }

  genUpSignedUrl(aid: string) :Observable<string>{
    const cmd = 'GenerateUploadPresignedUrl';
    const httpOptions = {
      responseType: 'text' ,
      headers: new HttpHeaders({'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'AttachmentId': aid
      })
    };
    //for whatever reason you need to put the object straight in here putting httpotions instead of object below will cause error
    return this.http.get(this.baseUrl+cmd, {
      responseType: 'text' ,
      headers: new HttpHeaders({'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'AttachmentId': aid
      })
    });
  }
  
  genGetSignedUrl(aid: string) :Observable<string>{
    const cmd = 'GenerateGetPresignedUrl';
    const httpOptions = {
      responseType: 'text' ,
      headers: new HttpHeaders({'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'AttachmentId': aid
      })
    };
    return this.http.get(this.baseUrl+cmd, {
      responseType: 'text' ,
      headers: new HttpHeaders({'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'AttachmentId': aid
      })
    });
  }

  getAttachment(aid: string) :Observable<any>{
    const cmd = 'GetAttachment';
    const httpOptions = {
      headers: new HttpHeaders({'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'AttachmentId': aid
      })
    };
    
    return this.http.get(this.baseUrl+cmd, httpOptions);
  }

  getAttachments(tleid: string) :Observable<any>{
    const cmd = 'GetAttachments';
    const httpOptions = {
      headers: new HttpHeaders({'TenantId': 'Team15', 'AuthToken': '727162e6-460d-44cf-925e-8f1ae74b2766',
      'TimelineEventId': tleid
      })
    };
    
    return this.http.get(this.baseUrl+cmd, httpOptions);
  }

  uploadAttach(signedUrl: string, file : File, type: string) {

    const headers = new HttpHeaders();
    headers.set('Content-Type', type);

    const req = new HttpRequest('PUT', signedUrl, file, {
      reportProgress: true,
      headers: headers
    });

    return this.http.request(req)
  }

  // type error here try to get it to wrok without any
  downloadAttach(signedUrl: any){

    const req = new HttpRequest('GET', signedUrl, {
      responseType: 'arraybuffer',
      reportProgress: true
    });

    return this.http.request(req);
  }

}
