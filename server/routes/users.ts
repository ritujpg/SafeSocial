import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

const usersFile = path.join(
  __dirname,
  "../data/users.json"
);

export const getUsers: RequestHandler = (
  _req,
  res
) => {
  const users = JSON.parse(
    fs.readFileSync(usersFile, "utf8")
  );

  res.json({
    success: true,
    count: users.length,
    users,
  });
};