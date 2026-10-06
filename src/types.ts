export interface MultimediaItem {
  id: string;
  proyecto_id: string;
  tipo: 'imagen' | 'video' | 'documento' | 'youtube' | 'drive' | 'github';
  url: string;
  titulo: string | null;
  descripcion: string | null;
  es_portada: '0' | '1';
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  name: string;
  is_leader: boolean;
}

export interface Project {
  id: string;
  name: string | null;
  description: string | null;
  status: string;
  cover: MultimediaItem | null;
  videos: MultimediaItem[];
  other_links: MultimediaItem[];
  team: TeamMember[];
  subject: string | null;
  category: string | null;
}
