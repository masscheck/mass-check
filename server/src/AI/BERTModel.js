const tf = require('@tensorflow/tfjs-node');

path = './SavedModel'
// input = 'Politically Correct Woman ( Almost ) Uses Pandemic Excuse Not Reuse Plastic Bag # coronavirus # nashville'

async function predict(input) {
  const model = await tf.node.loadSavedModel(path, ['serve'], 'serving_default');
  const output = model.predict(input);
  console.log(output);
}

module.exports = predict;