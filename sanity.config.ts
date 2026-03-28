import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { projectSchema } from './src/sanity/schemas/project'

export default defineConfig({
  name: 'teo-naval-portfolio',
  title: 'Teo Naval Portfolio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool(), visionTool()],
  defaultTool: 'structure',
  schema: {
    types: [projectSchema],
  },
})
