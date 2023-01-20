const { validationResult } = require('express-validator')
const { default: mongoose } = require('mongoose')

const { getUserByToken } = require('../helpers/functions')
const Palette = require('../models/Palette')
const { createImage, deleteImage } = require('../utils/images')

const paletteFields = {
  colors: 1,
  tags: 1,
  likes: 1,
  dateCreate: 1
}

class PaletteController {
  async paletteCreate(req, res) {
    try {
      const errors = validationResult(req)
      
      if (!errors.isEmpty()) {
        return res.status(400).json({message: 'Invalid data', errors})
      }

      const { 
        colors = [], 
        tags = []
      } = req.body

      const palette = new Palette({ 
        colors, 
        tags
      })

      await palette.save()
      return res.json({ palette, message: 'Palette was successfully created!' })
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'Server palette functional error. Try to check your entries.' })
    }
  }

  async getPalettes(req, res) {
    try {
      const limit = 50
      const { skip = 0 } =  req.body

      const palettes = await Palette
        .find({}, paletteFields)
        .sort({ 'likes': -1 }) 
        .skip(skip)
        .limit(limit)

      const palettesAmount = await Palette.count()

      return res.json({ palettes, limit, amount: palettesAmount })
    } catch (error) {
      console.log(error)
      return res.status(400).json({message: 'Server palette functional error. Try to check your entries.'})
    }
  }

  async getPaletteById(req, res) {
    try {
      const { id = 0 } =  req.params

      const palette = await Palette.findOne({ _id: id }, paletteFields)

      if (!palette) {
        return res.status(400).json({ message: `Can not find the palette` })
      }

      return res.json(palette)
    } catch (error) {
      console.log(error)
    }
  }

  async paletteFinder(req, res) {
    try {
      const limit = 50
      const { skip = 0, query = '' } =  req.body

      if (!query) {
        const palettes = await Palette
          .find({})
          .sort({ 'likes': -1 }) 
          .skip(skip) 
          .limit(limit)
        
        const palettesAmount = await Palette
          .find({})
          .count()
        
        return res.status(200).json({ palettes, limit, amount: palettesAmount })
      }

      const words = query.match( new RegExp(/(\w|[\u0400-\u04FF])+/, 'ig') )

      const palettes = await Palette
        .find({ tags: { 
          $regex: new RegExp(words ? words.join('|') : ''  , 'i')
        } })
        .sort({ 'likes': -1 }) 
        .skip(skip) 
        .limit(limit)

      const palettesAmount = await Palette
        .find({ tags: { 
          $regex: new RegExp(words ? words.join('|') : ''  , 'i')
        } })
        .count()

      return res.status(200).json({ palettes, limit, amount: palettesAmount })
    } catch (error) {
      console.log(error)
      return res.status(400).json({message: 'Server palette functional error. Try to check your entries.'})
    }
  }
  
  async paletteAddLike(req, res) {
    try {
      const limit = 50
      const { skip = 0, query = '' } =  req.body

      if (!query) {
        const palettes = await Palette
          .find({})
          .sort({ 'likes': 1 }) 
          .skip(skip) 
          .limit(limit)
        
        const palettesAmount = await Palette
          .find({})
          .count()
        
        return res.status(200).json({ palettes, limit, amount: palettesAmount })
      }

      const words = query.match( new RegExp(/(\w|[\u0400-\u04FF])+/, 'ig') )

      const palettes = await Palette
        .find({ tags: { 
          $regex: new RegExp(words ? words.join('|') : ''  , 'i')
        } })
        .sort({ 'likes': -1 }) 
        .skip(skip) 
        .limit(limit)

      const palettesAmount = await Palette
        .find({ tags: { 
          $regex: new RegExp(words ? words.join('|') : ''  , 'i')
        } })
        .count()

      return res.status(200).json({ palettes, limit, amount: palettesAmount })
    } catch (error) {
      console.log(error)
      return res.status(400).json({message: 'Server palette functional error. Try to check your entries.'})
    }
  }

  async paletteAddLike(req, res) {
    try {
      const { 
        id = '',
      } = req.body

      // Validate the ID format
      if (!mongoose.isValidObjectId(id)) {
        return res.status(403).json({ message: 'Not valid ID' })
      }

      const palette = await Palette.findOne({ _id: id })
  
      if (!palette) return res.status(400).json({ message: `Can not find the palette to update` })
  
      const updSet = { 
        likes: palette.likes + 1, 
      }

      const updPalette = await Palette.findOneAndUpdate(
        { _id: id },
        { $set: updSet },
        { new: true }
      )

      if (!updPalette) {
        return res.status(403).json({ message: 'Palette do not exist or you do not have access to update it' })
      }

      return res.status(200).json({ palette: updPalette, message: `Palette successfully updated` }) 
    } catch (error) {
      console.log(error)
      return res.status(400).json({message: 'Server palette functional error. Try to check your entries.'})
    }
  }

  async deletePalette(req, res) {
    try {
      const { id = '' } =  req.params
  
      const palette = await Palette.findOne({ _id: id })
  
      if (!palette) {
        return res.status(400).json({ message: `Can not find palette to delete` })
      }
  
      return res.status(200).json({ message: `Palette successfully deleted` }) 
    } catch (error) {
      console.log(error)
      return res.status(400).json({message: 'Server palette functional error. Try to check your entries.'})
    }
  }
}

module.exports = new PaletteController()