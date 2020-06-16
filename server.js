const config = require('./config');
const mongoose = require('mongoose');

const express = require('express'),
    // socket = require('./server/spotify_playback'),
    router = require('./scripts/modules/router'),
    app = express(),

    // multer = require('multer'),
    // upload = multer({dest: 'uploads/'}),
    caregivers = {
        id: 'test'
    };

const bodyParser = require('body-parser');
// const session = require('express-session');
const cookies = require('cookie-parser');

// Port
app.listen(config.port, () => {
    console.log(`Application started on port: ${config.port}`);
});

// Body parser init
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
// parse application/json
app.use(bodyParser.json());

// Session init
// app.use(
//     session({
//         resave: false,
//         saveUninitialized: true,
//         secret: process.env.SESSION_KEY,
//         port: process.env.PORT,
//         secure: false,
//     })
// );

// Cookie parser init
app.use(cookies());

// Mongoose setup
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rtw_database', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).catch(err => console.log(err));

mongoose.connection.on('connected', () => {
    console.log('mongoose is connected');
});

app
    .set('view engine', 'ejs')
    .set('views', 'views')
    .use(express.static('static'))

    // Check if ACCESS_TOKEN exists. If not, fetch a new one with the refresh token.
    .get('/', async (req, res) => {
        if (req.cookies.ACCESS_TOKEN) {
            router.basicPage(res, 'memories-overview', 'Herinneringen');
        } else {
            getRefreshToken(req, res).then(() => {
                router.basicPage(res, 'memories-overview', 'Herinneringen');
            });
        }
    })

    .get('/memories-overview', async (req, res) => {
        if (req.cookies.ACCESS_TOKEN) {
            router.basicPage(res, 'memories-overview', 'Herinneringen');
        } else {
            getRefreshToken(req, res).then(() => {
                router.basicPage(res, 'memories-overview', 'Herinneringen');
            });
        }
    })

    .get('/login', async (req, res) => {
        if (req.cookies.ACCESS_TOKEN) {
            router.basicPage(res, 'login', 'Login');
        } else {
            getRefreshToken(req, res).then(() => {
                router.basicPage(res, 'login', 'Login');
            });
        }
    })

    .get('/add-memory', async (req, res) => {
        if (req.cookies.ACCESS_TOKEN) {
            router.pageWithData(res, 'add-memory', 'Herinnering toevoegen', caregivers);
        } else {
            getRefreshToken(req, res).then(() => {
                router.pageWithData(res, 'add-memory', 'Herinnering toevoegen', caregivers);
            });
        }
    })

    .get('/memory-details', async (req, res) => {
        if (req.cookies.ACCESS_TOKEN) {
            router.pageWithData(res, 'memory-details', 'Herinnering details', caregivers);
        } else {
            getRefreshToken(req, res).then(() => {
                router.pageWithData(res, 'memory-details', 'Herinnering details', caregivers);
            });
        }
    })

    .get('/music-overview', async (req, res) => {
        if (req.cookies.ACCESS_TOKEN) {
            router.pageWithData(res, 'music-overview', 'Muziek');
        } else {
            getRefreshToken(req, res).then(() => {
                router.pageWithData(res, 'music-overview', 'Muziek');
            });
        }
    })

    .get('/settings', async (req, res) => {
        if (req.cookies.ACCESS_TOKEN) {
            router.basicPage(res, 'settings', 'Instellingen');
        } else {
            getRefreshToken(req, res).then(() => {
                router.basicPage(res, 'settings', 'Instellingen');
            });
        }
    });

// Spotify Oauth
const spotifyLogin = require('./server/login.js');
const spotifyCallback = require('./server/callback.js');

// Spotify login routes
app.get('/spotifylogin', spotifyLogin); // Redirect for Spotify auth
app.get('/callback', spotifyCallback); // Callback for fetching Spotify tokens

// Get refresh token
const getRefreshToken = require('./server/get_refresh_token.js');
app.get('/refresh', getRefreshToken); // Callback for fetching Spotify tokens

// Save data to database
// const submitMemory = require('./server/submit_memory.js');
// app.post('/submit-memory', submitMemory);

const { Account, Memory } = require('./server/database_schema.js');
const multer = require('multer');

// Multer setup
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, './static/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.post('/submit-memory', upload.single('image-upload'), (req, res) => {
    // console.log(req.file, req.body);

    // Create new memory
    let memory = {
        title: req.body.title !== '' ? req.body.title : null,
        description: req.body.description !== '' ? req.body.description : null,
        // keywords: req.body.keywords.length > 0 ? req.body.keywords.map(keyword => keyword) : null
        keywords: req.body.keywords !== null ? req.body.keywords : null,
        media: []
    };

    // Store media
    if (req.file) {
        const image = {
            name: req.file.filename,
            path: `/${req.file.filename}`
        };

        console.log(image);

        memory.media.push(image);
    }

    // Save new user to database
    const newMemory = new Memory(memory);

    newMemory.save(err => {
        if (err) {
            console.log('save failed: ', err);
        } else {
            console.log('memory has been saved');
        }
    });
});