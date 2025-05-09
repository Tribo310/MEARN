const express = require("express");
const connectDB = require("./db");
const userModel = require("./models/user");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const placeModel = require("./models/place");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users); // зөв JSON буцаана
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/register", async (req, res) => {
  const { username, password, userImgUrl } = req.body;

  const newUser = new userModel({
    name: username,
    password, // ⛔️ Шифрлэхгүй хадгалж байна
    imgUrl: userImgUrl,
    userId: uuidv4(),
  });

  try {
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/api/login", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res
      .status(400)
      .json({ error: "Нэвтрэх нэр болон нууц үгийг бөглөнө үү" });
  }

  try {
    const user = await userModel.findOne({ name: name, password: password });

    if (!user) {
      return res
        .status(401)
        .json({ error: "Нэвтрэх нэр эсвэл нууц үг буруу байна" });
    }

    const userInfo = {
      id: user.userId,
      username: user.name,
      userImgUrl: user.imgUrl,
      createdPlaces: user.createdPlaces || [],
    };

    console.log("User found:", userInfo);
    return res.status(200).json({
      message: "Амжилттай нэвтэрлээ",
      user: userInfo,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Серверийн алдаа" });
  }
});

app.get("/api/allUsers", async (req, res) => {
  const { currentUserId } = req.query;

  if (!currentUserId) {
    return res.status(401).json({ error: "Нэвтрээгүй байна" });
  }

  try {
    const users = await userModel.find(); // Бүх хэрэглэгчдийг авна
    const places = await placeModel.find(); // Бүх газруудыг авна

    const currentUser = users.find((u) => u.userId === currentUserId);
    if (!currentUser) {
      return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    }

    const otherUsers = users
      .filter((user) => user.userId !== currentUserId)
      .map((user) => ({
        id: user.userId,
        username: user.name,
        userImgUrl: user.imgUrl,
        createdPlaces: places.filter((p) => p.createdUserID === user.userId),
      }));

    const currentUserPlaces = places.filter(
      (place) => place.createdUserID === currentUserId
    );

    res.status(200).json({
      currentUser: {
        id: currentUser.userId,
        username: currentUser.name,
        userImgUrl: currentUser.imgUrl,
        createdPlaces: currentUserPlaces,
      },
      otherUsers,
    });
  } catch (err) {
    console.error("Error in /api/allUsers:", err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

app.post("/api/placeadd", async (req, res) => {
  const {
    createdUserID,
    placeName,
    placeImgUrl,
    placeDescription,
    placeAddress,
  } = req.body;

  if (!createdUserID || !placeName || !placeDescription || !placeImgUrl) {
    return res
      .status(400)
      .json({ error: "Бүх нэмэх газрын талбарыг бөглөнө үү" });
  }

  try {
    // 1. Хэрэглэгчийг шалгах
    const user = await userModel.findOne({ userId: createdUserID });
    if (!user) {
      return res.status(403).json({ error: "Хэрэглэгч олдсонгүй" });
    }

    // 2. Газар үүсгэх
    const newPlace = new placeModel({
      createdUserID,
      placeName,
      placeImgUrl,
      placeDescription,
      placeAddress,
    });

    await newPlace.save();

    // 3. Хариу буцаах
    const userInfo = {
      id: user.userId,
      username: user.name,
      userImgUrl: user.imgUrl,
      createdPlaces: await placeModel.find({ createdUserID }),
    };

    res.status(201).json({
      message: "Амжилттай бүртгэгдлээ",
      place: newPlace,
      user: userInfo,
    });
  } catch (err) {
    console.error("Error adding place:", err);
    res.status(500).json({ error: "Газар нэмэхэд серверийн алдаа гарлаа" });
  }
});

app.get("/api/allUsers", async (req, res) => {
  try {
    // 1. Нэвтэрсэн хэрэглэгчийг тодорхойлох (жишээ нь session эсвэл token ашиглаж болно)
    const currentUserID = req.session?.userId || req.headers["x-user-id"];
    if (!currentUserID) {
      return res.status(401).json({ error: "Нэвтрээгүй байна" });
    }

    // 2. Нэвтэрсэн хэрэглэгчийн мэдээллийг авах
    const currentUser = await userModel.findOne({ userId: currentUserID });
    if (!currentUser) {
      return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    }

    // 3. Нэвтэрсэн хэрэглэгчийн газрын жагсаалт
    const currentUserPlaces = await placeModel.find({
      createdUserID: currentUserID,
    });

    // 4. Бусад хэрэглэгчдийг авах
    const otherUsers = await userModel.find({
      userId: { $ne: currentUserID },
    });

    // 5. JSON хариу буцаах
    res.status(200).json({
      currentUser: {
        id: currentUser.userId,
        name: currentUser.name,
        imgUrl: currentUser.imgUrl,
        createdPlaces: currentUserPlaces,
      },
      otherUsers: otherUsers.map((user) => ({
        id: user.userId,
        name: user.name,
        imgUrl: user.imgUrl,
      })),
    });
  } catch (err) {
    console.error("Алдаа гарлаа:", err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});
app.get("/api/userPlaces/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userPlaces = await placeModel.find({ createdUserID: userId });
    res.status(200).json(userPlaces);
  } catch (error) {
    console.error("Error fetching user places:", error);
    res.status(500).json({ error: "Газруудыг авах үед алдаа гарлаа" });
  }
});

app.delete("/api/places/:id", async (req, res) => {
  const placeId = req.params.id;
  const currentUserId = req.headers["x-user-id"]; // эсвэл session/token ашиглаж болно

  // 1. Нэвтэрсэн эсэх шалгах
  if (!currentUserId) {
    return res.status(401).json({ error: "Нэвтрээгүй байна" });
  }

  try {
    // 2. Газар байгаа эсэх шалгах
    const place = await placeModel.findById(placeId);
    if (!place) {
      return res.status(404).json({ error: "Газар олдсонгүй" });
    }

    // 3. Зөв хэрэглэгч үү шалгах
    if (place.createdUserID !== currentUserId) {
      return res
        .status(403)
        .json({ error: "Та зөвхөн өөрийн газрыг устгаж болно" });
    }

    // 4. Газар устгах
    await placeModel.findByIdAndDelete(placeId);

    // 5. Хариу өгөх
    res
      .status(200)
      .json({ message: "Газар амжилттай устгагдлаа", deletedPlaceId: placeId });
  } catch (error) {
    console.error("Газрыг устгах үед алдаа гарлаа:", error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

app.put("/api/places/:id", async (req, res) => {
  const placeId = req.params.id;
  const { placeName, placeImgUrl, placeDescription, placeAddress } = req.body;
  const currentUserId = req.headers["x-user-id"]; // эсвэл session/token-оос авсан ID

  // 1. Шалгах: шаардлагатай талбарууд байна уу?
  if (!placeName || !placeImgUrl || !placeDescription) {
    return res
      .status(400)
      .json({ error: "Бүх заавал бөглөх талбарыг бөглөнө үү" });
  }

  if (!currentUserId) {
    return res.status(401).json({ error: "Нэвтрээгүй байна" });
  }

  try {
    // 2. Газар олдох эсэх
    const existingPlace = await placeModel.findById(placeId);
    if (!existingPlace) {
      return res.status(404).json({ error: "Газрын мэдээлэл олдсонгүй" });
    }

    // 3. Энэ хэрэглэгч өөрийн газар эсэхийг шалгах
    if (existingPlace.createdUserID !== currentUserId) {
      return res
        .status(403)
        .json({ error: "Та энэ газрыг өөрчлөх эрхгүй байна" });
    }

    // 4. Шинэчлэл хийх
    existingPlace.placeName = placeName;
    existingPlace.placeImgUrl = placeImgUrl;
    existingPlace.placeDescription = placeDescription;
    if (placeAddress) existingPlace.placeAddress = placeAddress;

    // 5. Хадгалах
    await existingPlace.save();

    res.status(200).json({
      message: "Газрын мэдээлэл амжилттай шинэчлэгдлээ",
      place: existingPlace,
    });
  } catch (error) {
    console.error("Газрын мэдээлэл шинэчлэхэд алдаа гарлаа:", error);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

connectDB();
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
