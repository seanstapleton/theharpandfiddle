$(document).ready( function() {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#calendar').fullCalendar({
        theme: true,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        weekMode: 'liquid',
        url: '#',
        events: [
            {
                title: 'Fingers of Lightning',
                start: '2016-08-19'
            }
        ]
    });
});