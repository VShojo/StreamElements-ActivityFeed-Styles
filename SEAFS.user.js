// ==UserScript==
// @name         StreamElements ActivityFeed Styles
// @namespace    https://vshojo.com/
// @version      1.01
// @description  Color items in StreamElements' activity feed to be more readable
// @author       Fugi
// @match        https://yoink.streamelements.com/activity-feed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=streamelements.com
// @grant        none
// ==/UserScript==

;(function () {
  'use strict'

  const target = document.querySelector('#root > .root > div > .root > div:last-child')
  target.classList.add('vsj-root')
  const formatter = new Intl.NumberFormat()
  const observer = new MutationObserver(l => {
    for (const r of l) {
      for (const e of r.addedNodes) {
        const title = e.querySelector('p[type="text"]')
        const name = title.querySelector('span').innerText
        const message = e.querySelector('p[type="sectionHeadline"]')
        const fixText = (b, c) => {
          const A = document.createElement('span')
          A.classList.add('vsj-name')
          A.innerText = name
          const B = document.createElement('span')
          B.classList.add('vsj-given')
          B.innerText = b
          title.innerHTML = ''
          title.appendChild(A)
          title.appendChild(document.createElement('br'))
          title.appendChild(B)
          if (message && c !== undefined) message.innerText = c
        }
        let m = /cheered (\d+) bits/.exec(title.innerText)
        if (m) {
          const n = Number(m[1])
          const t = [10000, 5000, 2000, 1000, 500, 200, 100].find(v => n >= v)
          if (t) {
            e.classList.add(`vsj-bits${t}`)
          }
          fixText(formatter.format(n), message.innerText.replaceAll(/cheer\d+/gi, ''))
          continue
        }
        m = /gifted (a|\d+) (Tier \d) sub/.exec(title.innerText)
        if (m) {
          const n = m[1] === 'a' ? 1 : Number(m[1])
          e.classList.add(`vsj-sub`)
          fixText(`${formatter.format(n)} gift subs (${m[2]})`, '')
          continue
        }
        if (title.innerText.includes('subscribed')) {
          e.classList.add(`vsj-sub`)
          fixText(title.innerText.replace(/^.*? has /, ''))
          continue
        }
      }
    }
  })
  observer.observe(target, { childList: true })

  const s = document.createElement('style')
  s.innerText = `
      .vsj-root > div:before { display: none; }
      .vsj-bits100, .vsj-bits100:hover { background: #134EB4; }
      .vsj-bits200, .vsj-bits200:hover { background: #1CE0FF; }
      .vsj-bits500, .vsj-bits500:hover { background: #26E8A9; }
      .vsj-bits1000, .vsj-bits1000:hover { background: #FCBE1F; }
      .vsj-bits2000, .vsj-bits2000:hover { background: #EF6708; }
      .vsj-bits5000, .vsj-bits5000:hover { background: #DE0050; }
      .vsj-bits10000, .vsj-bits10000:hover { background: #DD0B17; }
      .vsj-sub, .vsj-sub:hover { background: #3B8C4D; }
      .vsj-root .MuiAvatar-circular {
        width: 48px;
        height: 48px;
      }
      .vsj-name {
        color: white;
        font-size: 20px;
        font-weight: bold;
        opacity: 0.8;
      }
      .vsj-given {
        color: white;
        font-size: 24px;
        font-weight: bold;
      }
      .vsj-root p[type="sectionHeadline"] {
        color: white;
        font-size: 18px !important;
        opacity: 0.90;
      }
    `
  document.head.appendChild(s)
})()
