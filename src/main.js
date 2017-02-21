import $ from 'jquery'

const test = () => console.log('test!')

new MutationObserver(test)
  .observe($('#main').get(0), { subtree: true, childList: true })
