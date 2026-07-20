//* types import
import {mapMediaAudioDto} from '@api/server/media.dto';
import {mockAudiosCatalog} from '@api/mocks/mediaMocks';
import {SoundProps} from '@Types/soundProps';

/** Fallback catalog for design-system showcases when queries are unavailable. */
export const sounds: SoundProps[] = mockAudiosCatalog.items.map(mapMediaAudioDto);
