const verifyComProf = (req, res, next) => {

    const isCompleted = req.profile_complete;
    console.log("profile completed :", isCompleted);
    if (!isCompleted) {
        return res.status(401).json({
            message: "User profile is not completed"
        });
    }

    next();

}

module.exports = verifyComProf;