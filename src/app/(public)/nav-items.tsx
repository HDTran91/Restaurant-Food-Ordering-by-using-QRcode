'use client'

import { useAppContext } from '@/components/app-provider'
import { Role } from '@/constants/type'
import { cn, handleErrorApi } from '@/lib/utils'
import { useLogoutMutation } from '@/queries/useAuth'
import { RoleType } from '@/types/jwt.types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const menuItems: {
  title: string
  href: string
  role?: RoleType[]
  hideWhenLogin?: boolean
}[] = [
  {
    title: 'Home',
    href: '/',

  },
  {
    title: 'Menu',
    href: '/guest/menu',
    role: [Role.Guest]
  },
  {
    title: 'Đăng nhập',
    href: '/login',
    hideWhenLogin: true
  },
  {
    title: 'Quản lý',
    href: '/manage/dashboard',
    role: [Role.Owner, Role.Employee],
  }
]

export default function NavItems({ className }: { className?: string }) {
  // case when user is logged in, only show menu log in
  const { role, setRole } = useAppContext()
  const logoutMutation = useLogoutMutation()
  const router = useRouter()
  const logout = async () => {
    if (logoutMutation.isPending) return
    try {
      await logoutMutation.mutateAsync()
      setRole(undefined)
      router.push('/')
    }
    catch (error) {
      handleErrorApi({ error })
    }
  }
  return (
  <>
    {menuItems.map((item) => {
      const isAuth = item.role && role && item.role.includes(role)
      const canshow = (item.role === undefined && item.hideWhenLogin === undefined) || (!role && item.hideWhenLogin)

      if (isAuth || canshow) {
        return (
        <Link key={item.href} href={item.href} className={className}>
          {item.title}
        </Link>
      )
      }
      return null
    })}
    {role && <div className={cn(className, 'cursor-pointer')} onClick={logout}>Log out</div>}
  </>

  )
}
