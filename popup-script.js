document.querySelector('#get_calendar_id').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'get_calendar' });
});

document.querySelector('#get_event_id').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'get_events' });
});

document.querySelector('#get_event').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'get_event' });
});

document.querySelector('#create_event').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'create_event' });
});

document.querySelector('#update_event').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'update_event' });
});

document.querySelector('#delete_event').addEventListener('click', function () {
    chrome.runtime.sendMessage({ message: 'delete_event' });
});