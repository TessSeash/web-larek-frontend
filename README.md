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
	previw: string | null;
	order: IOrder;
}
```

Интерфейс данных покупателя для оформления заказа
```
interface IOrderForm {
    	payment: string;
    	address: string;
    	email: string;
    	phone: string;
    	total: string | number;
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
## Архитектура приложения

Код приложения разделён на слои согласно паттерну Model-View-Presenter (MVP)
- слой представления, отвечает за отображение данных на странице
- слой данных, отвечает за хранение и изменение данных
- презентер, отвечает за связь представления и данных

### Базовый код
#### Класс API
Класс для работы с API.
В конструктор передается url (baseUrl) и опции запроса (options)
Методы:
- `get` - выполняет GET-запрос по переданному URI, добавляя его к базовому URL.
- `post` - выполняет запрос с телом (body) и методом POST, PUT, PATCH или другим, отправляя данные на сервер.
#### Класс Model
#### Класс Component
#### Класс EventEmitter
