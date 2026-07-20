//* types import
import {mapMediaVideoDto} from '@api/server/media.dto';
import {mockVideosCatalog} from '@api/mocks/mediaMocks';
import {VideoProps} from '@Types/videoProps';

/** Fallback catalog for design-system showcases when queries are unavailable. */
export const videos: VideoProps[] = mockVideosCatalog.items.map(mapMediaVideoDto);
