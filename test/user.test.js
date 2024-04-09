const request = require("supertest");
const app = require("../server"); // Assuming your Express app is exported from server.js
const mongoose = require("mongoose");
const User = require("../models/user.model");

describe("User Routes", () => {
  beforeEach(async () => {
    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /signup", () => {
    test("should create a new user", async () => {
      const newUser = {
        name: "Test User",
        email: "test@example.com",
        phoneNumber: "1234567890",
        nic: "123456789X",
        password: "password",
      };

      const response = await request(app).post("/users/signup").send(newUser);

      expect(response.statusCode).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data.user.email).toBe(newUser.email);

      // Check if user is saved in the database
      const savedUser = await User.findOne({ email: newUser.email });
      expect(savedUser).toBeTruthy();
      expect(savedUser.name).toBe(newUser.name);
    });
  });

  describe("POST /login", () => {
    // Create a user for login tests
    beforeEach(async () => {
      const newUser = {
        name: "Test User",
        email: "test@example.com",
        phoneNumber: "1234567890",
        nic: "123456789X",
        password: "password",
      };
      await User.create(newUser);
    });

    test("should login an existing user", async () => {
      const response = await request(app)
        .post("/users/login")
        .send({ email: "test@example.com", password: "password" });

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.user.email).toBe("test@example.com");
    });
  });
});
