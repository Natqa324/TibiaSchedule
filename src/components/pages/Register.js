// src/components/Register.js
import React, { useState } from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Importujemy funkcję

const Register = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);

	const createUserWithEmailAndPasswordHandler = (event, email, password) => {
		event.preventDefault();
		createUserWithEmailAndPassword(auth, email, password) // Używamy funkcji z auth
			.catch((error) => {
				setError(error.message);
				console.error(
					'Error signing up with email and password',
					error
				);
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
			<h1>Zarejestruj się</h1>
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
						createUserWithEmailAndPasswordHandler(
							event,
							email,
							password
						);
					}}>
					Zarejestruj się
				</button>
			</form>
		</div>
	);
};

export default Register;
