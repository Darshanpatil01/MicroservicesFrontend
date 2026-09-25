import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employeeService";

import { getAllDepartments } from "../../services/departmentService";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    salary: "",
    departmentId: "",
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [employeeResponse, departmentResponse] =
        await Promise.all([
          getAllEmployees(),
          getAllDepartments(),
        ]);

      setEmployees(employeeResponse.data);
      setDepartments(departmentResponse.data);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load employee data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await getAllEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to load employees.",
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
      email: "",
      salary: "",
      departmentId: "",
    });

    setShowModal(true);
  };

  const openEditModal = (employee) => {
    setEditingId(employee.id);

    setFormData({
      name: employee.name || "",
      email: employee.email || "",
      salary: employee.salary ?? "",
      departmentId:
        employee.departmentId ??
        employee.department?.id ??
        "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      salary: "",
      departmentId: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      formData.salary === "" ||
      formData.departmentId === ""
    ) {
      Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Please fill all employee fields.",
      });

      return;
    }

    const employeeData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      salary: Number(formData.salary),
      departmentId: Number(formData.departmentId),
    };

    try {
      if (editingId !== null) {
        await updateEmployee(editingId, employeeData);

        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Employee updated successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await createEmployee(employeeData);

        Swal.fire({
          icon: "success",
          title: "Added",
          text: "Employee added successfully.",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      closeModal();
      await loadEmployees();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text:
          error.response?.data?.message ||
          "Unable to save employee.",
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Employee?",
      text: "Are you sure you want to delete this employee?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteEmployee(id);

      await loadEmployees();

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Employee deleted successfully.",
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
          "Unable to delete employee.",
      });
    }
  };

  const getDepartmentName = (employee) => {
    if (employee.department?.name) {
      return employee.department.name;
    }

    const department = departments.find(
      (item) =>
        Number(item.id) === Number(employee.departmentId)
    );

    return department?.name || "N/A";
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Employees</h2>

          <p className="text-muted mb-0">
            Manage all employees
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openAddModal}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Add Employee
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Salary</th>
                  <th>Department</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-4"
                    >
                      <div
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></div>

                      Loading employees...
                    </td>
                  </tr>
                ) : employees.length > 0 ? (
                  employees.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>

                      <td>{employee.name}</td>

                      <td>{employee.email}</td>

                      <td>
                        ₹{Number(employee.salary).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        {getDepartmentName(employee)}
                      </td>

                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() =>
                            openEditModal(employee)
                          }
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDelete(employee.id)
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
                      colSpan="6"
                      className="text-center text-muted py-4"
                    >
                      No employees found.
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
                      {editingId !== null
                        ? "Edit Employee"
                        : "Add Employee"}
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
                        Employee Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter employee name"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Salary
                      </label>

                      <input
                        type="number"
                        name="salary"
                        className="form-control"
                        value={formData.salary}
                        onChange={handleChange}
                        placeholder="Enter salary"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Department
                      </label>

                      <select
                        name="departmentId"
                        className="form-select"
                        value={formData.departmentId}
                        onChange={handleChange}
                      >
                        <option value="">
                          Select Department
                        </option>

                        {departments.map((department) => (
                          <option
                            key={department.id}
                            value={department.id}
                          >
                            {department.name}
                            {department.location
                              ? ` - ${department.location}`
                              : ""}
                          </option>
                        ))}
                      </select>

                      {departments.length === 0 && (
                        <div className="form-text text-danger">
                          No departments available. Add a
                          department first.
                        </div>
                      )}
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
                      disabled={departments.length === 0}
                    >
                      {editingId !== null
                        ? "Update Employee"
                        : "Add Employee"}
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

export default EmployeeList;