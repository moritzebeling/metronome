class Helpers {
    /**
     * @param {number} number 
     * @param {number} length 
     * @returns {string}
     */
    static leadingZeros(number, length = 2) {
        return number.toString().padStart(number, '0');
    }

    /**
     * @param {number} mil 
     * @returns {number}
     */
    static mil2bpm( mil ){
		return Math.round(60000 / mil);
	}

    /**
     * @param {number} bpm 
     * @returns {number}
     */
	static bpm2mil( bpm ){
		return Math.round(1000 / ( bpm / 60 ));
	}
}

export class Metronome {

    constructor (beats = 4, callback=(b)=>{}) {
        this.beats = beats;
        this.beat = 0;
        this.bpm = 0;
        this.callback = callback;
        this.interval = null;
    }
    
    start( bpm = 120 ) {

        clearInterval(this.interval);
        this.bpm = bpm;

        this.beat = 0;
        let context = this;

        this.interval = setInterval(()=>{

            context.beat = context.beat % context.beats;
            context.callback( context.beat );
            context.beat++;

        }, Helpers.bpm2mil( this.bpm ) );
    }

}

export class BPMCounter {

    constructor(callback=()=>{}, lookback = 16){
        /**
         * @type {Date[]}
         */
        this.sequence = [];
        this.bpmLast = 0;
        this.bpmAverage = 0;
        this.lookback = lookback;
        this.callback = callback;
    }

    reset(){
        this.sequence = [];
    }

    get bpm(){
        return this.bpmAverage;
    }

    /* input */

    tap(){
		
        let last = this.sequence[this.sequence.length-1];
		let now = new Date();

		this.sequence.push( now );
		this.sequence = this.sequence.slice(this.lookback * -1);

		// calculate last
		if( last ){
			this.bpmLast = Helpers.mil2bpm( this.diff( now, last ));
		}
		
		// calculate average
		this.bpmAverage = Helpers.mil2bpm( this.average( this.sequence ));
		if( this.sequence.length > 4 && Math.abs( (this.bpmAverage / this.bpmLast) - 1 ) > 0.5 ){
			this.reset();
			this.bpmAverage = this.bpmLast;
		}

        this.callback( this.bpmLast, this.bpmAverage );
	
	}

    /* helpers */

    /**
     * @param {Date} now 
     * @param {Date} past 
     * @returns {number}
     */
    diff( now, past ){
		return now.getTime() - past.getTime();
	}
	
    /**
     * @param {Date[]} sequence 
     * @returns {number}
     */
	average( sequence ){
		let sum = 0;
		for( let i = 0; i < sequence.length; i++ ){
			if( sequence[i+1] ){
				sum += this.diff( sequence[i+1], sequence[i] );
			}
		}
		return sum / (sequence.length-1);
	}
	
}