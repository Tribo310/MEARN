import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Places() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [curPlaces, setCurPlaces] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!storedUser) {
          throw new Error("Нэвтрээгүй байна");
        }

        const response = await fetch(
          `http://localhost:3000/api/allUsers?currentUserId=${storedUser.id}`
        );

        if (!response.ok) {
          throw new Error("Хэрэглэгчийн мэдээллийг татаж чадсангүй");
        }

        const data = await response.json();
        setCurrentUser(data.currentUser);
        setUsers(data.otherUsers);
        setCurPlaces(data.currentUser.createdPlaces || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("Current user:", currentUser);
    console.log("Current user places:", curPlaces);
    console.log("Other users:", users.length);
  }, [currentUser, users, curPlaces]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto mt-8">
        <strong className="font-bold">Алдаа: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Хэрэглэгчид</h1>

        {currentUser && (
          <div className="flex items-center space-x-3">
            <span className="text-gray-600 hidden md:inline">
              {currentUser.username}
            </span>
            <div className="relative">
              <button>
                <img
                  src={
                    currentUser.userImgUrl || "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
                  onClick={() => navigate("/me", { state: { currentUser } })}
                />
              </button>
            </div>
          </div>
        )}
      </header>

      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4">
                <div className="flex items-center space-x-4 mb-3">
                  <img
                    src={user.userImgUrl || "https://via.placeholder.com/150"}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {user.username}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {user.createdPlaces?.length || 0} газрууд
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    Дэлгэрэнгүй
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-600 mt-8">
          Хэрэглэгч байхгүй байна!
        </div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Буцах
      </button>
    </div>
  );
}

export default Places;
