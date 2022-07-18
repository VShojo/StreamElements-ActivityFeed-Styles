// ==UserScript==
// @name         StreamElements ActivityFeed Styles
// @namespace    https://vshojo.com/
// @version      1.03
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
          const t = [20, 10, 4, 2, 1].find(v => n >= v) || 1
          e.classList.add(`vsj-gift${t}`)
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
      .vsj-root > div:before {  display: none; }
      .vsj-root > div { border: none; }
      .vsj-bits100   { background: #134EB4 !important; }
      .vsj-bits200   { background: #1CE0FF !important; }
      .vsj-bits500   { background: #26E8A9 !important; }
      .vsj-bits1000  { background: #FCBE1F !important; }
      .vsj-bits2000  { background: #EF6708 !important; }
      .vsj-bits5000  { background: #DE0050 !important; }
      .vsj-bits10000 { background: #DD0B17 !important; }
      .vsj-sub       { background: #3B8C4D !important; }
      .vsj-gift1  .vsj-given { background: #26E8A9 !important; }
      .vsj-gift2  .vsj-given { background: #FCBE1F !important; }
      .vsj-gift4  .vsj-given { background: #EF6708 !important; }
      .vsj-gift10 .vsj-given { background: #DE0050 !important; }
      .vsj-gift20 .vsj-given { background: #DD0B17 !important; }
      .vsj-root .MuiAvatar-circular {
        width: 48px;
        height: 48px;
      }
      .vsj-name {
        color: white;
        font-size: 20px;
        font-weight: bold;
        opacity: 0.8;
        text-shadow: 0 0 2px black;
      }
      .vsj-given {
        color: white;
        font-size: 24px;
        font-weight: bold;
        text-shadow: 0 0 2px black;
      }
      .vsj-root p[type="sectionHeadline"] {
        color: white;
        font-size: 18px !important;
        opacity: 0.90;
        text-shadow: 0 0 2px black;
      }
    `
  document.head.appendChild(s)
})()
