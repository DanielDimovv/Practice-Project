"use client";

import ViewProjectCard from "@/components/projectCards/ViewProjectCard";
import { useAuthContext } from "@/context/AuthContext";
import { useGetUserProjects } from "@/hooks/user";
import { SelectProject } from "@/server/db/schema";

export default function Dashboard() {
  //Въпрос за добавяне на users към проекта и какво става когато имаме два hook-a в енда форма ( от арихитектурна гледна точка да се погледнат таблиците и да се обсъди какво правим ако в една форма ни се налага да позлваме два hooka )

  const { user } = useAuthContext();

  const { data, isLoading, isError, error } = useGetUserProjects(
    user?.id ?? 0,
    user?.role ?? "user"
  );

  return (
    <>
      {isLoading && (
        <p className="text-muted-foreground text-center py-8">
          Loading projects...
        </p>
      )}

      {isError && (
        <p className="text-center py-8 text-red-400">Error: {error.message}</p>
      )}
      {data?.projects?.length === 0 && (
        <p className="text-muted-foreground text-center py-8">
          The user does not have assigned projects yet.
        </p>
      )}

      {data && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
          {data?.projects?.map((project: SelectProject) => (
            <ViewProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
