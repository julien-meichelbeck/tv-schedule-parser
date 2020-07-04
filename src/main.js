import $ from 'jquery'

const CONFIG = {
  hbo: {
    name: 'HBO',
    channelMapping: {},
    channelFilter: () => true,
    channelNames: '[class="bands/LinearSchedule--channelName"]',
    channelLanes: '[class="bands/LinearSchedule--channelLane"]',
    program: 'li',
    programName: '[class="bands/LinearSchedule--programName"]',
    programDate: '[class="bands/LinearSchedule--airingTime"]',
    currentDay: '[class="bands/schedule/DaySelector--daySelectorWrapper"] .undefined',
    dateFormatter: (date) => date.text(),
    titleFormatter: (title) => title.text(),
  },
  dstv: {
    channelFilter: () => true,
    channelMapping: {
      101: 'Channel 101',
      104: 'Movies Premiere 104',
      105: 'Movies Smile 105',
      106: 'Movies Action+ 106',
      110: 'Movies Action',
      111: 'Movies All Stars',
      115: 'M City',
      139: 'Movies Zone',
      900: 'Binge',
    },
    channelNames: '.channel-number',
    channelLanes: '.channel-row',
    program: '.event',
    programName: '.event-title',
    programDate: '.event-time',
    currentDay: '.active.contentBlock-act',
    dateFormatter: (date) => date.text().trim(),
    titleFormatter: (title) => title.text().trim(),
  },
  mnet: {
    name: 'M-NET',
    channelFilter: () => true,
    channelMapping: {
      101: 'Channel 101',
      104: 'Movies Premiere 104',
      105: 'Movies Smile 105',
      106: 'Movies Action+ 106',
      110: 'Movies Action',
      111: 'Movies All Stars',
      115: 'M City',
      139: 'Movies Zone',
      900: 'Binge',
    },
    channelNames: '.bar-key-channel',
    channelLanes: '.bar-row:not(.bar-row-top)',
    program: '.bar',
    programName: '.bar-title',
    programDate: '.bar-meta',
    currentDay: '.tv-guide-swiper-container .swiper-slide.swiper-slide-active',
    dateFormatter: (date) => date.text(),
    titleFormatter: (title) => title.clone().children().remove().end().text(),
  },
  startimes: {
    name: 'StarTimes',
    channelMapping: {
      127: 'Novela E',
      617: 'Novela F',
      615: 'Novela F Plus',
    },
    channelFilter: (name) => name && name.includes('Novela'),
    channelNames: '.pic',
    channelLanes: '.list .inner .item',
    program: '.box',
    programName: 'h3',
    programDate: 'h3',
    currentDay: 'li.now',
    titleFormatter: (title) => title.text().split(' | ')[0],
    dateFormatter: (date) => date.text().split(' | ')[1],
  },
}
chrome.runtime.connect()
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script loaded !')
  const config = window.location.href.includes('m-net')
    ? CONFIG.mnet
    : window.location.href.includes('startimestv')
    ? CONFIG.startimes
    : window.location.href.includes('dstv')
    ? CONFIG.dstv
    : CONFIG.hbo

  const channels = $(config.channelNames).map(
    (index, channelName) => config.channelMapping[channelName.innerText.trim()] || channelName.innerText.trim()
  )

  const rows = []
  $(config.channelLanes).each((index, channel) => {
    $(channel)
      .find(config.program)
      .each((i, program) => {
        const title = config.titleFormatter($(program).find(config.programName))
        const date = config.dateFormatter($(program).find(config.programDate))

        if (title) rows.push([channels[index], title, date])
      })
  })

  const day = $(config.currentDay).text()
  sendResponse({ rows: rows.filter((row) => config.channelFilter(row[0])), day })
})
