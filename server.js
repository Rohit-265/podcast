const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const multer = require('multer'); 

const cors = require('cors'); 


const app = express();
const port = 4107;

mongoose.connect('mongodb://localhost:27017/podcast', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.use(bodyParser.json());
app.use(cors());

// SCHEMASS
//USER
const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true,
    unique: true
  },
  Password: {
    type: String,
    required: true
  },
  PodcastName: {
    type: String,
    unique: true
  }
});

const User = mongoose.model('User', userSchema);

const composedPodSchema = new mongoose.Schema({
    composerName: {
      type: String,
      required: true
    },
    composerPodcastName: {
      type: String,
      required: true
    },
    podcastName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    audioFile: {
      type: String, 
      required: true
    },
    likes: {
      type: Number,
      default: 0 
    },
    dislikes: {
        type: Number,
        default: 0 
      }
  });

  const ComposedPod = mongoose.model('ComposedPod', composedPodSchema);


////////////////////////////////////////////

// REGISTER USER
app.post('/api/register', async (req, res) => {
    const { Name, Email, Password, PodcastName } = req.body;
  
    try {
      const existingEmail = await User.findOne({ Email });
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
        const existingPodcastName = await User.findOne({ PodcastName });
      if (existingPodcastName) {
        return res.status(400).json({ message: 'Podcast Name already exists' });
      }
        const newUser = new User({
        Name,
        Email,
        Password,
        PodcastName,
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Error registering user' });
    }
  });


//LOGIN USER

app.post('/api/login', async (req, res) => {
    const { Email, Password } = req.body;
  
    try {
      const user = await User.findOne({ Email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' });
      }
      
      if (Password !== user.Password) {
        return res.status(400).json({ success: false, message: 'Incorrect password' });
      }
      
      return res.status(200).json({ success: true, user: { Email: user.Email, Name: user.Name, PodcastName: user.PodcastName } });
    } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ success: false, message: 'Failed to login. Please try again later.' });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });
  
  app.post('/api/composedpod/upload', upload.single('audioFile'), async (req, res) => {
    try {
      const { composerName, composerPodcastName, podcastName, description } = req.body;
      const audioFile = req.file.filename; // Get the filename of the uploaded audio file
  
      const newComposedPod = new ComposedPod({
        composerName,
        composerPodcastName,
        podcastName,
        description,
        audioFile,
        likes: 0,
        dislikes : 0 
      });
  
      await newComposedPod.save();
  
      res.status(201).json({ success: true, message: 'Podcast composed and uploaded successfully' });
    } catch (error) {
      console.error('Error uploading composed podcast:', error);
      res.status(500).json({ success: false, message: 'Failed to upload composed podcast' });
    }
  });


  /// LISTE POD API

  app.get('/api/composedpod', async (req, res) => {
    try {
      const podcasts = await ComposedPod.find();
      res.status(200).json(podcasts);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
      res.status(500).json({ message: 'Failed to fetch podcasts' });
    }
  });
  
  // Route to handle liking a podcast
  app.put('/api/composedpod/:id/like', async (req, res) => {
    try {
      const podcast = await ComposedPod.findById(req.params.id);
      if (!podcast) {
        return res.status(404).json({ message: 'Podcast not found' });
      }
      podcast.likes++;
      podcast.dislikes--;
      await podcast.save();
      res.status(200).json({ message: 'Podcast liked successfully', likes: podcast.likes });
    } catch (error) {
      console.error('Error liking podcast:', error);
      res.status(500).json({ message: 'Failed to like podcast' });
    }
  });
  
  // Route to handle unliking a podcast
  app.put('/api/composedpod/:id/unlike', async (req, res) => {
    try {
      const podcast = await ComposedPod.findById(req.params.id);
      if (!podcast) {
        return res.status(404).json({ message: 'Podcast not found' });
      }
      if(podcast.likes > 0)
      {
        podcast.likes--;
      }
      podcast.dislikes++;
      await podcast.save();
      res.status(200).json({ message: 'Podcast unliked successfully', likes: podcast.likes });
    } catch (error) {
      console.error('Error unliking podcast:', error);
      res.status(500).json({ message: 'Failed to unlike podcast' });
    }
  });
  

  
  
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
