import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Player, TrainingSession, TrainingAttendance, Lineup, PerformanceSliders, AppEvent, TrainingReport, Message, CoachSettings } from './types';

// Mock Data
const MOCK_PLAYERS: Player[] = [
  { id: 'p1', name: 'Robert Lewandowski', position: 'ST', baseSkills: { pace: 75, shooting: 94, passing: 79, dribbling: 86, defending: 44, physical: 83 }, stats: { goals: 15, assists: 3, minutes: 1200 } },
  { id: 'p2', name: 'Piotr Zieliński', position: 'CM', baseSkills: { pace: 78, shooting: 77, passing: 86, dribbling: 85, defending: 65, physical: 68 }, stats: { goals: 2, assists: 8, minutes: 1050 } },
  { id: 'p3', name: 'Wojciech Szczęsny', position: 'GK', baseSkills: { pace: 40, shooting: 20, passing: 60, dribbling: 40, defending: 85, physical: 80 }, stats: { goals: 0, assists: 0, minutes: 1350 } },
  { id: 'p4', name: 'Matty Cash', position: 'RB', baseSkills: { pace: 85, shooting: 65, passing: 75, dribbling: 78, defending: 79, physical: 82 }, stats: { goals: 1, assists: 4, minutes: 980 }, isInjured: true },
  { id: 'p5', name: 'Jakub Kiwior', position: 'CB', baseSkills: { pace: 73, shooting: 45, passing: 70, dribbling: 65, defending: 82, physical: 78 }, stats: { goals: 0, assists: 1, minutes: 800 } },
  { id: 'p6', name: 'Nicola Zalewski', position: 'LW', baseSkills: { pace: 86, shooting: 68, passing: 76, dribbling: 82, defending: 60, physical: 65 }, stats: { goals: 3, assists: 5, minutes: 750 } },
  { id: 'p7', name: 'Przemysław Frankowski', position: 'RW', baseSkills: { pace: 88, shooting: 72, passing: 78, dribbling: 80, defending: 68, physical: 75 }, stats: { goals: 4, assists: 6, minutes: 1100 } },
  { id: 'p8', name: 'Sebastian Szymański', position: 'CAM', baseSkills: { pace: 82, shooting: 78, passing: 83, dribbling: 84, defending: 55, physical: 66 }, stats: { goals: 6, assists: 7, minutes: 950 } },
  { id: 'p9', name: 'Jan Bednarek', position: 'CB', baseSkills: { pace: 62, shooting: 40, passing: 65, dribbling: 55, defending: 80, physical: 84 }, stats: { goals: 1, assists: 0, minutes: 1250 } },
  { id: 'p10', name: 'Bartosz Bereszyński', position: 'LB', baseSkills: { pace: 78, shooting: 50, passing: 70, dribbling: 72, defending: 76, physical: 78 }, stats: { goals: 0, assists: 2, minutes: 600 } },
  { id: 'p11', name: 'Karol Świderski', position: 'ST', baseSkills: { pace: 76, shooting: 80, passing: 72, dribbling: 75, defending: 40, physical: 78 }, stats: { goals: 8, assists: 2, minutes: 850 } },
  { id: 'p12', name: 'Krzysztof Piątek', position: 'ST', baseSkills: { pace: 74, shooting: 82, passing: 65, dribbling: 70, defending: 35, physical: 80 }, stats: { goals: 5, assists: 1, minutes: 500 } },
];

const MOCK_TRAININGS: TrainingSession[] = [
  { id: 't1', date: '2026-04-01', type: 'Taktyka' },
  { id: 't2', date: '2026-04-05', type: 'Motoryka' },
  { id: 't3', date: '2026-04-08', type: 'Gierka wewnętrzna' },
];

const MOCK_ATTENDANCES: TrainingAttendance[] = MOCK_PLAYERS.flatMap(p => 
  MOCK_TRAININGS.map(t => {
    const isFormPlayer = p.id === 'p1' || p.id === 'p2';
    const isPresent = isFormPlayer ? true : Math.random() > 0.3;
    return {
      id: `att_${t.id}_${p.id}`,
      trainingId: t.id,
      playerId: p.id,
      isPresent,
      performanceSliders: isPresent ? {
        engagement: isFormPlayer ? 9 : Math.floor(Math.random() * 5) + 4,
        tactics: isFormPlayer ? 8 : Math.floor(Math.random() * 5) + 4,
        technique: isFormPlayer ? 9 : Math.floor(Math.random() * 5) + 4,
      } : undefined
    };
  })
);

const MOCK_EVENTS: AppEvent[] = [
  { id: 'e1', title: 'Trening Taktyczny', date: '2026-04-15', time: '17:00', type: 'Trening', location: 'Boisko Główne' },
  { id: 'e2', title: 'Mecz vs FC Orły', date: '2026-04-18', time: '15:00', type: 'Mecz', location: 'Stadion Miejski', lineup: { 'st': 'p1', 'cm1': 'p2' } },
  { id: 'e3', title: 'Odprawa Wideo', date: '2026-04-14', time: '16:00', type: 'Inne', location: 'Sala Konferencyjna' },
  { id: 'e4', title: 'Mecz vs KS Sokoły', date: '2026-04-25', time: '18:00', type: 'Mecz', location: 'Stadion Wyjazdowy' },
];

export interface CoachData {
  players: Player[];
  trainings: TrainingSession[];
  attendances: TrainingAttendance[];
  lineup: Lineup;
  events: AppEvent[];
  activeEventId: string | null;
  reports: TrainingReport[];
  messages: Message[];
  settings: CoachSettings;
}

const INITIAL_COACH_DATA: CoachData = {
  players: [],
  trainings: [],
  attendances: [],
  lineup: {},
  events: [],
  activeEventId: null,
  reports: [],
  messages: [],
  settings: { enableParentModule: false }
};

interface AppState {
  coachesData: Record<string, CoachData>;
  currentCoachId: string | null;

  setCoachId: (id: string | null) => void;
  
  // Actions
  setActiveEvent: (eventId: string | null) => void;
  toggleInjury: (playerId: string) => void;
  toggleAttendance: (trainingId: string, playerId: string) => void;
  updatePerformance: (trainingId: string, playerId: string, sliders: PerformanceSliders) => void;
  setLineupSlot: (slotId: string, playerId: string | null) => void;
  setEventLineupSlot: (eventId: string, slotId: string, playerId: string | null) => void;
  copyPreviousLineup: (eventId: string) => void;
  
  addPlayer: (player: Omit<Player, 'id' | 'accessCode'>) => void;
  updatePlayer: (id: string, player: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  addEvent: (event: Omit<AppEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<AppEvent>) => void;
  deleteEvent: (id: string) => void;
  saveTrainingReport: (eventId: string) => void;
  sendMessage: (playerIds: string[], content: string) => void;
  markMessageRead: (messageId: string) => void;
  updateSettings: (settings: Partial<CoachSettings>) => void;

  // Getters
  isPlayerInForm: (playerId: string) => boolean;
}

const mutateCoach = (state: AppState, mutator: (data: CoachData) => Partial<CoachData>) => {
  if (!state.currentCoachId) return state;
  const currentData = state.coachesData[state.currentCoachId] || INITIAL_COACH_DATA;
  const updates = mutator(currentData);
  return {
    coachesData: {
      ...state.coachesData,
      [state.currentCoachId]: { ...currentData, ...updates }
    }
  };
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      coachesData: {},
      currentCoachId: null,

      setCoachId: (id) => set(state => {
        if (!id) return { currentCoachId: null };
        if (!state.coachesData[id]) {
          return {
            currentCoachId: id,
            coachesData: {
              ...state.coachesData,
              [id]: INITIAL_COACH_DATA
            }
          };
        }
        return { currentCoachId: id };
      }),

      setActiveEvent: (eventId) => set(state => mutateCoach(state, () => ({ activeEventId: eventId }))),

      toggleInjury: (playerId) => set(state => mutateCoach(state, data => ({
        players: data.players.map(p => p.id === playerId ? { ...p, isInjured: !p.isInjured } : p)
      }))),

      addPlayer: (player) => set(state => mutateCoach(state, data => {
        const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        return {
          players: [...data.players, { ...player, id: `p${Date.now()}`, accessCode }]
        };
      })),

      updatePlayer: (id, updatedPlayer) => set(state => mutateCoach(state, data => ({
        players: data.players.map(p => p.id === id ? { ...p, ...updatedPlayer } : p)
      }))),

      deletePlayer: (id) => set(state => mutateCoach(state, data => {
        const newLineup = { ...data.lineup };
        Object.keys(newLineup).forEach(key => {
          if (newLineup[key] === id) newLineup[key] = null;
        });

        const newEvents = data.events.map(e => {
          if (!e.lineup) return e;
          const eLineup = { ...e.lineup };
          Object.keys(eLineup).forEach(key => {
            if (eLineup[key] === id) eLineup[key] = null;
          });
          return { ...e, lineup: eLineup };
        });

        return {
          players: data.players.filter(p => p.id !== id),
          attendances: data.attendances.filter(a => a.playerId !== id),
          lineup: newLineup,
          events: newEvents,
        };
      })),

      addEvent: (event) => set(state => mutateCoach(state, data => ({
        events: [...data.events, { ...event, id: `e${Date.now()}` }]
      }))),

      updateEvent: (id, updatedEvent) => set(state => mutateCoach(state, data => ({
        events: data.events.map(e => e.id === id ? { ...e, ...updatedEvent } : e)
      }))),

      deleteEvent: (id) => set(state => mutateCoach(state, data => ({
        events: data.events.filter(e => e.id !== id),
        reports: data.reports.filter(r => r.eventId !== id),
        attendances: data.attendances.filter(a => a.trainingId !== id),
        activeEventId: data.activeEventId === id ? null : data.activeEventId
      }))),

      saveTrainingReport: (eventId) => set(state => mutateCoach(state, data => {
        const event = data.events.find(e => e.id === eventId);
        if (!event) return {};

        const eventAttendances = data.attendances.filter(a => a.trainingId === eventId);
        
        const newReport: TrainingReport = {
          id: `rep_${Date.now()}`,
          eventId: event.id,
          date: event.date,
          title: event.title,
          attendances: [...eventAttendances],
          createdAt: new Date().toISOString(),
        };

        const existingIndex = data.reports.findIndex(r => r.eventId === eventId);
        if (existingIndex >= 0) {
          const newReports = [...data.reports];
          newReports[existingIndex] = { ...newReport, id: data.reports[existingIndex].id };
          return { reports: newReports };
        }

        return { reports: [...data.reports, newReport] };
      })),

      sendMessage: (playerIds, content) => set(state => mutateCoach(state, data => {
        const date = new Date().toISOString();
        const newMessages = playerIds.map(id => ({
          id: `msg_${Date.now()}_${id}_${Math.random().toString(36).substr(2, 5)}`,
          playerId: id,
          date,
          content,
          read: false
        }));
        return { messages: [...data.messages, ...newMessages] };
      })),

      markMessageRead: (messageId) => set(state => mutateCoach(state, data => ({
        messages: data.messages.map(m => m.id === messageId ? { ...m, read: true } : m)
      }))),

      updateSettings: (settings) => set(state => mutateCoach(state, data => ({
        settings: { ...data.settings, ...settings }
      }))),

      toggleAttendance: (trainingId, playerId) => set(state => mutateCoach(state, data => {
        const existingIndex = data.attendances.findIndex(a => a.trainingId === trainingId && a.playerId === playerId);
        if (existingIndex >= 0) {
          const newAttendances = [...data.attendances];
          const current = newAttendances[existingIndex];
          newAttendances[existingIndex] = {
            ...current,
            isPresent: !current.isPresent,
            performanceSliders: !current.isPresent ? { engagement: 5, tactics: 5, technique: 5 } : undefined
          };
          return { attendances: newAttendances };
        } else {
          return {
            attendances: [...data.attendances, {
              id: `att_${trainingId}_${playerId}`,
              trainingId,
              playerId,
              isPresent: true,
              performanceSliders: { engagement: 5, tactics: 5, technique: 5 }
            }]
          };
        }
      })),

      updatePerformance: (trainingId, playerId, sliders) => set(state => mutateCoach(state, data => ({
        attendances: data.attendances.map(a => 
          (a.trainingId === trainingId && a.playerId === playerId) 
            ? { ...a, performanceSliders: sliders } 
            : a
        )
      }))),

      setLineupSlot: (slotId, playerId) => set(state => mutateCoach(state, data => {
        const newLineup = { ...data.lineup };
        if (playerId) {
          Object.keys(newLineup).forEach(key => {
            if (newLineup[key] === playerId) newLineup[key] = null;
          });
        }
        newLineup[slotId] = playerId;
        return { lineup: newLineup };
      })),

      setEventLineupSlot: (eventId, slotId, playerId) => set(state => mutateCoach(state, data => {
        const events = [...data.events];
        const eventIndex = events.findIndex(e => e.id === eventId);
        if (eventIndex >= 0) {
          const event = events[eventIndex];
          const newLineup = { ...(event.lineup || {}) };
          
          if (playerId) {
            Object.keys(newLineup).forEach(key => {
              if (newLineup[key] === playerId) newLineup[key] = null;
            });
          }
          
          if (slotId !== 'bench') {
            newLineup[slotId] = playerId;
          }
          
          events[eventIndex] = { ...event, lineup: newLineup };
        }
        return { events };
      })),

      copyPreviousLineup: (eventId) => set(state => mutateCoach(state, data => {
        const currentEvent = data.events.find(e => e.id === eventId);
        if (!currentEvent) return {};

        const previousMatches = data.events.filter(e => 
          e.type === 'Mecz' && 
          new Date(e.date).getTime() < new Date(currentEvent.date).getTime() && 
          e.lineup && 
          Object.keys(e.lineup).length > 0
        );

        previousMatches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (previousMatches.length > 0) {
          const events = [...data.events];
          const eventIndex = events.findIndex(e => e.id === eventId);
          events[eventIndex] = { ...currentEvent, lineup: { ...previousMatches[0].lineup } };
          return { events };
        }
        return {};
      })),

      isPlayerInForm: (playerId: string) => {
        const state = get();
        if (!state.currentCoachId) return false;
        const data = state.coachesData[state.currentCoachId] || INITIAL_COACH_DATA;
        
        const sortedTrainings = [...data.trainings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const last3Trainings = sortedTrainings.slice(0, 3);
        const last3TrainingIds = last3Trainings.map(t => t.id);

        const recentAttendances = data.attendances.filter(a => 
          a.playerId === playerId && last3TrainingIds.includes(a.trainingId)
        );

        const presentCount = recentAttendances.filter(a => a.isPresent).length;
        if (presentCount < 2) return false;

        const presentAttendances = recentAttendances.filter(a => a.isPresent && a.performanceSliders);
        if (presentAttendances.length === 0) return false;

        let totalScore = 0;
        let scoreCount = 0;

        presentAttendances.forEach(a => {
          if (a.performanceSliders) {
            totalScore += a.performanceSliders.engagement + a.performanceSliders.tactics + a.performanceSliders.technique;
            scoreCount += 3;
          }
        });

        const average = totalScore / scoreCount;
        return average > 7.0;
      }
    }),
    {
      name: 'coachpro-storage-v2',
    }
  )
);

export const useCoachData = () => {
  const currentCoachId = useAppStore(state => state.currentCoachId);
  const coachesData = useAppStore(state => state.coachesData);
  return currentCoachId && coachesData[currentCoachId] ? coachesData[currentCoachId] : INITIAL_COACH_DATA;
};
