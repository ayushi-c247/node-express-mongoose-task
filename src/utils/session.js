//module exports
module.exports = async (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect(`${process.env.hostPath}v1/admin/adminDashboard`);
    } else {
        next();
    }
};
