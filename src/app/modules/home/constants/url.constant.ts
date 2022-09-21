const url = {
  host: '/assets/api',
  json: {
    contact: 'json/home/contact',
    socialMedia: 'json/home/social-media',

    blog: {
      load: 'json/home/blog',
      translate: 'json/home/blog/translate'
    },
    portfolio: {
      load: 'json/home/portfolio',
      translate: 'json/home/portfolio/translate'
    },
    product: {
      load: 'json/home/product',
      translate: 'json/home/product/translate'
    },
    profile: {
      load: 'json/home/profile',
      translate: 'json/home/profile/translate'
    },
    resume: {
      load: 'json/home/resume',
      translate: 'json/home/resume/translate'
    },
    skill: {
      load: 'json/home/skill',
      translate: 'json/home/skill/translate'
    },
    userReview: {
      load: 'json/home/user-review',
      translate: 'json/home/user-review/translate'
    }
  }
}

export const REQUEST_URL = { ...url };
