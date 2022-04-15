

const handleHomeImages = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: 'This is the home images endpoint'
    })
}


module.exports = {
    handleHomeImages
}