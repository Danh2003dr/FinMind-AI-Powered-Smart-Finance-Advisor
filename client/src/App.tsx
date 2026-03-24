import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { AIAdvisorPage } from './features/ai-advisor/AIAdvisorPage';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { ForecastingPage } from './features/analytics/ForecastingPage';
import { LandingPage } from './features/marketing/LandingPage';
import { SetupWizardPage } from './features/onboarding/SetupWizardPage';
import { ReceiptScannerPage } from './features/transactions/ReceiptScannerPage';
import { TransactionsPage } from './features/transactions/TransactionsPage';
import { BudgetsPage } from './features/budgets/BudgetsPage';
import { SavingGoalsPage } from './features/saving-goals/SavingGoalsPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { NotificationsPage } from './features/notifications/NotificationsPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setup" element={<SetupWizardPage />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/saving-goals" element={<SavingGoalsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/scan" element={<ReceiptScannerPage />} />
          <Route path="/analytics" element={<ForecastingPage />} />
          <Route path="/ai-advisor" element={<AIAdvisorPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
