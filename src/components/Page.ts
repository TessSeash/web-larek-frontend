import { Component } from './base/Components';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IPage {
    catalog:HTMLElement;
    counter: number;
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _buttonCart: HTMLButtonElement;
  
    constructor(container: HTMLElement, protected events: IEvents) {
      super(container);
  
      this._counter = ensureElement('.header__basket-counter');
      this._catalog = ensureElement('.gallery');
      this._wrapper = ensureElement('.page__wrapper');
      this._buttonCart = ensureElement<HTMLButtonElement>('.header__basket');
  
      this._buttonCart.addEventListener('click', () => {
        this.events.emit('cart:open');
      });
    }
  
    set catalog(items: HTMLElement[]) {
      this._catalog.replaceChildren(...items);
    }
  
    set counter(value: number) {
      this.setText(this._counter, String(value));
    }
  
    set locked(value: boolean) {
      this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    }
  }