import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

const app = express();

// Middleware for serving static files
app.use(express.static('public'));

// Middleware for parsing requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: '3b9d524e8e4f2f1c2a6d8eecb927f324a5c41dcb6f7e9fa231a4b5738e6f9123',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// In-Memory Array as a Database
const users = [];

// Configure Passport
passport.use(
  new LocalStrategy((username, password, done) => {
    const user = users.find((u) => u.username === username);
    if (!user) {
      return done(null, false, { message: 'User not found' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password' });
    }
    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find((u) => u.id === id);
  done(null, user);
});


app.get('/', (req, res) => res.sendFile(process.cwd() + '/public/index.html'));

app.get('/', (req, res) =>
  res.send(`
    <form method="post" action="/register">
      <input name="username" placeholder="Username" required>
      <input name="password" type="password" placeholder="Password" required>
      <button type="submit">Register</button>
    </form>
  `)
);

app.post('/', (req, res) => {
  const { username, password } = req.body;
  if (users.find((u) => u.username === username)) {
    return res.send('User already exists. <a href="/register">Try again</a>');
  }
  const newUser = {
    id: users.length + 1,
    username,
    password,
  };
  users.push(newUser);
  res.send('Registration successful! <a href="/login">Log in</a>');
});

app.get('/login', (req, res) => res.sendFile(process.cwd() + '/public/login.html'));


app.get('/signup', (req, res) => res.sendFile(process.cwd() + '/public/signup.html'));

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/profile',
    failureRedirect: '/login',
  })
);

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.send(`Welcome ${req.user.username}! <a href="/logout">Logout</a>`);
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Start Server
app.listen(3000, () => console.log('Server running successfully '));