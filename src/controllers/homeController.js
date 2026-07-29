export const getHome = (req, res) => {
  res.render("home", { user: req.user || null });
};
