import projectsRaw from '../../projects_data.json';
import type { Project } from '../types';

// Filter to only include projects with a published/approved status and a name
const allProjects: Project[] = (projectsRaw as Project[]).filter(
  (p) => p.name && p.status !== 'eliminado'
);

export default allProjects;
