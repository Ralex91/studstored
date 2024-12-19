import { Card } from "@/components/ui/card"

import { BarChartComponent } from "@/components/ui/barChart"

export const stats = [
  { label: "Nombre d'élèves", value: 1200 },
  { label: "Redoublants", value: 45 },
  { label: "Nombre de classes", value: 30 },
  { label: "Nombre de profs", value: 75 },
]

export const links = [
  { name: "Gestion des élèves", href: "/students" },
  { name: "Gestion des profs", href: "/teachers" },
  { name: "Gestion des classes", href: "/classes" },
  { name: "Paramètres", href: "/settings" },
]
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <h2>
          Bienvenue, <span className="font-semibold">Admin</span>
        </h2>
        <h3>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700"
          >
            Année scolaire:
          </label>
          <select
            id="year"
            name="year"
            className=" p-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option>2021-2022</option>
            <option>2022-2023</option>
            <option>2023-2024</option>
            <option>2024-2025</option>
          </select>
        </h3>
      </header>

      <section className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4 text-center">
            <h2 className="text-lg font-semibold text-gray-600">
              {stat.label}
            </h2>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map((link, index) => (
          <button
            as="a"
            key={index}
            href={link.href}
            className="p-4 text-center bg-blue-600 text-white hover:bg-blue-700 transition rounded-md"
          >
            {link.name}
          </button>
        ))}
        <button className="col-span-4">
          <a
            href="/years"
            className="block w-full p-4 text-center bg-blue-600 text-white hover:bg-blue-700 transition rounded-md"
          >
            Créer une année
          </a>
        </button>
      </section>
      <div className="grid grid-cols-2 gap-4 mt-8">
        <BarChartComponent />
        <BarChartComponent />
        <BarChartComponent />
        <BarChartComponent />
      </div>
    </div>
  )
}
