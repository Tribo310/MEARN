import { useLocation, useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";
import { useEffect, useState } from "react";
import axios from "axios";

function CurrentPlace() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [places, setPlaces] = useState([]);
  const [editingPlace, setEditingPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!storedUser) {
          throw new Error("Нэвтрээгүй байна");
        }

        setCurrentUser(storedUser);
        console.log("Current userID:", storedUser.id);

        const placesResponse = await fetch(
          `http://localhost:3000/api/userPlaces/${storedUser.id}`
        );

        if (!placesResponse.ok) {
          throw new Error("Газрын мэдээлэл авахад алдаа гарлаа");
        }

        const placesData = await placesResponse.json();
        setPlaces(placesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleDelete = async (placeId) => {
    try {
      await fetch(`http://localhost:3000/api/places/${placeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser.id,
        },
      });
      setPlaces((prev) => prev.filter((place) => place._id !== placeId));
    } catch (error) {
      console.error("Error deleting place:", error);
      alert("Газар устгах явцад алдаа гарлаа");
    }
  };

  const handleEdit = (place) => {
    setEditingPlace({ ...place });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/places/${editingPlace._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": currentUser.id,
          },
          body: JSON.stringify({
            placeName: editingPlace.placeName,
            placeImgUrl:
              editingPlace.placeImgUrl || "https://via.placeholder.com/500x300",
            placeDescription: editingPlace.placeDescription,
            placeAddress: editingPlace.placeAddress,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Газрын мэдээлэл шинэчлэхэд алдаа гарлаа");
      }

      const updated = await response.json();

      setPlaces((prev) =>
        prev.map((place) =>
          place._id === editingPlace._id ? updated.place : place
        )
      );

      setEditingPlace(null);
    } catch (error) {
      console.error("Error updating place:", error);
      alert("Газар засах явцад алдаа гарлаа");
    }
  };

  const handleCancelEdit = () => {
    setEditingPlace(null);
  };

  const handleAddPlace = () => {
    navigate("/placeadd", { state: { currentUser } });
  };

  const handleEditFieldChange = (field, value) => {
    setEditingPlace((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return <div className="p-6">Уншиж байна...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="bg-white shadow-sm rounded-lg p-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Таны газрууд</h1>
        {currentUser && (
          <div className="flex items-center space-x-3">
            <span className="text-gray-600 hidden md:inline">
              {currentUser.username}
            </span>
            <img
              src={currentUser.userImgUrl || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
            />
          </div>
        )}
      </header>

      {places.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <div
              key={place._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={
                    place.placeImgUrl || "https://via.placeholder.com/500x300"
                  }
                  alt={place.placeName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                {editingPlace?._id === place._id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingPlace.placeName}
                      onChange={(e) =>
                        handleEditFieldChange("placeName", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                    <textarea
                      value={editingPlace.placeDescription}
                      onChange={(e) =>
                        handleEditFieldChange(
                          "placeDescription",
                          e.target.value
                        )
                      }
                      className="w-full p-2 border rounded"
                      rows="3"
                    />
                    <input
                      type="text"
                      value={editingPlace.placeAddress}
                      onChange={(e) =>
                        handleEditFieldChange("placeAddress", e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                    <div className="flex justify-end space-x-2 pt-2">
                      <button
                        onClick={handleSaveEdit}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                      >
                        Хадгалах
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                      >
                        Цуцлах
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {place.placeName}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {place.placeDescription}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {place.placeAddress}
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(place)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Засах
                      </button>
                      <button
                        onClick={() => handleDelete(place._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Устгах
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Одоогоор нэмсэн газар байхгүй байна</p>
        </div>
      )}

      <div className="fixed bottom-8 right-8">
        <button
          onClick={handleAddPlace}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <CiCirclePlus className="w-8 h-8" />
        </button>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Буцах
      </button>
    </div>
  );
}

export default CurrentPlace;
