require('dotenv').config();
const path = require('path');
const express = require('express');
const jwt = require('jsonwebtoken');

const users = [
    { 
        username: 'test', 
        password: 'test', 
        theme: 'dark', 
        branding: { 
            light: { header: 'white' }, 
            dark: { header: 'black' } 
        } 
    },
    { 
        username: 'admin', 
        isAdmin: true, 
        password: 'StrongSecretPwd123!', 
        theme: 'dark', 
        branding: { 
            light: { header: 'white' }, 
            dark: { header: 'black' } 
        } 
    }
];

const app = express();

app.use(require('cors')());
app.use(express.json());

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.token;
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = users.find(u => u.username === data.username);
        return next();
    } catch (e) {
        console.error(e);
        res.status(403).send('Auth required!!');
    }
}

app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'static/login.html')));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'static/dashboard.html')));

app.post('/login', (req, res) => {
    const user = users.find(u => u.username === req.body.username && u.password === req.body.password);

    if (!user) return res.sendStatus(403);

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
    return res.json({ token });

});

app.get('/users', authMiddleware, (req, res) => {
    if (!req.user.isAdmin) return res.status(403).send('You are not admin');

    return res.json(users);
});

app.get('/branding', authMiddleware, (req, res) => {
    return res.json(req.user.branding[req.user.theme]);
});

app.post('/branding', authMiddleware, (req, res) => {
    const { theme, component, color } = req.body;
    req.user.branding[theme][component] = color;
    req.user.theme = theme;
    return res.json(req.user.branding[theme]);
});









const getOptions = () => ({});// do some lookup and return something or null 

app.get('/rand', (req, res) => {
    const spawn = require('child_process').spawn;
    const env = getOptions().env;

    const ping = spawn('node', ['-e', 'console.log(Math.random())'], { env: { ...env, PATH: process.env.PATH } });

    ping.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        res.send(data);
    });

    ping.on('error', (data) => {
        console.log(`err: ${data}`);
        res.send(data);
    });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
