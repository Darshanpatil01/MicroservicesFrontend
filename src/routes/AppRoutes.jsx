import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DepartmentList from "../pages/department/DepartmentList";
import EmployeeList from "../pages/employee/EmployeeList";
import ProjectList from "../pages/project/ProjectList";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/departments"
            replace
          />
        }
      />

      <Route
        path="/departments"
        element={<DepartmentList />}
      />

      <Route
        path="/employees"
        element={<EmployeeList />}
      />

      <Route
        path="/projects"
        element={<ProjectList />}
      />
    </Routes>
  );
}

export default AppRoutes;