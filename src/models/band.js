const mongoose = require('mongoose');

const BandSchema = mongoose.Schema({
  band_id: { type: Number, required: true, unique: true },
  band_name: { type: String, required: true },
  band_genre: { type: String, required: true },
  band_country: { type: String, required: true },
  band_themes: { type: String, required: false },
  band_location: { type: String, reqired: false },
});

module.exports = mongoose.model('Band', BandSchema);
