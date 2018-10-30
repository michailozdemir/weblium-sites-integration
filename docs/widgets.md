---
sidebarDepth: 2
---

# Интеграция виджетов

## Google Tag Manager
### Настройка отслеживания ивентов на отправку формы/клик кнопки Google Tag Manager

Определитесь, что нужно отслеживать. Кнопку или отправку формы. Начнем с кнопки.

### Для того, что бы настроить отслеживание event'a на клик кнопки, нужно:

1. Найти кнопку в DOM'e сайта с помощью `document.querySelector` и внести её в переменную, которую мы назовём `button`
```js
var button = document.querySelector('#cover ~ section a');
```

2. После того, как кнопка была найдена, нужно навесить функцию на кнопку, которая будет срабатывать при клике.
Сделаем это с помощью события `onclick`.
```js
button.onclick = function () {

}
```

3. Внутри функции добавляем действие, которые выслал клиент.
```js
button.onclick = function () {
dataLayer.push({
		'event': 'Event_landing_page',
		'eventCategory': 'order',
		'eventAction': 'form_send',
	});
}
```

4. Готовый скрипт выглядит вот так:
```js
var button = document.querySelector('#cover ~ section a');
button.onclick = function () {
dataLayer.push({
		'event': 'Event_landing_page',
		'eventCategory': 'order',
		'eventAction': 'form_send',
	});
}
```


### Для того, что бы настроить отслеживание event'a на отправку формы, нужно:

Все выглядит практически так же как и в настройках для кнопки, только лишь событие будет `onsubmit`, а не `onclick` как в примере выше. Так же, стоит заменить название переменной, что бы избежать одинаковых названий.

```js
var form = document.querySelector('#cover ~ section form');
form.onsubmit = function () {
dataLayer.push({
		'event': 'Event_landing_page',
		'eventCategory': 'order',
		'eventAction': 'form_send',
	});
}
```

Подробнее о событиях [`onclick`](https://www.w3schools.com/jsref/event_onclick.asp), [`onsubmit`](https://www.w3schools.com/jsref/event_onsubmit.asp) и [`querySelector`](https://www.w3schools.com/jsref/met_document_queryselector.asp)

---

## Facebook Pixel
### Установка Facebook Pixel и отслеживания ивентов на отправку формы/клик кнопки

1. Для установки __Facebook Pixel__ виджета, необходимо получить его код. Поступает он от клиента. Вставляется в раздел `<head>`

```html
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '772721986392137');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=772721986392137&ev=PageView&noscript=1
https://www.facebook.com/tr?id=772721986392137&ev=PageView&noscript=1

https://www.facebook.com/tr?id=772721986392137&ev=PageView&noscript=1
https://www.facebook.com/tr?id=772721986392137&ev=PageView&noscript=1

"
/></noscript>
<!-- End Facebook Pixel Code -->
```
2. После успешной установки виджета, разберемся с отслеживанием ивентов. Ивенты так же приходят нам от клиентов в соответствии с их требованиями. Для примера берём вот этот ивент, который отслеживает завершение регистрации (потенициальную конверсию клиента в покупателя):

```js
fbq('track', 'Lead');
```

3. Здесь все делается по аналогии с __Google Tag Manager__. Для начала найдем кнопку в DOM'e сайта с помощью `document.querySelector` и внесем её в переменную, которую назовём `button`

```js
var button = document.querySelector('#cover ~ section a');
```

2. После того, как кнопка была найдена, нужно навесить функцию на кнопку, которая будет срабатывать при клике.
Сделаем это с помощью события `onclick`.
```js
button.onclick = function () {

}
```

3. Внутри функции добавляем действие, которые выслал клиент.
```js
button.onclick = function () {
fbq('track', 'Lead');
}
```

4. Готовый скрипт выглядит вот так:
```js
var button = document.querySelector('#cover ~ section a');
button.onclick = function () {
fbq('track', 'Lead');
}
```

### Для того, что бы настроить отслеживание event'a на отправку формы, нужно:

Все выглядит практически так же как и в настройках для кнопки, только лишь событие будет `onsubmit`, а не `onclick` как в примере выше. Так же, стоит заменить название переменной, что бы избежать одинаковых названий.

```js
var form = document.querySelector('#cover ~ section form');
form.onclick = function () {
fbq('track', 'Lead');
}
```

### Как проверить работоспособность виджета?

Что бы удостоверится в правильной установке Facebook Pixel, используется специальное расширение для Chrome - [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc).  Расширение отображает как и успешную установку, так и ошибки которые могли возникнуть после нее.

Подробнее о событиях [`onclick`](https://www.w3schools.com/jsref/event_onclick.asp), [`onsubmit`](https://www.w3schools.com/jsref/event_onsubmit.asp) и [`querySelector`](https://www.w3schools.com/jsref/met_document_queryselector.asp)
Подробнее о [Facebook Pixel событиях (отслеживание конверсий)](https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking) 
