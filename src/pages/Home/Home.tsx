import { createSignal, createMemo, For, Show } from 'solid-js';
import { ProjectCard } from '../../components';
import allProjects from '../../data/projects';
import styles from './Home.module.css';

const PAGE_SIZE = 16; // 4 × 4 grid

const CATEGORIES = ['Todos', 'Programación', 'Arte', 'Videojuegos', 'Realidad Virtual', 'fundamental'];

function Home() {
  const [activeCategory, setActiveCategory] = createSignal<string>('Todos');
  const [page, setPage] = createSignal(1);

  const filtered = createMemo(() => {
    const cat = activeCategory();
    if (cat === 'Todos') return allProjects;
    return allProjects.filter((p) => p.category === cat);
  });

  const totalPages = createMemo(() => Math.max(1, Math.ceil(filtered().length / PAGE_SIZE)));

  const currentPage = createMemo(() => {
    const p = page();
    return Math.min(p, totalPages());
  });

  const paginated = createMemo(() => {
    const start = (currentPage() - 1) * PAGE_SIZE;
    return filtered().slice(start, start + PAGE_SIZE);
  });

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const goTo = (p: number) => setPage(Math.max(1, Math.min(p, totalPages())));

  // Build page numbers to show (max 5 around current)
  const pageNumbers = createMemo(() => {
    const total = totalPages();
    const cur = currentPage();
    const pages: number[] = [];
    const start = Math.max(1, cur - 2);
    const end = Math.min(total, cur + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  });

  return (
    <div class={styles.page}>
      {/* Header */}
      <header class={styles.header}>
        <span class={styles.pretitle}>Expo LMAD 2026</span>
        <h1 class={styles.title}>Portafolio LMAD</h1>
        <p class={styles.subtitle}>
          Proyectos estudiantiles — {allProjects.length} trabajos presentados
        </p>
      </header>

      {/* Category filters */}
      <nav class={styles.filters} aria-label="Filtros por categoría">
        <For each={CATEGORIES}>
          {(cat) => (
            <button
              class={`${styles.pill} ${activeCategory() === cat ? styles.pillActive : ''}`}
              onClick={() => handleCategoryChange(cat)}
              aria-pressed={activeCategory() === cat}
            >
              {cat}
            </button>
          )}
        </For>
      </nav>

      {/* Project grid */}
      <div class={styles.grid}>
        <Show
          when={paginated().length > 0}
          fallback={
            <div class={styles.empty}>
              <p class={styles.emptyIcon}>🔍</p>
              <p>No hay proyectos en esta categoría.</p>
            </div>
          }
        >
          <For each={paginated()}>
            {(project) => <ProjectCard project={project} />}
          </For>
        </Show>
      </div>

      {/* Pagination */}
      <Show when={totalPages() > 1}>
        <nav class={styles.pagination} aria-label="Paginación">
          <button
            class={styles.pageBtn}
            onClick={() => goTo(currentPage() - 1)}
            disabled={currentPage() === 1}
            aria-label="Página anterior"
          >
            ‹
          </button>

          <Show when={pageNumbers()[0] > 1}>
            <button class={styles.pageBtn} onClick={() => goTo(1)}>1</button>
            <Show when={pageNumbers()[0] > 2}>
              <span class={styles.pageInfo}>…</span>
            </Show>
          </Show>

          <For each={pageNumbers()}>
            {(n) => (
              <button
                class={`${styles.pageBtn} ${currentPage() === n ? styles.pageBtnActive : ''}`}
                onClick={() => goTo(n)}
                aria-label={`Página ${n}`}
                aria-current={currentPage() === n ? 'page' : undefined}
              >
                {n}
              </button>
            )}
          </For>

          <Show when={pageNumbers()[pageNumbers().length - 1] < totalPages()}>
            <Show when={pageNumbers()[pageNumbers().length - 1] < totalPages() - 1}>
              <span class={styles.pageInfo}>…</span>
            </Show>
            <button class={styles.pageBtn} onClick={() => goTo(totalPages())}>{totalPages()}</button>
          </Show>

          <button
            class={styles.pageBtn}
            onClick={() => goTo(currentPage() + 1)}
            disabled={currentPage() === totalPages()}
            aria-label="Página siguiente"
          >
            ›
          </button>
        </nav>
      </Show>
    </div>
  );
}

export { Home };