import { generateRandomPassword } from "@/lib/utils"
import prisma from "@/lib/db"
import bcrypt from "bcrypt"

export async function POST(req) {
  // Parse les données reçues sous forme de form-data
  const formData = await req.formData() // Utilise formData() au lieu de req.json()

  // Récupération des champs du form-data
  const importType = formData.get("importType") // Récupère la valeur du champ "importType"
  const file = formData.get("file") // Récupère le fichier

  console.log("importType:", importType)
  console.log("file:", file)

  // Vérification du fichier
  if (
    !file ||
    (file.type !== "application/vnd.ms-excel" &&
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      file.type !== "text/csv" &&
      !file.name.endsWith(".csv"))
  ) {
    return new Response(JSON.stringify({ error: "Fichier invalide" }), {
      status: 400,
    })
  }

  // Vérification du type d'importation
  if (!["students_teachers", "students", "teachers"].includes(importType)) {
    return new Response(JSON.stringify({ error: "Type d'import invalide" }), {
      status: 400,
    })
  }

  // Lire le contenu du fichier
  const data = await file.text()
  const lines = data.split("\n").filter((line) => line.trim() !== "")

  let createdProfessors = []

  if (importType === "teachers" || importType === "students_teachers") {
    const teachers = [
      ...new Set(
        lines.slice(1).map((line) => {
          const teacherFullName = line.split(",")[4]
          return teacherFullName ? teacherFullName.trim() : null
        })
      ),
    ].filter(Boolean)

    console.log("Professeurs à importer:", teachers)

    for (const teacherFullName of teachers) {
      const [teacherLastName, teacherFirstName] = teacherFullName.split(" ")

      console.log("Prénom:", teacherFirstName)
      console.log("Nom:", teacherLastName)
      if (!teacherFirstName || !teacherLastName) continue

      const existingProfessor = await prisma.Professor.findFirst({
        where: {
          firstName: teacherFirstName,
          lastName: teacherLastName,
        },
      })
      console.log("existingProfessor", existingProfessor)

      if (existingProfessor) {
        console.log(
          `Professeur ${teacherFirstName} ${teacherLastName} existe déjà.`
        )
        continue
      }

      const username = `edu_${teacherFirstName
        .slice(0, 2)
        .toLowerCase()}${teacherLastName.toLowerCase()}`

      const plainPassword = generateRandomPassword()
      const hashedPassword = await bcrypt.hash(plainPassword, 10)

      console.log(username, plainPassword)
      console.log(hashedPassword)
      const newUser = await prisma.user.create({
        data: {
          name: `${teacherFirstName} ${teacherLastName}`,
          username: username,
          hashPassword: hashedPassword,
          roles: ["PROFESSOR"],
        },
      })

      console.log("Nouvel utilisateur créé:", newUser)

      const newProfessor = await prisma.professor.create({
        data: {
          firstName: teacherFirstName,
          lastName: teacherLastName,
        },
      })

      createdProfessors.push({
        username,
        firstName: teacherFirstName,
        lastName: teacherLastName,
        plainPassword,
      })
    }
  }

  return new Response(
    JSON.stringify({
      message: "Importation terminée avec succès.",
      createdProfessors,
    }),
    {
      status: 200,
    }
  )
}
