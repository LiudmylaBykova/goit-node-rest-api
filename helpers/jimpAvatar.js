import Jimp from "jimp";

const jimpAvatar = async (file) => {
  await Jimp.read(file)
    .then((image) => {
      return image.cover(250, 250).quality(75).write(file);
    })
    .catch((error) => {
      next(error);
    });
};

export default jimpAvatar;
