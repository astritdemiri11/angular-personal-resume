const url = {
  host: '/assets/api',
  html: {
    project: 'html/node-project'
  },
  json: {
    project: {
      load: 'json/home/portfolio',
      translate: 'json/home/portfolio/translate'
    }
  }
}

export const REQUEST_URL = { ...url };
