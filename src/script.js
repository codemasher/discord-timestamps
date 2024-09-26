/**
 * @created    25.09.2024
 * @author     smiley <smiley@chillerlan.net>
 * @copyright  2024 smiley
 * @license    MIT
 */

(() => {
	let dateInput = document.getElementById('date');
	let timeInput = document.getElementById('time');
	let zoneInput = document.getElementById('timezone');

	// https://gist.github.com/LeviSnoot/d9147767abeef2f770e9ddcd91eb85aa
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
	let formats = {
		d:   {format: '' , style: { dateStyle: 'long', timeStyle: 'short' },  name: 'Default',        },
		sd:  {format: 'd', style: { dateStyle: 'short' },                     name: 'Short Date',     },
		ld:  {format: 'D', style: { dateStyle: 'long' },                      name: 'Long Date',      },
		st:  {format: 't', style: { timeStyle: 'short' },                     name: 'Short Time',     },
		lt:  {format: 'T', style: { timeStyle: 'medium' },                    name: 'Long Time',      },
		sdt: {format: 'f', style: { dateStyle: 'long', timeStyle: 'short' },  name: 'Short Date/Time',},
		ldt: {format: 'F', style: { dateStyle: 'full', timeStyle: 'short' },  name: 'Long Date/Time', },
		rt:  {format: 'R', style: { style: 'long', numeric: 'auto' },         name: 'Relative Time',  },
	};

	let handles = {};

	function setTimezoneOptions(){
		let tz = new Date().getTimezoneOffset() / -60;

		for(let i = -12; i <= 14; i++){
			let option = document.createElement('option');
			option.value = i + '';

			if(i === 0){
				option.innerText = 'UTC';
			}
			else if(i > 0){
				// "UTC+n"
				option.innerText = 'UTC+' + i;
			}
			else{
				// "UTC-n"
				option.innerText = 'UTC' + i;
			}

			// select the current time zone and set it as default
			if(i === tz){
				option.defaultSelected  = true;
				option.innerText       += ' (current)';
			}

			zoneInput.appendChild(option);
		}
	}

	// https://stackoverflow.com/a/58252034
	function setDefaultValue(){
		let nowUTC = new Date();
		nowUTC.setSeconds(0);
		nowUTC.setMilliseconds(0);

		// get the local time for display in the date/time input in accordance to the time zone offset select
		let nowLoc = new Date(nowUTC);
		nowLoc.setMinutes(nowLoc.getMinutes() - nowLoc.getTimezoneOffset());

		dateInput.valueAsDate = nowLoc;
		timeInput.valueAsDate = nowLoc;

		// set the timestamps with the UTC time (will be formatted to local time)
		setTimestampTags(nowUTC);
	}

	function setTimestampTags(d){
		let t = d.getTime();

		for(let k in formats){
			// might error on invalid dates
			if(isNaN(t)){
				handles[k].example.innerText = 'invalid date';
				handles[k].input.value       = '';
			}
			else{
				let {format, style} = formats[k];
				let timestamp       = t / 1000;

				handles[k].example.innerText = formatDate(d, format, style);
				handles[k].input.value       = (format !== '') ? `<t:${timestamp}:${format}>` : `<t:${timestamp}>`;
			}
		}

	}

	function getDate(){
		let tz = zoneInput.value - 0;

		if(tz < -12 || tz > 14){
			throw new Error('invalid time tone offset');
		}

		let inputDate = new Date(dateInput.valueAsNumber + timeInput.valueAsNumber - tz * 3600000);
		// milliseconds should always be 0 here, but we're paranoid
		inputDate.setMilliseconds(0);

		return inputDate;
	}

	function formatDate(d, format, style){

		if(format === 'R'){
			return new Intl.RelativeTimeFormat((navigator.language || 'en'), style).format(...formatRelativeTime(d));
		}

		return new Intl.DateTimeFormat((navigator.language || 'en'), style).format(d);
	}

	function formatRelativeTime(d){
		let diff  = -((new Date().getTime() - d.getTime()) / 1000) | 0;
		let adiff = Math.abs(diff);

		switch(true){
			case adiff > 31536000: return [Math.round(diff / 31536000), 'year'];
			case adiff > 2592000 : return [Math.round(diff / 2592000), 'month'];
			case adiff > 604800  : return [Math.round(diff / 604800), 'week'];
			case adiff > 86400   : return [Math.round(diff / 86400), 'day'];
			case adiff > 3600    : return [Math.round(diff / 3600), 'hour'];
			case adiff > 60      : return [Math.round(diff / 60), 'minute'];
			default              : return [diff, 'seconds'];
		}
	}

	window.addEventListener('load', ev => {
		setTimezoneOptions();
		setDefaultValue();
	});

	document.getElementById('settings').addEventListener('change', ev => setTimestampTags(getDate()));

	for(let k in formats){
		let label = document.createElement('label');

		let labeltext = document.createElement('span');
		labeltext.innerText = formats[k].name;

		let input = document.createElement('input');
		input.type = 'text';
		input.readOnly = true;
		input.className = 'timestamp';
		input.addEventListener('click', ev => ev.target.select());

		let copy = document.createElement('button');
		copy.innerText = 'copy';

		copy.addEventListener('click', async ev => {
			ev.preventDefault();
			ev.stopPropagation();

			try{
				await navigator.clipboard.writeText(input.value);
			}
			catch(e){
				// noop
			}
		});

		let example = document.createElement('div');
		example.className = 'example';

		label.appendChild(labeltext);
		label.appendChild(input);
		label.appendChild(copy);
		label.appendChild(example);

		handles[k] = {input: input, example: example};

		document.getElementById('output').appendChild(label);
	}

})();
