import React, { useState, useEffect } from 'react';
import {
	collection,
	getDocs,
	getFirestore,
	updateDoc,
	doc,
	deleteDoc,
	addDoc,
	deleteField,
} from 'firebase/firestore';
import { app } from '../../firebase';
import { FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ViewApi() {
	const [nicknames, setNicknames] = useState([]);
	const [rangeLevels, setRangeLevels] = useState([]);
	const db = getFirestore(app);
	const [showModal, setShowModal] = useState(false);

	const [newNicknameName, setNewNicknameName] = useState('');
	const [newNicknameProfession, setNewNicknameProfession] = useState('');
	const [newRangeLevelMinLvl, setNewRangeLevelMinLvl] = useState('');
	const [newRangeLevelMaxLvl, setNewRangeLevelMaxLvl] = useState('');

	useEffect(() => {
		const pobierzDane = async () => {
			try {
				const nicknamesCollectionRef = collection(db, 'nicknames');
				const nicknamesSnapshot = await getDocs(nicknamesCollectionRef);
				const nicknamesData = nicknamesSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setNicknames(nicknamesData);

				const rangeLevelsCollectionRef = collection(db, 'rangeLevels');
				const rangeLevelsSnapshot = await getDocs(
					rangeLevelsCollectionRef
				);
				const rangeLevelsData = rangeLevelsSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setRangeLevels(rangeLevelsData);
			} catch (error) {
				console.error('Błąd podczas pobierania danych: ', error);
			}
		};

		pobierzDane();
	}, [db]);

	const handleNicknameChange = (event, nicknameId) => {
		const updatedNicknames = nicknames.map((nickname) =>
			nickname.id === nicknameId
				? { ...nickname, name: event.target.value }
				: nickname
		);
		setNicknames(updatedNicknames);
	};

	const handleProfessionChange = (event, nicknameId) => {
		const updatedNicknames = nicknames.map((nickname) =>
			nickname.id === nicknameId
				? { ...nickname, profession: event.target.value }
				: nickname
		);
		setNicknames(updatedNicknames);
	};

	const zapiszZmianyNickname = async (nicknameId, nowyNickname) => {
		try {
			const nicknameDocRef = doc(db, 'nicknames', nicknameId);
			await updateDoc(nicknameDocRef, {
				name: nowyNickname,
			});
		} catch (error) {
			console.error(
				`Błąd podczas aktualizacji nickname dla ID: ${nicknameId}: `,
				error
			);
		}
	};

	const zapiszZmianyProfesji = async (nicknameId, nowaProfesja) => {
		try {
			const nicknameDocRef = doc(db, 'nicknames', nicknameId);
			await updateDoc(nicknameDocRef, {
				profession: nowaProfesja,
			});
		} catch (error) {
			console.error(
				`Błąd podczas aktualizacji profesji dla nickname o ID: ${nicknameId}: `,
				error
			);
		}
	};

	const usunNickname = async (nicknameId) => {
		try {
			const nicknameDocRef = doc(db, 'nicknames', nicknameId);
			await deleteDoc(nicknameDocRef);
			pobierzDane();
		} catch (error) {
			console.error(
				`Błąd podczas usuwania nickname o ID: ${nicknameId}: `,
				error
			);
		}
	};

	const usunRangeLevel = async (rangeLevelId) => {
		try {
			const rangeLevelDocRef = doc(db, 'rangeLevels', rangeLevelId);
			await deleteDoc(rangeLevelDocRef);
			pobierzDane();
		} catch (error) {
			console.error(
				`Błąd podczas usuwania range level o ID: ${rangeLevelId}: `,
				error
			);
		}
	};

	const dodajNickname = async () => {
		if (newNicknameName && newNicknameProfession) {
			try {
				const nicknamesCollectionRef = collection(db, 'nicknames');
				await addDoc(nicknamesCollectionRef, {
					name: newNicknameName,
					profession: newNicknameProfession,
				});
				setNewNicknameName('');
				setNewNicknameProfession('');
				pobierzDane();
			} catch (error) {
				console.error('Błąd podczas dodawania nickname: ', error);
			}
		} else {
			alert('Wprowadź nickname i profesję.');
		}
	};

	const dodajRangeLevel = async () => {
		if (newRangeLevelMinLvl) {
			try {
				const rangeLevelsCollectionRef = collection(db, 'rangeLevels');
				await addDoc(rangeLevelsCollectionRef, {
					minLvl: parseInt(newRangeLevelMinLvl),
					maxLvl: parseInt(newRangeLevelMaxLvl),
				});
				setNewRangeLevelMinLvl('');
				setNewRangeLevelMaxLvl('');
				pobierzDane();
			} catch (error) {
				console.error('Błąd podczas dodawania range level: ', error);
			}
		} else {
			alert('Wprowadź poziom range level.');
		}
	};

	const pobierzDane = async () => {
		try {
			const nicknamesCollectionRef = collection(db, 'nicknames');
			const nicknamesSnapshot = await getDocs(nicknamesCollectionRef);
			const nicknamesData = nicknamesSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setNicknames(nicknamesData);

			const rangeLevelsCollectionRef = collection(db, 'rangeLevels');
			const rangeLevelsSnapshot = await getDocs(rangeLevelsCollectionRef);
			const rangeLevelsData = rangeLevelsSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setRangeLevels(rangeLevelsData);
		} catch (error) {
			console.error('Błąd podczas pobierania danych: ', error);
		}
	};

	const usunCalyTydzien = async () => {
		try {
			const schedulesRef = collection(db, 'schedules');
			const schedulesSnapshot = await getDocs(schedulesRef);

			for (const docSnapshot of schedulesSnapshot.docs) {
				const docRef = doc(db, 'schedules', docSnapshot.id);
				const data = docSnapshot.data();
				const updates = {};

				for (const field in data) {
					updates[field] = deleteField();
				}

				await updateDoc(docRef, updates);
			}
		} catch (error) {
			console.error('Błąd podczas usuwania tygodnia: ', error);
		}
		setShowModal(false);
	};

	return (
		<>
			<div className='btn-div'>
				<Link to='/'>↩ Back</Link>
				<button onClick={() => setShowModal(true)}>
					Usuń cały tydzień{' '}
					<span>
						<FaTrashAlt />
					</span>
				</button>
			</div>

			<div className='wrapper'>
				<div className='box'>
					<h2>Dodaj Nickname:</h2>
					<div className='nicknamebox'>
						<input
							type='text'
							placeholder='Nickname'
							value={newNicknameName}
							onChange={(e) => setNewNicknameName(e.target.value)}
						/>
						<select
							className='selectNickname'
							value={newNicknameProfession}
							onChange={(e) =>
								setNewNicknameProfession(e.target.value)
							}>
							<option value=''>- - - - - - -</option>
							<option value='ED'>ED</option>
							<option value='EK'>EK</option>
							<option value='MS'>MS</option>
							<option value='RP'>RP</option>
						</select>
						<button onClick={dodajNickname}>Dodaj</button>
					</div>
				</div>
				<div className='box'>
					<h2>Nicknames:</h2>
					{nicknames.length > 0 ? (
						<ul>
							{nicknames.map((nickname) => (
								<li key={nickname.id}>
									<div className='nickname-input'>
										Nickname:
										<input
											type='text'
											value={nickname.name}
											onChange={(event) =>
												handleNicknameChange(
													event,
													nickname.id
												)
											}
										/>
										<button
											className='green'
											onClick={() =>
												zapiszZmianyNickname(
													nickname.id,
													nickname.name
												)
											}>
											Zapisz
										</button>{' '}
									</div>
									<div className='profession-input'>
										Profesja:
										<select
											value={nickname.profession}
											onChange={(event) =>
												handleProfessionChange(
													event,
													nickname.id
												)
											}>
											<option value='ED'>ED</option>
											<option value='MS'>MS</option>
											<option value='RP'>RP</option>
											<option value='EK'>EK</option>
										</select>
										<button
											className='green'
											onClick={() =>
												zapiszZmianyProfesji(
													nickname.id,
													nickname.profession
												)
											}>
											Zapisz
										</button>
										<button
											className='red'
											onClick={() =>
												usunNickname(nickname.id)
											}>
											Usuń
										</button>
									</div>
								</li>
							))}
						</ul>
					) : (
						<p>Brak nicknames w bazie danych.</p>
					)}
				</div>
				<div className='box'>
					<h2>Dodaj Range Level:</h2>
					<div className='rangeBox'>
						<input
							type='number'
							placeholder='Minimalny Level'
							value={newRangeLevelMinLvl}
							onChange={(e) =>
								setNewRangeLevelMinLvl(e.target.value)
							}
							required
						/>
						<input
							type='number'
							placeholder='Maksymalny Level'
							value={newRangeLevelMaxLvl}
							onChange={(e) =>
								setNewRangeLevelMaxLvl(e.target.value)
							}
							required
						/>
						<button onClick={dodajRangeLevel}>Dodaj</button>
					</div>
				</div>
				<div className='box'>
					<h2>Range Levels:</h2>
					{rangeLevels.length > 0 ? (
						<ul>
							{rangeLevels.map((rangeLevel) => (
								<li key={rangeLevel.id}>
									Level: {rangeLevel.minLvl} -{' '}
									{rangeLevel.maxLvl}
									<button
										className='red'
										onClick={() =>
											usunRangeLevel(rangeLevel.id)
										}>
										Usuń
									</button>
								</li>
							))}
						</ul>
					) : (
						<p>Brak range levels w bazie danych.</p>
					)}
				</div>
			</div>
			<div>
				{showModal && (
					<div className='modal'>
						<div>
							<p>Czy na pewno chcesz usunąć cały tydzień?</p>
							<div className='modal-content'>
								<button
									className='red'
									onClick={usunCalyTydzien}>
									<FaTrashAlt /> {` `}Tak, usuń
								</button>
								<button onClick={() => setShowModal(false)}>
									Anuluj
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
}

export default ViewApi;
