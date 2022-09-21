import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
import { ServerModule } from '@angular/platform-server';
import { readFileSync } from 'fs';
import { CustomError, Response, ResponseType, TranslationLoaderService } from 'ngx-material-translate';
import { join } from 'path';
import { catchError, map, Observable } from 'rxjs';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { ServerInitializer } from './core/initializer/server.initializer';

export function initApp(serverLoadService: ServerInitializer) {
  return () => serverLoadService.initApp();
}

export function serverLoader() {
  return {
    get<T, U>(url: string, _options: Object, append: U): Observable<{ append: U, data: T }> {
      return new Observable<T>(subscriber => {
        const distFolder = join(process.cwd(), 'dist/personal-resume/browser');
        const stringData = readFileSync(distFolder + url, 'utf-8');

        subscriber.next(JSON.parse(stringData))
        subscriber.complete();
      }).pipe(
        catchError((error: { message: string }) => {
          throw new CustomError<U>(error.message, append);
        }),
        map(responseSerialized => {
          const response = new Response<T>(responseSerialized, ResponseType.Success, null);
          return { append, data: response.data }
        }));
    }
  }
}


@NgModule({
  imports: [
    AppModule,
    FlexLayoutServerModule,
    ServerModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initApp, multi: true, deps: [ServerInitializer] },
    { provide: TranslationLoaderService, useFactory: serverLoader }
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule { }
