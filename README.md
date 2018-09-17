# Кастомная интеграция для блоков и сайтов на Weblium

## Содержание
#### __Как добавить интеграцию к определённому блоку или странице?__
#### __Добавление GeoPlugin для подмены номеров на сайте относительно региона пользователя__
####  __Настройка отслеживания ивентов на заполнение формы/клик кнопки Google Tag Manager__

---

### Как добавить интеграцию к определённому блоку или странице?

#### Для того, что бы привязать код к __определенному блоку__ на сайте, необходимо:

1. Узнать __ID__ блока. Найти его можно заглянув в __Google Dev Tools (Inspect Mode)__ - http://prntscr.com/k20uuo
2. Добавить в CSS данную строку, в соотвествии с ID блока, который был найден:
```css
 #cover ~ section элемент_в_блоке {
   изменения
   }
```
`~ section` отвечает за переход в контент блока, соотвественно возможность редактировать все, что находится в нём.



#### Для того, что бы привязать код к __определенной странице__, необходимо:

1. Узнать __ID__ страницы. Найти его можно заглянув в __Google Dev Tools (Inspect Mode)__ - http://prntscr.com/k21cbd
2. Добавить в CSS данную строку, в соотвествии с ID страницы, который был найден. 
```css
 #page-home элемент {
   изменения
   }
```
Логика ID страницы состоит в `#page-$slug$`. То есть, ID страницы всегда будет состоять из __#page-__ и __URL__ страницы.

---

### __Добавление GeoPlugin для подмены номеров на сайте относительно региона пользователя__

1. На странице создается __Extra Block__, во вкладку __JS__ добавляем код - https://codepen.io/anon/pen/NLObmV
* 1.1  В конце кода есть путь к которому обращается данный скрипт - 
```css
#header ~ header a[class*="header__button__"]
```
2. В самом начале кода есть перечень стран с их [ISO номерами](https://countrycode.org/) (желательно использовать первый вариант, то есть RU, UA и т.д.)

__*String:*__ Номер в том виде в котором он будет отображаться на странице

__*Number:*__ Номер для линка, который прописывается в виде `tel:+380...` (без использования скобок, дефисов и прочего)

```js
	rest: {
		string: '+372 884-00-64 ',
		number: '+3728840064'
	},
``` используется для обозначения дефолтного номера, который будет работать для тех стран, что не указаны в скрипте.
