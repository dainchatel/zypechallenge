let url = 'https://api.zype.com/videos/?api_key=***';
let placeholderImgUrl = 'http://i68.tinypic.com/2gw75fm.png';
let imgs = [];

// this function is called when the page loads
// it uses jquery to call the zype api and return the array of clip objects
// it iterates through each clip object and creates three elements
// a div, an appended image, and an appended h2

let load = () => {
  $.get(url, (data) => {
    let myClips = data.response;
    myClips.forEach((c) => {
      $('<div/>', {
        class: 'video-list-el',
        id: c._id,
      }).appendTo('body');
      // this finds the image url (highest res image, fine in this case)
      // if the image url is not from zype (or doesn't exist), it returns the default image
      let imgUrl = c.thumbnails[c.thumbnails.length - 1].url;
      let updateImgUrl = /zype/.test(imgUrl) ? imgUrl : placeholderImgUrl;
      $('<img/>', {
        src: updateImgUrl,
        class: 'video-list-img',
        id: c._id + 'img'
      }).appendTo('#' + c._id);
      $('<h2/>', {
        text: c.title,
        class: 'video-list-h2'
      }).appendTo('#' + c._id);
      // this adds each img id to the imgs array (necessary in parallax)
      imgs.push(c._id + 'img');
    })
  });
}

// this is the parallax function
// it checks to see how far down the page the current frame is
// then it takes a negative fraction of the distance and concatenates it to a pixel string
// then it loops through the imgs array, and for id, it adjusts the 'top' attribute
// to be just a little more or less than it was before, depending on if the scroll was up or down
// it parallaxes a little slower as it goes down the page (i * .0015)
// and it adds a little more positive buffer as it goes down the page (+i)

let parallax = () => {
 var scrolltop = window.pageYOffset;
 let newScroll = -scrolltop * .02 + 'px';
 for (let i = 0; i < imgs.length; i++) {
    let newScroll = -scrolltop * (.025 - (i * .0015)) + i + 'px'
    $('#' + imgs[i]).css('top', newScroll);
 }
}

// this adds a global event listener for the window
// when the user scrolls, this functions gets the frame information
// and calls parallax as a callback with the updated frame information

window.addEventListener('scroll', function(){
 requestAnimationFrame(parallax)
}, false)

load();

