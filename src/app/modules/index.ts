import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PersonModule } from './person/person.module';
import { IncomingDocumentsModule } from './incoming_documents/incoming_documents.module';

export default [UserModule, AuthModule, PersonModule, IncomingDocumentsModule];
