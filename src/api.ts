import express from 'express';
import { SignUpController } from './driver/sign-up.controller';

const app = express();
app.use(express.json());
const signUpController = new SignUpController();
app.post('/signup', async function(req, res) {
	return await signUpController.post(req, res);
});
app.listen(3000, () => console.log('Application is running at port: 3000'));
