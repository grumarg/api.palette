const { Schema, model } = require('mongoose')

const Palette = new Schema({
  colors: {type: [String], require: true},
  tags: {type: [String], default: []},
  likes: {type: Number, default: 0},
  dateCreate: {type: Date, default: new Date()},
  dateUpdate: {type: Date, default: new Date()},
})

module.exports = model('Palette', Palette)