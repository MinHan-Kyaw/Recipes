'use client'

import { usePathname } from 'next/navigation'
import MainHeader from "@/components/main-header/MainHeader"

export default function ConditionalHeader() {
  const pathname = usePathname()
  const isAuthRoute = pathname?.startsWith('/auth')
  
  if (isAuthRoute) {
    return null
  }
  
  return <MainHeader />
}
