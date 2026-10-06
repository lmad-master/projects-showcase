import { createSignal, createMemo, For, Show } from 'solid-js';
import { useNavigate, useParams } from '@solidjs/router';
import allProjects from '../../data/projects';
import type { MultimediaItem } from '../../types';
import styles from './ProjectDetail.module.css';

const LINK_ICONS: Record<string, string> = {
  github: '',
  drive: '',
  documento: '',
  youtube: '▶',
  video: '',
  imagen: '',
};

const LINK_LABELS: Record<string, string> = {
  github: 'GitHub',
  drive: 'Google Drive',
  documento: 'Documento',
  youtube: 'YouTube',
  video: 'Video',
  imagen: 'Imagen',
};

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  const project = createMemo(() =>
    allProjects.find((p) => p.id === params.id)
  );

  const videos = createMemo(() => project()?.videos ?? []);
  const [activeVideoIdx, setActiveVideoIdx] = createSignal(0);

  const activeVideo = createMemo<MultimediaItem | undefined>(
    () => videos()[activeVideoIdx()]
  );

  const coverUrl = createMemo(() => {
    const c = project()?.cover;
    if (!c) return null;
    if (c.url.startsWith('http')) return c.url;
    return `/storage/${c.url}`;
  });

  return (
    <div class={styles.page}>
      {/* Back button */}
      <button class={styles.back} onClick={() => navigate('/')}>
        ← Volver al portafolio
      </button>

      <Show
        when={project()}
        fallback={
          <div style={{ 'text-align': 'center', 'padding': '5rem', 'color': 'var(--color-text-muted)' }}>
            <p style={{ 'font-size': '3rem' }}>🔍</p>
            <p>Proyecto no encontrado.</p>
          </div>
        }
      >
        {/* Header */}
        <div class={styles.headline}>
          <Show when={project()!.category}>
            <span class={styles.category}>{project()!.category}</span>
          </Show>
          <h1 class={styles.projectName}>{project()!.name}</h1>
          <Show when={project()!.subject}>
            <p class={styles.subjectLabel}>
               {project()!.subject}
            </p>
          </Show>
        </div>

        {/* Two-column layout */}
        <div class={styles.layout}>
          {/* LEFT — cover + description */}
          <div class={styles.left}>
            <div class={styles.coverWrapper}>
              <Show
                when={coverUrl()}
                fallback={<div class={styles.coverPlaceholder}>🎓</div>}
              >
                <img
                  class={styles.cover}
                  src={coverUrl()!}
                  alt={project()!.name ?? 'Portada del proyecto'}
                />
              </Show>
            </div>

            <div class={styles.descSection}>
              <p class={styles.sectionLabel}>Descripción</p>
              <p class={styles.description}>
                {project()!.description ?? 'Sin descripción disponible.'}
              </p>
            </div>
          </div>

          {/* RIGHT — video */}
          <div class={styles.right}>
            <Show
              when={videos().length > 0}
              fallback={
                <div class={styles.noVideo}>
                  <span class={styles.noVideoIcon}>🎬</span>
                  <span>Sin video disponible</span>
                </div>
              }
            >
              {/* Video tabs (if more than one) */}
              <Show when={videos().length > 1}>
                <div class={styles.videoTabs}>
                  <For each={videos()}>
                    {(v, i) => (
                      <button
                        class={`${styles.videoTab} ${activeVideoIdx() === i() ? styles.videoTabActive : ''}`}
                        onClick={() => setActiveVideoIdx(i())}
                      >
                        {v.titulo ?? `Video ${i() + 1}`}
                      </button>
                    )}
                  </For>
                </div>
              </Show>

              <div class={styles.videoWrapper}>
                <Show when={activeVideo()}>
                  <iframe
                    class={styles.videoIframe}
                    src={activeVideo()!.url}
                    title={activeVideo()!.titulo ?? 'Video del proyecto'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </Show>
              </div>
            </Show>

            {/* Other links */}
            <Show when={project()!.other_links.length > 0}>
              <div class={styles.linksSection}>
                <p class={styles.sectionLabel}>Recursos adicionales</p>
                <div class={styles.linksList}>
                  <For each={project()!.other_links}>
                    {(link) => (
                      <Show when={link.deleted_at === null}>
                        <a
                          class={styles.linkChip}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {LINK_ICONS[link.tipo] ?? '🔗'}{' '}
                          {link.titulo ?? LINK_LABELS[link.tipo] ?? 'Enlace'}
                        </a>
                      </Show>
                    )}
                  </For>
                </div>
              </div>
            </Show>
          </div>
        </div>

        {/* Divider */}
        <div class={styles.divider} />

        {/* Team */}
        <Show when={project()!.team.length > 0}>
          <section class={styles.teamSection}>
            <p class={styles.teamTitle}>Equipo del proyecto</p>
            <ul class={styles.teamList}>
              <For each={project()!.team}>
                {(member) => (
                  <li class={styles.teamItem}>
                    <Show when={member.is_leader}>
                      <span class={styles.leaderStar} title="Líder"></span>
                    </Show>
                    {toTitleCase(member.name)}
                  </li>
                )}
              </For>
            </ul>
          </section>
        </Show>
      </Show>
    </div>
  );
}

export { ProjectDetail };
