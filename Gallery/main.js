let boxes = [...document.querySelectorAll('.box')]
let text = [...document.querySelectorAll('.text')]

let images = [{
  url: 'images/01-landscape.jpg',
  showing: false,
  quotes: ['You', 'two', 'three', 'will']
},
{
  url: 'images/02-landscape.jpg',
  showing: false,
  quotes: ['one', 'pay', 'will', 'you']
},
{
  url: 'images/03-landscape.jpg',
  showing: false,
  quotes: ['one', 'pay', 'three', 'you']
},
{
  url: 'images/04-landscape.jpg',
  showing: false,
  quotes: ['will', 'two', 'three', 'pay']
},
{
  url: 'images/05-landscape.jpg',
  showing: false,
  quotes: ['one', 'two', 'you', 'four']
},
{
  url: 'images/06-landscape.jpg',
  showing: false,
  quotes: ['one', 'pay', 'three', 'will']
}]

function changeImage (box) {
  if (box.classList[1]) {
    let image = selectImage(box)
    let url = box.style.backgroundImage.replace(/^url\("(.+)"\)$/, "$1")
    let element = images.find(function(el) {
      return el.url === url
    })

    element.showing = false
    box.style.backgroundImage = `url(${image.url})`
    image.showing = true
  }
}

function clickBoxFactory () {
  return function clickBox(e) {
    let clickedBox = e.currentTarget
    boxes.forEach((box, i) => {
      if (box !== clickedBox) {
        changeImage(box)
        box.classList.remove('expanded')
        text[i].classList.add('hideText')
      } else {
        changeImage(box)
        box.classList.toggle('expanded')
        text[i].classList.toggle('hideText')
      }
    })
  }
}

function selectImage (box) {
  let availableImages = images.filter((image) => {
    return !image.showing
  })

  let selectedImage = availableImages[Math.floor(Math.random() * Math.floor(availableImages.length))]
  let selectedQuote = selectedImage.quotes[Math.floor(Math.random() * Math.floor(selectedImage.quotes.length))]
  selectedImage.showing = true

  //Can this all be put in its own function?

  if (!box.style.backgroundImage) {
    box.style.backgroundImage = `url(${selectedImage.url})`
    box.firstElementChild.innerText = selectedQuote
  } else {
    // Will screw up the timing if someone clicks on a box before the transition is completed.
    setTimeout(function(){
      box.firstElementChild.innerText = selectedQuote
    }, 1500)
  }
  

  return selectedImage
}

boxes.forEach((box) => {
  box.addEventListener('click', clickBoxFactory())
  box.addEventListener('load', selectImage(box))
})