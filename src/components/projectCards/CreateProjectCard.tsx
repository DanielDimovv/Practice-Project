"use client";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { useState } from "react";
import UserMultiselect from "./UserMultiSelect";
import { useRouter } from "next/navigation";
import ImageUploader from "../additional/ImageUploader";

export type CreateProject = {
  name: string;
  description: string;
  status: string;
  deadline: string;
  blockers: string;
  userIds: number[];
  imageId?:number | undefined;
};

type Props = {
  onSubmit: (data: CreateProject) => void;
  isPending: boolean;
  error?: string;
};

export default function CreateProjectCard({
  onSubmit,
  isPending,
  error,
}: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateProject>({
    name: "",
    description: "",
    status: "planned",
    deadline: "",
    blockers: "",
    userIds: [],
    imageId:undefined
  });

  return (
    <Card className="w-full max-w-md mx-auto p-4 sm:p-6 mt-8 sm:mt-16">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(formData);
        }}
      >
        <ImageUploader type="project"  onUploadComplete={(imageId) => setFormData({...formData, imageId})} />
        <div className="space-y-2">
          <Label>Name</Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(newValue) =>
              setFormData({ ...formData, status: newValue })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="blocked">Blocked </SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Deadline</Label>
          <Input
            type="date"
            value={formData.deadline}
            onChange={(e) => {
              setFormData({ ...formData, deadline: e.target.value });
            }}
          />
        </div>
        <div className="space-y-2">
          <Label>Blockers</Label>
          <Textarea
            value={formData.blockers}
            onChange={(e) => {
              setFormData({ ...formData, blockers: e.target.value });
            }}
          />
        </div>

        <div className="space-y-2">
          <UserMultiselect
            selectedUserIds={formData.userIds}
            onChange={(ids) => {
              setFormData({ ...formData, userIds: ids });
            }}
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating..." : "Create"}
          </Button>
          <Button
            type="button"
            onClick={() => {
              router.push("/dashboard");
            }}
          >
            Close
          </Button>
        </div>
      </form>
    </Card>
  );
}
