import { AuthModule } from './auth/auth.module';
import { EntryDocumentsModule } from './entry_documents/entry_documents.module';
import { InternalDocumentsModule } from './internal_documents/internal_documents.module';
import { PersonModule } from './person/person.module';
import { UserModule } from './user/user.module';

export default [
  UserModule,
  AuthModule,
  PersonModule,
  EntryDocumentsModule,
  InternalDocumentsModule,
];
