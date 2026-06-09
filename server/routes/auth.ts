import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const usersFile = path.join(__dirname, "../data/users.json");

export const register: RequestHandler = (req, res) => {
  const { name, username, email, password } = req.body;

  const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));

  const existingUser = users.find(
    (user: any) =>
      user.username === username || user.email === email
  );

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  const newUser = {
    id: `USR-${Date.now()}`,
    username,
    email,
    password,
    fullName: name,
  };

  users.push(newUser);

  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  res.json({
    success: true,
    message: "Registration successful",
    user: newUser,
  });
};

export const login: RequestHandler = (req, res) => {
  const { email, password } = req.body;

  const users = JSON.parse(fs.readFileSync(usersFile, "utf8"));

  const user = users.find(
    (u: any) =>
      (u.username === email || u.email === email) &&
      u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  res.json({
    success: true,
    message: "Login successful",
    user,
  });
};