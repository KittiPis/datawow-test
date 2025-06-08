import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/login') // 🔁 redirect ไปหน้า login โดยตรง
}
