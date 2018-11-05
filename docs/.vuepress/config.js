
module.exports = {
  base: '/weblium-sites-integration/',
  title: 'Weblium Sites Integration',
  description: 'Кастомная интеграция для блоков и сайтов на Weblium',

themeConfig: {
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Содержание', link: 'info.md' },
    { text: 'Виджеты', link: 'widgets.md' },
      { text: 'GitHub', link: 'https://github.com/michailozdemir/weblium-sites-integration/' },
    ],
sidebar: {
      '/': [
        {
          title: 'Содержание',
          collapsable: false,
          children: ['info']
        },
        {
          title: 'Виджеты',
          collapsable: false,
          children: ['widgets']
        }
      ]
    }
  }
}