import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const usersFile = path.join(
  process.cwd(),
  "server",
  "data",
  "users.json"
);

const readUsers = () => {
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]");
  }

  return JSON.parse(
    fs.readFileSync(usersFile, "utf8")
  );
};

const saveUsers = (users: any[]) => {
  fs.writeFileSync(
    usersFile,
    JSON.stringify(users, null, 2)
  );
};

export const getUsers: RequestHandler = (
  _req,
  res
) => {
  const users = readUsers();

  res.json({
    success: true,
    count: users.length,
    users,
  });
};

export const createUser: RequestHandler = (
  req,
  res
) => {
  const users = readUsers();

  const newUser = {
    id: `USR${Date.now()}`,
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    accountStatus:
      req.body.accountStatus || "active",
    riskScore: req.body.riskScore || 0,
    alertsCount: req.body.alertsCount || 0,
    activityCount:
      req.body.activityCount || 0,
    lastLogin: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  res.status(201).json({
    success: true,
    user: newUser,
  });
};

export const updateUser: RequestHandler = (
  req,
  res
) => {
  const { id } = req.params;

  const users = readUsers();

  const index = users.findIndex(
    (user: any) => user.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  users[index] = {
    ...users[index],
    ...req.body,
  };

  saveUsers(users);

  res.json({
    success: true,
    user: users[index],
  });
};

export const deleteUser: RequestHandler = (
  req,
  res
) => {
  const { id } = req.params;

  const users = readUsers();

  const filteredUsers = users.filter(
    (user: any) => user.id !== id
  );

  saveUsers(filteredUsers);

  res.json({
    success: true,
    message: "User deleted successfully",
  });
};
