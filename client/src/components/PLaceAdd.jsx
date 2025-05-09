import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PlaceAdd() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(location.state?.currentUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state with correct property names
  const [form, setForm] = useState({
    placeName: "",
    placeDescription: "",
    placeImgUrl: "",
    placeAddress: "",
  });

  // If user is not available from location state, fetch from API
  useEffect(() => {
    if (!user) {
      const fetchCurrentUser = async () => {
        try {
          const response = await fetch("http://localhost:3000/api/currentUser");
          const data = await response.json();
          if (data && data.id) {
            setUser(data);
          } else {
            setError("Хэрэглэгчийн мэдээлэл олдсонгүй");
            setTimeout(() => navigate("/signin"), 2000);
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          setError("Хэрэглэгчийн мэдээлэл авахад алдаа гарлаа");
          setTimeout(() => navigate("/signin"), 2000);
        }
      };
      fetchCurrentUser();
    }
  }, [navigate, user]);

  const validate = () => {
    if (!form.placeName.trim()) {
      setError("Газрын нэр оруулна уу");
      return false;
    }
    if (!form.placeDescription.trim()) {
      setError("Газрын тайлбар оруулна уу");
      return false;
    }
    if (!form.placeImgUrl.trim()) {
      setError("Зураг оруулна уу");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!user || !user.id) {
      setError("Хэрэглэгчийн мэдээлэл олдсонгүй");
      return;
    }

    // Prevent double submission
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/placeadd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          createdUserID: user.id,
          placeName: form.placeName,
          placeDescription: form.placeDescription,
          placeImgUrl: form.placeImgUrl,
          placeAddress: form.placeAddress,
        }),
      });

      const data = await response.json(); // энд алдаа гарч байна

      if (!response.ok) {
        throw new Error(data.error || "Алдаа гарлаа");
      }

      alert("Амжилттай нэмэгдлээ!");

      // Navigate after successful addition
      navigate("/me", {
        state: {
          currentUser: data.user,
        },
        replace: true, // Replace the current entry in history to prevent going back to form
      });
    } catch (error) {
      console.error("Error adding place:", error);
      setError(error.message || "Газар нэмэхэд алдаа гарлаа");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h1 className="text-xl font-bold mb-4">Газар нэмэх</h1>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium">
              Газрын нэр:
            </label>
            <input
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              type="text"
              value={form.placeName}
              onChange={(e) => setForm({ ...form, placeName: e.target.value })}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium">
              Газрын тайлбар:
            </label>
            <textarea
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              value={form.placeDescription}
              onChange={(e) =>
                setForm({ ...form, placeDescription: e.target.value })
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium">
              Зургийн холбоос:
            </label>
            <input
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              type="text"
              value={form.placeImgUrl}
              onChange={(e) =>
                setForm({ ...form, placeImgUrl: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 font-medium">
              Хаяг (заавал биш):
            </label>
            <input
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
              type="text"
              value={form.placeAddress}
              onChange={(e) =>
                setForm({ ...form, placeAddress: e.target.value })
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className={`flex-1 px-4 py-2 ${
                isSubmitting ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
              } text-white font-semibold rounded-md`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Нэмж байна..." : "Нэмэх"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Буцах
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlaceAdd;
