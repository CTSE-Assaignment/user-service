const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

describe('User Routes', () => {
  let user;
  let token;
  let user2;

  beforeAll(async () => {
    await User.deleteMany();
    user2 = await User.create({
      name: 'Dave Joe',
      email: 'dave@example.com',
      phoneNumber: '332222243434',
      nic: 'ABC1223336',
      password: 'passsdsws33ord123',
    });

    token = jwt.sign({ id: user2._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

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


  describe('POST /login', () => {

    beforeEach(async () => {
      await User.deleteMany();
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
