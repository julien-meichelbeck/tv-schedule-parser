import $ from 'jquery'

$('#download-btn').click(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs[0]
    console.log(tab)
    chrome.tabs.sendMessage(tab.id, { action: 'ALERT' }, () => {})
  })
})
