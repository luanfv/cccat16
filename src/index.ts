import { ApiHttpServer } from './api-http-server';
import { AccountDatabaseRepository } from './infra/repository/account-database.repository';

const accountRepository = new AccountDatabaseRepository();
const api = new ApiHttpServer(accountRepository)
    .addSignUpRoute();
api.listen();
