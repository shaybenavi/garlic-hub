import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Core Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser('garlic-hub-secret-token'));

// Static assets
app.use('/media', express.static(path.join(__dirname, 'public/media')));
app.use(express.static(path.join(__dirname, 'public')));

// In-Memory Data Store
const store = {
  players: [
    {
      player_id: 1,
      player_name: 'Lobby 4K Display',
      status: 'online',
      ip: '192.168.1.101',
      model: 'Raspberry Pi 5',
      uuid: 'd3b07384-d113-46fb-a0b7-4c7b13a37b1a',
      playlist_id: 1,
      playlist_name: 'hurzi (Master Loop)',
      refresh: 300,
      last_ping: 'Just now',
      firmware: 'v2.4.1',
      resolution: '3840x2160'
    },
    {
      player_id: 2,
      player_name: 'Cafeteria Menu Board',
      status: 'online',
      ip: '192.168.1.102',
      model: 'Android SMIL Player',
      uuid: 'a8f90241-e221-482a-bc91-2d7c81b29a2c',
      playlist_id: 2,
      playlist_name: 'interne Playliste',
      refresh: 300,
      last_ping: '1 min ago',
      firmware: 'v2.4.0',
      resolution: '1920x1080'
    },
    {
      player_id: 3,
      player_name: 'Main Entrance Welcome Screen',
      status: 'online',
      ip: '192.168.1.103',
      model: 'Garlic-Box x86',
      uuid: 'e4c89110-f432-49da-aa82-9f8e12d45c3b',
      playlist_id: 4,
      playlist_name: 'Multizone Entrance Screen',
      refresh: 180,
      last_ping: '3 mins ago',
      firmware: 'v2.5.0',
      resolution: '1920x1080'
    },
    {
      player_id: 4,
      player_name: 'Conference Room B Wayfinder',
      status: 'standby',
      ip: '192.168.1.104',
      model: 'Raspberry Pi 4',
      uuid: '7b9e0231-10bc-43df-91ca-5491f9b33a01',
      playlist_id: 3,
      playlist_name: 'externe Playliste',
      refresh: 600,
      last_ping: '15 mins ago',
      firmware: 'v2.3.8',
      resolution: '1080x1920'
    }
  ],

  playlists: [
    {
      playlist_id: 1,
      playlist_name: 'hurzi (Master Loop)',
      playlist_mode: 'master',
      duration: 75,
      shuffle: false,
      last_update: '2025-02-22 09:56:44',
      items: [
        { item_id: 1, item_name: 'Abu Dhabi Mosque', item_type: 'image', file_resource: 'abu-dhabi-mosque.jpg', duration: 15, fit: 'cover' },
        { item_id: 2, item_name: 'Istanbul by Night', item_type: 'image', file_resource: 'istanbul-by-night.jpg', duration: 15, fit: 'cover' },
        { item_id: 3, item_name: 'Corfu Coast Panorama', item_type: 'image', file_resource: 'corfu-coast.jpg', duration: 15, fit: 'cover' },
        { item_id: 4, item_name: 'Hong Kong Pier', item_type: 'image', file_resource: 'hongkong-pier.jpg', duration: 15, fit: 'cover' },
        { item_id: 5, item_name: 'Vostok Spaceship Exhibit', item_type: 'image', file_resource: 'vostok-space-ship.jpg', duration: 15, fit: 'cover' }
      ]
    },
    {
      playlist_id: 2,
      playlist_name: 'interne Playliste',
      playlist_mode: 'internal',
      duration: 45,
      shuffle: false,
      last_update: '2025-02-26 10:05:58',
      items: [
        { item_id: 6, item_name: 'Hua Hin Evening Notice', item_type: 'image', file_resource: 'hua-hin-pub.jpg', duration: 15, fit: 'cover' },
        { item_id: 7, item_name: 'Bangkok City Update', item_type: 'image', file_resource: 'bangkok-electricity.jpg', duration: 15, fit: 'cover' },
        { item_id: 8, item_name: 'Yerevan Art Gallery', item_type: 'image', file_resource: 'yerevan-armenia-art.jpg', duration: 15, fit: 'cover' }
      ]
    },
    {
      playlist_id: 3,
      playlist_name: 'externe Playliste',
      playlist_mode: 'external',
      duration: 30,
      shuffle: false,
      last_update: '2025-02-26 10:07:03',
      items: [
        { item_id: 9, item_name: 'Hong Kong Street Art', item_type: 'image', file_resource: 'hongkong-art.jpg', duration: 15, fit: 'cover' },
        { item_id: 10, item_name: 'Moscow River View', item_type: 'image', file_resource: 'moscow-river.jpg', duration: 15, fit: 'cover' }
      ]
    },
    {
      playlist_id: 4,
      playlist_name: 'Multizone Entrance Screen',
      playlist_mode: 'multizone',
      duration: 60,
      shuffle: false,
      last_update: '2025-03-07 14:24:21',
      items: [
        { item_id: 11, item_name: 'Abu Dhabi Mosque (Zone A)', item_type: 'image', file_resource: 'abu-dhabi-mosque.jpg', duration: 15, fit: 'cover' },
        { item_id: 12, item_name: 'Corfu Anemomilos (Zone B)', item_type: 'image', file_resource: 'corfu-anemomilos.jpg', duration: 15, fit: 'cover' },
        { item_id: 13, item_name: 'Indian Shop Bangkok', item_type: 'image', file_resource: 'indian-shop-bangkok.jpg', duration: 15, fit: 'cover' },
        { item_id: 14, item_name: 'Istanbul by Night', item_type: 'image', file_resource: 'istanbul-by-night.jpg', duration: 15, fit: 'cover' }
      ]
    },
    {
      playlist_id: 5,
      playlist_name: 'Das ist ein Kanal und so',
      playlist_mode: 'channel',
      duration: 60,
      shuffle: true,
      last_update: '2025-02-26 10:20:56',
      items: [
        { item_id: 15, item_name: 'Corfu Coast', item_type: 'image', file_resource: 'corfu-coast.jpg', duration: 15, fit: 'cover' },
        { item_id: 16, item_name: 'Vostok Spaceship', item_type: 'image', file_resource: 'vostok-space-ship.jpg', duration: 15, fit: 'cover' },
        { item_id: 17, item_name: 'Moscow River', item_type: 'image', file_resource: 'moscow-river.jpg', duration: 15, fit: 'cover' },
        { item_id: 18, item_name: 'Bangkok Lights', item_type: 'image', file_resource: 'bangkok-electricity.jpg', duration: 15, fit: 'cover' }
      ]
    }
  ],

  media: [
    { media_id: 1, title: 'Sheikh Zayed Mosque', filename: 'abu-dhabi-mosque.jpg', category: 'images', resolution: '1920x1080', filesize: '420 KB', tags: 'architecture, landmark' },
    { media_id: 2, title: 'Bangkok City Electricity', filename: 'bangkok-electricity.jpg', category: 'images', resolution: '1920x1080', filesize: '380 KB', tags: 'urban, city' },
    { media_id: 3, title: 'Corfu Anemomilos Windmill', filename: 'corfu-anemomilos.jpg', category: 'images', resolution: '1920x1080', filesize: '310 KB', tags: 'coastal, greece' },
    { media_id: 4, title: 'Corfu Coastline Panorama', filename: 'corfu-coast.jpg', category: 'images', resolution: '1920x1080', filesize: '450 KB', tags: 'nature, beach' },
    { media_id: 5, title: 'Hong Kong Street Art', filename: 'hongkong-art.jpg', category: 'images', resolution: '1920x1080', filesize: '390 KB', tags: 'art, mural' },
    { media_id: 6, title: 'Hong Kong Victoria Pier', filename: 'hongkong-pier.jpg', category: 'images', resolution: '1920x1080', filesize: '410 KB', tags: 'harbour, boats' },
    { media_id: 7, title: 'Hua Hin Nightlife Bistro', filename: 'hua-hin-pub.jpg', category: 'images', resolution: '1920x1080', filesize: '360 KB', tags: 'night, restaurant' },
    { media_id: 8, title: 'Phahurat Indian Market Bangkok', filename: 'indian-shop-bangkok.jpg', category: 'images', resolution: '1920x1080', filesize: '340 KB', tags: 'textiles, market' },
    { media_id: 9, title: 'Istanbul Bosphorus Night', filename: 'istanbul-by-night.jpg', category: 'images', resolution: '1920x1080', filesize: '480 KB', tags: 'lights, bridge' },
    { media_id: 10, title: 'Moskva River Bridges', filename: 'moscow-river.jpg', category: 'images', resolution: '1920x1080', filesize: '400 KB', tags: 'river, city' },
    { media_id: 11, title: 'Vostok Spacecraft Capsule', filename: 'vostok-space-ship.jpg', category: 'images', resolution: '1920x1080', filesize: '430 KB', tags: 'science, museum' },
    { media_id: 12, title: 'Yerevan Cascade Art Center', filename: 'yerevan-armenia-art.jpg', category: 'images', resolution: '1920x1080', filesize: '370 KB', tags: 'sculpture, armenia' }
  ],

  templates: [
    { template_id: 1, name: '1080p Landscape Welcome Banner', type: 'canvas', resolution: '1920x1080', orientation: 'Landscape', last_update: '2025-02-15' },
    { template_id: 2, name: 'Digital Menu Board 3-Column', type: 'html', resolution: '1920x1080', orientation: 'Landscape', last_update: '2025-02-18' },
    { template_id: 3, name: 'Vertical Totem Wayfinder', type: 'canvas', resolution: '1080x1920', orientation: 'Portrait', last_update: '2025-03-01' }
  ],

  users: [
    { UID: 1, username: 'admin', email: 'admin@garlic-hub.com', role: 'Administrator', status: 'Active', locale: 'en_US', last_login: '2026-09-06 18:22:10' },
    { UID: 2, username: 'horst', email: 'horst@example.com', role: 'Editor', status: 'Active', locale: 'en_US', last_login: '2026-09-05 14:10:00' },
    { UID: 3, username: 'Günter', email: 'guenter@example.com', role: 'Editor', status: 'Active', locale: 'en_US', last_login: '2026-09-04 11:05:43' },
    { UID: 4, username: 'reseller', email: 'reseller@example.com', role: 'Viewer', status: 'Active', locale: 'de_DE', last_login: '2026-09-01 09:12:30' }
  ]
};

// Global context middleware
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.hostUrl = `${req.protocol}://${req.get('host')}`;

  // Read flash message from cookie if set
  if (req.cookies.gh_flash) {
    try {
      res.locals.flash = JSON.parse(req.cookies.gh_flash);
      res.clearCookie('gh_flash');
    } catch {
      res.locals.flash = null;
    }
  } else {
    res.locals.flash = null;
  }

  // Session user simulation
  if (req.cookies.gh_user) {
    try {
      res.locals.user = JSON.parse(req.cookies.gh_user);
    } catch {
      res.locals.user = { username: 'admin', role: 'Administrator', UID: 1 };
    }
  } else {
    res.locals.user = { username: 'admin', role: 'Administrator', UID: 1 };
  }

  next();
});

// Flash helper
function setFlash(res, message, type = 'success') {
  res.cookie('gh_flash', JSON.stringify({ message, type }), { maxAge: 10000, httpOnly: true });
}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// 1. Dashboard
app.get('/', (req, res) => {
  const onlinePlayers = store.players.filter(p => p.status === 'online').length;
  res.render('home', {
    title: 'Dashboard',
    stats: {
      totalPlayers: store.players.length,
      onlinePlayers,
      totalPlaylists: store.playlists.length,
      totalMedia: store.media.length
    },
    players: store.players
  });
});

// 2. Authentication
app.get('/login', (req, res) => {
  res.render('login', { title: 'Sign In', error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && (password === 'Demo1234!' || password === 'admin' || password === '')) {
    const userObj = { username: 'admin', role: 'Administrator', UID: 1 };
    res.cookie('gh_user', JSON.stringify(userObj), { maxAge: 86400000 });
    setFlash(res, 'Logged in successfully as Administrator');
    return res.redirect('/');
  }

  // Check other users
  const found = store.users.find(u => u.username.toLowerCase() === (username || '').toLowerCase());
  if (found) {
    res.cookie('gh_user', JSON.stringify(found), { maxAge: 86400000 });
    setFlash(res, `Welcome back, ${found.username}!`);
    return res.redirect('/');
  }

  res.render('login', { title: 'Sign In', error: 'Invalid username or password credentials.' });
});

app.get('/logout', (req, res) => {
  res.clearCookie('gh_user');
  setFlash(res, 'You have been logged out.');
  res.redirect('/login');
});

// 3. Players Management
app.get('/player', (req, res) => {
  res.render('player', {
    title: 'Media Players',
    players: store.players,
    playlists: store.playlists
  });
});

app.post('/player/add', (req, res) => {
  const { player_name, model, ip, resolution, playlist_id, refresh } = req.body;
  const pl = store.playlists.find(p => p.playlist_id === Number(playlist_id));
  const newPlayer = {
    player_id: Date.now(),
    player_name: player_name || 'New Hardware Player',
    model: model || 'Raspberry Pi 5',
    ip: ip || '192.168.1.120',
    resolution: resolution || '1920x1080',
    uuid: 'gh-' + Math.random().toString(36).substring(2, 10),
    playlist_id: Number(playlist_id) || 1,
    playlist_name: pl ? pl.playlist_name : 'hurzi (Master Loop)',
    status: 'online',
    refresh: Number(refresh) || 300,
    last_ping: 'Just now',
    firmware: 'v2.5.1'
  };
  store.players.push(newPlayer);
  setFlash(res, `Registered new player "${newPlayer.player_name}"`);
  res.redirect('/player');
});

app.get('/player/edit/:id', (req, res) => {
  const player = store.players.find(p => p.player_id === Number(req.params.id));
  if (!player) return res.redirect('/player');
  res.render('player_edit', {
    title: `Edit Player: ${player.player_name}`,
    player,
    playlists: store.playlists
  });
});

app.post('/player/edit/:id', (req, res) => {
  const player = store.players.find(p => p.player_id === Number(req.params.id));
  if (player) {
    const { player_name, model, ip, resolution, status, playlist_id, refresh } = req.body;
    player.player_name = player_name || player.player_name;
    player.model = model || player.model;
    player.ip = ip || player.ip;
    player.resolution = resolution || player.resolution;
    player.status = status || player.status;
    player.refresh = Number(refresh) || player.refresh;
    player.playlist_id = Number(playlist_id) || player.playlist_id;
    const pl = store.playlists.find(p => p.playlist_id === player.playlist_id);
    if (pl) player.playlist_name = pl.playlist_name;
    setFlash(res, `Updated device settings for "${player.player_name}"`);
  }
  res.redirect('/player');
});

app.post('/player/assign/:id', (req, res) => {
  const player = store.players.find(p => p.player_id === Number(req.params.id));
  if (player) {
    const plId = Number(req.body.playlist_id);
    player.playlist_id = plId;
    const pl = store.playlists.find(p => p.playlist_id === plId);
    if (pl) player.playlist_name = pl.playlist_name;
    setFlash(res, `Assigned playlist "${player.playlist_name}" to player "${player.player_name}"`);
  }
  res.redirect('/player');
});

app.post('/player/push/:id', (req, res) => {
  const player = store.players.find(p => p.player_id === Number(req.params.id));
  if (player) {
    player.last_ping = 'Just now';
    setFlash(res, `Content sync triggered for player "${player.player_name}" (SMIL feed notified)`);
  }
  res.redirect(req.headers.referer || '/player');
});

app.post('/player/ping/:id', (req, res) => {
  const player = store.players.find(p => p.player_id === Number(req.params.id));
  if (player) {
    player.last_ping = 'Just now';
    player.status = 'online';
    setFlash(res, `Ping OK (14ms latency) from ${player.ip} (${player.model})`);
  }
  res.redirect('/player');
});

app.post('/player/delete/:id', (req, res) => {
  store.players = store.players.filter(p => p.player_id !== Number(req.params.id));
  setFlash(res, 'Player removed from network inventory');
  res.redirect('/player');
});

// 4. Playlists Management
app.get('/playlists', (req, res) => {
  res.render('playlists', {
    title: 'Playlists',
    playlists: store.playlists
  });
});

app.post('/playlists/create', (req, res) => {
  const { playlist_name, playlist_mode, shuffle } = req.body;
  const newPl = {
    playlist_id: Date.now(),
    playlist_name: playlist_name || 'Untitled Playlist',
    playlist_mode: playlist_mode || 'master',
    duration: 0,
    shuffle: Boolean(shuffle),
    last_update: new Date().toISOString().replace('T', ' ').substring(0, 19),
    items: []
  };
  store.playlists.push(newPl);
  setFlash(res, `Created new playlist "${newPl.playlist_name}"`);
  res.redirect(`/playlists/compose/${newPl.playlist_id}`);
});

app.get('/playlists/compose/:id', (req, res) => {
  const playlist = store.playlists.find(p => p.playlist_id === Number(req.params.id));
  if (!playlist) return res.redirect('/playlists');

  // Recalculate duration
  playlist.duration = playlist.items.reduce((acc, item) => acc + (item.duration || 10), 0);

  res.render('playlist_compose', {
    title: `Compose: ${playlist.playlist_name}`,
    playlist,
    allMedia: store.media
  });
});

app.post('/playlists/:id/items/add', (req, res) => {
  const playlist = store.playlists.find(p => p.playlist_id === Number(req.params.id));
  if (playlist) {
    const mediaItem = store.media.find(m => m.media_id === Number(req.body.media_id));
    if (mediaItem) {
      playlist.items.push({
        item_id: Date.now(),
        item_name: mediaItem.title,
        item_type: 'image',
        file_resource: mediaItem.filename,
        duration: Number(req.body.duration) || 15,
        fit: 'cover'
      });
      playlist.duration = playlist.items.reduce((acc, i) => acc + i.duration, 0);
      playlist.last_update = new Date().toISOString().replace('T', ' ').substring(0, 19);
      setFlash(res, `Added "${mediaItem.title}" to sequence`);
    }
  }
  res.redirect(`/playlists/compose/${req.params.id}`);
});

app.post('/playlists/:id/items/:itemId/duration', (req, res) => {
  const playlist = store.playlists.find(p => p.playlist_id === Number(req.params.id));
  if (playlist) {
    const item = playlist.items.find(i => i.item_id === Number(req.params.itemId));
    if (item) {
      item.duration = Math.max(1, Number(req.body.duration) || 10);
      playlist.duration = playlist.items.reduce((acc, i) => acc + i.duration, 0);
      setFlash(res, `Updated duration for "${item.item_name}" to ${item.duration}s`);
    }
  }
  res.redirect(`/playlists/compose/${req.params.id}`);
});

app.post('/playlists/:id/items/:itemId/remove', (req, res) => {
  const playlist = store.playlists.find(p => p.playlist_id === Number(req.params.id));
  if (playlist) {
    playlist.items = playlist.items.filter(i => i.item_id !== Number(req.params.itemId));
    playlist.duration = playlist.items.reduce((acc, i) => acc + i.duration, 0);
    setFlash(res, 'Slide removed from sequence');
  }
  res.redirect(`/playlists/compose/${req.params.id}`);
});

app.post('/playlists/delete/:id', (req, res) => {
  store.playlists = store.playlists.filter(p => p.playlist_id !== Number(req.params.id));
  setFlash(res, 'Playlist deleted');
  res.redirect('/playlists');
});

// 5. Mediapool
app.get('/mediapool', (req, res) => {
  const selectedCategory = req.query.category || 'all';
  const filteredMedia = selectedCategory === 'all'
    ? store.media
    : store.media.filter(m => m.category === selectedCategory);

  const allAvailableFiles = [
    'abu-dhabi-mosque.jpg',
    'bangkok-electricity.jpg',
    'corfu-anemomilos.jpg',
    'corfu-coast.jpg',
    'hongkong-art.jpg',
    'hongkong-pier.jpg',
    'hua-hin-pub.jpg',
    'indian-shop-bangkok.jpg',
    'istanbul-by-night.jpg',
    'moscow-river.jpg',
    'vostok-space-ship.jpg',
    'yerevan-armenia-art.jpg'
  ];

  res.render('mediapool', {
    title: 'Mediapool',
    media: store.media,
    filteredMedia,
    selectedCategory,
    allAvailableFiles
  });
});

app.post('/mediapool/upload', (req, res) => {
  const { title, filename, category, resolution, tags } = req.body;
  const newAsset = {
    media_id: Date.now(),
    title: title || 'New Media Asset',
    filename: filename || 'abu-dhabi-mosque.jpg',
    category: category || 'images',
    resolution: resolution || '1920x1080',
    filesize: '450 KB',
    tags: tags || 'signage, 1080p'
  };
  store.media.unshift(newAsset);
  setFlash(res, `Asset "${newAsset.title}" added to Mediapool`);
  res.redirect('/mediapool');
});

app.post('/mediapool/delete/:id', (req, res) => {
  store.media = store.media.filter(m => m.media_id !== Number(req.params.id));
  setFlash(res, 'Asset removed from Mediapool');
  res.redirect('/mediapool');
});

// 6. Templates Designer
app.get('/templates', (req, res) => {
  res.render('templates', {
    title: 'Templates',
    templates: store.templates
  });
});

// 7. Users
app.get('/users', (req, res) => {
  res.render('users', {
    title: 'User Management',
    users: store.users
  });
});

app.post('/users/add', (req, res) => {
  const { username, email, role, locale } = req.body;
  const newUser = {
    UID: Date.now(),
    username: username || 'newuser',
    email: email || 'user@example.com',
    role: role || 'Editor',
    status: 'Active',
    locale: locale || 'en_US',
    last_login: 'Never'
  };
  store.users.push(newUser);
  setFlash(res, `User "${newUser.username}" created`);
  res.redirect('/users');
});

app.post('/users/delete/:id', (req, res) => {
  store.users = store.users.filter(u => u.UID !== Number(req.params.id));
  setFlash(res, 'User account removed');
  res.redirect('/users');
});

// 8. Legals
app.get('/legals', (req, res) => {
  res.render('legals', { title: 'Legal Notice' });
});

// 9. SMIL Index Endpoint (Core Digital Signage SMIL 3.0 Feed)
app.get('/smil-index', (req, res) => {
  let selectedPlaylist = null;

  if (req.query.playlist_id) {
    selectedPlaylist = store.playlists.find(p => p.playlist_id === Number(req.query.playlist_id));
  } else if (req.query.player_id) {
    const player = store.players.find(p => p.player_id === Number(req.query.player_id));
    if (player) {
      selectedPlaylist = store.playlists.find(p => p.playlist_id === player.playlist_id);
    }
  }

  if (!selectedPlaylist) {
    selectedPlaylist = store.playlists[0];
  }

  const baseUrl = `${req.protocol}://${req.get('host')}`;

  // Build W3C SMIL 3.0 XML string
  let smilXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  smilXml += `<smil xmlns="http://www.w3.org/ns/SMIL" version="3.0" baseProfile="Language">\n`;
  smilXml += `  <head>\n`;
  smilXml += `    <meta name="title" content="${selectedPlaylist.playlist_name.replace(/"/g, '&quot;')}" />\n`;
  smilXml += `    <meta name="generator" content="Garlic-Hub Digital Signage Management" />\n`;
  smilXml += `    <layout>\n`;
  smilXml += `      <root-layout width="1920" height="1080" backgroundColor="#000000" />\n`;
  smilXml += `      <region regionName="main" left="0" top="0" width="1920" height="1080" />\n`;
  smilXml += `    </layout>\n`;
  smilXml += `  </head>\n`;
  smilXml += `  <body>\n`;
  smilXml += `    <seq repeatCount="indefinite">\n`;

  if (selectedPlaylist.items && selectedPlaylist.items.length > 0) {
    selectedPlaylist.items.forEach(item => {
      const srcUrl = `${baseUrl}/media/${item.file_resource}`;
      smilXml += `      <img src="${srcUrl}" dur="${item.duration || 15}s" fit="${item.fit || 'cover'}" region="main" title="${item.item_name.replace(/"/g, '&quot;')}" />\n`;
    });
  } else {
    smilXml += `      <text src="data:text/plain,Garlic-Hub Empty Playlist" dur="10s" region="main" />\n`;
  }

  smilXml += `    </seq>\n`;
  smilXml += `  </body>\n`;
  smilXml += `</smil>\n`;

  res.set('Content-Type', 'application/smil+xml; charset=utf-8');
  res.send(smilXml);
});

// 10. Async / API Endpoints
app.get('/async/player/list', (req, res) => res.json(store.players));
app.get('/async/playlists/list', (req, res) => res.json(store.playlists));
app.get('/async/mediapool/list', (req, res) => res.json(store.media));

// 404 handler
app.use((req, res) => {
  res.status(404).render('home', {
    title: 'Not Found',
    stats: {
      totalPlayers: store.players.length,
      onlinePlayers: store.players.filter(p => p.status === 'online').length,
      totalPlaylists: store.playlists.length,
      totalMedia: store.media.length
    },
    players: store.players
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Garlic-Hub Digital Signage server running on http://${HOST}:${PORT}`);
});
