const EDO = require("edo.js").EDO
let edo = new EDO(12)
const mod = (n, m) => {
    return ((n % m) + m) % m;
}
const JS = function (thing) {
    return JSON.stringify(thing).replace(/"/g,'')
}

const CJS = function (thing) {
    console.log(JS(thing))
}
const rand_int_in_range = function (min,max) {
    return Math.floor(Math.random() * (max - min +1)) + min
}

const rand_int_in_range_but_not_zero = function (min,max) {
    let val = Math.floor(Math.random() * (max - min +1)) + min
    while(val==0) val = Math.floor(Math.random() * (max - min +1)) + min
    return val
}
const unique_in_array = (list) => {

    let unique  = new Set(list.map(JSON.stringify));
    unique = Array.from(unique).map(JSON.parse);

    return unique
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const control = [
    {
        semitones:2,
        pentatonic: [{up:1,down:2},{up:2,down:3},{up:4,down:5}],
        diatonic: [{up:1,down:2},{up:2,down:3},{up:4,down:5},{up:5,down:6},{up:6,down:7}],
    },
    {
        semitones:4,
        pentatonic: [{up:1,down:3}],
        diatonic: [{up:1,down:3},{up:4,down:6},{up:5,down:7}]
    }]

const manipulations = [
    {
        semitones:3,
        pentatonic: [{up:3,down:4},{up:5,down:6}],
        diatonic: [{up:2,down:4},{up:3,down:5},{up:6,down:1}]
    },

    {
        semitones:5,
        pentatonic: [{up:2,down:4},{up:3,down:5},{up:4,down:6},{up:5,down:7}],
        diatonic: [{up:1,down:4},{up:2,down:5},{up:3,down:6},{up:5,down:8},{up:6,down:9},{up:7,down:10}]
    }
]

const make_stimuli = function (subject_id,Qs_per_transmode=8,num_of_transmodes=6,control_per_transmode=2) {


    //Mode array
    let dia_modes = shuffle(Array.from(Array(num_of_transmodes)).map((el,i)=>i%7))
    let penta_modes = shuffle(Array.from(Array(num_of_transmodes)).map((el,i)=>i%5))

    //manipulation array
    let manips = []
    while(manips.length<Qs_per_transmode*num_of_transmodes) manips.push(...shuffle(Array.from(Array(manipulations.length).keys())))

    //control manipulation array
    let cont_manips = []
    while(cont_manips.length<control_per_transmode*num_of_transmodes) cont_manips.push(...shuffle(Array.from(Array(control.length).keys())))

    //Up/down array
    let dia_upd = shuffle(Array.from(Array(Qs_per_transmode*num_of_transmodes)).map((el,i)=>(i%2==0)?"up":"down"))
    let penta_upd = shuffle(Array.from(Array(Qs_per_transmode*num_of_transmodes)).map((el,i)=>(i%2==0)?"up":"down"))

    //Transposition array
    let dia_transpositions = shuffle(Array.from(Array(num_of_transmodes)).map((el,i)=>(i%7)-3))  //-3 through +3
    let penta_transpositions = shuffle(Array.from(Array(num_of_transmodes)).map((el,i)=>(i%7)-3))  //-3 through +3



    let all_dia = []
    let all_penta = []


    for (let i = 0; i < num_of_transmodes; i++) {

        let dia_mode = dia_modes.shift()
        let penta_mode = penta_modes.shift()
        let dia_trans = dia_transpositions.shift()
        let penta_trans = penta_transpositions.shift()
        let dia = edo.scale([0, 2, 4, 5, 7, 9, 11]).mode(dia_mode).pitches
        let penta = edo.scale([0, 2, 4, 7, 9]).mode(penta_mode).pitches

        let diatonic_Qs = {
            subject_id:subject_id,
            set:[0,2,4,5,7,9,11],
            mode: dia_mode,
            in_mode: dia,
            type: "diatonic",
            transposition:dia_trans,
            transposed_in_mode: dia.map(note=>note+dia_trans),
            Q:[]
        }
        let pentatonic_Qs = {
            subject_id:subject_id,
            set:[0,2,4,7,9],
            mode: penta_mode,
            in_mode: penta,
            type: "pentatonic",
            transposition:penta_trans,
            transposed_in_mode: penta.map(note=>note+penta_trans),
            Q:[]
        }






        for (let j = 0; j < Qs_per_transmode; j++) {
            let manipulation_both = manipulations[manips.shift()]

            let dia_manip = manipulation_both.diatonic[rand_int_in_range(0,manipulation_both.diatonic.length-1)]
            let penta_manip = manipulation_both.diatonic[rand_int_in_range(0,manipulation_both.pentatonic.length-1)]

            let dia_dir = dia_upd.shift()
            let dia_delta = (dia_dir=="down")? dia_manip['up']-dia_manip['down'] : dia_manip['down']-dia_manip['up']
            let dia_sign = (dia_dir=="down")? -1:1
            dia_manip = dia_manip[dia_dir]


            let penta_dir = penta_upd.shift()
            let penta_delta = (penta_dir=="down")? penta_manip['up']-penta_manip['down'] : penta_manip['down']-penta_manip['up']
            let penta_sign = (penta_dir=="down")? -1:1
            penta_manip = penta_manip[penta_dir]


            let dia_manip_in_mode = dia_manip-dia_mode
            let penta_manip_in_mode = penta_manip-penta_mode

            if(dia_manip_in_mode<1) dia_manip_in_mode += 7
            if(penta_manip_in_mode<1) penta_manip_in_mode += 5



            diatonic_Qs.Q.push({
                semitones: manipulation_both.semitones,
                direction: dia_dir,
                reference_SD: dia_manip_in_mode,
                delta: dia_delta,
                reference_note: diatonic_Qs.transposed_in_mode[(dia_manip_in_mode-1)%dia.length],
                test_note: diatonic_Qs.transposed_in_mode[(dia_manip_in_mode-1)%dia.length]+(manipulation_both.semitones*dia_sign),
                control:false
            })

            pentatonic_Qs.Q.push({
                semitones: manipulation_both.semitones,
                direction: penta_dir,
                reference_SD: penta_manip_in_mode,
                delta: penta_delta,
                reference_note: pentatonic_Qs.transposed_in_mode[(penta_manip_in_mode-1)%penta.length],
                test_note: pentatonic_Qs.transposed_in_mode[(penta_manip_in_mode-1)%dia.length]+(manipulation_both.semitones*penta_sign),
                control:false
            })
        }

        for (let j = 0; j < control_per_transmode; j++) {
            let manipulation_both = control[cont_manips.shift()]

            let dia_manip = manipulation_both.diatonic[rand_int_in_range(0,manipulation_both.diatonic.length-1)]
            let penta_manip = manipulation_both.diatonic[rand_int_in_range(0,manipulation_both.pentatonic.length-1)]

            let dia_dir = dia_upd.shift()
            let dia_delta = (dia_dir=="down")? dia_manip['up']-dia_manip['down'] : dia_manip['down']-dia_manip['up']
            let dia_sign = (dia_dir=="down")? -1:1
            dia_manip = dia_manip[dia_dir]


            let penta_dir = penta_upd.shift()
            let penta_delta = (penta_dir=="down")? penta_manip['up']-penta_manip['down'] : penta_manip['down']-penta_manip['up']
            let penta_sign = (penta_dir=="down")? -1:1
            penta_manip = penta_manip[penta_dir]


            let dia_manip_in_mode = dia_manip-dia_mode
            let penta_manip_in_mode = penta_manip-penta_mode

            if(dia_manip_in_mode<1) dia_manip_in_mode += 7
            if(penta_manip_in_mode<1) penta_manip_in_mode += 5



            diatonic_Qs.Q.push({
                semitones: manipulation_both.semitones,
                direction: dia_dir,
                reference_SD: dia_manip_in_mode,
                delta: dia_delta,
                reference_note: diatonic_Qs.transposed_in_mode[(dia_manip_in_mode-1)%dia.length],
                test_note: diatonic_Qs.transposed_in_mode[(dia_manip_in_mode-1)%dia.length]+(manipulation_both.semitones*dia_sign),
                control:true
            })

            pentatonic_Qs.Q.push({
                semitones: manipulation_both.semitones,
                direction: penta_dir,
                reference_SD: penta_manip_in_mode,
                delta: penta_delta,
                reference_note: pentatonic_Qs.transposed_in_mode[(penta_manip_in_mode-1)%penta.length],
                test_note: pentatonic_Qs.transposed_in_mode[(penta_manip_in_mode-1)%dia.length]+(manipulation_both.semitones*penta_sign),
                control:true
            })

        }


        diatonic_Qs.Q = shuffle(diatonic_Qs.Q)
        pentatonic_Qs.Q = shuffle(pentatonic_Qs.Q)
        all_dia.push(diatonic_Qs)
        all_penta.push(pentatonic_Qs)
    }


    let all_Qs = []
    if(Math.round(Math.random())==1) all_Qs.push(...all_dia,...all_penta)
    else all_Qs.push(...all_penta,...all_dia)

    return all_Qs
}
module.exports = make_stimuli


