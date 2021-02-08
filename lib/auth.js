module.exports = {
  isOwner: function (req) {
    if (req.session.logined === true) return true;
    else return false;
  },
  statusUI: function (req) {
    if (req.session.logined === true)
      return `${req.session.nickname} / <a href="/auth/logout">logout</a>`;

    return `<a href="/auth/login">login</a>`;
  },
};
