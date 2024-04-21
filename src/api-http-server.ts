import express, { Express } from 'express';
import { SignUpController } from './controller/sign-up.controller';
import { AccountRepository } from './infra/repository/account.repository';

export class ApiHttpServer {
	public readonly app: Express;

	constructor(
		private readonly accountRepository: AccountRepository,
	) {
		this.app = express();
		this.app.use(express.json());
	}

	addSignUpRoute() {
		const signUpController = new SignUpController(this.accountRepository);
		this.app.post('/signup', async function(req, res) {
			return await signUpController.post(req, res);
		});
		console.log('[POST] /signup');
		return this;	
	}

	listen(port: number = 3000) {
		this.app.listen(port, () => console.log(`Application is running at port ${port}`));
	}
}