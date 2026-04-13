/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Layout, TabType } from './components/Layout';
import { DashboardView } from './components/DashboardView';
import { ScheduleView } from './components/ScheduleView';
import { PlayersView } from './components/PlayersView';
import { TrainingView } from './components/TrainingView';
import { LineupBuilderView } from './components/LineupBuilderView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReportsView } from './components/ReportsView';
import { MessagesView } from './components/MessagesView';
import { AuthView } from './components/AuthView';
import { ParentView } from './components/ParentView';
import { useAuthStore } from './authStore';
import { useAppStore } from './store';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { currentUser, parentAccessCode } = useAuthStore();
  const { setCoachId } = useAppStore();

  useEffect(() => {
    if (currentUser) {
      setCoachId(currentUser.id);
    } else {
      setCoachId(null);
    }
  }, [currentUser, setCoachId]);

  if (parentAccessCode) {
    return <ParentView />;
  }

  if (!currentUser) {
    return <AuthView />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
      {activeTab === 'schedule' && <ScheduleView />}
      {activeTab === 'players' && <PlayersView />}
      {activeTab === 'training' && <TrainingView />}
      {activeTab === 'reports' && <ReportsView />}
      {activeTab === 'lineup' && <LineupBuilderView />}
      {activeTab === 'analytics' && <AnalyticsView />}
      {activeTab === 'messages' && <MessagesView />}
    </Layout>
  );
}



