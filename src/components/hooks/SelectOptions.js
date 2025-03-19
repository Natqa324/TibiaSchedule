import React, { useState, useEffect } from 'react';
import {
	collection,
	getDocs,
	getFirestore,
	updateDoc,
	doc,
	deleteField,
} from 'firebase/firestore';
import { app } from '../../firebase';

export default function SelectOptions({ profession, hour, schedule, day }) {
	const [nicknamesFromFirebase, setNicknamesFromFirebase] = useState([]);
	const db = getFirestore(app);
	const scheduleDocRef = doc(db, 'schedules', 'globalScheduleId');

	useEffect(() => {
		const pobierzNicknames = async () => {
			try {
				const nicknamesCollectionRef = collection(db, 'nicknames');
				const querySnapshot = await getDocs(nicknamesCollectionRef);
				const data = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setNicknamesFromFirebase(data);
			} catch (error) {
				console.error(
					'Błąd podczas pobierania nicknames z Firebase: ',
					error
				);
			}
		};

		pobierzNicknames();
	}, [db]);

	const handleChange = async (event, hour) => {
		const selectedValue = event.target.value;
		const key = `${hour.start}_${day}_${profession}`;

		if (selectedValue) {
			try {
				await updateDoc(scheduleDocRef, {
					[`${key}`]: [selectedValue],
				});
			} catch (error) {
				console.error(
					'Błąd podczas aktualizacji harmonogramu w Firebase: ',
					error
				);
			}
		} else {
			try {
				const updatePayload = {};
				updatePayload[key] = deleteField();
				await updateDoc(scheduleDocRef, updatePayload);
			} catch (error) {
				console.error(
					`Błąd podczas usuwania ${key} z Firebase:`,
					error
				);
			}
		}
	};

	return (
		<select
			value={schedule[`${hour.start}_${day}_${profession}`] || []}
			onChange={(event) => handleChange(event, hour)}>
			<option></option>
			{nicknamesFromFirebase.map((el) => {
				return (
					<React.Fragment key={el.id}>
						{el.profession === profession ? (
							<option value={el.name}>{el.name}</option>
						) : null}
					</React.Fragment>
				);
			})}
		</select>
	);
}
