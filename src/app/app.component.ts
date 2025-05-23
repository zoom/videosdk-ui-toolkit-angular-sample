import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

import uitoolkit, { CustomizationOptions } from "@zoom/videosdk-ui-toolkit";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {

  sessionContainer: any;
  authEndpoint = ''
  inSession: boolean = false
  config : CustomizationOptions = {
    videoSDKJWT: '',
    sessionName: 'test',
    userName: 'Angular',
    sessionPasscode: '123',
    featuresOptions: {
      virtualBackground: {
        enable: true,
        virtualBackgrounds: [{
          url: 'https://images.unsplash.com/photo-1715490187538-30a365fa05bd?q=80&w=1945&auto=format&fit=crop'
        }]
     }
    }
  };
  role = 1

  constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document: any, private ngZone: NgZone) {

  }

  ngOnInit() {
    
  }

  getVideoSDKJWT() {
    this.sessionContainer = document.getElementById('sessionContainer')

    this.inSession = true
    
    this.httpClient.post(this.authEndpoint, {
	    sessionName:  this.config.sessionName,
      role: this.role,
      videoWebRtcMode: 1,
    }).subscribe((data: any) => {
      if(data.signature) {
        console.log(data.signature)
        this.config.videoSDKJWT = data.signature
        this.joinSession()
      } else {
        console.log(data)
      }
    })
  }

  joinSession() {
    this.ngZone.runOutsideAngular(() => {
      uitoolkit.joinSession(this.sessionContainer, this.config)
      uitoolkit.onSessionClosed(this.sessionClosed)
      uitoolkit.onSessionDestroyed(this.sessionDestroyed)
    })
  }

  sessionClosed = (() => {
    console.log('session closed')
    this.inSession = false
  })

  sessionDestroyed = (() => {
    console.log("session destroyed")
    uitoolkit.destroy();
  })
}