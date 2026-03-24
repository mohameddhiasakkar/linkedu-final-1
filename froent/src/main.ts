import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app/app.config';
<<<<<<< HEAD:froent/src/main.ts
import { App } from './app/app/app';
=======
import { AppComponent } from './app/app/app.component';
>>>>>>> upstream/main:src/main.ts
import 'zone.js';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));