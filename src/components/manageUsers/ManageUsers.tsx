
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";
import { useGetAllUsers, useDeleteUser, useUpdateUserData } from "@/hooks/user";
import {  useState } from "react";
import { SelectUser } from "@/server/db/schema";

import { Badge } from "../ui/badge";

import AddNewUser from "./AddNewUser";
import { useQueryClient } from "@tanstack/react-query";



  type UserData = {
    id: number | undefined;
    name: string;
    email: string;
    password: string;
    role: "admin" | "user" |  undefined; 
  };


export default function ManageUsers() {

  const querClient = useQueryClient()
  
  const {
    data: allUsers,
    isLoading: loadingAllUsers,
    error: errorAllUsers,
  } = useGetAllUsers();



  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const selectedUserData = allUsers?.find((u) => u.id === selectedUserId);
 


  const [userData,setUserData] = useState<UserData>({
    id:undefined,
    name:'',
    email:"",
    password:"",
    role:undefined
  })



  
  const [isOpenEditCard, setIsOpenEditCard] = useState(false);
  const [isOpenCreateCard,setIsOpenCreateCard] = useState(false)
  const [isSaved,setIsSaved] = useState(false)

  const { mutate: updateRole, isPending: isPendingRole } = useUpdateUserData();
  const { mutate: deleteUser, isPending: isPendingDelete } = useDeleteUser();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedUserId ) return;
    console.log(userData)

    updateRole(
      { userId: selectedUserId,userData},
      {
        onSuccess: () => {
          setSelectedUserId(null);
          setIsOpenEditCard(false)
          setIsSaved(true)
          querClient.invalidateQueries({queryKey:["users"]})
         
         
        },
      }
    );
  }

  return (<>
  
  <Card className="grid place-items-center gap-2 p-4 ">
  <p className="text-center mt-2">Users Managment </p>
            <p className="text-center">  Select a user to update their credentials or create a new user.</p>
    
             
           

          <div className="grid gap-3">
            {loadingAllUsers && <p>Loading users...</p>}
            {errorAllUsers && <p>{errorAllUsers.message}</p>}
            {!loadingAllUsers && (
              <div className="flex flex-col md:flex-row gap-4 p-2 md:justify-between md:items-center">
                <div className="flex items-center gap-2"><Label>Select a user</Label>
                <Select
                  value={selectedUserId?.toString() ?? ""}
                  onValueChange={(value) => {
                    const userId = Number(value);
                    setSelectedUserId(userId);

                    const user = allUsers?.find((u) => u.id === userId);
                    if (user) {
                      setUserData({
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        password: "",
                        role: user.role
                      })
                    }
                    setIsOpenEditCard(true)
                    setIsOpenCreateCard(false);
                    setIsSaved(false)
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Users" />
                  </SelectTrigger>
                  <SelectContent>
                    {allUsers?.map((user: SelectUser) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select> </div>

                <div><Button type="button" onClick={()=> {setIsOpenCreateCard(true); setIsOpenEditCard(false);setSelectedUserId(null)}}>Create new user</Button> </div>
                
              </div>
            )}
        </div>
  </Card>

  {isOpenEditCard && !isOpenCreateCard &&  <Card className="mt-4 p-2">
      
      <form onSubmit={handleSubmit}>
        <p className="text-center">User Details </p>
         

        <div className="space-y-2 mb-2">
          {selectedUserData && (<>
            <div>
              <Label>Name</Label>
              <Input type="text" value={userData.name} onChange={(e) => setUserData({...userData,name:e.target.value})} />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="text" value={userData.email} onChange={(e) => setUserData({...userData,email:e.target.value})} />
            </div>

            <div>
              <Label>Password</Label>
              <Input type="text"  placeholder="Enter the new password" value={userData.password}  onChange={(e) => setUserData({...userData,password:e.target.value})} />
            </div>
          
            <div className="space-y-2 mb-2">
              <Label>Change the current user role</Label>
              <RadioGroup
                value={userData.role ?? ""}
                onValueChange={(value) =>
                  // setNewRole(value as "admin" | "user")
                  setUserData({...userData,role:value as "admin" | "user"})
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
          </>

          

            
          )}
        </div>
        <div className="flex  justify-between">
          <div className="flex gap-3">
          <Button type="submit">
            {isPendingRole ? "Loading..." : "Save changes"}
          </Button>
          <Button variant="outline" type="button" onClick={() => {
            setSelectedUserId(null);
            setIsOpenEditCard(false)
          }}> Close</Button>

          </div>
          
          
          <Button type="button" variant="destructive" onClick={() => {
  deleteUser(Number(selectedUserId), {
    onSuccess: () => {
      setSelectedUserId(null);
      setIsOpenEditCard(false);  
      setIsSaved(true)
    },
  });
}}>
  {isPendingDelete ? "Deleting.." :"Delete User"}
</Button>
            
                   
          </div>    
          
      </form>

      
    
  </Card> }

  {isOpenCreateCard && !isOpenEditCard &&  <AddNewUser setIsOpenCreateCard={setIsOpenCreateCard} setIsSaved={setIsSaved}/> }

 { isSaved && <div>
  <Badge className="bg-green-400 text-black mt-4">
  The changes were applied successfully.
</Badge>
      </div>}
      
    
  
  </>
    
  );
}
