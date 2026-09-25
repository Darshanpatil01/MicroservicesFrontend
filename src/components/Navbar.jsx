import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark shadow-sm">
      <div className="container">
        <NavLink
          className="navbar-brand fw-bold"
          to="/departments"
        >
          Microservices Admin
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >
          <div className="navbar-nav ms-auto">
            <NavLink
              to="/departments"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-building me-1"></i>
              Departments
            </NavLink>

            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-people me-1"></i>
              Employees
            </NavLink>

            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <i className="bi bi-kanban me-1"></i>
              Projects
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;