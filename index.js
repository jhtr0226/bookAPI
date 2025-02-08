require('dotenv').config();

const express = require('express');
const connectDB = require('./database/connect'); 
const booksRoute = require('./routes/booksRoute');
const authorsRoute = require('./routes/authorsRoute');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const errorMiddlerware = require('./middleware/errorMiddleware');
const session = require("express-session");
const passport = require('passport');
require("./passport-config"); 
const authRoutes = require("./routes/authRoute");
const MongoStore = require("connect-mongo");


const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

// Middleware
app.use(express.json());
/*
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false, 
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      collectionName: "sessions",
    }),
    cookie: {
      secure: process.env.RENDER === "true",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);*/
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
connectDB();





// API Routes
app.use(booksRoute);
app.use(authorsRoute);
app.use(authRoutes);


app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      oauth2RedirectUrl: process.env.GITHUB_CALLBACK_URL,
      oauth: {
        clientId: process.env.GITHUB_CLIENT_ID,  
        clientSecret: process.env.GITHUB_CLIENT_SECRET, 
        appName: "BooksAPI",
        usePkceWithAuthorizationCodeGrant: true,
        additionalQueryStringParams: {
          response_type: "code",
          scope: "user:email",
          access_type: "offline",
          prompt: "consent",
        },
      },
    },
  })
);





// Root Route
app.get("/", (req, res) => {
  res.send('<h1>Home Page</h1><a href="/auth/github">Login with GitHub</a>');
});

app.get("/dashboard", (req, res) => {
  console.log("Dashboard Route Hit - User:", req.user);

  if (!req.isAuthenticated()) {
    console.log("User not authenticated, redirecting to /");
    return res.redirect("/");
  }

  res.send(`<h1>Welcome, ${req.user.displayName}</h1>
    <img src="${req.user.profilePicture}" alt="Profile Picture" style="border-radius: 50px; width: 100px;">
    <p>Email: ${req.user.email}</p>
    <a href="/logout">Logout</a>`);
});


app.use(errorMiddlerware);


// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
