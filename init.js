'use strict'

// Tabs

function replaceTabText (string, path, html, tab, color, uppercase) {
  if (~html.indexOf(string)) {
    var match = path.match(/\/.+$/i)
    if (match) {
      var arr = match[0].split('/')
      match = arr[arr.length - 3] + '/' + arr[arr.length - 2] + '/'
      if (match === 'shared') {
        match = arr[arr.length - 3] + ' - shared'
      }
      if (uppercase) {
        match = match[0].toUpperCase() + match.slice(1)
      }
    }
    tab.style.fontWeight = 'bold'
    tab.innerHTML = match || html
  }
}

function solvetabs () {
  try {
    var bars = document.getElementsByClassName('tab-bar')
    var bl = bars.length
    var titles
    var html
    var path
    var projectPaths = atom.project.getPaths() // eslint-disable-line
    for (var b = 0; b < bl; b += 1) {
      titles = bars[b].getElementsByClassName('title')
      var tl = titles.length
      for (var t = 0; t < tl; t += 1) {
        let tab = titles[t]
        html = tab.innerHTML
        if (html) {
          path = tab.getAttribute('data-path')

          replaceTabText('index.js', path, html, tab)
          replaceTabText('constructor.js', path, html, tab, false, true)
          if (path) {
            projectPaths.map((item) => {
              if (path.indexOf(item) === 0) {
                let rest = path.slice(item.length)
                let style = tab.parentNode.style
                if (endsWith(rest, ['.less', '.css', '.sass', '.scss'])) {
                  style.color = 'darkorchid'
                }
                if (endsWith(rest, '.md')) {
                  style.color = 'hotpink'
                }
                if (endsWith(rest, 'package.json')) {
                  style.fontWeight = 'bold'
                  style.textDecoration = 'underline'
                  style.color = 'olive'
                }
                if (~rest.indexOf('/test/')) {
                  style.color = 'teal'
                }
              }
            })
          }
        }
      }
    }
  } catch (e) {
    console.log(':(', e.stack)
  }
}

function endsWith (str, end) {
  var yes = false
  if (Array.isArray(end)) {
    for (let i = 0, len = end.length; i < len && !yes; i += 1) {
      yes = _endsWith(str, end[i])
      if (yes) {
        break
      }
    }
  } else {
    yes = _endsWith(str, end)
  }
  return yes
}

function _endsWith (str, end) {
  var yes = false
  var idx = str.lastIndexOf(end)
  if (idx !== -1 && (idx + end.length === str.length)) {
    yes = true
  }
  return yes
}

setInterval(solvetabs, 500)
