import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import uitoolkit from "@zoom/videosdk-ui-toolkit";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  sessionContainer: any;
  authEndpoint = ''
  inSession: boolean = false
  config = {
    videoSDKJWT: '',
    sessionName: 'test',
    userName: 'Angular',
    sessionPasscode: '123',
    features: ['video', 'audio', 'settings', 'users', 'chat', 'share']
  };
  role = 1

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document: any) {

  }

  ngOnInit() {
    
  }

  getVideoSDKJWT() {
    this.sessionContainer = document.getElementById('sessionContainer')

    this.inSession = true
    
    this.httpClient.post(this.authEndpoint, JSON.stringify({
	    sessionName:  this.config.sessionName,
      role: this.role,
    })).toPromise().then((data: any) => {
      if(data.signature) {
        console.log(data.signature)
        this.config.videoSDKJWT = data.signature
        this.joinSession()
      } else {
        console.log(data)
      }
    }).catch((error) => {
      this.inSession = false
      console.log(error)
    })
  }

  joinSession() {
    uitoolkit.joinSession(this.sessionContainer, this.config)

    uitoolkit.onSessionClosed(this.sessionClosed)
  }

  sessionClosed = (() => {
    console.log('session closed')
    uitoolkit.closeSession(this.sessionContainer)
    this.inSession = false
  })
}