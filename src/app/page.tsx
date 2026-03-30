import { getProjects } from '@/lib/sanity'
import ProjectsList from '@/components/ProjectsList'

export const revalidate = 10

export default async function Home() {
  const projects = await getProjects()

  return (
    <main>
      <ProjectsList projects={projects} />
    </main>
  )
}
