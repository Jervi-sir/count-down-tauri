var GlobalSeconds = 10;
var timer = null;
function Timer(duration, element) {
	var self = this;
	this.duration = duration;
	this.element = element;
	this.running = false;
	
	this.els = {
		ticker: document.getElementById('ticker'),
		seconds: document.getElementById('seconds'),
		start_set: document.getElementById('display_time'),
	};
	
	document.getElementById('toggle').addEventListener('click', function() {
		var cl = 'countdown--wide';
		if (self.element.classList.contains(cl)) {
			self.element.classList.remove(cl);
		} else {
			self.element.classList.add(cl);
		}
	});
	
}

Timer.prototype.start = function() {
	var self = this;
	var start = null;
	this.running = true;
	var remainingSeconds = this.els.seconds.textContent = toTime(this.duration / 1000);
	
	function draw(now) {
		if (!start) start = now;
		var diff = now - start;
		var newSeconds = Math.ceil((self.duration - diff)/1000);

		if (diff <= self.duration) {
			self.els.ticker.style.height = 100 - (diff/self.duration*100) + '%';
			
			if (newSeconds != remainingSeconds) {
				self.els.seconds.textContent = toTime(newSeconds);
				remainingSeconds = newSeconds;
			}
			
			self.frameReq = window.requestAnimationFrame(draw);
		} else {
			//self.running = false;
			self.els.seconds.textContent = toTime(0);
			self.els.ticker.style.height = '0%';
			self.element.classList.add('countdown--ended');
            playAudio();
		}
	};
	
	self.frameReq = window.requestAnimationFrame(draw);
}

Timer.prototype.reset = function() {
	this.running = false;
	window.cancelAnimationFrame(this.frameReq);
	this.els.seconds.textContent = toTime(this.duration / 1000);
	this.els.ticker.style.height = null;
	this.element.classList.remove('countdown--ended');
}

Timer.prototype.setDuration = function(duration) {
	this.duration = duration;
	this.els.seconds.textContent = toTime(this.duration / 1000);
}

function toTime (input) {
    var sec_num = parseInt(input, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes + ':' + seconds ;
}

function playAudio() {
    var audio = new Audio('ringtone.mp3');
    audio.play();
}

function verifyNumber(evt) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
        theEvent.returnValue = false;
        if(theEvent.preventDefault) return theEvent.preventDefault();
    }
    var seconds = document.getElementById('second_amount').value;
    if(seconds >= 3600) {
        seconds= 3599;
    }
    document.getElementById('display_time').textContent = toTime(seconds * 10);
}


function setTimer() {
    var seconds = document.getElementById('second_amount').value;
    if(seconds >= 3600) {
        seconds = 3599;
    }
    GlobalSeconds = seconds;
	if(timer != null) {
		timer.reset();
	}
    timer = new Timer(GlobalSeconds * 1000, document.getElementById('countdown'));
    timer.start();
}

