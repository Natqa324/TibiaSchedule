import SelectOptions from '../hooks/SelectOptions';
import LevelOptions from '../hooks/LevelOptions';
import { Link } from 'react-router-dom';

const hours = Array.from({ length: 24 }, (_, i) => ({
	start: `${String(i).padStart(2, '0')}:00`,
	end: `${String((i + 1) % 24).padStart(2, '0')}:00`,
}));

const professions = ['EK', 'ED', 'RP', 'MS'];

function DayPage({ day, schedule }) {
	return (
		<>
			<Link id='undoButton' to='/'>
				↩ Cofnij
			</Link>
			<div className='container'>
				<table>
					<thead>
						<tr>
							<td colSpan='2' className='none'></td>
							<td colSpan='4' className='daysTd'>
								{day.toUpperCase()}
							</td>
							<td colSpan='1' className='none'></td>
						</tr>
						<tr>
							<td colSpan='2' className='table grey'>
								TIME
							</td>
							{professions.map((profession) => (
								<td key={profession} className='violet'>
									{profession}
								</td>
							))}
							<td className='grey'>Level Range</td>
						</tr>
					</thead>
					<tbody>
						{hours.map((hour, index) => (
							<tr key={index}>
								<td className='table'>{hour.start}</td>
								<td className='table'>{hour.end}</td>
								{professions.map((profession) => (
									<td key={profession}>
										<SelectOptions
											profession={profession}
											hour={hour}
											schedule={schedule}
											day={day}
										/>
									</td>
								))}
								<td>
									<LevelOptions />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}

export default DayPage;
