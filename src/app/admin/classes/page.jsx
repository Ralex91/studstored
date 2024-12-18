"use client"

import { Skeleton } from "@/components/ui/skeleton"
import ClassRow from "@/features/classes/components/ClassRow"
import CreateNewClass from "@/features/classes/components/CreateNewClass"
import { useClasses } from "@/features/classes/hooks/useClasses"

const ClassListPage = () => {
  const { data: classesData, isLoading, isError } = useClasses()

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl mb-4 font-semibold">Liste des classes</h1>
        <CreateNewClass
          professors={classesData?.professors || []}
          years={classesData?.years || []}
        />
      </div>
      <div className="flex flex-col gap-4">
        {isLoading &&
          Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 rounded-lg" />
          ))}
        {isError && <div>Error</div>}

        {!isLoading &&
          !isError &&
          classesData.classes?.map((classItem, index) => (
            <ClassRow key={index} data={classItem} />
          ))}
      </div>
    </div>
  )
}

export default ClassListPage
