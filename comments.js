// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

// Create web server
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create comments object
const commentsByPostId = {};

// Create route to get all comments for a given post
app.get('/posts/:id/comments', (req, res) => {
  // Send back comments
  res.send(commentsByPostId[req.params.id] || []);
});

// Create route to post a comment to a post
app.post('/posts/:id/comments', async (req, res) => {
  // Generate random id for comment
  const commentId = randomBytes(4).toString('hex');
  // Get comment content from request body
  const { content } = req.body;
  // Get comments for post
  const comments = commentsByPostId[req.params.id] || [];
  // Add new comment to comments
  comments.push({ id: commentId, content, status: 'pending' });
  // Set comments for post
  commentsByPostId[req.params.id] = comments;
  // Emit event to event bus
  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    },
  });
  // Send back comments
  res.status(201).send(comments);
});

// Create route to receive events from event bus
app.post('/events', async (req, res) => {
  // Get event type and data from request body
  const { type, data } = req.body;
  // Log event type
  console.log(`Received event: ${type}`);
  // If event type is CommentModerated
  if (type === 'CommentModerated') {
    // Get comment id, post id, and status from data
    const { id, postId, status, content } = data;
    // Get comments for post
    const comments = commentsByPostId[postId];
    // Find comment with matching id
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    // Set status of comment to status from data