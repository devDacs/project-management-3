import { prisma } from "../src/lib/prisma";
import path from "path";
import fs from "fs";

const orderedFileNames = [
  "team.json",
  "project.json",
  "user.json",
  "projectTeam.json",
  "task.json",
  "attachment.json",
  "comment.json",
  "taskAssignment.json",
];

async function main() {
  const dataDirectory = path.join(process.cwd(), "prisma", "seedData");

  await deleteAllData();

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const modelName = path.basename(fileName, path.extname(fileName));
    const model = prisma[modelName as keyof typeof prisma] as any;

    if (modelName === "team") {
      for (const data of jsonData) {
        const { productOwnerUserId, projectManagerUserId, ...teamData } = data;

        await model.create({
          data: teamData,
        });
      }

      console.log(`Seeded ${modelName} without user assignments`);
      continue;
    }

    for (const data of jsonData) {
      await model.create({ data });
    }

    console.log(`Seeded ${modelName} with data from ${fileName}`);
  }

  // Phase 3: Assign Product Owners and Project Managers
  const teamData = JSON.parse(
    fs.readFileSync(path.join(dataDirectory, "team.json"), "utf-8"),
  );

  for (const team of teamData) {
    const createdTeam = await prisma.team.findFirst({
      where: { teamName: team.teamName },
    });

    if (!createdTeam) {
      throw new Error(`Team not found: ${team.teamName}`);
    }

    await prisma.team.update({
      where: { id: createdTeam.id },
      data: {
        productOwnerUserId: team.productOwnerUserId,
        projectManagerUserId: team.projectManagerUserId,
      },
    });
  }

  console.log("Updated Team role assignments");
}

async function deleteAllData() {
  // Your deletion logic goes here
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
