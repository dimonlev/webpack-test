const buttons = document.querySelector(".btn-container")
const btn = document.querySelectorAll(".btn")
const fullscreenButton = document.querySelector(".fullscreen")
const body = document.querySelector("body")
const inputs = document.querySelectorAll('input[type="range"');
const resetButton = document.querySelector(".btn-reset")
const nextButton = document.querySelector(".btn-next")
const img = document.querySelector('img');
const loadButton = document.querySelector('input[type="file"]');
const base = 'https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/';
const images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
const saveButton = document.querySelector('.btn-save');
const canvas = document.querySelector('canvas');

console.log(canvas);

buttons.addEventListener('click', (event) => {
  if (event.target.classList.contains('btn')) {
    btn.forEach((el) => {
      if (el.classList.contains('btn-active')) {
        el.classList.remove('btn-active');
      }
    });
    event.target.classList.add('btn-active');
  }
});

// output value change
const handleUpdate = (event) => {
  const suffix = event.dataset.sizing || '';
  document.documentElement.style.setProperty(`--${event.name}`, event.value + suffix);
  event.nextElementSibling.value = event.value
}
inputs.forEach(input => input.addEventListener('input', (event) => handleUpdate(event.path[0])));

// reset button 
const reset = () => {
  inputs.forEach(input => {
    if (input.getAttribute("name") === "saturate") {
      input.value = 100
      handleUpdate(input)
    }
    else if (input.hasAttribute("data-sizing")) {
      input.value = 0
      handleUpdate(input)
    }
  })
}
resetButton.addEventListener('click', reset)

// add image
let i = 0;
const viewBgImage = (src) => {
  const image = new Image();
  image.src = src;
  image.onload = () => {
    reset();
    img.setAttribute("src", `${src}`);

  };
}
// add next button action
const getImage = () => {
  let now = new Date()
  let hours = now.getHours()
  let dayNight = ""

  if (hours >= 0 && hours < 6) {
    dayNight = "night";
    hours = 0;
    if (i === 5)
      i = 0
  }
  else if (hours > 5 && hours < 12) {
    dayNight = "morning";
    hours = 5;
    if (i === 5)
      i = 0
  }
  else if (hours > 11 && hours < 18) {
    dayNight = "day";
    hours = 10;
    if (i === 5)
      i = 0
  }
  else if (hours > 17 && hours < 24) {
    dayNight = "evening";
    hours = 15;
    if (i === 5)
      i = 0
  }

  const index = i + hours;
  const imageSrc = base + dayNight + "/" + images[index];
  viewBgImage(imageSrc);
  i++;
  nextButton.disabled = true;
  setTimeout(function () { nextButton.disabled = false }, 100);
}
nextButton.addEventListener('click', getImage);

// input from local drive
console.log(loadButton);
loadButton.addEventListener('change', (e) => {
  const file = loadButton.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.src = reader.result;
    img.setAttribute("src", `${image.src}`);
    reset();
  }
  reader.readAsDataURL(file);
});

//convert image to canvas
const drawImage = (url = ) => {
  const image = new Image();
  image.setAttribute('crossOrigin', 'anonymous');
  image.src = img.getAttribute("src");

  console.log(image.src);
  canvas.width = image.width;
  canvas.height = image.height;
  let blur = getComputedStyle(document.documentElement).getPropertyValue('--blur');
  let invert = getComputedStyle(document.documentElement).getPropertyValue('--invert');
  let sepia = getComputedStyle(document.documentElement).getPropertyValue('--sepia');
  let saturate = getComputedStyle(document.documentElement).getPropertyValue('--saturate');
  let hue = getComputedStyle(document.documentElement).getPropertyValue('--hue');
  const ctx = canvas.getContext("2d");
  ctx.filter = `blur(${blur}) invert(${invert}) sepia(${sepia}) saturate(${saturate}) hue-rotate(${hue})`
  ctx.drawImage(image, 0, 0);
};

drawImage()
//save image with filters
saveButton.addEventListener('click', function (e) {
  // drawImage()
  var link = document.createElement('a');
  link.download = 'download.png';
  link.href = canvas.toDataURL("image/jpeg")
  console.log(canvas.toDataURL("image/jpeg"));
  link.click();
  link.delete;
});

// fullscreen button change
const deactivateFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
};
fullscreenButton.addEventListener('click', () => {
  if (document.fullscreenElement)
    deactivateFullscreen()
  else
    body.requestFullscreen()
})
