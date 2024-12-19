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

  const lines = (await file.text()).split("\n").filter((line) => line.trim())
  const processedData = processFileData(lines.slice(1))

  const createdProfessors = importType.includes("teachers")
    ? await processProfessors(processedData.teacherNames)
    : []

  const createdStudents = importType.includes("students")
    ? await processStudents(processedData.students, yearId)
    : []

  return new Response(
    JSON.stringify({
      message: "Importation terminée avec succès.",
      createdProfessors: createdProfessors.map(
        ({ professorData, plainPassword }) => ({
          username: `edu_${professorData.firstName
            .slice(0, 2)
            .toLowerCase()}${professorData.lastName.toLowerCase()}`,
          ...professorData,
          plainPassword,
        })
      ),
      createdStudents,
    }),
    { status: 200 }
  )
}

function processFileData(lines) {
  const teacherNames = new Set()
  const students = []

  for (const line of lines) {
    const [level, lastName, firstName, birthDate, professorName] = line
      .split(",")
      .map((item) => item.trim())

    if (professorName) teacherNames.add(professorName)
    if (firstName && lastName) {
      students.push({ level, lastName, firstName, birthDate, professorName })
    }
  }

  return { teacherNames: Array.from(teacherNames), students }
}

async function processProfessors(teacherNames) {
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
  const createUsers = []
  const createProfessors = []

  for (const fullName of teacherNames) {
    const [lastName, firstName] = fullName.split(" ")
    if (
      !firstName ||
      !lastName ||
      existingProfessorMap.has(`${firstName} ${lastName}`)
    ) {
      continue
    }

    const username = `edu_${firstName
      .slice(0, 2)
      .toLowerCase()}${lastName.toLowerCase()}`
    const plainPassword = generateRandomPassword()
    const hashedPassword = await bcrypt.hash(plainPassword, 12)

    createUsers.push({
      name: `${firstName} ${lastName}`,
      username,
      hashPassword: hashedPassword,
      role: "PROFESSOR",
    })

    createProfessors.push({ firstName, lastName })

    newProfessors.push({
      userData: createUsers[createUsers.length - 1],
      professorData: createProfessors[createProfessors.length - 1],
      plainPassword,
    })
  }

  if (newProfessors.length > 0) {
    await prisma.$transaction([
      prisma.user.createMany({ data: createUsers }),
      prisma.professor.createMany({ data: createProfessors }),
    ])
  }

  return newProfessors
}

async function processStudents(students, yearId) {
  const [existingClasses, existingStudents, existingProfessors] =
    await Promise.all([
      prisma.class.findMany({
        where: { schoolYearId: yearId },
        select: { id: true, name: true, professorId: true },
      }),
      prisma.student.findMany({
        where: {
          OR: students.map((s) => ({
            firstName: s.firstName,
            lastName: s.lastName,
          })),
        },
        select: { id: true, firstName: true, lastName: true },
      }),
      prisma.professor.findMany({
        where: {
          OR: Array.from(new Set(students.map((s) => s.professorName)))
            .map((name) => {
              const [lastName, firstName] = name.split(" ")
              return { firstName, lastName }
            })
            .filter((n) => n.firstName && n.lastName),
        },
        select: { id: true, firstName: true, lastName: true },
      }),
    ])

  const classMap = new Map(existingClasses.map((c) => [c.name, c]))
  const studentMap = new Map(
    existingStudents.map((s) => [`${s.firstName} ${s.lastName}`, s.id])
  )
  const professorMap = new Map(
    existingProfessors.map((p) => [`${p.firstName} ${p.lastName}`, p.id])
  )

  const createdStudents = []
  const registrationsToCreate = []
  const classesToCreate = []
  const studentsToCreate = []
  const classesToUpdate = []

  for (const student of students) {
    const { level, lastName, firstName, professorName } = student
    if (!lastName || !firstName || !level) continue

    const studentKey = `${firstName} ${lastName}`
    if (!studentMap.has(studentKey)) {
      studentsToCreate.push({ firstName, lastName })
    }

    if (!classMap.has(level) && professorName) {
      const [professorLastName, professorFirstName] = professorName.split(" ")
      const professorId = professorMap.get(
        `${professorFirstName} ${professorLastName}`
      )

      classesToCreate.push({
        name: level,
        schoolYearId: yearId,
        professorId: professorId || null,
      })
      classMap.set(level, {
        name: level,
        id: null,
        professorId: professorId || null,
      })
    }
  }

  await prisma.$transaction(async (prisma) => {
    if (classesToCreate.length > 0) {
      await prisma.class.createMany({
        data: classesToCreate,
      })

      const createdClasses = await prisma.class.findMany({
        where: {
          name: { in: classesToCreate.map((c) => c.name) },
          schoolYearId: yearId,
        },
      })
      createdClasses.forEach((c) => classMap.set(c.name, c))
    }

    if (studentsToCreate.length > 0) {
      await prisma.student.createMany({
        data: studentsToCreate,
      })

      const newStudents = await prisma.student.findMany({
        where: {
          OR: studentsToCreate.map((s) => ({
            firstName: s.firstName,
            lastName: s.lastName,
          })),
        },
        select: { id: true, firstName: true, lastName: true },
      })

      newStudents.forEach((s) =>
        studentMap.set(`${s.firstName} ${s.lastName}`, s.id)
      )
    }

    for (const student of students) {
      const { level, professorName } = student
      const existingClass = classMap.get(level)

      if (existingClass && !existingClass.professorId && professorName) {
        const [professorLastName, professorFirstName] = professorName.split(" ")
        const professorId = professorMap.get(
          `${professorFirstName} ${professorLastName}`
        )

        if (
          professorId &&
          !classesToUpdate.some((c) => c.id === existingClass.id)
        ) {
          classesToUpdate.push({
            id: existingClass.id,
            professorId,
          })
        }
      }
    }

    for (const classToUpdate of classesToUpdate) {
      await prisma.class.update({
        where: { id: classToUpdate.id },
        data: { professorId: classToUpdate.professorId },
      })
    }

    for (const student of students) {
      const { level, firstName, lastName } = student
      const studentId = studentMap.get(`${firstName} ${lastName}`)
      const classId = classMap.get(level)?.id

      if (studentId && classId) {
        registrationsToCreate.push({
          studentId,
          classId,
          redoubler: false,
        })
      }

      createdStudents.push({
        firstName,
        lastName,
        level,
        professorName: student.professorName,
      })
    }

    if (registrationsToCreate.length > 0) {
      await prisma.registration.createMany({
        data: registrationsToCreate,
        skipDuplicates: true,
      })
    }
  })

  return createdStudents
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
