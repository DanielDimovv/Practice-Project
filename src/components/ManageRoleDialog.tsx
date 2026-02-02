// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectItem,
//   SelectContent,
// } from "./ui/select";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// import { Label } from "@/components/ui/label";
// import { useGetAllUsers, useUpdateUserRole, useDeleteUser } from "@/hooks/user";
// import { useState } from "react";
// import { SelectUser } from "@/server/db/schema";
// import { useCurrentUser } from "@/hooks/useAuth";
// import {
//   AlertDialogAction,
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
// } from "./ui/alert-dialog";

// export default function ManageRoleDialog() {
//   const {
//     data: allUsers,
//     isLoading: loadingAllUsers,
//     error: errorAllUsers,
//   } = useGetAllUsers();
//   const { data: currentUser } = useCurrentUser();

//   const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
//   const selectedUserData = allUsers?.find((u) => u.id === selectedUserId);
//   const [newRole, setNewRole] = useState<"admin" | "user" | null>(null);
//   const [isOpen, setIsOpen] = useState(false);

//   const { mutate: updateRole, isPending: isPendingRole } = useUpdateUserRole();
//   const { mutate: deleteUser, isPending: isPendingDelete } = useDeleteUser();

//   function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     if (!selectedUserId || !newRole) return;

//     updateRole(
//       { userId: selectedUserId, role: newRole },
//       {
//         onSuccess: () => {
//           setSelectedUserId(null);
//           setNewRole(null);
//           setIsOpen(false);
//         },
//       }
//     );
//   }

//   return (
//     <Dialog
//       open={isOpen}
//       onOpenChange={(open) => {
//         setIsOpen(open);
//         if (!open) {
//           setSelectedUserId(null);
//           setNewRole(null);
//         }
//       }}
//     >
//       <DialogTrigger asChild>
//         <Button variant="outline">Manage Users</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Users Managment</DialogTitle>
//             <DialogDescription>
//               Here you can choose a user and change his role, or delete the
//               selected user
//             </DialogDescription>
//           </DialogHeader>

//           <div className="grid gap-3">
//             {loadingAllUsers && <p>Loading users...</p>}
//             {errorAllUsers && <p>{errorAllUsers.message}</p>}
//             {!loadingAllUsers && (
//               <div className="space-y-2">
//                 <Label>Select a user</Label>
//                 <Select
//                   value={selectedUserId?.toString() ?? ""}
//                   onValueChange={(value) => {
//                     const userId = Number(value);
//                     setSelectedUserId(userId);

//                     const user = allUsers?.find((u) => u.id === userId);
//                     if (user) {
//                       setNewRole(user.role);
//                     }
//                   }}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Users" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {allUsers?.map((user: SelectUser) => (
//                       <SelectItem key={user.id} value={user.id.toString()}>
//                         {user.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             )}

//             {selectedUserData && (
//               <div className="space-y-2 mb-2">
//                 <Label>Change the current user role</Label>
//                 <RadioGroup
//                   value={newRole ?? ""}
//                   onValueChange={(value) =>
//                     setNewRole(value as "admin" | "user")
//                   }
//                 >
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="admin" id="admin" />
//                     <Label htmlFor="admin">Admin</Label>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <RadioGroupItem value="user" id="user" />
//                     <Label htmlFor="user">User</Label>
//                   </div>
//                 </RadioGroup>
//               </div>
//             )}
//           </div>
//           <DialogFooter className="mt-2ним к">
//             <Button type="submit">
//               {isPendingRole ? "Loading..." : "Save changes"}
//             </Button>
//             <DialogClose asChild>
//               <Button variant="outline" onClick={() => setSelectedUserId(null)}>
//                 Cancel
//               </Button>
//             </DialogClose>
//             {selectedUserData && selectedUserData.id !== currentUser?.id && (
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button type="button" variant="destructive">
//                     Delete User
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                     <AlertDialogDescription>
//                       This will permanently delete {selectedUserData.name}. This
//                       action cannot be undone.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <AlertDialogAction
//                       onClick={() => {
//                         deleteUser(Number(selectedUserId), {
//                           onSuccess: () => {
//                             setSelectedUserId(null);
//                             setIsOpen(false);
//                           },
//                         });
//                       }}
//                       className="bg-red-600 hover:bg-red-500"
//                     >
//                       {isPendingDelete ? "Loading" : "Delete"}
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             )}
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
