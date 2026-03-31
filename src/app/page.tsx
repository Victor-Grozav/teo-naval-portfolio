import { getProjects } from '@/lib/sanity'
import ProjectsList from '@/components/ProjectsList'

export const revalidate = 10

export default async function Home() {
  const projects = await getProjects()

  return (
    <main className="flex flex-col flex-1">
      <ProjectsList projects={projects} />
    </main>
  )
}
