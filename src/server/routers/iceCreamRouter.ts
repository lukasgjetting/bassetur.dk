import { z } from "zod";
import { procedure, router } from "../trpc";
import { prisma } from "../prisma";
import { TRPCError } from "@trpc/server";
import iceCreamOptions from "@/utils/iceCreamOptions";

export const iceCreamRouter = router({
  getSelection: procedure
    .input(z.object({ userName: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findFirstOrThrow({
        where: {
          name: input.userName,
        },
      });

      return user.iceCreamSelection.split(";");
    }),
  setSelection: procedure
    .input(
      z.object({
        userName: z.string(),
        iceCreamSelection: z.array(z.string()),
      }),
    )
    .mutation(async ({ input }) => {
      input.iceCreamSelection.forEach((iceCream) => {
        if (!iceCreamOptions.includes(iceCream)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Ugyldig variant: ${iceCream}. Mystisk! 🤔`,
          });
        }
      });

      input.iceCreamSelection.forEach((iceCream) => {
        if (iceCream === "Overrask mig") {
          return;
        }

        if (input.iceCreamSelection.filter((i) => i === iceCream).length > 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              'Man må ikke vælge den samme is flere gange (udover "Overrask mig")',
          });
        }
      });

      await prisma.user.update({
        data: {
          iceCreamSelection: input.iceCreamSelection.join(";"),
        },
        where: {
          name: input.userName,
        },
      });
    }),
  getAllSelections: procedure.query(async () => {
    const users = await prisma.user.findMany({
      select: {
        name: true,
        iceCreamSelection: true,
        tableNumber: true,
      },
    });

    return users.map((user) => ({
      name: user.name,
      iceCreamSelection: user.iceCreamSelection.split(";"),
      tableNumber: user.tableNumber,
    }));
  }),
});
