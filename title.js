const titleRouter = require('express').Router()
const fetch = require('node-fetch')
//const URL = require('url')
const http = require('http')

const parseTitle = (body) => {
  let match = body.match(/<title>([^<]*)<\/title>/) // regular expression to parse contents of the <title> tag
  if (!match || typeof match[1] !== 'string')
    throw new Error('Unable to parse the title tag')
  return match[1]
}

let titles = []

const getText = (response, callback) => {
  response.text()
    .then(text => callback(text))
}

const getTitle = (body) => {
  return parseTitle(body)
}

const fetchU = (url, callback) => {
  fetch('https://' + url)
    .then(response => callback(response))
    .catch()
}

const fetchURLs = (urls) => {
  // urls.forEach(url => {
  //   fetch('https://' + url)
  //     .then(response => callback(response))
  // })
  fetchU(url, (response) => {
    getText(response, (body) => {
      console.log('body: ', parseTitle(body))
      titles.push(parseTitle(body))
    })
  })
}

const getResponse = (addresses, callback) => {
  const titles = addresses.map(address => {
    return fetch('https://' + address)
      .then(response => response.text())
      .then(body => parseTitle(body))
      .then(title => [address, title])
      .catch((error) => [address, 'NO RESPONSE'])
  })
  titles.then(callback(titles))
  //console.log(titles)
  //callback(titles)
  // addresses.map(address => {
  //   fetch('https://' + address)
  //     .then(response => response.text())
  //     .then(body => parseTitle(body))
  //     .then(title => [address, title])
  //     .catch((error) => [address, 'NO RESPONSE'])
  // });
}

titleRouter.get('/', async (request, response) => {
  let addresses = request.query.address
  if (!addresses) {
    return response.send('give address as a url parameter')
  }
  if (typeof addresses === "string") {
    addresses = [addresses]
  }

  const options = new URL('http://www.dawn.com/events')
  console.log(options)

  http.get('http://www.dawn.com/events', (res) => {
    console.log(res)
  })

  response.send('sdfda')

  // getResponse(addresses, (titles) => {
  //   console.log('sdfdh', titles)
  //   response.send(titles)
  // })

  // let titles = []

  // const getTitles = (urls) => {
  //   urls.forEach(url => {
  //     fetchU(url, (response) => {
  //       getText(response, (body) => {
  //         console.log('body: ', parseTitle(body))
  //         titles.push(parseTitle(body))
  //       })
  //     })
  //   });
  // }
  // getTitles(addresses)
  // setTimeout(() => {
  //   const template = `
  //     <!DOCTYPE html>
  //     <html lang="en">
  //     <head></head>
  //     <body>
  //       <h1>Following are titles of given websites: </h1>
  //       <ul>
  //         ${addresses.map((address, i) => titles[i] ? `<li>${address} - "${titles[i]}"</li>` : `<li>${address} - NO RESPONSE</li>`)}
  //       </ul>
  //     </body>
  //     </html>
  //   `
  //   response.send(template)
  // }, 5000)

  // const getTitles = (addresses, callback) => {
  //   addresses.forEach(address => {

  //   });
  // }

  //--------------- USING PROMISES ---------------
  // Promise.all(addresses.map(address =>
  //   fetch('https://' + address)
  //     .then(response => response.text())
  //     .then(body => parseTitle(body))
  //     .catch((error) => {
  //       console.log('error: ', error)
  //     })
  // )).then(titles => {
  //   const template = `
  //     <!DOCTYPE html>
  //     <html lang="en">
  //     <head></head>
  //     <body>
  //       <h1>Following are titles of given websites: </h1>
  //       <ul>
  //         ${addresses.map((address, i) => titles[i] ? `<li>${address} - "${titles[i]}"</li>` : `<li>${address} - NO RESPONSE</li>`)}
  //       </ul>
  //     </body>
  //     </html>
  //   `
  //   response.send(template)
  // })
  // .catch((error) => {
  //   console.log('error: ', error)
  // })
})

module.exports = titleRouter
