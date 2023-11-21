
const endPoints = require('../endpoints.json')


exports.getEndpoints = (req, res) => {
    res.status(200).send(endPoints)
}