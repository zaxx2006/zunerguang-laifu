import * as migration_20261014_065641_laifu_initial from './20261014_065641_laifu_initial';
import * as migration_20261022_085501_service_presentations from './20261022_085501_service_presentations';
import * as migration_20261023_014438_high_conflict_support from './20261023_014438_high_conflict_support';
import * as migration_20261023_054849_site_completion from './20261023_054849_site_completion';
import * as migration_20261027_073000_optional_media_source from './20261027_073000_optional_media_source';

export const migrations = [
  {
    up: migration_20261014_065641_laifu_initial.up,
    down: migration_20261014_065641_laifu_initial.down,
    name: '20261014_065641_laifu_initial',
  },
  {
    up: migration_20261022_085501_service_presentations.up,
    down: migration_20261022_085501_service_presentations.down,
    name: '20261022_085501_service_presentations',
  },
  {
    up: migration_20261023_014438_high_conflict_support.up,
    down: migration_20261023_014438_high_conflict_support.down,
    name: '20261023_014438_high_conflict_support',
  },
  {
    up: migration_20261023_054849_site_completion.up,
    down: migration_20261023_054849_site_completion.down,
    name: '20261023_054849_site_completion'
  },
  {
    up: migration_20261027_073000_optional_media_source.up,
    down: migration_20261027_073000_optional_media_source.down,
    name: '20261027_073000_optional_media_source'
  },
];
