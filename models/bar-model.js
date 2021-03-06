const mongoose = require('mongoose')

const BarSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    default: ''
  },
  postalCode: {
    type: Number,
    default: 0
  },
  neighbourhood: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  placeTypes: [
    {
      type: String,
      default: ''
    }
  ],
  rating: {
    type: Number,
    default: 0
  },
  smokingType: {
    type: String,
    default: ''
  },
  openingHours: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  thumbPhotos: [
    {
      type: String,
      default: ''
    }
  ],
  largePhotos: [
    {
      type: String,
      default: ''
    }
  ],
  placeId: {
    type: String,
    default: '',
    unique: true
  },
  status: {
    type: String,
    default: 'pending'
  }
})

const BarModel = mongoose.model('Bar', BarSchema)

module.exports = BarModel
