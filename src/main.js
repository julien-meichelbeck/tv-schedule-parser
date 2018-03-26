import $ from 'jquery'

const CONFIG = {
  hbo: {
    name: 'HBO',
    channelMapping: {},
    channelNames: '[class="bands/LinearSchedule--channelName"]',
    channelLanes: '[class="bands/LinearSchedule--channelLane"]',
    program: 'li',
    programName: '[class="bands/LinearSchedule--programName"]',
    programDate: '[class="bands/LinearSchedule--airingTime"]',
    currentDay: '[class="bands/schedule/DaySelector--daySelectorWrapper"] .undefined',
    titleFormatter: title => title.text(),
  },
  mnet: {
    name: 'M-NET',
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
    titleFormatter: title =>
      title
        .clone()
        .children()
        .remove()
        .end()
        .text(),
  },
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const config = window.location.href.includes('m-net') ? CONFIG.mnet : CONFIG.hbo
  const rows = []
  const channels = $(config.channelNames).map(
    (index, channelName) => config.channelMapping[channelName.innerText] || channelName.innerText
  )
  $(config.channelLanes).each((index, channel) => {
    $(channel)
      .find(config.program)
      .each((i, program) => {
        const title = config.titleFormatter($(program).find(config.programName))
        const date = $(program)
          .find(config.programDate)
          .text()
        if (title) rows.push([channels[index], title, date])
      })
  })
  const day = $(config.currentDay).text()
  sendResponse({ rows, day })
})
