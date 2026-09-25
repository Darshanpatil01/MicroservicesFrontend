import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../services/projectService";

import { getAllEmployees } from "../../services/employeeService";

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    name: "",
    description: "",
    employeeId: "",
    startDate: "",
    endDate: "",
    status: "PLANNED",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [projectResponse, employeeResponse] =
        await Promise.all([
          getAllProjects(),
          getAllEmployees(),
        ]);

      setProjects(projectResponse.data);
      setEmployees(employeeResponse.data);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load project data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await getAllProjects();
      setProjects(response.data);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load projects.",
      });
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingId(project.id);

    setFormData({
      name: project.name || "",
      description: project.description || "",
      employeeId:
        project.employeeId ??
        project.employee?.id ??
        "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      status: project.status || "PLANNED",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      formData.employeeId === "" ||
      !formData.startDate ||
      !formData.status
    ) {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Please fill all required fields.",
      });

      return;
    }

    if (
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Dates",
        text: "End date cannot be before start date.",
      });

      return;
    }

    const projectData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      employeeId: Number(formData.employeeId),
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      status: formData.status,
    };

    try {
      if (editingId !== null) {
        await updateProject(editingId, projectData);

        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Project updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await createProject(projectData);

        Swal.fire({
          icon: "success",
          title: "Added",
          text: "Project added successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      closeModal();
      await loadProjects();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text:
          error.response?.data?.message ||
          "Unable to save project.",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Project?",
      text: "Are you sure you want to delete this project?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteProject(id);

      await loadProjects();

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Project deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error.response?.data?.message ||
          "Unable to delete project.",
      });
    }
  };

  const getEmployeeName = (project) => {
    if (project.employee?.name) {
      return project.employee.name;
    }

    const employee = employees.find(
      (item) =>
        Number(item.id) === Number(project.employeeId)
    );

    return employee?.name || "N/A";
  };

  const getDepartmentName = (project) => {
    if (project.employee?.department?.name) {
      return project.employee.department.name;
    }

    const employee = employees.find(
      (item) =>
        Number(item.id) === Number(project.employeeId)
    );

    return employee?.department?.name || "N/A";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-success";

      case "IN_PROGRESS":
        return "bg-primary";

      case "ON_HOLD":
        return "bg-warning text-dark";

      case "CANCELLED":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Projects</h2>

          <p className="text-muted mb-0">
            Manage all projects
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add Project
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th className="text-end">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-4"
                    >
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></div>

                      Loading projects...
                    </td>
                  </tr>
                ) : projects.length > 0 ? (
                  projects.map((project) => (
                    <tr key={project.id}>
                      <td>{project.id}</td>

                      <td>
                        <div className="fw-semibold">
                          {project.name}
                        </div>

                        {project.description && (
                          <small className="text-muted">
                            {project.description}
                          </small>
                        )}
                      </td>

                      <td>
                        {getEmployeeName(project)}
                      </td>

                      <td>
                        {getDepartmentName(project)}
                      </td>

                      <td>{project.startDate}</td>

                      <td>
                        {project.endDate || "-"}
                      </td>

                      <td>
                        <span
                          className={`badge ${getStatusClass(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() =>
                            openEditModal(project)
                          }
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDelete(project.id)
                          }
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center text-muted py-4"
                    >
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingId !== null
                        ? "Edit Project"
                        : "Add Project"}
                    </h5>

                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeModal}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Project Name
                        </label>

                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter project name"
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Employee
                        </label>

                        <select
                          name="employeeId"
                          className="form-select"
                          value={formData.employeeId}
                          onChange={handleChange}
                        >
                          <option value="">
                            Select Employee
                          </option>

                          {employees.map((employee) => (
                            <option
                              key={employee.id}
                              value={employee.id}
                            >
                              {employee.name}
                              {employee.department?.name
                                ? ` - ${employee.department.name}`
                                : ""}
                            </option>
                          ))}
                        </select>

                        {employees.length === 0 && (
                          <div className="form-text text-danger">
                            No employees available. Add an
                            employee first.
                          </div>
                        )}
                      </div>

                      <div className="col-12 mb-3">
                        <label className="form-label">
                          Description
                        </label>

                        <textarea
                          name="description"
                          className="form-control"
                          rows="3"
                          value={formData.description}
                          onChange={handleChange}
                          placeholder="Enter project description"
                        ></textarea>
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Start Date
                        </label>

                        <input
                          type="date"
                          name="startDate"
                          className="form-control"
                          value={formData.startDate}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          End Date
                        </label>

                        <input
                          type="date"
                          name="endDate"
                          className="form-control"
                          value={formData.endDate}
                          onChange={handleChange}
                          min={formData.startDate}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Status
                        </label>

                        <select
                          name="status"
                          className="form-select"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="PLANNED">
                            Planned
                          </option>

                          <option value="IN_PROGRESS">
                            In Progress
                          </option>

                          <option value="ON_HOLD">
                            On Hold
                          </option>

                          <option value="COMPLETED">
                            Completed
                          </option>

                          <option value="CANCELLED">
                            Cancelled
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={employees.length === 0}
                    >
                      {editingId !== null
                        ? "Update Project"
                        : "Add Project"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
}

export default ProjectList;