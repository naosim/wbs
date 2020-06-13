import { TitleOnlyToMangedService } from './service/TitleOnlyToMangedService';
import { UpdateNoteBodyService } from './service/UpdateNoteBodyService';
import { CreateEmptyNoteService } from './service/CreateEmptyNoteService';
export class Services {
  constructor(readonly titleOnlyToMangedService: TitleOnlyToMangedService, readonly updateNoteBodyService: UpdateNoteBodyService, readonly createEmptyNoteService: CreateEmptyNoteService) { }
}
