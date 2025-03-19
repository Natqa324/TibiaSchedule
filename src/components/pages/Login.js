import React, { useState } from 'react';
import { app } from '../../firebase';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);

	const signInWithEmailAndPasswordHandler = (event, email, password) => {
		event.preventDefault();
		app.signInWithEmailAndPassword(email, password).catch((error) => {
			setError(error.message);
			console.error('Error signing in with password and email', error);
		});
	};

	const onChangeHandler = (event) => {
		const { name, value } = event.currentTarget;

		if (name === 'userEmail') {
			setEmail(value);
		} else if (name === 'userPassword') {
			setPassword(value);
		}
	};

	return (
		<div>
			<h1>Zaloguj się</h1>
			{error !== null && <div>{error}</div>}
			<form>
				<label htmlFor='userEmail'>Email:</label>
				<input
					type='email'
					name='userEmail'
					value={email}
					placeholder='Email'
					onChange={onChangeHandler}
				/>
				<label htmlFor='userPassword'>Hasło:</label>
				<input
					type='password'
					name='userPassword'
					value={password}
					placeholder='Hasło'
					onChange={onChangeHandler}
				/>
				<button
					onClick={(event) => {
						signInWithEmailAndPasswordHandler(
							event,
							email,
							password
						);
					}}>
					Zaloguj
				</button>
			</form>
		</div>
	);
};

export default Login;
