import express, { Express } from 'express';
import { SignUpController } from './controllers/sign-up.controller';

export class AppServer {
	public readonly app: Express;

	constructor() {
		this.app = express();
		this.configServer(this.app);
	}

	private configServer(app: Express) {
		app.use(express.json());
		const signUpController = new SignUpController();
		app.post('/signup', async function(req, res) {
			return await signUpController.post(req, res);
		});
	}

	listen(port: number = 3000) {
		this.app.listen(port, () => console.log(`Application is running at port ${port}`));
	}
}