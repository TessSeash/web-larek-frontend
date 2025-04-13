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
	title: string;
	category: string;
	image?: string;
	description?: string;
	price: number | null;
}
```

Интерфейс для частей приложения: каталог, корзина, превью, форма заказа
```
interface IAppState {
	catalog:IProduct[];
	cart: string[];
	preview: string | null;
	order: IOrder;
}
```
Интерфейс корзины товаров
```
 interface ICart {
	products: IProduct[];
	totalPrice: string | number;
 }
```
Интерфейс данных покупателя для оформления заказа
```
interface IOrderForm {
    	payment: TPayment;
    	address: string;
    	email: string;
    	phone: string;
    	paymentPrice: string | number;
}
```
Интерфейс данных самого заказа (Товары и данные покупателя)
```
interface IOrder extends IOrderForm {
    	items: string[];
}
```
Интерфейс данных, приходящих с сервера
```
interface IOrderResult {
    	id: string;
    	total: number;
}
```
Типы ошибки заказа
```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

Тип способа оплаты заказа
 
 ```
 type TPayment = 'card' | 'cash' | undefined;
 ```

 Типы взаимодействий компонентов (события)
 ```
 export type AppEvents =
  | 'modal:open'
  | 'modal:close'
  | 'product:select'
  | 'product:add'
  | 'product:remove'
  | 'cart:submit'
  | 'orderFormData:valid'
  | 'orderFormData:submit'
  | 'orderFormData:orderCompleted';
 ```

## Архитектура приложения

Код приложения разделён на слои согласно паттерну Model-View-Presenter (MVP)
- слой представления, отвечает за отображение данных на странице
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных

### Базовый код

#### Класс API
Класс для работы с API.
В конструктор передается url (baseUrl) и опции запроса (options)

##### Методы:
- `get` - выполняет GET-запрос по переданному URI, добавляя его к базовому URL.
- `post` - выполняет запрос с телом (body) и методом POST, PUT, PATCH или другим, отправляя данные на сервер.

##### Типы:
- `ApiPostMethods` - Типы для 'POST', 'PUT', 'DELETE' запросов.
- `ApiListResponse<Type>` - Ответ с количеством элементов и массив с данными.


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



### Слой модель

#### Класс ProductsData

Класс для хранения данных о товарах на главной странице и их логика работы

##### Поля класса:

- `products: IProduct[];` - Товары в ассортименте на главной (Ввиде массива объектов)

##### Методы:

- `setProduct(product: IProduct[]): void` - добавить продукт
- `deleteProduct(product: IProduct[]): void` - удалить продукт
- `getProducts(id: string): IProduct | undefined;` - получить все товары

#### Класс CartData

Класс для хранения данных о товарах в корзине их логика работы

##### Поля класса:

- `cart: ICart` - Выбранные товары в корзине покупателя (Массив объектов)

##### Методы:

- `addProductToCart(id: string): void` - добавить товар в корзину
- `removeProductFromCart(id: string): void` - убрать товар из корзины
- `clearCart(): void` - очистить корзину от всех товаров
- `getProducts(): IProduct` - вернуть массив товаров в корзине

### Слой представления

#### Класс Modal

Класс модального окна. Отвечает за отображение всплывающих окон: предпросмотр товара, корзина или форма оформления заказа.

- `constructor(selector: string, events: IEvents)` - конструктор находит модальное окно и настраивает систему событий.

##### Поля класса:

- `modal: HTMLElement` - элемент для отображения модального окна.
- `events: IEvents` - брокер событий

##### Методы:

- `open` - открыть модальное окно
- `close` - закрыть модальное окно


#### Класс Page

Класс следит за состоянием страницы. Работает с основной обёрткой страницы, кнопкой открытия корзины, счётчиком товаров.
Класс взаимодействует с корзиной, передавая события через систему событийного брокера.

##### Поля класса:

- `wrapper: HTMLElement` - состояние обертки страницы.
- `button: HTMLButtonElement` - кнопка для открытия корзины.
- `counter: HTMLSpanElement` - счётчик количества товаров в корзине.

##### Методы:
- `set isLocked(value:boolean)` - блокировать или разблокировать страницу.
- `set counter(value:number)` - изменить счётчик количества товаров в корзине.


#### Класс Product

 Класс представляет товар и его характеристики(описание)

 ##### Поля класса:

- `id` - уникальный код товара
- `title` - название 
- `category` - категория(тип)
- `image` - изображение
- `description` - описание
- `price` - цена

##### Методы:

- `set id(value: string)` - установить идентификатор товара
- `set title(value: string)` - установить название
- `set category(value: string)` - установить категорию(тип)
- `set image(value: string)` -  установить изображение
- `set description(value: string)` - установить описание
- `set price(value: string)` - установить цену

#### Класс OrderForm

Класс для процесса оформления покупки. Покупатель указывает свои данные и способ оплаты

 ##### Поля класса:
- `payment(value: TPayment)` - способ оплаты
- `address(value: string)` - адрес доставки
- `email: HTMLInputElement` - электронная почта
- `phone: HTMLInputElement` - номер телефона
- `paymentPrice(value: string)` - итоговая цена для оплаты

##### Методы:

- `set payment(value: TPayment)` - устанавливает способ оплаты.
- `set address(value: string)` - устанавливает адрес доставки.
- `set email(value: string)` - устанавливает email.
- `set phone(value: string)` - устанавливает номер телефона.
- `set paymentPrice(value: string)` - устанавливает итоговую цену для оплаты

- `get payment(): TPayment` - возвращает способ оплаты.
- `get address(): string` - возвращает адрес доставки.
- `get email(): string` - возвращает email
- `get phone(): string` - возвращает номер телефона.

### Слой презентера

#### Класс ApiService
Класс работает как посредник между фронтендом и бэкендом(API). Отправление запросов сервису и обработка полученных данных.

##### Методы:

- `getProducts` - Получить данные о товарах с сервера.
- `sendOrder` - Отправить заказ.


## Взаимодействия компонентов
- `modal: open` - открытие модального окна.
- `modal: close` - закрытие модального окна.
- `product: select` - выбор товара для просмотра.
- `product: add` - добавление товара в корзину.
- `product: remove` -  удаление товара из корзины 
- `cart: submit` - завершение процесса выбора товаров и переход к оформлению заказа
- `orderFormData:valid` — валидация формы оформления заказа.
- `orderFormData:submit` — подтверждение данных покупателя.
- `orderFormData: orderCompleted` - завершение заказа.
