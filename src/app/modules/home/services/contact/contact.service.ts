import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslationLoaderService } from 'ngx-material-translate';
import { take } from 'rxjs';
import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { ContactDTO } from '../../models/contact/contact.interface';
import { Contact } from '../../models/contact/contact.model';
import * as ContactActions from '../../state/contact/contact.actions';
import * as fromContactReducer from '../../state/contact/contact.reducer';
import * as ContactSelectors from '../../state/contact/contact.selectors';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  model = this.getModel();
  business = this.getBusiness();
  request = this.getRequest();

  constructor(
    private store: Store<fromContactReducer.State>,
    private translationLoaderService: TranslationLoaderService) { }

  private getModel() {
    return {
      state$: this.store.select(ContactSelectors.selectContactState),
      contact$: this.store.select(ContactSelectors.selectContact),
      status$: this.store.select(ContactSelectors.selectStatus)
    }
  }

  private getBusiness() {
    const self = this;

    return {
      convertDTO: (contactDTO: ContactDTO) => {
        return new Contact(contactDTO);
      },
      convertToDTO: (contact: Contact): ContactDTO => {
        return {
          a: contact.addresses,
          e: contact.emails,
          p: contact.phones
        };
      },
      addContact: (contact: Contact) => {
        self.store.dispatch(ContactActions.loadContactSuccess({ contact }));
      },
      loadContact: (path: string, force: boolean = false) => {
        self.model.status$.pipe(take(1)).subscribe(status => {
          if(status === ResponseType.Loading) {
            return;
          }

          if (!force && status === ResponseType.Success) {
            return;
          }

          self.store.dispatch(ContactActions.loadContact({ path: `${path}.json` }));
        });
      }
    }
  }

  private getRequest() {
    const self = this;

    return {
      loadContact: (path: string) => {
        return self.translationLoaderService.get<ContactDTO, null>(path, {}, null);
      }
    }
  }
}
