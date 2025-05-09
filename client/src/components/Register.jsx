// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function Register() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//     confirmPassword: "",
//     userImgUrl: "",
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.username.trim())
//       newErrors.username = "Нэвтрэх нэр оруулна уу";
//     if (!formData.password.trim()) newErrors.password = "Нууц үг оруулна уу";
//     else if (formData.password.length < 6)
//       newErrors.password = "Нууц үг 6-12 тэмдэгтээс бүрдэнэ";
//     if (formData.password !== formData.confirmPassword)
//       newErrors.confirmPassword = "Нууц үг ижил байх ёстой";
//     if (!formData.userImgUrl.trim()) newErrors.userImgUrl = "Зураг оруулна уу";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setIsSubmitting(true);

//     try {
//       const response = await fetch("http://localhost:3000/api/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           password: formData.password,
//           userImgUrl: formData.userImgUrl,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         if (data.error.includes("username")) {
//           throw new Error("Хэрэглэгчийн нэр бүртгэлтэй байна");
//         }
//         throw new Error(data.error || "Бүртгэл амжилтгүй");
//       }

//       alert("Амжилттай бүртгэгдлээ!");
//       navigate("/signin");
//     } catch (error) {
//       setErrors({
//         form: error.message || "Алдаа гарлаа. Дахин оролдоно уу",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
//       <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
//         Бүртгүүлэх
//       </h2>

//       {errors.form && (
//         <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
//           {errors.form}
//         </div>
//       )}

//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label
//             htmlFor="username"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Нэвтрэх нэр
//           </label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={formData.username}
//             onChange={handleChange}
//             className={`w-full px-3 py-2 border rounded-md ${
//               errors.username ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.username && (
//             <p className="mt-1 text-sm text-red-500">{errors.username}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="password"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Нууц үг
//           </label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             className={`w-full px-3 py-2 border rounded-md ${
//               errors.password ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.password && (
//             <p className="mt-1 text-sm text-red-500">{errors.password}</p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="confirmPassword"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Нууц үг давтах
//           </label>
//           <input
//             type="password"
//             id="confirmPassword"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             className={`w-full px-3 py-2 border rounded-md ${
//               errors.confirmPassword ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors.confirmPassword && (
//             <p className="mt-1 text-sm text-red-500">
//               {errors.confirmPassword}
//             </p>
//           )}
//         </div>

//         <div className="mb-4">
//           <label
//             htmlFor="userImgUrl"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Профайл зурагны URL
//           </label>
//           <input
//             type="text"
//             id="userImgUrl"
//             name="userImgUrl"
//             value={formData.userImgUrl}
//             onChange={handleChange}
//             className={`w-full px-3 py-2 border rounded-md ${
//               errors.userImgUrl ? "border-red-500" : "border-gray-300"
//             }`}
//             placeholder="https://example.com/image.jpg"
//           />
//           {errors.userImgUrl && (
//             <p className="mt-1 text-sm text-red-500">{errors.userImgUrl}</p>
//           )}
//         </div>

//         <div className="mb-4 flex justify-center">
//           <button
//             type="submit"
//             className={`w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 ${
//               isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//             disabled={isSubmitting}
//           >
//             {isSubmitting ? "Бүртгэлж байна..." : "Бүртгүүлэх"}
//           </button>
//         </div>

//         <div className="text-center text-sm text-gray-600">
//           Бүртгэлтэй юу?{" "}
//           <Link to="/signin" className="text-blue-500">
//             Нэвтрэх
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Register;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    userImgUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "Нэвтрэх нэр оруулна уу";
    if (!formData.password.trim()) newErrors.password = "Нууц үг оруулна уу";
    else if (formData.password.length < 6)
      newErrors.password = "Нууц үг 6-12 тэмдэгтээс бүрдэнэ";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Нууц үг ижил байх ёстой";
    if (!formData.userImgUrl.trim()) newErrors.userImgUrl = "Зураг оруулна уу";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          userImgUrl: formData.userImgUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error.includes("username")) {
          throw new Error("Хэрэглэгчийн нэр бүртгэлтэй байна");
        }
        throw new Error(data.error || "Бүртгэл амжилтгүй");
      }

      alert("Амжилттай бүртгэгдлээ!");
      navigate("/signin");
    } catch (error) {
      setErrors({
        form: error.message || "Алдаа гарлаа. Дахин оролдоно уу",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
        Бүртгүүлэх
      </h2>

      {errors.form && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
          {errors.form}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Нэвтрэх нэр
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.username ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Нууц үг
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Нууц үг давтах
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="userImgUrl"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Профайл зурагны URL
          </label>
          <input
            type="text"
            id="userImgUrl"
            name="userImgUrl"
            value={formData.userImgUrl}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.userImgUrl ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.userImgUrl && (
            <p className="mt-1 text-sm text-red-500">{errors.userImgUrl}</p>
          )}
        </div>

        <div className="mb-4 flex justify-center">
          <button
            type="submit"
            className={`w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Бүртгэлж байна..." : "Бүртгүүлэх"}
          </button>
        </div>

        <div className="text-center text-sm text-gray-600">
          Бүртгэлтэй юу?{" "}
          <Link to="/signin" className="text-blue-500">
            Нэвтрэх
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
