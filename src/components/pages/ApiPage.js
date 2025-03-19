import React from 'react';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { app } from '../../firebase';
import ViewApi from '../hooks/ViewApi';

function WysyłanieDoFirebase() {
	const db = getFirestore(app);

	const nicknames = [{ name: 'Natqa Senpai', profession: 'ED' }];

	const rangeLevels = [{ minLvl: 500, maxLvl: 600 }];

	const wyslijNicknames = async () => {
		try {
			const nicknamesCollectionRef = collection(db, 'nicknames');
			for (const nickname of nicknames) {
				const docRef = await addDoc(nicknamesCollectionRef, nickname);
				console.log('Dodano nickname z ID: ', docRef.id);
			}
			console.log('Wszystkie nickname zostały wysłane do Firebase!');
		} catch (error) {
			console.error('Błąd podczas wysyłania nicknames: ', error);
		}
	};

	const wyslijRangeLevels = async () => {
		try {
			const rangeLevelsCollectionRef = collection(db, 'rangeLevels');
			for (const rangeLevel of rangeLevels) {
				const docRef = await addDoc(
					rangeLevelsCollectionRef,
					rangeLevel
				);
				console.log('Dodano rangeLevel z ID: ', docRef.id);
			}
			console.log('Wszystkie rangeLevels zostały wysłane do Firebase!');
		} catch (error) {
			console.error('Błąd podczas wysyłania rangeLevels: ', error);
		}
	};

	const wyslijObieTablice = () => {
		wyslijNicknames();
		wyslijRangeLevels();
	};

	return (
		<div>
			<ViewApi />
			<br />
			<hr />
			<br />
			<button onClick={wyslijObieTablice} className='light' disabled>
				NIE KLIKAĆ - Wyślij dane do Firebase
			</button>
		</div>
	);
}

export default WysyłanieDoFirebase;
