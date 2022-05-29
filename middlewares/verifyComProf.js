const verifyComProf = () => {
    return (req, res, next) => {
        if (!req.complete_profile) {
            return res.status(401).json({
                message: "User profile is not completed"
            });
        }

        next();
    }
}

module.exports = verifyComProf;