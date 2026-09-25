import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/departmentService";

function DepartmentList() {
  const [departments, setDepartments] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const [editingId, setEditingId] = useState(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load departments.",
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

    setFormData({
      name: "",
      location: "",
    });

    setShowModal(true);
  };

  const openEditModal = (department) => {
    setEditingId(department.id);

    setFormData({
      name: department.name || "",
      location: department.location || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);

    setEditingId(null);

    setFormData({
      name: "",
      location: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.location.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Please enter department name and location.",
      });

      return;
    }

    try {
      if (editingId) {
        await updateDepartment(editingId, formData);

        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Department updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await createDepartment(formData);

        Swal.fire({
          icon: "success",
          title: "Added",
          text: "Department added successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      closeModal();
      await loadDepartments();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Unable to save department.",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Department?",
      text: "Are you sure you want to delete this department?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteDepartment(id);

      await loadDepartments();

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Department deleted successfully.",
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
          "Unable to delete department.",
      });
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Departments</h2>

          <p className="text-muted mb-0">
            Manage all departments
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add Department
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Department Name</th>
                  <th>Location</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {departments.length > 0 ? (
                  departments.map((department) => (
                    <tr key={department.id}>
                      <td>{department.id}</td>

                      <td>{department.name}</td>

                      <td>{department.location}</td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() =>
                            openEditModal(department)
                          }
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDelete(department.id)
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center text-muted py-4"
                    >
                      No departments found.
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
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingId
                        ? "Edit Department"
                        : "Add Department"}
                    </h5>

                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeModal}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">
                        Department Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter department name"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Location
                      </label>

                      <input
                        type="text"
                        name="location"
                        className="form-control"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Enter location"
                      />
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
                    >
                      {editingId
                        ? "Update Department"
                        : "Add Department"}
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

export default DepartmentList;