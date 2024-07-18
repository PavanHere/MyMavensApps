import { createBrowserHistory } from 'history';
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: 'YOUR_APPLICATION_ID',
  clientToken: 'YOUR_CLIENT_TOKEN',
  site: 'YOUR_DATADOG_SITE', // 'datadoghq.com', 'datadoghq.eu', etc.
  service: 'your-service-name',
  env: 'your-environment-name',
  version: '1.0.0', // version of your application
  sampleRate: 100,
  trackInteractions: true,
  defaultPrivacyLevel: 'mask-user-input', // or 'allow', 'mask'
  beforeSend: (event, context) => {
    // Modify event or context here if needed
  },
});

datadogRum.startSessionReplayRecording();

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { datadogRum } from '@datadog/browser-rum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        datadogRum.addAction('navigation', { path: event.urlAfterRedirects });
      }
    });
  }
}

