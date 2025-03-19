import React, { useState, useEffect } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../../firebase';

export default function SelectOptions() {
	const [rangeLevelsFromFirebase, setRangeLevelsFromFirebase] = useState([]);
	const db = getFirestore(app);

	useEffect(() => {
		const pobierzRangeLevels = async () => {
			try {
				const rangeLevelsCollectionRef = collection(db, 'rangeLevels');
				const querySnapshot = await getDocs(rangeLevelsCollectionRef);
				const data = querySnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setRangeLevelsFromFirebase(data);
			} catch (error) {
				console.error(
					'Błąd podczas pobierania range levels z Firebase: ',
					error
				);
			}
		};

		pobierzRangeLevels();
	}, [db]);

	return (
		<select disabled>
			<option style={{ cursor: 'not-allowed' }}>--soon--</option>
			{rangeLevelsFromFirebase.map((el) => {
				return (
					<React.Fragment key={el.id}>
						{el.minLvl && el.maxLvl ? (
							<option value={`${el.minLvl}-${el.maxLvl}`}>
								{el.minLvl} - {el.maxLvl}
							</option>
						) : null}
					</React.Fragment>
				);
			})}
		</select>
	);
}
