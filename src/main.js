import $ from 'jquery'

const SEPARATOR = ' ; '

const download = (filename, text) => {
  const element = document.createElement('a')
  element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

const CONFIG = {
  hbo: {
    name: 'HBO',
    channelNames: '[class="bands/LinearSchedule--channelName"]',
    channelLanes: '[class="bands/LinearSchedule--channelLane"]',
    program: 'li',
    programName: '[class="bands/LinearSchedule--programName"]',
    programDate: '[class="bands/LinearSchedule--airingTime"]',
    currentDay: '[class="bands/schedule/DaySelector--selected"]',
    titleFormatter: title => title.text(),
  },
  mnet: {
    name: 'M-NET',
    channelNames: '.bar-key-channel',
    channelLanes: '.bar-row:not(.bar-row-top)',
    program: '.bar',
    programName: '.bar-title',
    programDate: '.bar-meta',
    currentDay: '.tv-guide-swiper-container .swiper-slide.swiper-slide-active',
    titleFormatter: title =>
      title
        .clone()
        .children()
        .remove()
        .end()
        .text(),
  },
}

const downloadCurrentDay = config => {
  const rows = [['Chaîne', 'Nom du programme', 'Date'].join(SEPARATOR)]
  const channels = $(config.channelNames).map((index, channelName) => channelName.innerText)
  $(config.channelLanes).each((index, channel) => {
    $(channel)
      .find(config.program)
      .each((i, program) => {
        const title = config.titleFormatter($(program).find(config.programName))
        const date = $(program)
          .find(config.programDate)
          .text()
        if (title) rows.push([channels[index], title, date].join(SEPARATOR))
      })
  })
  const dayName = $(config.currentDay).text()
  download(`${config.name}-${dayName}`, rows.join('\n'))
}

chrome.runtime.onMessage.addListener(() => {
  const config = window.location.href.includes('m-net') ? CONFIG.mnet : CONFIG.hbo
  downloadCurrentDay(config)
})
