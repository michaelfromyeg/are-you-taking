import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar"
import format from "date-fns/format"
import parse from "date-fns/parse"
import startOfWeek from "date-fns/startOfWeek"
import getDay from "date-fns/getDay"
import "react-big-calendar/lib/css/react-big-calendar.css"
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

const COLORS = ['blue', 'green', 'red', 'orange', 'pink', 'yellow']


const CustomCalendar = ({ events }) => {
	const eventStyleGetter = (event, start, end, isSelected) => {
		const style = {
			backgroundColor: event.color,
			color: "white",
			opacity: 1
		}
		return {
			style: style
		}
	}

	const parseEvents = (events) => {
		const seenUsers = []
		let color = -1;
		const newEvents = events.map(e => {
			if (!seenUsers.includes(e.user_id)) {
				color = color + 1;
				seenUsers.push(e.user_id)
			}
			return {
				title: e.label,
				start: new Date(e.start_time),
				end: new Date(e.end_time),
				color: COLORS[color],
			}
		})

		console.log(newEvents)

		return newEvents
	}

	return (
		<div className={styles.calendar}>
			<Calendar
				localizer={localizer}
				views={["month", "week"]}
				defaultView={Views.WEEK}
				// events={dummyEvents}
				events={parseEvents(events)}
				startAccessor="start"
				endAccessor="end"
				style={{ height: "1500px", width: "100%", margin: "50px", margin: 0, padding: "1em" }}
				eventPropGetter={(eventStyleGetter)}
			/>
		</div>
	)
}

export default CustomCalendar
