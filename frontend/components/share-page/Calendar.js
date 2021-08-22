import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { useState, useEffect } from 'react'
import styles from './Calendar.module.scss'

const locales = {
	"en-US": require("date-fns/locale/en-US")
}

const localizer = dateFnsLocalizer({
	format,
	parse,
	startOfWeek,
	getDay,
	locales
})

const allViews = Object.keys(Views).map(k => Views[k])

const events = [
		{
			title: "meeting",
			start: new Date(2021,7,10,12,10,0),
			end: new Date(2021,7,10,14,20,0),
			color: 'blue'
		},
		{
			title: "test",
			start: new Date(2021,7,10,12,10,0),
			end: new Date(2021,7,10,14,20,0),
			color: 'green'
		},
		{
			title: "school",
			start: new Date(2021,7,13),
			end: new Date(2021,7,15),
			color: 'red'
		}
	]

const CustomCalendar = ({ users }) => {
	const [allEvents, setAllEvents] = useState([])
	
	useEffect(() => {
		setAllEvents(events)
	}, [])

	const eventStyleGetter = (event,start,end,isSelected) => {
		const style = {
			backgroundColor: event.color,
			color: "white",
			opacity: 1
		}
		return {
			style: style
		}
	}

	return (
		<div className={styles.calendar}>
			<Calendar 
			localizer={localizer} 
			views={["month", "week"]}
			defaultView={Views.WEEK}
			events={allEvents} 
			startAccesor="start"
			endAccessor="end"
			style={{height: "1500px", width: "100%", margin: "50px",margin: 0,padding: "1em"}}
			eventPropGetter={(eventStyleGetter)}
		
			/>
		</div>
	)
}

export default CustomCalendar