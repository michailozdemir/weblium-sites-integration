# Кастомная интеграция для блоков и сайтов на Weblium

### Содержание
#### [__Как добавить интеграцию к определённому блоку или странице?__](#Как-добавить-интеграцию-к-определённому-блоку-или-странице-1)
#### [__Добавление GeoPlugin для подмены номеров на сайте относительно региона пользователя__](#Добавление-geoplugin-для-подмены-номеров-на-сайте-относительно-региона-пользователя-1)
#### [__Массовое скачивание ресурсов с сайта с помощью скрипта__](#Массовое-скачивание-ресурсов-с-сайта-с-помощью-скрипта-1)
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

---

## __Массовое скачивание ресурсов с сайта с помощью скрипта__

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
![Code example GIF](https://storage.jumpshare.com/preview/kf2WoC-qef20d5RyEyOQlGjVBx1fq3Y2O-4j3YvHeMIx3-b5g8OMM5XbWSMMZRmfk3zDKSCeIG8r9XmvCvCwwVNlSmh0egFbdyHzE6LvoMAI4av1wcwKsmUDuTGzHRrg)
