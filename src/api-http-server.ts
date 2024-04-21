import { RideRepository } from './infra/repository/ride.repository';
import express, { Express } from 'express';
import { SignUpController } from './controller/sign-up.controller';
import { AccountRepository } from './infra/repository/account.repository';
import { RideController } from './controller/ride.controller';

export class ApiHttpServer {
	public readonly app: Express;

	constructor() {
		this.app = express();
		this.app.use(express.json());
	}

	addSignUpRoute(accountRepository: AccountRepository) {
		const signUpController = new SignUpController(accountRepository);
		this.app.post('/signup', async function(req, res) {
			return await signUpController.post(req, res);
		});
		console.log('[POST] /signup');
		return this;	
	}

	addRideRoute(accountRepository: AccountRepository, rideRepository: RideRepository) {
		const rideController = new RideController(accountRepository, rideRepository);
		this.app.post('/ride', async function(req, res) {
			return await rideController.post(req, res);
		});
		console.log('[POST] /ride');
		return this;
	}

	listen(port: number = 3000) {
		this.app.listen(port, () => console.log(`Application is running at port ${port}`));
	}
}