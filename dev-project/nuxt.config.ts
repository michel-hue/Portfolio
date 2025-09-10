export default defineNuxtConfig({
  app: {
    head: {
       charset: 'utf-16',
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      title: 'Portfolio', // default fallback title
      htmlAttrs: {
        lang: 'fr',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ]
    }
  }
})
