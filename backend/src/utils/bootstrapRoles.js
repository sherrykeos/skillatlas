import prisma from "../lib/prisma.js";

/**
 * Ensures initial roles are synchronized on startup:
 * - @sherry (or shaj7492@gmail.com) is designated as platform ADMIN.
 * - Any user who has authored skills is assigned CREATOR so they keep access.
 */
export async function bootstrapRoles() {
  try {
    // 1. Ensure the designated admin email is platform ADMIN
    const adminEmail = (process.env.ADMIN_EMAIL || "vybe.srd@gmail.com").toLowerCase().trim();
    const adminUser = await prisma.user.findFirst({
      where: { email: adminEmail },
    });

    if (adminUser) {
      if (adminUser.role !== "ADMIN") {
        await prisma.user.update({
          where: { id: adminUser.id },
          data: { role: "ADMIN" },
        });
        console.log(`[Bootstrap] Configured @${adminUser.username} (${adminUser.email}) as platform ADMIN.`);
      }

      // Enforce single superadmin policy: demote any other ADMIN
      const otherAdmins = await prisma.user.findMany({
        where: {
          role: "ADMIN",
          id: { not: adminUser.id },
        },
      });

      for (const other of otherAdmins) {
        await prisma.user.update({
          where: { id: other.id },
          data: { role: "CREATOR" },
        });
        console.log(`[Bootstrap] Demoted @${other.username} (${other.email}) from ADMIN to maintain single superadmin policy.`);
      }
    }

    // 2. Promote any user who has authored skills to CREATOR
    const authors = await prisma.skill.findMany({
      select: { authorId: true },
      distinct: ["authorId"],
    });

    for (const { authorId } of authors) {
      if (authorId && authorId !== adminUser?.id) {
        const author = await prisma.user.findUnique({ where: { id: authorId } });
        if (author && author.role === "USER") {
          await prisma.user.update({
            where: { id: authorId },
            data: { role: "CREATOR" },
          });
          console.log(`[Bootstrap] Promoted existing skill author @${author.username} to CREATOR.`);
        }
      }
    }
  } catch (error) {
    console.error("[Bootstrap] Failed to synchronize roles:", error);
  }
}
