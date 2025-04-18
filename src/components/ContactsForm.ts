import { BaseForm } from "./common/BaseForm";
import { IOrderForm } from "../types";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

export class ContactsForm extends BaseForm<IOrderForm> {
    emailInput: HTMLInputElement;
    phoneInput: HTMLInputElement;
    payOrderButton: HTMLButtonElement;
  
    constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
  
      this.emailInput = ensureElement<HTMLInputElement>('input[name=email]', this.container);
      this.phoneInput = ensureElement<HTMLInputElement>('input[name=phone]', this.container);
  
    }

    clearContacts() {
        this.emailInput.value = '';
        this.phoneInput.value = '';
      }
  }
  