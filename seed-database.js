// MongoDB seeding script
// Run this in the MongoDB pod to populate the database

// Switch to the echoboard database
db = db.getSiblingDB('echoboard')

// Clear existing data
db.users.deleteMany({})
db.feedback.deleteMany({})

print("Cleared existing data")

// Insert sample users
const users = [
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: '$2a$10$rQJ8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K', // password123
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Alex Chen',
    email: 'alex@example.com',
    password: '$2a$10$rQJ8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K', // password123
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Maria Garcia',
    email: 'maria@example.com',
    password: '$2a$10$rQJ8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K', // password123
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'David Kim',
    email: 'david@example.com',
    password: '$2a$10$rQJ8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K', // password123
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Emma Wilson',
    email: 'emma@example.com',
    password: '$2a$10$rQJ8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K8cL8K', // password123
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const insertedUsers = db.users.insertMany(users)
print(`Created ${insertedUsers.insertedIds.length} users`)

// Insert sample feedback
const feedback = [
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
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
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
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18')
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
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
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
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22')
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
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
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
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28')
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
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30')
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
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  }
]

const insertedFeedback = db.feedback.insertMany(feedback)
print(`Created ${insertedFeedback.insertedIds.length} feedback entries`)

print("\n--- SEEDING SUMMARY ---")
print(`Users created: ${insertedUsers.insertedIds.length}`)
print(`Feedback created: ${insertedFeedback.insertedIds.length}`)

print("\n--- TEST ACCOUNTS ---")
users.forEach(user => {
  print(`${user.role.toUpperCase()}: ${user.email} / password123`)
})

print("\nDatabase seeded successfully!")
