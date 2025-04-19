# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Описание проекта
Небольшое фронтенд-приложение с архитектурой Model-View-Presenter (MVP). 
Пользователи могут просматривать каталог товаров, изучать подробности, добавлять в корзину товары и оформлять заказ.

## Описание данных
Интерфейс товара
```
interface IProduct {
	id: string; 
	index: number;
	title: string; 
	category: string; 
	image?: string; 
	description?: string; 
	price: number | null; 
	button?: HTMLElement;
}
```

Интерфейс для частей приложения: каталог, корзина, превью, форма заказа
```
interface IAppState {
	catalog: IProduct[];
	cart: string[]; 
	preview: string | null;
	order: IOrder; 
}
```

Интерфейс данных покупателя для оформления заказа
```
interface IOrderForm {
    payment: 'cash' | 'card';
	address: string; 
	email: string; 
	phone: string;
}
```
Интерфейс данных заказа (Товары и стомость заказа)
```
interface IOrder extends IOrderForm {
    items: string[];
    total: number;
}
```
Тип для возврата данных с сервера в случае успешно оформленного заказа
```
interface IOrderResult {
	id: string;
	total: number;
}
```
Интерфейс корзины товаров
```
 interface ICart {
	products: HTMLElement[];
	totalPrice: number; 
	selected: string[];
 }
```
Типы ошибки валидации данных формы
```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

Тип способа оплаты заказа
 
 ```
 type TPayment = 'card' | 'cash';
 ```

 Типы взаимодействий компонентов (события)
 ```
enum AppEvents { //все события
    CatalogChanged = 'catalog:changed',
    ProductSelect = 'product:select',
    ProductAdd = 'product:add',
    ProductRemove = 'product:remove',
    ModalOpen = 'modal:open',
    ModalClose = 'modal:close',
    PreviewChanged = 'preview:changed',
    CartOpen = 'cart:open',
    CartChanged = 'cart:changed',
    CounterChanged = 'counter:changed',
    OrderOpen = 'order:open',
    PaymentChanged = 'payment:changed',
    OrderAddressChanged = 'order.address:changed',
    ContactsEmailChanged = 'contacts.email:changed',
    ContactsPhoneChanged = 'contacts.phone:changed',
    FormErrorsChanged = 'formErrors:changed',
    OrderSubmit = 'order:submit',
    ContactsSubmit = 'contacts:submit',
  }
 ```
 Типы категорий заказа
 ```
 enum Category { // категория товаров
	SoftSkill = 'софт-скил',
	HardSkill = 'хард-скил',
	Additional = 'дополнительное',
	Other = 'другое',
	Button = 'кнопка',
}

const categoryClasses: Record<Category, string> = {
	[Category.SoftSkill]: 'soft',
	[Category.HardSkill]: 'hard',
	[Category.Additional]: 'additional',
	[Category.Other]: 'other',
	[Category.Button]: 'button',
}
 ```
Значения для валидации, чтобы подставлять в контейнер с ошибками
 ```
 const errText = {
    address: 'Укажите адрес доставки',
    email: 'Необходимо указать электронную почту',
    phone: 'Необходимо указать номер телефона',
}
 ```

## Архитектура приложения

Код приложения разделён на слои согласно паттерну Model-View-Presenter (MVP)
- слой представления, отвечает за отображение данных на странице
- слой данных, отвечает за хранение, изменение и валидацию данных
- презентер, отвечает за связь представления и данных

### Базовый код

#### Класс API
Класс для работы с API.
В конструктор передается url (baseUrl) и опции запроса (options)
Конструктор создаёт экземпляр API-клиента

`constructor(baseUrl: string, options?: RequestInit)`

##### Методы:
- `get(uri: string): Promise<object>`
Выполняет GET-запрос по переданному URI, добавляя его к базовому URL.

- `post(uri: string, data: object, method?: ApiPostMethods): Promise<object>` 
Выполняет запрос с телом (body) и методом POST, PUT, PATCH или другим, отправляя данные на сервер.

##### Типы:
- `type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'`
Типы для 'POST', 'PUT', 'DELETE' запросов.

- `type ApiListResponse<Type> = { total: number; items: Type[] }`
Ответ с количеством элементов и массив с данными.


#### Класс EventEmitter
Класс реализует брокер событий. 
Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события

##### Свойства:
`_events` — карта всех событий и их подписчиков.

##### Методы:
- `on` - Подписывает функцию callback на событие с именем eventName.
- `off` - Удаляет обработчик callback из события eventName.
- `emit` - Генерирует событие eventName, передавая data всем его подписчикам.
- `onAll` - Подписывает функцию callback на все события сразу.
- `ofAll` - Полностью сбрасывает все подписки на все события.
- `trigger` - Возвращает функцию, которая при вызове вызовет событие eventName, объединив переданные данные с `context`

##### Типы:
- `EventName` - Тип, описывающий имя события, может быть регулярным выражением или обычной строкой.
- `Subscriber` - Тип функции-обработчика события. Принимает опциональные данные `(data)` и ничего не возвращает.
- `EmitterEvent` - Событие с данными, содержащими имя события и саму информацию.

#### Класс Component
Класс Component<T> - абстрактный. Класс используется для работы с DOM, создания компонентов.
Позволяет типизировать входные параметры компонента(Дженерик).

##### Свойства:
- `container: HTMLElement` — корневой HTML-элемент компонента.

##### Конструктор
- `constructor(container: HTMLElement)` 
Создаёт компонент, привязанный к указанному DOM-элементу. Принимает на вход `container: HTMLElement`

##### Методы

- `render(data?: Partial<T>): HTMLElement`
Метод render обновляет внутренние данные компонента и возвращает его корневой DOM-элемент. 
Он используется для того, чтобы обновить данные компонента и показать его во внешнем интерфейсе.

- `toggleClass(element: HTMLElement, className: string, force?: boolean): void` 
Добавляет или убирает CSS-класс у элемента.

- `setText(element: HTMLElement, value: unknown): void`
Устанавливает текст для элемента.

- `setDisabled(element: HTMLElement, state: boolean): void`
Включает или выключает атрибут disabled у элемента.

- `setHidden(element: HTMLElement): void`
Скрывает элемент, устанавливая display: none.

- `setVisible(element: HTMLElement): void`
Показывает скрытый элемент, удаляя display.

- `setImage(element: HTMLImageElement, src: string, alt?: string): void`
Устанавливает изображение и (опционально) alt.

#### Класс Model
Класс Model - абстрактный.
Класс помогает работать с данными и отправлять события, когда что-то изменилось.
Также позволяет отличать модели от обычных объектов.

##### Конструктор
- `constructor(data: Partial<T>, events: IEvents)`
Создаёт модель с начальными данными и возможностью уведомлять другие части приложения об изменениях.

##### Методы

- `emitChanges(event: string, payload?: object): void`
Уведомляет, что модель изменилась.

### Слой модель

#### Класс AppState

Класс для управления состоянием каталога товаров, корзины, заказа и формы оформления заказа. 
Предоставляет методы для изменения состояния и оповещения подписчиков об изменениях.

##### Поля класса:

- `catalog:IProduct[]` - хранение товаров в ассортименте на странице
- `cart: IProduct[]` - хранение id товаров, добавленных в корзину
- `preview: string | null` - id товара который, просматривают
- `order: IOrder` - текущий заказ
- `formErrors` - ошибки валидации в форме оформления заказа
- `orderForm(): IOrderForm` - данные формы оформления заказа, формируются на основе текущего заказа order при помощи сеттера.
##### Методы:

- `set orderForm(value: IOrderForm)` - сформировать данные формы оформления заказа
- `setCatalog(items: IProduct[])` - установить список товаров в каталоге(в наличии на главной странцие)
- `setPreview(item: IProduct)` - установить товар для предосмотра.

- `addProductToCart(id: string): void` - добавить товар в корзину и оповещает подписчиков об изменении
- `removeProductFromCart(id: string): void` - убрать товар из корзины и оповещение подписчиков
- `productInCart(item: IProduct): boolean` - проверка наличия товара в корзине
- `getOrder(): IOrder` - вернуть объект текущего заказа.
- `getProducts(): IProduct` - вернуть массив с ID товаров в корзине
- `getTotal(): number` - вернуть сумму всех товаров в корзине.
- `setOrderAddress(value: string)` - назначить адрес доставки и включить проверку валидности
- `setOrderEmail(value: string)` - назначить электронную почту и включить проверку валидности
- `setOrderPhone(value: string)` - назначить номер телефона и включить проверку валидности
- `checkValidity(form: string)` - проверить валидность получаемого инпута и уведомить подписчиков о событии
- `clearAppData()` - очистить данные о пользователе и о заказе, испольуется после успешной отправки заказа на сервер


### Слой представления
Классы в этом слое отвечают за отображение данных внутри контейнера (DOM-элемент).

#### Класс Modal

Класс модального окна. Отвечает за отображение всплывающих окон: предпросмотр товара, корзина или форма оформления заказа.

- `constructor(selector: string, events: IEvents)` - конструктор находит модальное окно и настраивает систему событий.

##### Поля класса:

- `_content` - элемент для отображения модального окна.
- `_closeButton` - элемент закрытия модального окна

##### Методы:

- `open` - открыть модальное окно
- `close` - закрыть модальное окно
- `render` - обновляет данные компонента и возвращает его контейнер.

#### Класс Cart
Класс для отображения корзины. Имеет список выбранных товаров и итоговую цену.

##### Поля класса:
- `_products: HTMLElement;` - контейнер для выбранных товаров
- `_total: HTMLElement` - элемент итоговой цены к оплате
- `_button` - кнопка для перехода к оформлению заказа(чтобы начать оформление)

##### Методы:

- `set items(items: HTMLElement[])` - обновление списка товаров
- `set selected(items: string[])` - активирует или деактивирует кнопку оформления в зависимости от наличия выбранных товаров.
- `set total(total: number)` - обновление итоговой цены к оплате. Если в корзине бесценный товар то нельзя оплачивать

#### Класс OrderResult
Класс для отображения успешно сделанного заказа

##### Поля класса:
- `_close: HTMLElement` - кнопка закрытия окна успешно завершенного заказа
- `_description: HTMLElement` - элемент с сообщением об успешно завершенной покупке

##### Методы:

- `set total(total: number)` - установка суммы за итоговый заказ

#### Класс Page

Класс следит за состоянием страницы. Работает с основной обёрткой страницы, кнопкой открытия корзины, счётчиком товаров.
Класс взаимодействует с корзиной, передавая события через систему событийного брокера.

##### Поля класса:

- `_wrapper: HTMLElement` - состояние обертки страницы.
- `_buttonCart: HTMLButtonElement` - кнопка для открытия корзины.
- `_counter: HTMLSpanElement` - счётчик количества товаров в корзине.
- `_catalog: HTMLElement` - контейнер каталога товаров на главной странице

##### Методы:
- `set catalog(items: HTMLElement[])` - установить товары в каталоге
- `set counter(value: number)` - установить счётсчик товаров в корзине
- `set locked(value: boolean)` - закрепить или открепить страницу от прокрутки

#### Класс Product

 Класс представляет товар и его характеристики(описание)

 ##### Поля класса:

- `id` - уникальный код товара
- `title` - название 
- `category` - категория(тип)
- `image` - изображение
- `description` - описание
- `price` - цена
- `button` -  кнопка для добавления карточки в превью
- `index` - номер товара в корзине покупок

##### Методы:

- `set id(value: string)` - установить идентификатор товара
- `set title(value: string)` - установить название
- `set category(value: string)` - установить категорию(тип)
- `set image(value: string)` -  установить изображение
- `set description(value: string)` - установить описание
- `set price(value: string)` - установить цену
- `set button(value:string)` - установить текст в кнопке


#### Класс OrderForm

Класс для процесса оформления покупки. Покупатель указывает свои данные и способ оплаты

 ##### Поля класса:
- `_paymentButtons: HTMLButtonElement[]` - кнопки способа оплаты
- `_paymentCard: HTMLButtonElement` - кнопка оплаты картой
- `_paymentCash: HTMLButtonElement` - кнопка оплаты наличными при получении
- `_addressInput: HTMLInputElement` - поле ввода для адреса

##### Методы:

- `set payment` - устанавливает способ оплаты.
- `set valid` - активировать деактивировать кнопку продолжения оформления формы
- `clearAddress` - очистить поле ввода адреса


#### Класс ContactsForm
Класс предназначен для работы с контактной формой(email и телефона) оформления заказа.
##### Поля класса:

- `emailInput` - поле ввода email.
- `phoneInput:` - поле ввода номера телефона.

##### Методы:

- `clearContacts` - очистить поля ввода электронной почты и номера телефона


#### Класс BaseForm
Класс представляет собой базовый абстрактный компонент формы.
Он нужен для управления поведением валидации, отображением ошибок и обработкой ввода данных.

##### Поля класса:
- `_submitButton: HTMLButtonElement` - кнопка в оформлении заказа
- `_errors: HTMLElement` - контейнер для отображения ошибок

##### Методы:
- `onInputChange` - метод, вызываемый при изменении любого поля формы. Генерирует событие кастомные события.
- `set valid` - устанавливает валидность формы
- `set errors` - устанавливает список ошибок
- `render` - метод для обновления состояния формы

### Слой презентера
Слой презентера отвечает за связь между данными и пользовательским интерфейсом. 
Обрабатывает события, полученные от слоя представления, управляет логикой взаимодействия, координирует вызовы к API и обновление UI.
Реагирует на действия пользователя и что сделать: вызвать API, обновить данные, показать или скрыть модальное окно и т.д.

#### Класс ApiService
Класс работает как посредник между фронтендом и бэкендом(API). Отправление запросов сервису и обработка полученных данных.

##### Методы:

- `getProducts` - Получить данные о товарах с сервера.
- `sendProducts` - Отправить заказ на сервер.


#### Взаимодействия компонентов(события)
- `catalog: changed` — изменение каталога товаров.
- `product: select` — выбор товара для просмотра.
- `product: add` — добавление товара в корзину.
- `product: remove` — удаление товара из корзины.
- `modal: open` — открытие модального окна.
- `modal: close` — закрытие модального окна.
- `preview: changed` — обновление предпросмотра товара.
- `cart: open` — открытие корзины.
- `cart: changed` — изменение содержимого корзины.
- `counter: changed` — изменение счётчика товаров.
- `order: open` — открытие формы оформления заказа.
- `payment: changed` — изменение способа оплаты.
- `order.address: changed` — изменение адреса доставки.
- `contacts.email: changed` — изменение почты в контактной форме.
- `contacts.phone: changed` — изменение телефона в контактной форме.
- `formErrors: changed` — изменение состояния ошибок в форме.
- `order: submit` — завершение заполнения формы с адрессом и оплатой.
- `contacts: submit` — завершение заполнения формы с почтой и номером телефона.
