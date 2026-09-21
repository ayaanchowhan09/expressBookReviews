const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customerRoutes = require("./router/auth_users.js").authenticated;
const generalRoutes = require("./router/general.js").general;

const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/customer", session({ secret: "fingerprint_customer", resave: false, saveUninitialized: false }));

app.use("/customer/auth/*", (req, res, next) => {
  const accessToken = req.session?.authorization?.accessToken;
  if (!accessToken) return res.status(401).json({ message: "Authentication required" });
  try {
    req.user = jwt.verify(accessToken, "access");
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

app.use("/customer", customerRoutes);
app.use("/", generalRoutes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
