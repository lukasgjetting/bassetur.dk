import { z } from "zod";
import { procedure, router } from "../trpc";
import { beverageRouter } from "./beverageRouter";
import { prisma } from "../prisma";

export const appRouter = router({
  beverage: beverageRouter,
  getUsers: procedure.query(async () => {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        securityQuestion: true,
        securityQuestionAnswerOptions: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return users.map((u) => ({
      ...u,
      securityQuestionAnswerOptions: u.securityQuestionAnswerOptions.split(";"),
    }));
  }),
  submitUserSecurityQuestion: procedure
    .input(
      z.object({
        userName: z.string(),
        securityQuestionAnswer: z.string(),
      }),
    )
    .mutation(async (req) => {
      const user = await prisma.user.findFirstOrThrow({
        where: {
          name: req.input.userName,
        },
      });

      return user.securityQuestionAnswer === req.input.securityQuestionAnswer;
    }),
});

export type AppRouter = typeof appRouter;
