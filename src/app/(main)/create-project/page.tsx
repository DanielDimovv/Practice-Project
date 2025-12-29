"use client";

import CreateProjectCard, {
  CreateProject,
} from "@/components/projectCards/CreateProjectCard";
import { useCreateProject } from "@/hooks/project";
import { useRouter } from "next/navigation";

export default function CreateProjectPage() {
  const router = useRouter();
  const {
    mutate: createProject,
    isPending: pendingProject,
    error: errorProject,
  } = useCreateProject();

  const handleSubmit = (data: CreateProject) => {
    createProject(data, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  return (
    <CreateProjectCard
      onSubmit={handleSubmit}
      isPending={pendingProject}
      error={errorProject?.message}
    />
  );
}
