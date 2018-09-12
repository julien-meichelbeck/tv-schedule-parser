import React from 'react'
import { render } from 'react-dom'

const App = class extends React.Component {
  state = { rows: [] }

  extractFromDom = event => {
    event.preventDefault()
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs[0]
      chrome.tabs.sendMessage(tab.id, {}, ({ rows, day }) =>
        this.setState({
          day,
          rows: [...this.state.rows, ...rows]
        })
      )
    })
  }

  download = event => {
    event.preventDefault()
    const text = this.state.rows.map(columns => columns.join(' ; ')).join('\n')
    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
    element.setAttribute('download', `${this.state.day}.csv`)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  render() {
    const showTable = this.state.rows.length
    return (
      <div>
        <div className="btn-group">
          <button
            className="btn-primary"
            onClick={() => {
              chrome.tabs.create({ url: 'https://julien-meichelbeck.github.io/moviedb/' })
            }}
          >
            Open MovieDB
          </button>
          <button className="btn-primary" onClick={this.extractFromDom}>
            Extract
          </button>
        </div>
        {showTable ? (
          <div>
            <button className="btn-secondary" onClick={this.download}>
              Download schedule
            </button>
            <table>
              {this.state.rows.map(columns => (
                <tr key={columns.join('-')}>
                  {columns.map(column => <td key={column}>{column}</td>)}
                </tr>
              ))}
            </table>
            <button className="btn-primary" onClick={this.extractFromDom}>
              Extract more
            </button>
          </div>
        ) : null}
      </div>
    )
  }
}

render(<App />, document.getElementById('main'))
