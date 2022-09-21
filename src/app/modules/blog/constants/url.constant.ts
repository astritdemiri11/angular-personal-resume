const url = {
  host: '/assets/api',
  html: {
    blog: 'html/blog'
  },
  json: {
    blog: {
      load: 'json/home/blog',
      translate: 'json/home/blog/translate'
    }
  }
}

export const REQUEST_URL = { ...url };
