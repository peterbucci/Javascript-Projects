let boxes = [...document.querySelectorAll('.box')]
let text = [...document.querySelectorAll('.text')]

let images = [{
  url: 'images/01-landscape.jpg',
  showing: false
},
{
  url: 'images/02-landscape.jpg',
  showing: false
},
{
  url: 'images/03-landscape.jpg',
  showing: false
},
{
  url: 'images/04-landscape.jpg',
  showing: false
},
{
  url: 'images/05-landscape.jpg',
  showing: false
},
{
  url: 'images/06-landscape.jpg',
  showing: false
},

]

function selectImage() {
  let availableImages = images.filter(function(el){
    return !el.showing
  })
  let selectedImage = availableImages[Math.floor(Math.random() * Math.floor(availableImages.length))]
  selectedImage.showing = true

  return selectedImage.url
}

function loadImages() {
  boxes.forEach(function(el) {
    el.style.backgroundImage = `url(${selectImage(el)})`
  })
}

function changeImage(image) {
  image.style.backgroundImage = `url(${selectImage()})`
}

function clickBox(e) {
  let clickedBox = e.target // The div you clicked on
  let arr = [...clickedBox.classList]
  boxes.forEach(function(el, i) {
  	if (el !== clickedBox) {
      el.classList.remove('expanded')
      text[i].classList.add('hideText')
    } else {
      el.classList.toggle('expanded')
      text[i].classList.toggle('hideText')
      console.log(el.style.backgroundImage)
      el.classList.length !== 2 && changeImage(el)
      
    }
  })
}

window.addEventListener('load', loadImages)
document.addEventListener('click', clickBox)

