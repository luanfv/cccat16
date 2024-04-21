import { RideDatabaseRepository } from './infra/repository/ride-database.repository';
import { ApiHttpServer } from './api-http-server';
import { PostgresAdapter } from './infra/database/postgres.adapter';
import { AccountDatabaseRepository } from './infra/repository/account-database.repository';

const postgresAdapter = new PostgresAdapter();
const accountRepository = new AccountDatabaseRepository(postgresAdapter);
const rideRepository = new RideDatabaseRepository(postgresAdapter);
const api = new ApiHttpServer()
    .addSignUpRoute(accountRepository)
    .addRideRoute(accountRepository, rideRepository);
api.listen();
