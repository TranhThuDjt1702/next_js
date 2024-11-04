export interface IActiveLinkProps{
    url:  string,
    children: React.ReactNode;
}

export interface IMenuItem {
    url: string,
    title: string,
    icon: React.ReactNode
}

export type TCreateUserParams = {
    clerkId : string,
    userName : string,
    email_address: string,
    name?: string,
    avatar? : string
}


