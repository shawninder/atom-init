'use strict'

var estimatedPadding = 1.5

function replaceTabText (path, html, tab, projectPaths, nbTabs) {
  if (path) {
    var projectPath
    for (var i = 0, len = projectPaths.length; i < len; i += 1) {
      if (~path.indexOf(projectPaths[i])) {
        projectPath = projectPaths[i]
      }
    }
    if (projectPath) {
      var newName = path.replace(projectPath, '')
      var tabStyle = window.getComputedStyle(tab)
      var tabWidth = parseInt(tabStyle.width.slice(0, -2), 10)
      var tabFontSize = parseInt(tabStyle['font-size'].slice(0, -2), 10)
      var a = parseInt(estimatedPadding * tabWidth / tabFontSize, 10)
      var b = newName.length - newName.lastIndexOf('/') - 1
      var ceil
      var dots = true
      if (a > b) {
        ceil = a
      } else {
        ceil = b
        dots = false
      }
      if (newName.length > ceil) {
        newName = newName.slice(-ceil)
        var idx = newName.indexOf('/')
        if (idx !== -1) {
          newName = newName.slice(idx)
        }
        if (dots) {
          newName = '...' + newName
        }
      }
      tab.style.fontWeight = 'bold'
      tab.innerHTML = newName || html
    }
  }
}

// Tabs
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
          replaceTabText(path, html, tab, projectPaths, tl)

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
