// import { useDeleteUser, useUpdateUserData } from "@/hooks/user";


// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Card } from "../ui/card";
// import { Input } from "../ui/input";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { useState } from "react";


// type UserData = {
//     id: number | undefined;
//     name: string;
//     email: string;
//     password: string;
//     role: "admin" | "user" |  undefined; 
//   };

//   type props = {
//     setIsSaved: (value: boolean) => void;
//     setIsOpenEditCard: (value: boolean) => void;
//     selectedUserId:number | null;
//     setSelectedUserId:(value: number | null) => void;
//   }

// export default function EditUserForm({setIsSaved, setIsOpenEditCard,setSelectedUserId,selectedUserId}:props) {


//     const { mutate: updateUserData, isPending: isPendingRole } = useUpdateUserData();
//   const { mutate: deleteUser, isPending: isPendingDelete } = useDeleteUser();

//   const [userData,setUserData] = useState<UserData>({
//     id:undefined,
//     name:'',
//     email:"",
//     password:"",
//     role:undefined
//   })

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     if (!selectedUserId ) return;
    

//     updateUserData(
//       { userId: selectedUserId,userData},
//       {
//         onSuccess: () => {
//           setSelectedUserId(null);
//           setIsOpenEditCard(false)
//           setIsSaved(true)
         
         
//         },
//       }
//     );
//   }




//     return <Card className="mt-4 p-2">
      
//     <form onSubmit={handleSubmit}>
//       <p className="text-center">User Details </p>
       

//       <div className="space-y-2 mb-2">
//         {selectedUserData && (<>
//           <div>
//             <Label>Name</Label>
//             <Input type="text" value={userData.name} onChange={(e) => setUserData({...userData,name:e.target.value})} />
//           </div>

//           <div>
//             <Label>Email</Label>
//             <Input type="text" value={userData.email} onChange={(e) => setUserData({...userData,email:e.target.value})} />
//           </div>

//           <div>
//             <Label>Password</Label>
//             <Input type="text"  placeholder="Enter the new password" value={userData.password}  onChange={(e) => setUserData({...userData,password:e.target.value})} />
//           </div>
        
//           <div className="space-y-2 mb-2">
//             <Label>Change the current user role</Label>
//             <RadioGroup
//               value={userData.role ?? ""}
//               onValueChange={(value) =>
//                 // setNewRole(value as "admin" | "user")
//                 setUserData({...userData,role:value as "admin" | "user"})
//               }
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="admin" id="admin" />
//                 <Label htmlFor="admin">Admin</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="user" id="user" />
//                 <Label htmlFor="user">User</Label>
//               </div>
//             </RadioGroup>
//           </div>
//         </>

        

          
//         )}
//       </div>
//       <div className="flex  justify-between">
//         <div className="flex gap-3">
//         <Button type="submit">
//           {isPendingRole ? "Loading..." : "Save changes"}
//         </Button>
//         <Button variant="outline" type="button" onClick={() => {
//           setSelectedUserId(null);
//           setIsOpenEditCard(false)
//         }}> Close</Button>

//         </div>
        
        
//         <Button type="button" variant="destructive" onClick={() => {
// deleteUser(Number(selectedUserId), {
//   onSuccess: () => {
//     setSelectedUserId(null);
//     setIsOpenEditCard(false);  
//     setIsSaved(true)
//   },
// });
// }}>
// {isPendingDelete ? "Deleting.." :"Delete User"}
// </Button>
          
                 
//         </div>    
        
//     </form>

    
  
// </Card>
// }