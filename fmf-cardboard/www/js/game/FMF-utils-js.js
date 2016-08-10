var EPSILON = 0.00001;

function arrayMin(arr) {
  var len = arr.length, min = Infinity;
  while (len--) {
    if (arr[len] < min) {
      min = arr[len];
    }
  }
  return min;
};

function arrayMax(arr) {
  var len = arr.length, max = -Infinity;
  while (len--) {
    if (arr[len] > max) {
      max = arr[len];
    }
  }
  return max;
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}


var generateHeight = function (width, height) {

  var size = width * height,
    data = new Uint8Array(size),
    perlin = new ImprovedNoise(),
    quality = 1,
    z = Math.random() * 100;

  for (var j = 0; j < 4; j++) {

    for (var i = 0; i < size; i++) {

      var x = i % width,
        y = ~~(i / width);
      data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75);

    }

    quality *= 5;

  }

  return data;

}

var randomFloatBetween = function(min, max){
    return (Math.random() * (max - min) + min)
}
