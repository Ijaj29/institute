import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '@/pages/Login';
import AdminLayout from '@/layouts/AdminLayout';
// import AdminOverview from '@/pages/admin/AdminOverview';
import AdminDashboard from '@/pages/admin/AdminDashboard';
// import AdminStudents from '@/pages/admin/AdminStudents';
// import FacultyDashboard from '@/pages/FacultyDashboard';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import FacultyDashboard from '@/pages/faculty/FacultyDashboard';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* every /adminDashboard/* page renders inside AdminLayout's <Outlet /> */}
      <Route
        path="/adminDashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        {/* <Route path="students" element={<AdminStudents />} /> */}
        {/* <Route path="staff" element={<AdminStaff />} /> */}
        {/* <Route path="fees" element={<AdminFees />} /> */}
        {/* <Route path="settings" element={<AdminSettings />} /> */}
      </Route>

      <Route
        path="/facultyDashboard"
        element={
          <ProtectedRoute allowedRoles={['FACULTY']}>
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}