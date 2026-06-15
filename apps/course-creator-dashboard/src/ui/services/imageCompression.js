export async function compressImageFile(file, options) {
  var safeOptions = options || {};
  var maxDimension = readPositiveNumber(safeOptions.maxDimension, 768);
  var quality = readPositiveNumber(safeOptions.quality, 0.82);
  var outputType = safeOptions.outputType || "image/jpeg";
  var image = null;
  var canvas = null;
  var context = null;
  var size = null;

  if (!file || typeof file.type !== "string" || file.type.indexOf("image/") !== 0) {
    throw new Error("Only image files can be compressed.");
  }

  if (file.type === "image/gif" || typeof document === "undefined") {
    return file;
  }

  image = await loadImage(file);
  size = fitImageSize(image.naturalWidth || image.width, image.naturalHeight || image.height, maxDimension);

  if (!size || (size.width >= (image.naturalWidth || image.width) && size.height >= (image.naturalHeight || image.height))) {
    return file;
  }

  canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, size.width, size.height);

  return await createCompressedFile(canvas, file, outputType, quality);
}

function loadImage(file) {
  return new Promise(function (resolve, reject) {
    var url = URL.createObjectURL(file);
    var image = new Image();

    image.onload = function () {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = function () {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image."));
    };

    image.src = url;
  });
}

function createCompressedFile(canvas, sourceFile, outputType, quality) {
  return new Promise(function (resolve, reject) {
    canvas.toBlob(function (blob) {
      var compressedName = createCompressedFileName(sourceFile.name || "image", outputType);

      if (!blob) {
        reject(new Error("Could not compress this image."));
        return;
      }

      resolve(new File([blob], compressedName, {
        type: outputType,
        lastModified: Date.now()
      }));
    }, outputType, quality);
  });
}

function fitImageSize(width, height, maxDimension) {
  var longestSide = Math.max(width, height);
  var scale = longestSide > maxDimension ? maxDimension / longestSide : 1;

  if (!width || !height) {
    return null;
  }

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
}

function createCompressedFileName(fileName, outputType) {
  var extension = outputType === "image/webp" ? ".webp" : ".jpg";
  var baseName = String(fileName || "image").replace(/\.[^.]+$/, "");

  return baseName + "-compressed" + extension;
}

function readPositiveNumber(value, fallbackValue) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : fallbackValue;
}
