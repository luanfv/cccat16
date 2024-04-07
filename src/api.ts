import express from 'express';
import { SignUpController } from './sign-up.controller';

const signUpController = new SignUpController();
const app = express();
app.use(express.json());
app.post('/signup', async function(req, res) {
	return await signUpController.post(req, res);
});
app.listen(3000);
