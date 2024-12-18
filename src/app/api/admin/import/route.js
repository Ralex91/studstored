import { generateRandomPassword } from "@/features/import/utils/import"
import prisma from "@/lib/db"
import bcrypt from "bcrypt"

export async function POST(req) {
  const formData = await req.formData()

  const importType = formData.get("importType")
  const file = formData.get("file")
  const yearId = formData.get("yearId")

  if (
    !file ||
    (![
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ].includes(file.type) &&
      !file.name.endsWith(".csv"))
  ) {
    return new Response(JSON.stringify({ error: "Fichier invalide" }), {
      status: 400,
    })
  }

  if (!["students_teachers", "students", "teachers"].includes(importType)) {
    return new Response(JSON.stringify({ error: "Type d'import invalide" }), {
      status: 400,
    })
  }

  const data = await file.text()
  const lines = data.split("\n").filter((line) => line.trim() !== "")

  let createdProfessors = []
  let createdStudents = []
  let teacherNames = []
  let students = []

  lines.slice(1).forEach((line) => {
    const [level, lastName, firstName, birthDate, professorName] = line
      .split(",")
      .map((item) => item.trim())
    if (importType.includes("teachers") && professorName)
      teacherNames.push(professorName)
    if (importType.includes("students"))
      students.push({ level, lastName, firstName, birthDate, professorName })
  })

  teacherNames = [...new Set(teacherNames)].filter(Boolean)

  const existingProfessors = await prisma.professor.findMany({
    where: {
      OR: teacherNames.map((name) => {
        const [lastName, firstName] = name.split(" ")
        return { firstName, lastName }
      }),
    },
    select: { firstName: true, lastName: true },
  })

  const existingProfessorMap = new Set(
    existingProfessors.map((p) => `${p.firstName} ${p.lastName}`)
  )

  const newProfessors = []

  for (const fullName of teacherNames) {
    const [lastName, firstName] = fullName.split(" ")
    if (
      !firstName ||
      !lastName ||
      existingProfessorMap.has(`${firstName} ${lastName}`)
    )
      continue

    const username = `edu_${firstName
      .slice(0, 2)
      .toLowerCase()}${lastName.toLowerCase()}`
    const plainPassword = generateRandomPassword()
    const hashedPassword = await bcrypt.hash(plainPassword, 12)

    newProfessors.push({
      userData: {
        name: `${firstName} ${lastName}`,
        username,
        hashPassword: hashedPassword,
        role: "PROFESSOR",
      },
      professorData: { firstName, lastName },
      plainPassword,
    })
  }

  if (newProfessors.length > 0) {
    await prisma.$transaction([
      ...newProfessors.map(({ userData }) =>
        prisma.user.create({ data: userData })
      ),
      ...newProfessors.map(({ professorData }) =>
        prisma.professor.create({ data: professorData })
      ),
    ])

    createdProfessors = newProfessors.map(
      ({ professorData, plainPassword }) => ({
        username: `edu_${professorData.firstName
          .slice(0, 2)
          .toLowerCase()}${professorData.lastName.toLowerCase()}`,
        ...professorData,
        plainPassword,
      })
    )
  }

  const classMap = new Map()
  const studentMap = new Map()

  const existingClasses = await prisma.class.findMany({
    where: { schoolYearId: yearId },
    select: { id: true, name: true, professorId: true },
  })

  existingClasses.forEach((c) => classMap.set(c.name, c))

  const existingStudents = await prisma.student.findMany({
    where: {
      OR: students.map((s) => ({
        firstName: s.firstName,
        lastName: s.lastName,
      })),
    },
    select: { id: true, firstName: true, lastName: true },
  })

  existingStudents.forEach((s) =>
    studentMap.set(`${s.firstName} ${s.lastName}`, s.id)
  )

  for (const student of students) {
    const { level, lastName, firstName, professorName } = student
    if (!lastName || !firstName || !level || !professorName) continue

    const studentKey = `${firstName} ${lastName}`
    let studentId = studentMap.get(studentKey)

    if (!studentId) {
      const newStudent = await prisma.student.create({
        data: { firstName, lastName },
      })
      studentId = newStudent.id
      studentMap.set(studentKey, studentId)
    }

    let currentClass = classMap.get(level)
    if (!currentClass) {
      currentClass = await prisma.class.create({
        data: { name: level, schoolYearId: yearId },
      })
      classMap.set(level, currentClass)
    }

    const [professorLastName, professorFirstName] = professorName.split(" ")
    const professor = existingProfessors.find(
      (p) =>
        p.firstName === professorFirstName && p.lastName === professorLastName
    )

    if (professor && !currentClass.professorId) {
      await prisma.class.update({
        where: { id: currentClass.id },
        data: { professorId: professor.id },
      })
    }

    await prisma.registration.upsert({
      where: { studentId_classId: { studentId, classId: currentClass.id } },
      update: {},
      create: { studentId, classId: currentClass.id, redoubler: false },
    })

    createdStudents.push({ firstName, lastName, level, professorName })
  }

  return new Response(
    JSON.stringify({
      message: "Importation terminée avec succès.",
      createdProfessors,
      createdStudents,
    }),
    { status: 200 }
  )
}

// ----------- DEV ONLY ------------
export async function GET(req) {
  try {
    await prisma.$transaction([
      prisma.registration.deleteMany({}),
      prisma.class.deleteMany({}),
      prisma.professor.deleteMany({}),
      prisma.student.deleteMany({}),
      prisma.user.deleteMany({}),
    ])

    return new Response(
      JSON.stringify({
        message: "Toutes les données ont été supprimées avec succès.",
      }),
      { status: 200 }
    )
  } catch (error) {
    console.error("Erreur lors de la suppression des données :", error)
    return new Response(
      JSON.stringify({
        error: "Une erreur est survenue lors de la suppression des données.",
      }),
      { status: 500 }
    )
  }
}
