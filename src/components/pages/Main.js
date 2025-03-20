import React from 'react';
import { Link } from 'react-router-dom';
import { daysOfWeek } from '../hooks/daysOfWeek';
import { Tooltip } from 'react-tooltip';

const timeSlots = Array.from({ length: 24 }, (_, i) => ({
	start: `${i.toString().padStart(2, '0')}:00`,
	end: `${((i + 1) % 24).toString().padStart(2, '0')}:00`,
}));

const rainbowColors = [
	'#FF0000',
	'#FF7F00',
	'#DDDD00',
	'#00DD00',
	'#00A2E8',
	'#4B0082',
	'#9400D3',
];

export default function Main({ schedule, accessLevel }) {
	const getSlotType = (time, day) => {
		const keyPattern = new RegExp(`^${time}_${day}_.+$`);
		const matchingKeys = Object.keys(schedule).filter((key) =>
			keyPattern.test(key)
		);

		if (matchingKeys.length === 4) {
			return 'FULL TH';
		} else if (matchingKeys.length === 3) {
			return 'TRIO';
		} else if (matchingKeys.length === 2) {
			return 'DUO';
		} else if (matchingKeys.length === 1) {
			return '+1';
		} else {
			return '';
		}
	};

	return (
		<div className='container'>
			{accessLevel ? 'test' : 'nie'}
			{console.log(accessLevel)}
			<Link id='undoButton' to='/apipage'>
				↩ PANEL
			</Link>
			<table>
				<thead>
					<tr>
						<td colSpan='2' className='none'></td>
						<td colSpan='5' className='daysTd'>
							DAYS OF WEEK
						</td>
						<td colSpan='2' className='none'></td>
					</tr>
					<tr>
						<td colSpan='2' className='table grey'>
							TIME
						</td>
						{daysOfWeek.map((day, index) => (
							<td
								key={index}
								className='table'
								style={{
									backgroundColor:
										rainbowColors[
											index % rainbowColors.length
										],
									color: 'white',
								}}>
								<Link
									to={`/${day.toLowerCase()}`}
									style={{
										textDecoration: 'none',
										color: 'inherit',
									}}>
									{day}
								</Link>
							</td>
						))}
					</tr>
				</thead>
				<tbody>
					{timeSlots.map((time, index) => (
						<tr key={index}>
							<td className='table'>{time.start}</td>
							<td className='table'>{time.end}</td>
							{daysOfWeek.map((day, dayIndex) => {
								const slotType = getSlotType(
									time.start,
									day.toLowerCase()
								);
								return (
									<td
										key={dayIndex}
										style={{
											textDecoration: 'none',
											color: 'inherit',
										}}>
										<Link
											to={`/${day.toLowerCase()}`}
											style={{
												display: 'block',
												width: '100%',
												height: '100%',
											}}
											data-tooltip-id={`tooltip-${dayIndex}-${index}`}
											data-tooltip-content={slotType}>
											{slotType}
										</Link>
										<Tooltip
											id={`tooltip-${dayIndex}-${index}`}
											place='top'
											effect='solid'
										/>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
