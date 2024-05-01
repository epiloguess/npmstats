interface NpmPackage {
  name: string;
  description: string;
  links: {
    npm: string;
    homepage: string;
    repository?: string;
    bugs: string;
  };
}

// https://registry.npmjs.org/-/v1/search?text=${query}
export interface NpmSearchResult {
  objects: {
    package: NpmPackage;

    score: {
      detail: {
        popularity: number;
      };
    };
  }[];
  total: number;
}

export type Dailydownload  = {
  downloads: number;
  day: string;
};
// https://api.npmjs.org/downloads/range/${lastMonthRange}/${pkg_name}
export interface npmDownloads {
  start: string;
  end: string;
  package: string;
  downloads: Dailydownload[];
}


export interface cnpm_data {
  downloads: {
    day: string;
    downloads: number;
  }[];
  versions: {
    [version: string]: {
      day: string;
      downloads: number;
    }[];
  };
}

export interface Downloads {
  pkg: string
  downloads: Dailydownload[]
  source: string
}

export interface Package {
  pkg:string,
  description:string,
  repository:string,
  popularity:number
}
