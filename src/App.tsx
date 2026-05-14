import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AnimationObserver } from './components/AnimationObserver'
import { AuthGuard } from './components/AuthGuard'
import { ScrollToTop } from './components/ScrollToTop'
import { ADMIN_ROLES, CMS_ROLES } from './constants/roles'
import { AdminLayout } from './components/layout/AdminLayout'
import { CmsLayout } from './components/layout/CmsLayout'
import { PublicLayout } from './components/layout/PublicLayout'
import { ToastProvider } from './components/ui/Toast'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminReviewPage } from './pages/admin/AdminReviewPage'
import { BukuTamuPage } from './pages/cms/BukuTamuPage'
import { DashboardPage } from './pages/cms/DashboardPage'
import { KontenPage } from './pages/cms/KontenPage'
import { PreviewPage as CmsPreviewPage } from './pages/cms/PreviewPage'
import { SettingsPage } from './pages/cms/SettingsPage'
import { LandingPage } from './pages/public/LandingPage'
import { LoginPage } from './pages/public/LoginPage'
import { RegisterPage } from './pages/public/RegisterPage'
import { TemplateDetailPage } from './pages/public/TemplateDetailPage'
import { TemplatesPage } from './pages/public/TemplatesPage'
import { DaftarTamuPage } from './pages/DaftarTamu'
import { PreviewPage as TemplatePreviewPage } from './pages/Preview'
import { UndanganPage } from './pages/Undangan'
import { WeddingBySlugPage } from './pages/WeddingBySlug'

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AnimationObserver />
        <ScrollToTop />
        <Routes>
          {/* Template renderer (no layout, full-bleed undangan). Wedding aesthetic */}
          <Route path="/demo" element={<UndanganPage />} />
          <Route path="/legacy/daftar-tamu" element={<DaftarTamuPage />} />
          <Route path="/preview/:templateSlug" element={<TemplatePreviewPage />} />

          {/* Discovery + auth + landing (neobrutalism) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/templates/:slug" element={<TemplateDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* CMS (auth required, role couple) */}
          <Route
            element={
              <AuthGuard allowedRoles={CMS_ROLES}>
                <CmsLayout />
              </AuthGuard>
            }
          >
            <Route path="/cms" element={<Navigate to="/cms/dashboard" replace />} />
            <Route path="/cms/dashboard" element={<DashboardPage />} />
            <Route path="/cms/konten" element={<KontenPage />} />
            <Route path="/cms/buku-tamu" element={<BukuTamuPage />} />
            <Route path="/cms/preview" element={<CmsPreviewPage />} />
            <Route path="/cms/settings" element={<SettingsPage />} />
          </Route>

          {/* Admin (auth required, role admin) */}
          <Route
            element={
              <AuthGuard allowedRoles={ADMIN_ROLES}>
                <AdminLayout />
              </AuthGuard>
            }
          >
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/couple/:id" element={<AdminReviewPage />} />
          </Route>

          {/* Public real wedding renderer (paling akhir karena catch-all slug) */}
          <Route path="/:slug" element={<WeddingBySlugPage />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}
