import { Router } from "express";
import { createUser, getAllUsers, getUsersCount } from "../../db/user";
import { QueryParamsSchema } from "../../models/queryParams";
import { NewUserSchema } from "../../models/user";
import { hashPassword } from "../../utils/password";

export const adminUsersRouter = Router();

adminUsersRouter.post("/createUser", async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    const parsedCredentials = await NewUserSchema.safeParseAsync({
      email,
      password,
      role,
      name,
    });
    if (!parsedCredentials.success) {
      return res.status(400).json({
        message: "Credenciales no validas para crear el usuario",
      });
    }
    const hashedPassword = await hashPassword({ password });
    const user = createUser({
      email,
      passwordHash: hashedPassword,
      role,
      name,
    });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

adminUsersRouter.get("/", async (req, res) => {
  const { page, limit, query, orderBy } = req.query;
  try {
    const parsedQuery = await QueryParamsSchema.safeParseAsync({
      page: Number(page),
      limit: Number(limit),
      query,
      orderBy,
    });
    if (!parsedQuery.success) {
      return res.status(400).json({ message: "Query params are not valid" });
    }

    const {
      page: parsedPage,
      limit: parsedLimit,
      orderBy: parsedOrderBy,
      query: parsedQueryString,
    } = parsedQuery.data;
    const users = await getAllUsers({
      limit: parsedLimit,
      page: parsedPage,
      query: parsedQueryString,
      orderBy: parsedOrderBy,
    });
    const count = await getUsersCount();
    const nextPage = count > parsedPage * parsedLimit + users.length;
    const prevPage = parsedPage > 0;
    return res.json({ data: users, nextPage, prevPage, count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});
