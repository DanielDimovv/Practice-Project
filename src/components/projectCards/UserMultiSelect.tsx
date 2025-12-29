"use client";

import { useGetAllUsers } from "@/hooks/user";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
  Command,
  CommandList,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { Checkbox } from "../ui/checkbox";

import { Button } from "../ui/button";
import { Label } from "../ui/label";

type Props = {
  selectedUserIds: number[];
  onChange: (ids: number[]) => void;
  disabled?: boolean;
};

export default function UserMultiselect({
  selectedUserIds,
  onChange,
  disabled,
}: Props) {
  const { data: users, isLoading } = useGetAllUsers();

  function handleToggle(userId: number) {
    const isSelected = selectedUserIds.includes(userId);

    if (isSelected) {
      onChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      onChange([...selectedUserIds, userId]);
    }
  }

  console.log(users);

  if (isLoading) return <p>Loading users...</p>;
  return (
    <>
      <div>
        <div>
          <Label>Assign users to the project</Label>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button disabled={disabled} >Select users...</Button>
          </PopoverTrigger>

          <PopoverContent>
            <Command>
              <CommandInput />
              <CommandList>
                <CommandEmpty>No users</CommandEmpty>
                <CommandGroup>
                  {users?.map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => handleToggle(user.id)}
                    >
                      <Checkbox checked={selectedUserIds.includes(user.id)} />
                      {user.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}
