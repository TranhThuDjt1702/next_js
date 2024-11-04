import Notfound from '@/app/not-found'
import { SignIn } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';

import React from 'react'

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const {userId,redirectToSignIn} = await auth();

    if (!userId) return redirectToSignIn()

    return (
        <div>
            {children}
        </div>
    )
}

export default AdminLayout
