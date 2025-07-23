import Layout from '@/app/(public)/layout'

export default function GuestLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Layout >
      {children}
    </Layout>
  )
}