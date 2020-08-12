'use strict';

let today = new Date();
let month = today.getMonth() + 1;
let day = today.getDate();
let year = 2020;
let selectedDay = today;
let monthDaysData = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let monthString = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
let dayString = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
let todayString = year + "-" + monthString[month - 1] + "-" + day;
let selectedDayString;
let monthDays;
let events = [];
let username;
let displayEvents = [];
let hasSelectedDay = false;
let monthEvents = [];


function getMonthDays(year) {
    if (year % 4 === 0) return 29;
    return 28;
}

function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}

function hasLogin() {
    username = sessionStorage.getItem("username");
    if (username) {
        return true
    }
    return true
}

function getEvents() {
    username = sessionStorage.getItem("username");
    let storageEvents = localStorage.getItem(username + "-events");
    if (storageEvents) {
        events = JSON.parse(storageEvents);
    }
}

function setCalendarEvents() {
    localStorage.setItem(username + "-events", JSON.stringify(events.filter(event => event.deleted !== true).map((event, index) => {
        event.id = index;
        return event
    })));
    getEvents();
}


function updateEvents() {
    monthEvents = events.filter((event) => event.year == year && event.month == month && event.deleted !== true).sort((a, b) => a.date.localeCompare(b.date));
    if (hasSelectedDay) {
        displayEvents = monthEvents.filter((event) => event.date == selectedDayString);
    } else {
        displayEvents = monthEvents;
    }
}

function initCalendar() {
    hasSelectedDay = false;
    if (hasLogin()) {
        try {
            let urlData = document.location.hash.split("?");
            if (urlData.length > 1) {
                let params = (document.location.hash.split("?")[1]).split("&");
                if (params) {
                    //let hasDay = false;
                    params.forEach(param => {
                        let paramData = param.split("=");
                        if (paramData[0] == "month") {
                            month = parseInt(paramData[1])
                        } else if (paramData[0] == "day") {
                            day = parseInt(paramData[1]);
                            hasSelectedDay = true;
                            //hasDay = true;
                        } else if (paramData[0] == "year") {
                            year = parseInt(paramData[1])
                        }
                    })

                    if (new Date(year, month, 0).getDate() < day || day < 1) {
                        throw new Error("invalid date");
                    }
                    if (hasSelectedDay) {
                        selectedDay = new Date(year, month, day);
                        selectedDayString = year + "-" + monthString[month - 1] + "-" + dayString[day - 1];
                    }
                }
            }
            getEvents();
            renderCalendar();

        } catch (err) {
            console.log(err);
            alert("invalid date parameters")
        }
    } else {
        window.location.hash = "#home";
        router.goToRoute("home");
    }
}

function renderCalendar(count) {
    if (count !== undefined) {
        month += parseInt(count);
        if (month == 0) {
            month = 12;
            year -= 1;
        } else if (month == 13) {
            month = 1;
            year += 1;
        }
        if (count !== 0) {
            window.location.hash = "#calendar?year=" + year + "&month=" + month;
            hasSelectedDay = false;
            selectedDayString = undefined;
        }
    }


    updateEvents();

    let dateString = year + "-" + monthString[month - 1] + "-01";

    var firstDayOfMonth = new Date(dateString);
    var weekDay = firstDayOfMonth.getDay();
    let monthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });
    let monthIndication = "<time datetime='" + year + "'-" + monthString[month - 1] + "'>" + monthName + " " + year;
    document.getElementsByClassName("month-indicator")[0].innerHTML = monthIndication;
    if (month == 2) {
        monthDays = getMonthDays(year);
    } else {
        monthDays = monthDaysData[month - 1];
    }
    createCalendar(weekDay);
    createEventList(monthName);
}

function createEventList(monthName) {
    let eventsHtml = "";
    if (hasSelectedDay) {
        eventsHtml += '<div class="events-header">Events for ' + selectedDayString + '</div>';
    } else {
        eventsHtml += '<div class="events-header">Events for ' + monthName + ' ' + year + '</div>';
    }
    if (displayEvents.length > 0) {
        for (let index = 0; index < displayEvents.length; index++) {
            eventsHtml += createEventItem(displayEvents[index])
        }
    } else {
        eventsHtml += '<div class="events-header">No events scheduled.Enjoy the day!</div>';
    }

    document.getElementsByClassName("calendar-events")[0].innerHTML = eventsHtml;
}

function createEventItem(event) {
    let eventHtml = "";
    eventHtml += '<div class="event">';
    eventHtml += ' <div class="event-info event-title"><strong>Title:</strong><span>' + event.title + '</span></div>'
    eventHtml += ' <div class="event-info"><strong>Date:</strong><span>' + event.date + '</span></div>'
    eventHtml += ' <div class="event-info"><strong>Participants:</strong><span>' + event.participants + '</span></div>'
    eventHtml += ' <div class="event-info"><strong>Description:</strong><span>' + event.details + '</span></div>'
    eventHtml += ' <button class="btn danger" onclick="deleteEvent(' + event.id + ')">Delete</button>'
    eventHtml += "</div>";
    return eventHtml;
}

function createCalendar(weekDay) {
    let monthHtml = "";
    for (let index = 1; index <= monthDays; index++) {
        monthHtml += createDateGridItem(index)

    }
    document.getElementsByClassName("date-grid")[0].innerHTML = monthHtml;
    document.querySelector(".date-grid div:first-child").style['grid-column'] = weekDay;
}

function setDateItems(dateString) {
    let eventsHtml = "";
    let dayEvents = events.filter(event => event.date == dateString);
    if (dayEvents.length > 0) {
        eventsHtml += "<div class='grid-day-events'>";
        dayEvents.forEach(event => {
            eventsHtml += "<div class='grid-event-item'>" + event.title + "</div>"
        })
        eventsHtml += '</div>';
    }
    return eventsHtml;
}

function createDateGridItem(index) {
    let itemHtml = "";
    let dateString = year + "-" + monthString[month - 1] + "-" + dayString[index - 1];
    if (selectedDayString !== dateString) {
        if (todayString !== dateString) {
            itemHtml += '<div class="date-grid-item" onclick="changeDate(' + index + ')"><time datetime = "' + dateString + '">' + index + '</time>';
            itemHtml += setDateItems(dateString);
            itemHtml += '</div>';
        } else {
            itemHtml += '<div class="date-grid-item today" onclick="changeDate(' + index + ')"><time datetime = "' + dateString + '">' + index + '</time>';
            itemHtml += setDateItems(dateString);
            itemHtml += '</div>';
        }
    } else if (hasSelectedDay) {
        if (todayString !== dateString) {
            itemHtml += '<div class="date-grid-item active" onclick="changeDate(' + index + ')"><time datetime = "' + dateString + '">' + index + '</time>';
            itemHtml += setDateItems(dateString);
            itemHtml += '</div>';
        } else {
            itemHtml += '<div class="date-grid-item active today" onclick="changeDate(' + index + ')"><time datetime = "' + dateString + '">' + index + '</time>';
            itemHtml += setDateItems(dateString);
            itemHtml += '</div>';
        }
    }
    return itemHtml;

}

function changeDate(selectedDay) {
    window.location.hash = "#calendar?year=" + year + "&month=" + month + "&day=" + selectedDay;
}

function openAddEventForm() {
    if (selectedDayString !== undefined) {
        document.getElementById("addEventForm").style.display = "block";
    } else {
        alert("You must select day of month first.");
    }
}

function deleteEvent(id) {
    for (let index = 0; index < events.length; index++) {
        if (events[index].id == id) {
            events[index].deleted = true;
            break;
        }
    }
    setCalendarEvents();
    renderCalendar(0)
}

function addEvent() {
    try {
        let title = document.getElementById("eventTitle").value;
        if (!title && title.trim() == "") {
            return;
        }
        let participants = document.getElementById("participants").value;
        let details = document.getElementById("details").value;
        events.push({
            title: title,
            participants: participants,
            details: details,
            id: events.length,
            month: month,
            year: year,
            date: selectedDayString
        })

        setCalendarEvents();
        closeAddEventForm();
        renderCalendar(0);
    } catch (e) {
        console.log("Error in adding events", e)
    }
}

function closeAddEventForm() {
    document.getElementById("eventTitle").value = "";
    document.getElementById("participants").value = "";
    document.getElementById("details").value = "";
    document.getElementById("addEventForm").style.display = "none";
}
