import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(express.json());
const allowedOrigins = [
  'https://streetup-frontend.onrender.com',
  'http://localhost:5000',
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

const PORT = process.env.PORT || 5000;

// MongoDB Connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("foodstalls");
    console.log("Connected to MongoDB Atlas: foodstalls");
  } catch (err) {
    console.error("Failed to connect MongoDB:", err);
    setTimeout(connectDB, 5000);
  }
}

connectDB();

app.get("/", (req, res) => {
  res.send("Foodstalls backend API running");
});

// ===== AUTHENTICATION ROUTES =====

// Signup
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    res.status(201).json({ message: "User created successfully", userId: result.insertedId });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET not configured" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { name: user.name, email: user.email, id: user._id } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== QUESTIONS ROUTES =====

// Get all questions
app.get("/questions", async (req, res) => {
  try {
    const questions = await db.collection("queries").find().toArray();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch questions" });
  }
});

// Get single question
app.get("/questions/:id", async (req, res) => {
  try {
    const question = await db.collection("queries").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!question) {
      return res.status(404).json({ error: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch question" });
  }
});

// Post new question
app.post("/questions", async (req, res) => {
  try {
    const { title, location, category, description } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!title || !location || !category || !description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        // Token invalid, allow anonymous posting
      }
    }

    const newQuestion = {
      title,
      location,
      category,
      description,
      upvotes: 0,
      answers: 0,
      verified: false,
      userId: userId ? new ObjectId(userId) : null,
      createdAt: new Date(),
    };

    const result = await db.collection("queries").insertOne(newQuestion);
    res.status(201).json({ message: "Question posted successfully", questionId: result.insertedId });
  } catch (err) {
    console.error("Error posting question:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== ANSWERS ROUTES =====

// Get answers for a specific question
app.get("/answers/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(questionId)) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    // Fetch all answers for this question
    const answers = await db
      .collection("answers")
      .find({ question_id: new ObjectId(questionId) })
      .toArray();

    res.json(answers);
  } catch (err) {
    console.error("Error fetching answers:", err);
    res.status(500).json({ error: "Failed to fetch answers" });
  }
});

// Post new answer
app.post("/answers", async (req, res) => {
  try {
    const { question_id, content } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!question_id || !content) {
      return res.status(400).json({ error: "Question ID and answer content are required" });
    }

    let userId = null;
    let author = "Anonymous";

    // Extract token and verify
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = new ObjectId(decoded.userId);
        const user = await db.collection("users").findOne({ _id: userId });
        author = user?.name || "Anonymous";
      } catch (err) {
        console.log("Token verification failed, using anonymous");
      }
    }

    const newAnswer = {
      question_id: new ObjectId(question_id),
      author,
      userId: userId,
      content,
      upvotes: 0,
      downvotes: 0,
      userVotes: [],
      verified: false,
      createdAt: new Date(),
    };

    const result = await db.collection("answers").insertOne(newAnswer);

    // Increment answer count on question
    await db.collection("queries").updateOne(
      { _id: new ObjectId(question_id) },
      { $inc: { answers: 1 } }
    );

    res.status(201).json({ message: "Answer posted successfully", answerId: result.insertedId });
  } catch (err) {
    console.error("Error posting answer:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Upvote answer
app.post("/answers/:answerId/upvote", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const answerId = req.params.answerId;

    if (!ObjectId.isValid(answerId)) {
      return res.status(400).json({ error: "Invalid answer ID" });
    }

    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = new ObjectId(decoded.userId);
      } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
    } else {
      return res.status(401).json({ error: "Must be logged in to vote" });
    }

    const answer = await db.collection("answers").findOne({ _id: new ObjectId(answerId) });
    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Check if user already voted
    const userVotes = answer.userVotes || [];
    const voteIndex = userVotes.findIndex((v) => v.userId?.toString() === userId.toString());

    if (voteIndex !== -1) {
      // User already voted
      const existingVote = userVotes[voteIndex];
      if (existingVote.type === "upvote") {
        return res.status(400).json({ error: "Already upvoted" });
      }

      // Remove downvote, add upvote
      await db.collection("answers").updateOne(
        { _id: new ObjectId(answerId) },
        {
          $inc: { downvotes: -1, upvotes: 1 },
          $set: { [`userVotes.${voteIndex}.type`]: "upvote" },
        }
      );
    } else {
      // New vote
      userVotes.push({ userId, type: "upvote" });
      await db.collection("answers").updateOne(
        { _id: new ObjectId(answerId) },
        {
          $inc: { upvotes: 1 },
          $set: { userVotes },
        }
      );
    }

    res.json({ message: "Upvoted successfully" });
  } catch (err) {
    console.error("Upvote error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Downvote answer
app.post("/answers/:answerId/downvote", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const answerId = req.params.answerId;

    if (!ObjectId.isValid(answerId)) {
      return res.status(400).json({ error: "Invalid answer ID" });
    }

    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = new ObjectId(decoded.userId);
      } catch (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
    } else {
      return res.status(401).json({ error: "Must be logged in to vote" });
    }

    const answer = await db.collection("answers").findOne({ _id: new ObjectId(answerId) });
    if (!answer) {
      return res.status(404).json({ error: "Answer not found" });
    }

    // Check if user already voted
    const userVotes = answer.userVotes || [];
    const voteIndex = userVotes.findIndex((v) => v.userId?.toString() === userId.toString());

    if (voteIndex !== -1) {
      // User already voted
      const existingVote = userVotes[voteIndex];
      if (existingVote.type === "downvote") {
        return res.status(400).json({ error: "Already downvoted" });
      }

      // Remove upvote, add downvote
      await db.collection("answers").updateOne(
        { _id: new ObjectId(answerId) },
        {
          $inc: { upvotes: -1, downvotes: 1 },
          $set: { [`userVotes.${voteIndex}.type`]: "downvote" },
        }
      );
    } else {
      // New vote
      userVotes.push({ userId, type: "downvote" });
      await db.collection("answers").updateOne(
        { _id: new ObjectId(answerId) },
        {
          $inc: { downvotes: 1 },
          $set: { userVotes },
        }
      );
    }

    res.json({ message: "Downvoted successfully" });
  } catch (err) {
    console.error("Downvote error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ===== STALLS ROUTES =====

// Get all stalls or filter by location/food
app.get("/stalls", async (req, res) => {
  try {
    const foodQuery = req.query.food;
    const locationQuery = req.query.location;
    const filter = {};

    if (foodQuery) {
      const foodArray = foodQuery.split(",").map(f => f.trim());
      filter.food_type = { $in: foodArray };
    }

    if (locationQuery) {
      filter.$or = [
        { "location.city": { $regex: locationQuery, $options: "i" } },
        { "location.area": { $regex: locationQuery, $options: "i" } }
      ];
    }

    const stalls = await db.collection("localstalls").find(filter).toArray();
    res.json(stalls);
  } catch (err) {
    res.status(500).json({ error: "Cannot fetch stalls" });
  }
});

// ===== USER ROUTES =====

// Get user profile
app.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user stats
    const questionsCount = await db.collection("queries").countDocuments({ userId: user._id });
    const answersCount = await db.collection("answers").countDocuments({ userId: user._id });
    const upvotesCount = await db.collection("answers").aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: null, total: { $sum: "$upvotes" } } }
    ]).toArray();

    res.json({
      name: user.name,
      email: user.email,
      location: user.location || "Not provided",
      joinedDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently",
      stats: {
        questions: questionsCount,
        answers: answersCount,
        upvotes: upvotesCount[0]?.total || 0,
      },
    });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Update user profile
app.put("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const { name, location } = req.body;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    if (!name && !location) {
      return res.status(400).json({ error: "Provide at least name or location to update" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = new ObjectId(decoded.userId);
      const updateData = {};

      if (name) updateData.name = name;
      if (location) updateData.location = location;

      const result = await db.collection("users").updateOne(
        { _id: userId },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "Profile updated successfully", updated: updateData });
    } catch (tokenErr) {
      return res.status(401).json({ error: "Invalid token" });
    }
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user's questions
app.get("/user/questions", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const questions = await db.collection("queries")
      .find({ userId: new ObjectId(decoded.userId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(questions);
  } catch (err) {
    console.error("Fetch user questions error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Get user's answers
app.get("/user/answers", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const answers = await db.collection("answers")
      .find({ userId: new ObjectId(decoded.userId) })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(answers);
  } catch (err) {
    console.error("Fetch user answers error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

// Search recommendations
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ error: "Search query required" });
    }

    const results = await db.collection("queries")
      .find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { location: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } }
        ]
      })
      .toArray();

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
