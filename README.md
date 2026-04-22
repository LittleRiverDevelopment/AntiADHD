# LifeForge Tracker ⚔️

A gamified life stats dashboard that uses video game-style level progression to motivate you to crush daily goals across multiple life areas. Inspired by Skyrim's skill system.

![Dark Mode Dashboard](https://via.placeholder.com/800x400/0a0a0f/00d4ff?text=LifeForge+Tracker)

## ✨ Features

### 🎮 Skyrim-Style Progression
- **6 Skill Categories**: Fitness, Business, Relationships, Learning, Health, Personal
- **XP System**: Earn XP for completing tasks (Easy: 10, Medium: 25, Hard: 50, Legendary: 100)
- **Level Up**: Each category levels independently (1-100)
- **Character Level**: Global level aggregated from all categories

### 🔥 Streak System
- Maintain daily streaks for XP multipliers
- 3 days: 1.5x XP
- 7 days: 2x XP
- 14 days: 2.5x XP
- 30+ days: 3x XP

### 🏆 Achievements
- 30+ unlockable achievements
- Rarity tiers: Common, Uncommon, Rare, Epic, Legendary
- Category-specific and global achievements

### 🎨 Beautiful UI
- Dark mode with neon accents (cyan, purple, green)
- Glassmorphism cards
- Smooth Framer Motion animations
- Confetti celebrations on level-ups
- Mobile responsive

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Chart.js (ready for integration)
- **Storage**: LocalStorage (no backend needed)
- **Effects**: React Confetti

## 📁 Project Structure

```
├── app/
│   ├── globals.css      # Global styles & custom CSS
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main page
├── components/
│   ├── AchievementBadge.tsx
│   ├── AchievementsPanel.tsx
│   ├── CharacterStats.tsx
│   ├── Dashboard.tsx    # Main dashboard component
│   ├── LevelUpModal.tsx
│   ├── ProgressBar.tsx
│   ├── SkillCard.tsx
│   └── TaskItem.tsx
├── lib/
│   ├── achievements.ts  # Achievement definitions
│   ├── storage.ts       # LocalStorage utilities
│   ├── types.ts         # TypeScript types
│   └── xpCalculations.ts # XP & level logic
└── public/
    ├── favicon.svg
    └── manifest.json    # PWA manifest
```

## 🎯 Usage

1. **Complete Tasks**: Click checkboxes to mark tasks complete and earn XP
2. **Add Custom Tasks**: Click "+ Add Quest" in any category
3. **Track Progress**: Watch your XP bars fill and levels increase
4. **Maintain Streaks**: Complete at least one task daily for multipliers
5. **Unlock Achievements**: Hit milestones to earn badges

## 🔧 Customization

### Adding New Categories

Edit `lib/types.ts` to add a new category ID:

```typescript
export type CategoryId = 'fitness' | 'business' | ... | 'newCategory'
```

Then add configuration in `CATEGORY_CONFIG`:

```typescript
newCategory: {
  id: 'newCategory',
  name: 'New Category',
  icon: '🌟',
  description: 'Description here',
  color: '#hexcolor',
}
```

### Adjusting XP Rewards

Edit `XP_REWARDS` in `lib/types.ts`:

```typescript
export const XP_REWARDS: Record<TaskDifficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
  legendary: 100,
}
```

## 📱 PWA Support

The app includes a web manifest for PWA capabilities. Add icons at:
- `/public/icon-192.png`
- `/public/icon-512.png`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this for your own projects!

---

Built with ⚔️ | Inspired by Skyrim | Level up your life!

