import express from 'express';
import { SignUpController } from './controllers/sign-up.controller';

const app = express();
app.use(express.json());
const signUpController = new SignUpController();
app.post('/signup', async function(req, res) {
	return await signUpController.post(req, res);
});

export { app };