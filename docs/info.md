---
sidebarDepth: 2
---

# Кастомная интеграция для блоков и сайтов на Weblium

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

---

## Добавление GeoPlugin для подмены номеров на сайте относительно региона пользователя

1. На странице создается __Extra Block__. Во вкладку __JS__ добавляем [код](https://codepen.io/anon/pen/NLObmV)
```js
const telMap = {
	RU: {
		string: ' +7 (495) 204-15-09',
		number: '+74952041509'
	},
	UA: {
		string: '+38 (044) 207-39-55',
		number: '+380442073955'
	},
	BY: {
		string: ' +7 (495) 204-15-09',
		number: '+74952041509'
	},
	KZ: {
		string: '+7 (727) 350-76-33',
		number: '+77273507633'
	},
	EE: {
		string: '+372 884-00-64',
		number: '+3728840064'
	},
	LV: {
		string: '+372 884-00-64',
		number: '+3728840064'
	},
	LT: {
		string: '+372 884-00-64',
		number: '+3728840064'
	},
	GE: {
		string: '+38 (044) 207-39-55',
		number: '+380442073955'
	},
	rest: {
		string: '+372 884-00-64 ',
		number: '+3728840064'
	},
}
const setTel = (code) => {
	if (Object.keys(telMap).includes(code)) {
		document.querySelector('#header ~ header a[class*="header__button__"] span span:nth-child(2)').innerHTML = telMap[code].string
		document.querySelector('#header ~ header a[class*="header__button__"]').setAttribute('href', `tel:${telMap[code].number}`)
		return
	}
	document.querySelector('#header ~ header a[class*="header__button__"] span span:nth-child(2)').innerHTML = telMap.rest.string
	document.querySelector('#header ~ header a[class*="header__button__"]').setAttribute('href', `tel:${telMap.rest.number}`)
}
fetch('https://api.ipgeolocation.io/ipgeo?apiKey=731931cff73f4eaaaea4d6773bbc0298').then(result => result.json().then(({
	country_code2
}) => setTel(country_code2)))
```

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

---

## Массовое скачивание ресурсов с сайта с помощью скрипта

1. Установить __Ruby__ на свое устройство (Windows, Mac). [Ссылка на установку](https://www.ruby-lang.org/en/documentation/installation/)
2. Создать себе файл `index.rb` и в него вставить данный скрипт.
```ruby
require 'json'
require 'rest-client'
require "open-uri"


$login = '’
$password = ''
$host = 'https://weblium.com'
$website_id = '5b5089fd1b27c5002389fbea'


def auth_data
    JSON.parse(RestClient::Request.execute(url: "#{$host}/api/v0.1.0/auth/login",
                                           method: :post,
                                           headers: { content_type: 'application/json' },
                                           payload: { username: $login , password: $password },
                                           verify_ssl: false))
end

def get_resource_list
    JSON.parse(RestClient::Request.execute(url: "#{$host}/api/website/#{$website_id}/resource",
    method: :get,                              
    headers: {
      content_type: 'application/json',
      Authorization: "Bearer #{auth_data['token']}",
      params: {
        skip: '0',
        limit: '200',
        "filter[storage]": 'gcs' 
      }
    },
    verify_ssl: false
    ))
end

def download_image(url, output_name)
  open(url) do |f|
    File.open(output_name, 'wb') do |file|
      file.puts f.read
    end
  end
  # `curl '#{url}' > #{output_name}`
end

  get_resource_list['data'].each do |resource|
    puts resource
    download_image("https:#{resource['url']}", "#{resource['name']}.#{resource['mimeType'].gsub('image/','')}")
  end
```
3. В полях `login` и `passoword` ввести данные своего аккаунта на Weblium, который имеет админские права (доступ в Backoffice). 
4. В поле `website_id` ввести __ID__ сайта. Найти его можно в ссылке сайта в Backoffice. [Пример](https://backoffice.weblium.site/#/websites/5ba0f621f5c8650025ddfed5/info)
__5ba0f621f5c8650025ddfed5__ - ID сайта
5. Сохранить файл. Открыть терминал и в терминале указать путь к файлу. Если он находится на рабочем столе, то `cd Desktop`.
6. После того, как путь указан верно, в терминале запустить скрипт командой `ruby index.rb`.

   Стоит учесть, что скрипт грузит файлы туда, где он находится. То есть желательно создать какую-то папку, куда вставить данный скрипт и соотвественно путь к файлу будет немного другой.
![Code example GIF](https://i.imgur.com/1xk8qcf.gif)

---

## Кнопка скролла наверх (Scroll to Top Button)

Как добавить кнопку для обратного скролла наверх на сайте?

1. Добавить кнопку в __HTML__ раздел сайта. Вариантов несколько. Либо в __`Before </body>`__, либо через __`Extra Block`__

```html
<div class="scroll__top__button" title="Back to top" style="opacity: 1;">➤</div>
```

2. Добавить стили для кнопки. Стилизировать можно как угодно, но в данном случае используется самый обыкновенный пример.
```css
.scroll__top__button {
    width: 40px;
    line-height: 40px;
    overflow: hidden;
    z-index: 999;
    cursor: pointer;
    opacity:0;
    transition: all 0.4s ease-in;
    transform: rotate(270deg);
    position: fixed;
    bottom: 50px;
    right: 0;
    background-color: #fafafa;
    color: #2468B3;
    text-align: center;
    font-size: 30px;
    text-decoration: none;
}

.scroll__top__button:hover {
    background-color: #2468B3;
    color: #fff;
}
```

3. Добавить скрипт для инициализации и работоспособности кнопки.

```js
jQuery(document).ready(function() {
	jQuery(window).scroll(function() {
		if (jQuery(this).scrollTop() > 600) {
			jQuery('.scroll__top__button').css('opacity', '1');
		} else {
			jQuery('.scroll__top__button').css('opacity', '0');
		}
	});
	jQuery('.scroll__top__button').click(function() {
		jQuery('body,html').animate({
			scrollTop: 0
		}, 1800);
		return false;
	});
});
```

4. Так как данный скрипт использует __jQuery__ библиотеку, стоит подгрузить её в корень сайта.  
В __`<head>`__ вставляем данный код `<script src="
https://ajax.googleapis.com/ajax
/libs/jquery/2.2.4/
jquery.min.js"></script>`

Пример работы кнопки [здесь](https://bootdevice.com.ua/).
![Scroll to Top Button Example](https://i.imgur.com/kdVMQql.gif)

  Стоит учесть, что если вы хотите вставить кнопку через __Extra Block__, то HTML, CSS и jQuery код стоит вставлять именно разделы блока. Если же через общую интеграцию на сайте, то  
  `HTML - Before </body>`  
  `CSS - CSS`  
  `jQuery - Before </body>`  

  Не забываем обернуть код в нужные тэги `(<script></script>)`
