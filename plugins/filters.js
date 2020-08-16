import Vue from 'vue'

Vue.filter('changeMediaUrl', (url) => {
  if (!url) { return '' }
  const newUrl = url.replace('https://s3.sa-east-1.amazonaws.com/media.cyberday.ec', 'https://media.cyberday.ec')
  return newUrl
})
