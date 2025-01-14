import Notfound from "@/app/not-found";
import { EuserRoles } from "@/contants/enums";
import { getUserInfo } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";

import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) return redirectToSignIn();
  
  const user = await getUserInfo({ userId });
  // console.log("user is:", user);

  if (user && user.role !== EuserRoles.ADMIN) return <Notfound/>
  
  return <div>{children}</div>;
};


export default AdminLayout;
