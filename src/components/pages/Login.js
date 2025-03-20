import React, { useState } from 'react';

const Login = ({ setAccessCode }) => {
	const correctCode = process.env.REACT_APP_CORRECT_CODE;
	const [error, setError] = useState(null);
	const [state, setState] = useState(null);

	const onChangeHandler = (event) => {
		const { value } = event.currentTarget;
		setState(value);
	};

	const handleAccess = (event) => {
		event.preventDefault();
		if (state === correctCode) {
			localStorage.setItem('accessCode', state);
			setAccessCode(state);
		} else {
			setError('Niepoprawny kod');
		}
	};

	return (
		<div className='loginWrapper'>
			<div className='loginContainer'>
				<h1>Enter code</h1>
				{error && <div className='fontSize'>{error}</div>}
				<form>
					<input
						type='password'
						name='userCode'
						value={state}
						placeholder='code'
						onChange={onChangeHandler}
					/>
					<br />
					<button onClick={handleAccess}>Potwierdz</button>
				</form>
			</div>
		</div>
	);
};

export default Login;
