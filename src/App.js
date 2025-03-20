import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/pages/Main';
import DayPage from './components/pages/DayPage';
import { daysOfWeek } from './components/hooks/daysOfWeek';
import { useState, useEffect } from 'react';
import ApiPage from './components/pages/ApiPage';
import { app } from './firebase';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
import Login from './components/pages/Login';

function App() {
	const [schedule, setSchedule] = useState({});
	const db = getFirestore(app);
	const scheduleDocRef = doc(db, 'schedules', 'globalScheduleId');
	const basename = process.env.REACT_APP_BASENAME;
	const [accessCode, setAccessCode] = useState(
		localStorage.getItem('accessCode') || ''
	);
	useEffect(() => {
		const unsubscribe = onSnapshot(scheduleDocRef, (docSnapshot) => {
			if (docSnapshot.exists()) {
				setSchedule(docSnapshot.data());
			} else {
				console.log(
					'Dokument harmonogramu nie istnieje, inicjalizuję...'
				);
				setDoc(scheduleDocRef, {})
					.then(() =>
						console.log(
							'Pomyślnie zainicjowano dokument harmonogramu.'
						)
					)
					.catch((error) =>
						console.error(
							'Błąd podczas inicjalizacji dokumentu: ',
							error
						)
					);
				setSchedule({});
			}
		});

		return () => unsubscribe();
	}, [db, scheduleDocRef]);

	return (
		<div className='App'>
			<BrowserRouter basename={basename}>
				<Routes>
					<Route
						path=''
						element={
							accessCode ? (
								<Main schedule={schedule} />
							) : (
								<Login setAccessCode={setAccessCode} />
							)
						}
					/>
					{daysOfWeek.map((day, index) => {
						const newDay = day.toLowerCase();
						return (
							<Route
								key={index}
								path={newDay}
								element={
									accessCode ? (
										<Main schedule={schedule} />
									) : (
										<DayPage
											day={newDay}
											schedule={schedule}
										/>
									)
								}
							/>
						);
					})}
				</Routes>
			</BrowserRouter>
		</div>
	);
}
export default App;
