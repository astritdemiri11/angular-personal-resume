import { ResponseType } from 'src/app/shared/models/response/response.enum';

import { Contact as ContactInterface, ContactDTO } from './contact.interface';

export class Contact implements ContactInterface {
  addresses: string[];
  emails: string[];
  phones: string[];

  constructor(contactDTO: ContactDTO, public status = ResponseType.Success, public error: string | null = null) {
    this.addresses = contactDTO.a;
    this.emails = contactDTO.e;
    this.phones = contactDTO.p;
  }
}
