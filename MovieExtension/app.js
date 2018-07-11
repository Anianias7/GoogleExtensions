var videoTag = document.querySelectorAll("video");
console.log(videoTag)
console.log([...videoTag]);

var isValid = (tag) => tag.startsWith("http");

var findValidLink = (links) => links.reduce((acc, val) => isValid(val) ? acc.concat(val) : acc, []);

var videoLinks = [...videoTag].map(tag => tag.src);

var videoLink = findValidLink(videoLinks)[0];
console.log(videoLink);

window.location.href = videoLink;
