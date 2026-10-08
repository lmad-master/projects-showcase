import { useNavigate } from '@solidjs/router';
import type { Project } from '../../types';

import { mediaUrl } from '../../utils/media';
import styles from './ProjectCard.module.css';

interface Props {
  project: Project;
  mediaBase?: string;
}

const ICON_MAP: Record<string, string> = {
  Arte: '🎨',
  Programación: '💻',
  'Realidad Virtual': '🥽',
  Videojuegos: '🎮',
  fundamental: '📚',
};

function ProjectCard(props: Props) {
  const navigate = useNavigate();
  const base = props.mediaBase ?? '';

  const coverUrl = () => {
    const c = props.project.cover;
    if (!c) return null;
    return mediaUrl(c.url);
  };

  const icon = () =>
    ICON_MAP[props.project.category ?? ''] ?? '📁';

  return (
    <div
      class={styles.card}
      onClick={() => navigate(`/project/${props.project.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/project/${props.project.id}`)}
      aria-label={`Ver proyecto: ${props.project.name}`}
    >
      {/* Cover */}
      {coverUrl() ? (
        <img
          class={styles.image}
          src={coverUrl()!}
          alt={props.project.name ?? 'Proyecto'}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <div class={styles.placeholder}>{icon()}</div>
      )}

      {/* Category badge */}
      {props.project.category && (
        <span class={styles.badge}>{props.project.category}</span>
      )}

      {/* Hover overlay */}
      <div class={styles.overlay}>
        {props.project.subject && (
          <p class={styles.subject}>{props.project.subject}</p>
        )}
        <p class={styles.title}>{props.project.name}</p>
      </div>
    </div>
  );
}

export { ProjectCard };
