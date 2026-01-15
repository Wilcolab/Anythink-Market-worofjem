# Integration Guide - Third-Party Services

## Overview

This guide covers integrating your Node.js server with third-party services and APIs to enhance functionality and capabilities.

---

## 🗄️ Database Integration

### Option 1: MongoDB

#### Setup

```bash
npm install mongoose
```

#### Basic Integration

**Create `src/models/Task.js`**:
```javascript
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Task', taskSchema);
```

**Update `src/index.js`**:
```javascript
const mongoose = require('mongoose');
const Task = require('./models/Task');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tasks');

// GET /tasks - now from database
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /tasks - save to database
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task({ text: req.body.text });
    await task.save();
    res.status(201).json({ message: 'Task added', taskCount: await Task.countDocuments() });
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' });
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Task deleted', taskCount: await Task.countDocuments() });
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});
```

#### Environment Setup

**`.env.local`**:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tasks
```

---

### Option 2: PostgreSQL with Sequelize

#### Setup

```bash
npm install sequelize pg pg-hstore
```

#### Basic Integration

**Create `src/models/index.js`**:
```javascript
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);

const Task = sequelize.define('Task', {
  text: {
    type: Sequelize.STRING(1000),
    allowNull: false
  },
  completed: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

module.exports = { sequelize, Task };
```

**Update `src/index.js`**:
```javascript
const { sequelize, Task } = require('./models');

// Sync database
sequelize.sync();

// GET /tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.findAll();
  res.json({ tasks: tasks.map(t => t.text) });
});

// POST /tasks
app.post('/tasks', async (req, res) => {
  await Task.create({ text: req.body.text });
  res.status(201).json({ message: 'Task added' });
});
```

---

## 🔐 Authentication & Authorization

### JWT Authentication

#### Setup

```bash
npm install jsonwebtoken bcryptjs
```

#### Implementation

**Create `src/middleware/auth.js`**:
```javascript
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
```

**Add to routes**:
```javascript
const auth = require('./middleware/auth');

app.get('/tasks', auth, (req, res) => {
  // Only authenticated users can access
  res.json({ tasks });
});

app.post('/login', (req, res) => {
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token });
});
```

---

## 📧 Email Integration

### SendGrid

#### Setup

```bash
npm install @sendgrid/mail
```

#### Usage

**Create `src/utils/email.js`**:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendTaskNotification(userEmail, taskText) {
  const msg = {
    to: userEmail,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'New Task Created',
    html: `<strong>Task: ${taskText}</strong>`
  };

  await sgMail.send(msg);
}

module.exports = { sendTaskNotification };
```

**Use in routes**:
```javascript
const { sendTaskNotification } = require('./utils/email');

app.post('/tasks', async (req, res) => {
  // ... task creation logic
  
  // Send email notification
  await sendTaskNotification(req.user.email, req.body.text);
  
  res.status(201).json({ message: 'Task added' });
});
```

---

## 💰 Payment Processing

### Stripe Integration

#### Setup

```bash
npm install stripe
```

#### Basic Implementation

**Create `src/utils/payment.js`**:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createPaymentIntent(amount) {
  const intent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd'
  });
  return intent;
}

async function processPayment(paymentMethodId, amount) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    payment_method: paymentMethodId,
    confirm: true
  });
  return paymentIntent;
}

module.exports = { createPaymentIntent, processPayment };
```

**Add payment endpoint**:
```javascript
const { createPaymentIntent } = require('./utils/payment');

app.post('/create-payment-intent', async (req, res) => {
  try {
    const intent = await createPaymentIntent(req.body.amount);
    res.json({ clientSecret: intent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## 🔔 Notifications

### Firebase Cloud Messaging (FCM)

#### Setup

```bash
npm install firebase-admin
```

#### Configuration

**Initialize Firebase**:
```javascript
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(
    require(process.env.FIREBASE_KEY_PATH)
  ),
  databaseURL: process.env.FIREBASE_DB_URL
});
```

**Send Notifications**:
```javascript
async function sendNotification(deviceToken, title, body) {
  const message = {
    notification: { title, body },
    token: deviceToken
  };

  await admin.messaging().send(message);
}
```

---

## 📊 Analytics

### Google Analytics Integration

#### Setup

```bash
npm install google-analytics
```

#### Implementation

```javascript
const ua = require('universal-analytics');

const visitor = ua(process.env.GOOGLE_ANALYTICS_ID);

// Track page view
visitor.pageview('/tasks').send();

// Track event
visitor.event('Tasks', 'Created').send();

// Track timing
visitor.timing('API', 'GET /tasks', responseTime).send();
```

---

## 🗺️ Maps & Geolocation

### Google Maps API

#### Setup

```bash
npm install @googlemaps/js-client-library
```

#### Usage

```javascript
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY
});

app.get('/geocode', (req, res) => {
  googleMapsClient.geocode({
    address: req.query.address
  }, (err, response) => {
    if (!err) {
      res.json(response.json.results);
    } else {
      res.status(400).json({ error: err });
    }
  });
});
```

---

## 🔍 Search Integration

### Elasticsearch

#### Setup

```bash
npm install @elastic/elasticsearch
```

#### Implementation

```javascript
const { Client } = require('@elastic/elasticsearch');

const client = new Client({ 
  node: process.env.ELASTICSEARCH_URL 
});

// Index a task
async function indexTask(task) {
  await client.index({
    index: 'tasks',
    id: task.id,
    body: task
  });
}

// Search tasks
async function searchTasks(query) {
  const { body } = await client.search({
    index: 'tasks',
    body: {
      query: {
        match: { text: query }
      }
    }
  });
  return body.hits.hits;
}

app.get('/search', async (req, res) => {
  const results = await searchTasks(req.query.q);
  res.json({ results });
});
```

---

## 📱 SMS Integration

### Twilio

#### Setup

```bash
npm install twilio
```

#### Implementation

```javascript
const twilio = require('twilio');

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendSMS(phoneNumber, message) {
  await twilioClient.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });
}

app.post('/send-sms', async (req, res) => {
  await sendSMS(req.body.phone, req.body.message);
  res.json({ success: true });
});
```

---

## 🤖 AI/ML Integration

### OpenAI Integration

#### Setup

```bash
npm install openai
```

#### Implementation

```javascript
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

async function generateTaskSummary(taskText) {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: `Summarize this task: ${taskText}` }
    ]
  });
  
  return response.data.choices[0].message.content;
}

app.post('/summarize', async (req, res) => {
  const summary = await generateTaskSummary(req.body.text);
  res.json({ summary });
});
```

---

## 📦 CDN Integration

### AWS CloudFront

#### Configuration

**Update response headers**:
```javascript
app.get('/static/*', (req, res) => {
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  // Serve static content
});
```

**CloudFront cache behaviors**:
```
GET /tasks:
  - Cache-Control: public, max-age=30
  - TTL: 30 seconds

GET /health:
  - Cache-Control: no-cache
  - TTL: 0
```

---

## 🔄 Webhook Integration

### Receiving Webhooks

```javascript
app.post('/webhooks/task-completed', (req, res) => {
  const { taskId, completedAt } = req.body;
  
  // Verify webhook signature
  const signature = req.headers['x-webhook-signature'];
  const calculated = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (signature !== calculated) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook
  console.log(`Task ${taskId} completed at ${completedAt}`);
  res.json({ success: true });
});
```

### Sending Webhooks

```javascript
async function sendWebhook(url, data) {
  const signature = crypto
    .createHmac('sha256', process.env.WEBHOOK_SECRET)
    .update(JSON.stringify(data))
    .digest('hex');

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-signature': signature
    },
    body: JSON.stringify(data)
  });
}

// Use in routes
app.post('/tasks', async (req, res) => {
  // ... create task
  
  await sendWebhook(
    process.env.WEBHOOK_URL,
    { event: 'task.created', task }
  );
});
```

---

## 📋 Integration Testing

### Test Third-Party Services

```javascript
describe('Third-Party Integrations', () => {
  describe('Stripe Payment', () => {
    it('should create payment intent', async () => {
      const intent = await createPaymentIntent(1000);
      expect(intent).toHaveProperty('client_secret');
    });
  });

  describe('SendGrid Email', () => {
    it('should send email notification', async () => {
      const result = await sendTaskNotification(
        'test@example.com',
        'Test task'
      );
      expect(result).toHaveProperty('id');
    });
  });

  describe('MongoDB Connection', () => {
    it('should connect to database', async () => {
      const tasks = await Task.find();
      expect(Array.isArray(tasks)).toBe(true);
    });
  });
});
```

---

## 🔒 Security Considerations

### API Keys Management

```javascript
// ✅ DO: Use environment variables
const apiKey = process.env.STRIPE_API_KEY;

// ❌ DON'T: Hardcode secrets
const apiKey = 'sk_live_51234567890';
```

### Rate Limiting for External APIs

```javascript
const externalApiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 30,              // 30 requests per minute
  keyGenerator: (req) => req.user?.id
});

app.post('/create-payment-intent', externalApiLimiter, async (req, res) => {
  // ... payment logic
});
```

### Retry Logic

```javascript
async function retryableRequest(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// Usage
const result = await retryableRequest(() => 
  stripe.paymentIntents.create({ amount: 1000 })
);
```

---

## 📚 Integration Checklist

- [ ] Database connection established
- [ ] Authentication implemented
- [ ] Email service configured
- [ ] Payment processing tested
- [ ] Notifications working
- [ ] Analytics tracking enabled
- [ ] Error handling for failures
- [ ] Retry logic implemented
- [ ] Security verified
- [ ] Integration tests passing

---

## 📖 Resource Links

| Service | Documentation | SDK |
|---------|---------------|-----|
| MongoDB | https://docs.mongodb.com/ | mongoose |
| PostgreSQL | https://www.postgresql.org/docs/ | sequelize |
| Firebase | https://firebase.google.com/docs | firebase-admin |
| Stripe | https://stripe.com/docs | stripe |
| SendGrid | https://docs.sendgrid.com/ | @sendgrid/mail |
| Twilio | https://www.twilio.com/docs | twilio |
| Elasticsearch | https://www.elastic.co/guide | @elastic/elasticsearch |
| OpenAI | https://platform.openai.com/docs | openai |

---

**Status**: ✅ Integration Ready

**Last Updated**: January 15, 2026
