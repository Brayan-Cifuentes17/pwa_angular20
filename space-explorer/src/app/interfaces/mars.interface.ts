export interface MarsPhoto {
  id: number;
  sol: number;
  img_src: string;
  earth_date: string;
  camera: { name: string; full_name: string };
  rover: { name: string; status: string };
}

export interface MarsResponse {
  photos: MarsPhoto[];
}

export interface NeoObject {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    kilometers: { estimated_diameter_min: number; estimated_diameter_max: number }
  };
  close_approach_data: {
    close_approach_date: string;
    relative_velocity: { kilometers_per_hour: string };
    miss_distance: { kilometers: string };
  }[];
}

export interface NeoResponse {
  element_count: number;
  near_earth_objects: Record<string, NeoObject[]>;
}

export interface Favorite {
  id?: number;
  type: 'apod' | 'neo';
  imageUrl: string;
  title: string;
  date: string;
  savedAt: number;
}

export interface Note {
  id?: number;
  favoriteId: number;
  text: string;
  createdAt: number;
  updatedAt: number;
}