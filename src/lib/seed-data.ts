
'use client';
import { doc, setDoc, collection, addDoc, Firestore } from 'firebase/firestore';

/**
 * Utility to seed Firestore with demo content for ConnectHub.
 * Creates standard users and high-quality sample posts.
 */
export async function seedDemoData(db: Firestore) {
  const users = [
    {
      id: 'demo_user_1',
      username: 'alex_rivera',
      displayName: 'Alex Rivera',
      email: 'alex@example.com',
      bio: 'Full-stack developer & open source enthusiast. Exploring the limits of modern JS and AI.',
      avatarUrl: 'https://picsum.photos/seed/alex/200/200',
      followerCount: 1240,
      followingCount: 450,
      postCount: 12,
      createdAt: new Date(Date.now() - 10000000).toISOString()
    },
    {
      id: 'demo_user_2',
      username: 'sarah_designs',
      displayName: 'Sarah Chen',
      email: 'sarah@example.com',
      bio: 'Creating pixel-perfect experiences. Coffee first, code later. Digital Nomad.',
      avatarUrl: 'https://picsum.photos/seed/sarah/200/200',
      followerCount: 890,
      followingCount: 320,
      postCount: 8,
      createdAt: new Date(Date.now() - 20000000).toISOString()
    },
    {
      id: 'demo_user_3',
      username: 'tech_insider',
      displayName: 'Tech Insider',
      email: 'tech@example.com',
      bio: 'Your daily pulse on the ever-changing world of technology and Silicon Valley.',
      avatarUrl: 'https://picsum.photos/seed/tech/200/200',
      followerCount: 5600,
      followingCount: 12,
      postCount: 45,
      createdAt: new Date(Date.now() - 30000000).toISOString()
    }
  ];

  const posts = [
    {
      authorId: 'demo_user_1',
      authorName: 'Alex Rivera',
      authorUsername: 'alex_rivera',
      authorAvatar: 'https://picsum.photos/seed/alex/200/200',
      content: 'Just launched my new portfolio using Next.js 15 and React 19! The performance gains are truly mind-blowing. The era of the App Router is just getting started. 🚀 #webdev #nextjs',
      imageUrl: 'https://picsum.photos/seed/post1/800/600',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      likeCount: 45,
      commentCount: 5
    },
    {
      authorId: 'demo_user_2',
      authorName: 'Sarah Chen',
      authorUsername: 'sarah_designs',
      authorAvatar: 'https://picsum.photos/seed/sarah/200/200',
      content: 'Current mood: Simplicty is the ultimate sophistication. ✨ Working on a new glassmorphism UI kit for the community. Stay tuned!',
      imageUrl: 'https://picsum.photos/seed/post2/800/600',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      likeCount: 128,
      commentCount: 12
    },
    {
      authorId: 'demo_user_3',
      authorName: 'Tech Insider',
      authorUsername: 'tech_insider',
      authorAvatar: 'https://picsum.photos/seed/tech/200/200',
      content: 'BREAKING: New generative AI models are now capable of reasoning through complex mathematical proofs in real-time. This marks a significant step towards AGI. 🤖 #AI #TechNews #Innovation',
      createdAt: new Date(Date.now() - 14400000).toISOString(),
      likeCount: 342,
      commentCount: 89
    },
    {
      authorId: 'demo_user_1',
      authorName: 'Alex Rivera',
      authorUsername: 'alex_rivera',
      authorAvatar: 'https://picsum.photos/seed/alex/200/200',
      content: 'Is it just me or is the new ShadCN UI update absolutely gorgeous? The attention to detail in the components is unmatched.',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likeCount: 89,
      commentCount: 14
    }
  ];

  // Seed Users (using setDoc to ensure specific IDs)
  for (const u of users) {
    await setDoc(doc(db, 'users', u.id), u);
  }

  // Seed Posts (using addDoc for unique post IDs)
  for (const p of posts) {
    await addDoc(collection(db, 'posts'), p);
  }
}
