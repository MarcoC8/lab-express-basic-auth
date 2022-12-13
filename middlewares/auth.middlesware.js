const isLoggedIn = (req, res, next) => {
    if(!req.session.user){
        res.redirect('/main');
        return;
    }
    next();
};

const isAnon = (req, res, next) => {
    if(req.session.user){
        res.redirect('/private');
        return;
    }
    next();
}

module.exports = {isLoggedIn, isAnon};