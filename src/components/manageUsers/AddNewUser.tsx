import { useState } from "react";
import { useCreateNewUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { UserRole } from "@/server/db/schema";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";



type props = {
    setIsSaved: (value: boolean) => void;
    setIsOpenCreateCard: (value: boolean) => void;
  }

export default function AddNewUser({setIsSaved, setIsOpenCreateCard}:props){
    const queryClient = useQueryClient()

    const {mutate:createNewUser,isPending, error} = useCreateNewUser()


    const [userData, setUserData] = useState<{
        name: string;
        email: string;
        password: string;
        role: UserRole | undefined;
      }>({
        name: "",
        email: "",
        password: "",
        role: undefined
      });


    return<>
    <Card className="grid place-items-center gap-2 p-2 mt-4">
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
              createNewUser(userData, {
                onSuccess: () => { setIsSaved(true)
                  setIsOpenCreateCard(false)
                  queryClient.invalidateQueries({ queryKey: ["users"] })
                  queryClient.invalidateQueries({queryKey:["activityHistory"]})
                  setUserData({
                    name: "",
                    email: "",
                    password: "",
                    role:undefined
                  })
                }
                
                ,
              });
            }}
          >
            <p className="text-center">Create New User</p>
            <div className="space-y-2 mb-2">
            <div >
              <Label>Name</Label>
              <Input
                type="text"
                value={userData.name}
                onChange={(e) => {
                  setUserData({ ...userData, name: e.target.value });
                }}
              />
            </div>
            <div className="space-y-2 mb-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={userData.email}
                onChange={(e) => {
                    setUserData({ ...userData, email: e.target.value });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={userData.password}
                onChange={(e) => {
                    setUserData({
                    ...userData,
                    password: e.target.value,
                  });
                }}
              />
            </div>
            <div className="space-y-2 mb-2">
              <Label>Select the user role</Label>
              <RadioGroup
                value={userData.role}
                onValueChange={(value) =>
                 
                    setUserData({...userData, role: value as UserRole})
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">Admin</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="user" />
                  <Label htmlFor="user">User</Label>
                </div>
              </RadioGroup>
            </div>


            </div>
            

            {error && (
              <p className="text-red-500">{error.message}</p>
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Registering..." : "Register"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setIsOpenCreateCard(false)
                  setUserData({ name: "", email: "", password: "", role:undefined });
                }}
              >
                Close
              </Button>
            </div>
          </form>
        </Card>
    
    </>


}