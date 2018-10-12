
let today = new Date()
let seconds = today.getSeconds()
let minutes = today.getMinutes()
let hours = today.getHours()

//Set the starting points of each hand
document.getElementById('second').style.transform = 'translate3D(-50%, 0, 0) rotate(' + 6 * seconds + 'deg)'
document.getElementById('minute').style.transform = 'translate3D(-50%, 0, 0) rotate(' + 6 * minutes + 'deg)'
document.getElementById('hour').style.transform = 'translate3D(-50%, 0, 0) rotate(' + 30 * hours  + 'deg)'
// Set the digital clock's starting time
document.getElementById('digitalClock').innerHTML = today.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })

let rotate = setInterval(function() {
  // Add 1 to the seconds variable every second
  seconds += 1

  // Add 1 to the minutes and hours variable every 60 seconds and 1 hour
  if (seconds % 60 === 0) {
    minutes += 1
  }
  
  if ((minutes - 1) * 60 + seconds % 3600 === 0) {
    hours += 1
  }
  
  // After 60 seconds reset variables
  if (seconds === 60) {
    today = new Date()
    seconds = today.getSeconds()
    minutes = today.getMinutes()
    hours = today.getHours()
  }

  // Call draw function to update CSS styles
  draw(seconds, minutes, hours)

  // Updates the digital clock's time
  digitalTime = new Date()
  document.getElementById('digitalClock').innerHTML = digitalTime.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })

}, 1000)

function draw(secondsPassed, minutesPassed, hoursPassed) {
  document.getElementById('second').style.transform = 'translate3D(-50%, 0, 0) rotate(' + 6 * secondsPassed + 'deg)'
  document.getElementById('minute').style.transform = 'translate3D(-50%, 0, 0) rotate(' + 6 * minutesPassed + 'deg)'
  document.getElementById('hour').style.transform = 'translate3D(-50%, 0, 0) rotate(' + 30 * hoursPassed + 'deg)'
}