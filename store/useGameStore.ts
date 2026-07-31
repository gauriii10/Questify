import { create } from 'zustand';

export type QuestDifficulty = 'easy' | 'medium' | 'hard';

export interface Quest {
  id: string;
  title: string;
  difficulty: QuestDifficulty;
  xp: number;
  completed: boolean;
}

interface GameState {
  level: number;
  xp: number;
  xpToNextLevel: number;
  gold: number;
  quests: Quest[];

  addQuest: (title: string, difficulty: QuestDifficulty) => void;
  completeQuest: (id: string) => void;
  deleteQuest: (id: string) => void;
}

const XP_MAP: Record<QuestDifficulty, number> = {
  easy: 20,
  medium: 50,
  hard: 100,
};

export const useGameStore = create<GameState>((set) => ({
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  gold: 0,
  quests: [
    {
      id: '1',
      title: 'Initialize Questify Core Systems',
      difficulty: 'easy',
      xp: 20,
      completed: false,
    },
  ],

  addQuest: (title, difficulty) => {
    const newQuest: Quest = {
      id: Date.now().toString(),
      title,
      difficulty,
      xp: XP_MAP[difficulty],
      completed: false,
    };

    set((state) => ({
      quests: [...state.quests, newQuest],
    }));
  },

  completeQuest: (id) => {
    set((state) => {
      const targetQuest = state.quests.find((q) => q.id === id);
      if (!targetQuest || targetQuest.completed) return state;

      let newXp = state.xp + targetQuest.xp;
      let newLevel = state.level;
      let newXpToNextLevel = state.xpToNextLevel;
      let newGold = state.gold + (targetQuest.difficulty === 'hard' ? 50 : 20);

      if (newXp >= state.xpToNextLevel) {
        newXp = newXp - state.xpToNextLevel;
        newLevel += 1;
        newXpToNextLevel = Math.round(newXpToNextLevel * 1.5);
      }

      return {
        level: newLevel,
        xp: newXp,
        xpToNextLevel: newXpToNextLevel,
        gold: newGold,
        quests: state.quests.map((q) =>
          q.id === id ? { ...q, completed: true } : q
        ),
      };
    });
  },

  deleteQuest: (id) => {
    set((state) => ({
      quests: state.quests.filter((q) => q.id !== id),
    }));
  },
}));