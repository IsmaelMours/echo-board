const mongoose = require('mongoose');

// Sample users data
const sampleUsers = [
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Alex Chen',
    email: 'alex@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Maria Garcia',
    email: 'maria@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'David Kim',
    email: 'david@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Emma Wilson',
    email: 'emma@example.com',
    password: 'password123',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  }
];

// Sample feedback data
const sampleFeedback = [
  {
    title: 'Great User Experience',
    message: 'The new dashboard design is intuitive and easy to navigate. I love the clean interface and how quickly I can find what I need.',
    rating: 5,
    status: 'approved',
    author: {
      name: 'Alex Chen',
      email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date('2024-01-15')
  },
  {
    title: 'Mobile App Performance',
    message: 'The mobile app is working much better now. Loading times have improved significantly and the offline functionality is great.',
    rating: 4,
    status: 'approved',
    author: {
      name: 'Maria Garcia',
      email: 'maria@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date('2024-01-18')
  },
  {
    title: 'Feature Request: Dark Mode',
    message: 'Would love to see a dark mode option for the application. It would be great for users who prefer darker themes and for use in low-light environments.',
    rating: 4,
    status: 'pending',
    author: {
      name: 'David Kim',
      email: 'david@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date('2024-01-20')
  },
  {
    title: 'Bug Report: Search Function',
    message: 'The search function sometimes returns no results even when I know the content exists. This happens especially with partial word searches.',
    rating: 2,
    status: 'pending',
    author: {
      name: 'Emma Wilson',
      email: 'emma@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date('2024-01-22')
  },
  {
    title: 'Customer Support Excellence',
    message: 'The customer support team was incredibly helpful when I had an issue with my account. They resolved it quickly and were very professional.',
    rating: 5,
    status: 'approved',
    author: {
      name: 'Alex Chen',
      email: 'alex@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date('2024-01-25')
  },
  {
    title: 'Documentation Improvements',
    message: 'The API documentation could be more detailed. Some endpoints lack examples and the error responses aren\'t well documented.',
    rating: 3,
    status: 'pending',
    author: {
      name: 'David Kim',
      email: 'david@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date('2024-01-28')
  },
  {
    title: 'Integration with Third-party Tools',
    message: 'Would be great to have better integration with popular project management tools like Jira, Asana, and Trello.',
    rating: 4,
    status: 'pending',
    author: {
      name: 'Maria Garcia',
      email: 'maria@example.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date('2024-01-30')
  },
  {
    title: 'Performance on Large Datasets',
    message: 'The application slows down significantly when working with large datasets. Consider implementing pagination or virtual scrolling.',
    rating: 3,
    status: 'pending',
    author: {
      name: 'Emma Wilson',
      email: 'emma@example.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
    },
    createdAt: new Date('2024-02-01')
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/echoboard';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Get the models
    const User = require('./dist/models/user').User;
    const Feedback = require('./dist/models/Feedback').Feedback;

    // Clear existing data
    await User.deleteMany({});
    await Feedback.deleteMany({});
    console.log('Cleared existing data');

    // Create users (using save() to trigger pre-save hooks for password hashing)
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users`);

    // Create a map of email to user ID for linking feedback
    const userMap = {};
    createdUsers.forEach(user => {
      userMap[user.email] = user._id;
    });

    // Update feedback data to include userId
    const feedbackWithUserIds = sampleFeedback.map(feedback => {
      const userEmail = feedback.author.email;
      const userId = userMap[userEmail];
      if (!userId) {
        throw new Error(`User not found for email: ${userEmail}`);
      }
      return {
        ...feedback,
        userId: userId
      };
    });

    // Create feedback
    const createdFeedback = await Feedback.insertMany(feedbackWithUserIds);
    console.log(`Created ${createdFeedback.length} feedback entries`);

    console.log('Database seeded successfully!');
    
    // Display summary
    console.log('\n--- SEEDING SUMMARY ---');
    console.log(`Users created: ${createdUsers.length}`);
    console.log(`Feedback created: ${createdFeedback.length}`);
    
    // Show user credentials for testing
    console.log('\n--- TEST ACCOUNTS ---');
    sampleUsers.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeding
seedDatabase();
