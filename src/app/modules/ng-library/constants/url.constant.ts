const url = {
  host: '/assets/api',
  html: {
    library: 'html/ng-library'
  },
  json: {
    library: {
      load: 'json/home/portfolio',
      translate: 'json/home/portfolio/translate'
    }
  }
}

export const REQUEST_URL = { ...url };
