let size = document.getElementById('size')
let sizeText = document.getElementById('sizeText')
let bold = document.getElementById('bold')
let italic = document.getElementById('italic')
let underline = document.getElementById('underline')

let red = document.getElementById('red')
let green = document.getElementById('green')
let blue = document.getElementById('blue')

let redTextBox = document.getElementById('redTextBox')
let greenTextBox = document.getElementById('greenTextBox')
let blueTextBox = document.getElementById('blueTextBox')
let font = document.getElementById('font')
let textLock = document.getElementById('textLock')
let refresh = document.getElementById('refresh')

let background = document.getElementById('headBG')
let text = document.getElementById('text')
let textbox = document.getElementById('textbox')

let imageUpload = document.getElementById('imageUpload')
let image = document.getElementById('image')

function randomQuote() {
  let quotes = [`
    Jane: Unto ... <br>
    Daria: Buckle my shoe.
  `, `
    Trent: Do you ever feel like you are wasting your life?<br>
    Daria: Only when I'm awake.
  `, `
    Jane: Misery loves company.<br>
    Daria: You don't have too tell me that. It's the basis of our whole friendship.
  `, `
    Daria: Oh, gee. Did I wake you? I guess that means you haven't been murdered. Well, that's good.
  `, `
    Helen: Daria, you can't spend the rest of your life in there.<br>
    Daria: I can once they put in my high-speed internet connection.
  `, `
    Daria: I'm overcome with emotion.
  `]
  text.innerHTML = quotes[Math.floor(Math.random() * Math.floor(quotes.length))]
}

function updateSize() {
  text.style.fontSize = size.value + 'px'
  textbox.style.fontSize = size.value + 'px'
}

function updateSizeText() {
  sizeText.value = size.value + 'px'
}

function updateCheckbox(property, whenChecked, whenUnchecked) {
  if(this.checked) {
    text.style[property] = whenChecked
    textbox.style[property] = whenChecked
  } else {
    text.style[property] = whenUnchecked
    textbox.style[property] = whenUnchecked
  }
}

function updateBold() {
  updateCheckbox.call(this, 'fontWeight', 'bold', 'normal')
}

function updateItalic() {
  updateCheckbox.call(this, 'fontStyle', 'italic', 'normal')
}

function updateUnderline() {
  updateCheckbox.call(this, 'textDecoration', 'underline','none')
}

function updateColors(red, green, blue, redChanged, greenChanged, blueChanged) {
  text.style.color = 'rgb(' + red.value + ',' + green.value + ',' + blue.value + ')'
  textbox.style.color = 'rgb(' + red.value + ',' + green.value + ',' + blue.value + ')'
  text.style.borderColor = 'rgb(' + red.value + ',' + green.value + ',' + blue.value + ')'
  background.style.backgroundColor = 'rgb(' + red.value + ',' + green.value + ',' + blue.value + ', 0.4)'

  redChanged.value = red.value
  blueChanged.value = blue.value
  greenChanged.value = green.value
}

function updateColor() {
  updateColors(red, blue, green, redTextBox, blueTextBox, greenTextBox)
}

function updateRgbBox(e) {
  console.log(e.currentTarget.value)

  if (e.currentTarget.value >= 0 && e.currentTarget.value <= 255) {
    updateColors(redTextBox, blueTextBox, greenTextBox, red, blue, green)
  } else if (e.currentTarget.value < 0) {
    e.currentTarget.value = '0'
  } else (
    e.currentTarget.value = '255'
  )
  
}

function updateFont() {
console.log()
  if (font.value.indexOf(' ') == -1) {
    text.style.fontFamily = font.value
    textbox.style.fontFamily = font.value
  } else {
    text.style.fontFamily = '\"' + font.value + '\"'
    textbox.style.fontFamily = '\"' + font.value + '\"'
  }
}

function textLockCheck() {
  if (this.checked) {
    // size.removeEventListener('input', updateSizeText)
  } else {
    // size.addEventListener('input', updateSizeText)
  }
}

function clickText() {
  textbox.value = text.innerText
  text.setAttribute("class", "hidden")
  textbox.removeAttribute("class", "hidden")
  textbox.focus()
}

function updateText(e) {
  var key = e.which || e.keyCode;
  if (key === 13) {
    swapText()
  }
}

function swapText() {
  text.innerHTML = textbox.value
  textbox.setAttribute("class", "hidden")
  text.removeAttribute("class", "hidden")
}

window.addEventListener('load', randomQuote)

size.addEventListener('input', updateSize)
size.addEventListener('input', updateSizeText)
bold.addEventListener('change', updateBold)
italic.addEventListener('change', updateItalic)
underline.addEventListener('change', updateUnderline)

red.addEventListener('input', updateColor)
green.addEventListener('input', updateColor)
blue.addEventListener('input', updateColor)

redTextBox.addEventListener('keyup', updateRgbBox)
greenTextBox.addEventListener('keyup', updateRgbBox)
blueTextBox.addEventListener('keyup', updateRgbBox)
redTextBox.addEventListener('change', updateRgbBox)
greenTextBox.addEventListener('change', updateRgbBox)
blueTextBox.addEventListener('change', updateRgbBox)

font.addEventListener('change', updateFont)
textLock.addEventListener('change', textLockCheck)
refresh.addEventListener('click', randomQuote)

text.addEventListener('click', clickText)
textbox.addEventListener('keypress', updateText)
textbox.addEventListener('blur', swapText)

imageUpload.addEventListener('change', function() {
  if (imageUpload.files && imageUpload.files[0]) {
    let reader = new FileReader();

    reader.onload = function(e) {
      image.src = e.target.result
    }
    reader.readAsDataURL(imageUpload.files[0])
  }
})


