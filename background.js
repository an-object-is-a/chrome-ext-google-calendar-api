const API_KEY = '';
let user_signed_in = false;
let calendar_id = '',
    event_id = '';

chrome.identity.onSignInChanged.addListener(function (account_id, signedIn) {
    if (signedIn) {
        user_signed_in = true;
    } else {
        user_signed_in = false;
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'get_auth_token') {
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            console.log(token);
        });
    } else if (request.message === 'get_profile') {
        chrome.identity.getProfileUserInfo({ accountStatus: 'ANY' }, function (user_info) {
            console.log(user_info);
        });
    } else if (request.message === 'get_calendar') {
        /*
            This route will GET ALL of your calendars, but choose the first calendar in the list
            as the calendar to modify for the extension.
        */
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let fetch_url = `https://www.googleapis.com/calendar/v3/users/me/calendarList?key=${API_KEY}`;
            let fetch_options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            fetch(fetch_url, fetch_options)
                .then(res => res.json())
                .then(res => {
                    if (res.items[0]) {
                        console.log(`The captured calendar id is: ${res.items[0].id}`);
                        calendar_id = res.items[0].id;
                    } else {
                        console.log("No calendar id was captured.");
                    }
                })
                .catch(err => console.log(err));
        });

        // calendar_id = ''
    } else if (request.message === 'get_events') {
        /*
            This route will GET ALL of your event for the calendar, but choose the first event in the list
            as the event to modify for the extension.
        */
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let fetch_url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar_id)}/events?key=${API_KEY}`;
            let fetch_options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }

            fetch(fetch_url, fetch_options)
                .then(res => res.json())
                .then(res => {
                    if (res.items[0]) {
                        console.log(`The captured event id is: ${res.items[0].id}`);
                        event_id = res.items[0].id;
                    } else {
                        console.log("No event id was captured.");
                    }
                })
                .catch(err => console.log(err));
        });

        // event_id = ''
    } else if (request.message === 'get_event') {
        /*
            This route will GET the data associated with the 'event_id' captures in the 'get_events' route.
        */
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let fetch_url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar_id)}/events/${event_id}?key=${API_KEY}`;
            let fetch_options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }

            fetch(fetch_url, fetch_options)
                .then(res => res.json())
                .then(res => {
                    console.log("The event details are: ");
                    console.log(res);
                })
                .catch(err => console.log(err));
        });
    } else if (request.message === 'create_event') {
        /*
            This route will CREATE a new event into the calendar captured in the 'get_calendar' route.
        */
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let fetch_url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar_id)}/events?key=${API_KEY}`;
            let fetch_options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "end": {
                        "dateTime": "2021-05-07T17:00:00-04:00"
                    },
                    "start": {
                        "dateTime": "2021-05-07T13:00:00-04:00"
                    },
                    "summary": "Title of the event",
                    "description": "Description of the event"
                })
            }

            fetch(fetch_url, fetch_options)
                .then(res => res.json())
                .then(res => console.log(res))
                .catch(err => console.log(err));
        });
    } else if (request.message === 'delete_event') {
        /*
            This route will DELETE the event from the calendar captured in the 'get_calendar' route
            AND associated with the 'event_id' captured in the 'get_events' route.
        */
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let fetch_url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar_id)}/events/${event_id}?key=${API_KEY}`;
            let fetch_options = {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }

            fetch(fetch_url, fetch_options)
                .then(res => {
                    console.log(res);
                    event_id = '';
                })
                .catch(err => console.log(err));
        });
    } else if (request.message === 'update_event') {
        /*
            This route will UPDATE the event from the calendar captured in the 'get_calendar' route
            AND associated with the 'event_id' captured in the 'get_events' route.
        */
        chrome.identity.getAuthToken({ interactive: true }, function (token) {
            let fetch_url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar_id)}/events/${event_id}?key=${API_KEY}`;
            let fetch_options = {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "end": {
                        "dateTime": "2021-05-07T17:00:00-04:00"
                    },
                    "start": {
                        "dateTime": "2021-05-07T13:00:00-04:00"
                    },
                    "summary": "New Title of the event",
                    "description": "New Description of the event"
                })
            }

            fetch(fetch_url, fetch_options)
                .then(res => console.log(res))
                .catch(err => console.log(err));
        });
    }
});
