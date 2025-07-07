import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  // Fetch all users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get("http://localhost:5001/api/auth/");
        const usersData = response.data.users || [];
        setUsers(usersData);
        setFilteredUsers(usersData); // Initialize with all users
      } catch (error) {
        setError("Error fetching users");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchUsers();
  }, []);

  // Handle role change
  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    setSelectedRole(selectedRole);
    if (selectedRole === "user") {
      setFilteredUsers(users); // Show all users if no role is selected
    } else {
      setFilteredUsers(users.filter((user) => user.role === selectedRole));
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5001/api/auth/${userId}`);
        setUsers(users.filter((user) => user.id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
      } catch (error) {
        setError("Error deleting user");
        console.error("Error deleting user:", error);
      }
    }
  };

  // Edit user
  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    setEditUser(userToEdit); // Set user for editing
  };

  const updateUser = async (userId, updatedData) => {
    try {
      // Set loading state to true while updating
      setLoading(true);

      const response = await axios.put(
        `http://localhost:5001/api/auth/${userId}`,
        updatedData
      );

      // Update the users list and filtered users
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? response.data.user : user
        )
      );
      setFilteredUsers((prevFilteredUsers) =>
        prevFilteredUsers.map((user) =>
          user.id === userId ? response.data.user : user
        )
      );

      // Reset edit form by setting editUser to null
      setEditUser(null);
    } catch (error) {
      setError("Error updating user");
      console.error("Error updating user:", error);
    } finally {
      // Set loading state to false after the update is done
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">All Users</h3>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {/* Role Filter Dropdown */}
            <div className="mb-4">
              <label
                htmlFor="role-filter"
                className="block text-gray-700 font-medium mb-2"
              >
                Filter by Role:
              </label>
              <select
                id="role-filter"
                value={selectedRole}
                onChange={handleRoleChange}
                className="p-2 border border-gray-300 rounded-lg w-full"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="barber">Barber</option>
                <option value="user">User</option>
              </select>
            </div>

            {/* User List */}
            {!editUser && (
              <ul className="space-y-4">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(
                    (user, index) =>
                      user ? ( // Check if the user is defined
                        <li
                          key={user.id || index}
                          className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-gray-800 font-medium">
                              ID: {user.id} - {user.username}
                            </span>
                            <span className="text-gray-600 text-sm">
                              {user.email}
                            </span>
                            <span className="text-gray-600 text-sm">
                              Role: {user.role}
                            </span>
                          </div>
                          <div className="space-x-4">
                            <button
                              onClick={() => handleEditUser(user.id)}
                              className="px-4 py-2 text-sm font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </li>
                      ) : null // Don't render undefined users
                  )
                ) : (
                  <p>No users found</p>
                )}
              </ul>
            )}
          </>
        )}

        {/* Edit Form */}
        {editUser && (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Edit User
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedData = {
                  username: e.target.username.value,
                  email: e.target.email.value,
                  role: e.target.role.value,
                  password: e.target.password.value || undefined, // Include password if provided
                };
                updateUser(editUser.id, updatedData);
              }}
            >
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  defaultValue={editUser.username}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  defaultValue={editUser.email}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  defaultValue={editUser.role}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="admin">Admin</option>
                  <option value="barber">Barber</option>
                  <option value="user">User</option>
                </select>
              </div>

              {/* Password Change */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  New Password (Leave blank if no change)
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
