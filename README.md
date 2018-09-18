# Кастомная интеграция для блоков и сайтов на Weblium

### Содержание
#### [__Как добавить интеграцию к определённому блоку или странице?__](#Как-добавить-интеграцию-к-определённому-блоку-или-странице-1)
#### [__Добавление GeoPlugin для подмены номеров на сайте относительно региона пользователя__](#Добавление-geoplugin-для-подмены-номеров-на-сайте-относительно-региона-пользователя-1)
####  __Настройка отслеживания ивентов на заполнение формы/клик кнопки Google Tag Manager__

---

## Как добавить интеграцию к определённому блоку или странице?

#### Для того, что бы привязать код к __определенному блоку__ на сайте, необходимо:

1. Узнать __ID__ блока. Найти его можно заглянув в __Google Dev Tools (Inspect Mode)__ - [тут](http://prntscr.com/k20uuo)
2. Добавить в CSS данную строку, в соотвествии с ID блока, который был найден:
```css
 #cover ~ section элемент_в_блоке {
   изменения
   }
```
`~ section` отвечает за переход в контент блока, соотвественно возможность редактировать все, что находится в нём.
В случае с header и footer, это будет соответственно `~ header` и `~ footer`. Что значит `~` - читать [здесь](http://htmlbook.ru/css/selector/sibling)


#### Для того, что бы привязать код к __определенной странице__, необходимо:

1. Узнать __ID__ страницы. Найти его можно заглянув в __Google Dev Tools (Inspect Mode)__ - [тут](http://prntscr.com/k21cbd)
2. Добавить в CSS данную строку, в соотвествии с ID страницы, который был найден. 
```css
 #page-home элемент {
   изменения
   }
```
Логика ID страницы состоит в `#page-$slug$`. То есть, ID страницы всегда будет состоять из __#page-__ и __URL__ страницы.
> Автор раздела: Michail Ozdemir

---

## __Добавление GeoPlugin для подмены номеров на сайте относительно региона пользователя__

1. На странице создается __Extra Block__. Во вкладку __JS__ добавляем [код](https://codepen.io/anon/pen/NLObmV)
2. В конце данного кода есть путь по которому обращается этот скрипт, то есть на что он будет применятся. Будь то кнопка или номер телефона где-то на странице. 
```css
#header ~ header a[class*="header__button__"]
```
3. В самом начале кода находится массив стран с их [ISO номерами](https://countrycode.org/) (желательно использовать первый вариант, то есть RU, UA, BY и т.д.).

    __String__ отвечает за номер в том виде в котором он будет отображаться на странице.  
    __Number__ отвечает за ссылку, которая прописывается в виде `tel:+380...` (без использования скобок, дефисов и прочего)  
    __rest__ используется для обозначения дефолтного номера, который будет работать для тех стран, что не указаны в скрипте.  
```js
	rest: {
		string: '+372 884-00-64',
		number: '+3728840064'
	},
``` 
4. Заменяем номера и страны, в которых он будет отображаться на нужные и сохраняем изменения, не забывая про `rest`. Привязываем все значения к нужным елементам и паблишим сайт. :+1:
   [Пример рабочего кода](https://c70y1.weblium.site/) находится в кнопке в шапке сайта.
> Автор раздела: Denys Lysiuk
