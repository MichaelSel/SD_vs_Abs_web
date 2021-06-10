let on_screen_animation
const base_freq = 261.63/2
const note_duration = 333 //msec
const gap_between_notes = 100 //msec
const get_freq = function (note,zero_freq=base_freq) {
    return zero_freq*Math.pow(2,note/12)
}
const play_note = function (note,duration=note_duration,delay=0) {
    let soundG = new Pizzicato.Group();
    for (let i = 0; i < 7; i++) {
        let sound = new Pizzicato.Sound({
            source: 'wave',
            options: {
                frequency: (i+1) * get_freq(note),
                release: 0.8,
                volume: 0.05

            }
        });
        soundG.addSound(sound)
    }


    let buf = setTimeout(function () {
        soundG.play()
        setTimeout(function () {
            soundG.stop()
        },duration)
    },delay)
}
const play_melody = function (melody,note_duration=333,gap_before_next=gap_between_notes) {
    for (let i = 0; i < melody.length; i++) {
        play_note(melody[i],note_duration-gap_before_next,i*note_duration)
    }
}
const play_animation = function (vid_path='public/animations/6 notes/data.json',melody,note_duration=note_duration,melody_start_delay=0) {
    document.getElementById('animation_container').innerHTML=""
    if(on_screen_animation) on_screen_animation.destroy()
    on_screen_animation = bodymovin.loadAnimation({
        container: document.getElementById('animation_container'),
        renderer: 'svg',
        loop:false,
        autoplay:true,
        path: vid_path
    })
    if(play_melody) setTimeout(function () {play_melody(melody,note_duration)},melody_start_delay)

    setTimeout(function () {
        $(".jspsych-btn").removeClass('hidden')
    },melody.length*1000)


}


var run_block = function (subject_id,block_no = 1,callback,sona="") {
    /* global vars */
    base_dir = "/pubstore"
    sub_dir = base_dir + "/" + subject_id
    img_dir = sub_dir + "/images"
    audio_dir = sub_dir + "/audio"
    csv_dir = sub_dir + "/csv"
    ITI_dur = 1000
    question_csv = undefined
    var mapping_123 = {
        "1":{rating: 1, certainty:"high"},
        "2":{rating: 2, certainty:"high"},
        "3":{rating: 3, certainty:"high"}
    }


    const execute_block = function (json) {
        /* create timeline */
        var timeline = [];

        var on_screen_prompts = []

        let total_responses = 0
        let correct_responses = 0


        /* define welcome message trial */
        var welcome = {
            type: "html-keyboard-response",
            stimulus: "<p> Hello and welcome to the study.<br> <br>" +
                "<p>Press any key on your keyboard to continue.</p>",
            data: { name: 'welcome_message' }
        };

        on_screen_prompts.push({
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'><b>NOTE: If you had participated in one of our previous experiments (e.g. Music Discrimination): this is a separate experiment and has a new set of instructions. Please read carefully.</b></p><br><br>" +
                "<p class='p_30'>Press the [A] key on your keyboard to continue.</p>",
            choices: ['a'],

            data: { name: 'message' }
        })

        on_screen_prompts.push({
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'>At this time, please attempt to eliminate any potential distractions.<br>" +
                "We ask that you please provide us with your undivided attention during the experiment.</p>" +
                "<p class='p_30'>Your responses are evaluated throughout the task on particular trials. Low engagement on these trials may result in more test questions.</p>" +
                "<p class='p_30'>The results of this study depend on your engagement. If you feel tired or unfocused, please hold off on performing the experiment at this time.</p>" +
                "<p class='p_30'>Press the [N] key on your keyboard to continue.</p>",
            choices: ['n'],
            data: { name: 'message' }
        })

        on_screen_prompts.push({
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'>In order to take this experiment you must use headphones.<br>" +
                "Please connect your headphones now if they are not already connected. <br>" +
                "When you are ready, press any key to continue.<br><br>" +
                "If you do not have headphones you may use earphones. Otherwise, unfortunately you cannot participate in this experiment at this time.<br> " +
                "We thank you for you time and your willingness to help. </p>",
            data: { name: 'headphones message' }
        })


        var instructions_practice = {
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'>For every trial you will listen to a (\"test\") melody. <br>" +
                "This melody will be followed by two similar (\"comparison\") melodies <br>(Option 1 and Option 2).</p>" +
                "<p class='p_30'>Press the [T] key on your keyboard to continue.</p>",
            post_trial_gap: 0,
            choices: ['t'],
            data: { name: 'instructions_practice' }
        };

        var instructions_practice2 = {
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'>After listening to the melodies, you will be asked to pick one of the two comparison melodies that (in your " +
                "opinion) sounds most <b>DIFFERENT</b> than the original test melody.</p>" +
                "<p class='p_30'>If you think Option 1 was <b>more different</b> than the test melody, please press [A] on your keyboard. " +
                "Otherwise, if you think Option 2 was <b>more different</b> than the test, please press [L] on your keyboard.</p>" +
                "<p class='p_30'>Press the [C] key on your keyboard to continue.</p>",
            choices: ['c'],
            post_trial_gap: 0,
            data: { name: 'instructions_practice' }
        };



        var instructions_practice3 = {
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'>The melodies are very brief so we ask that you focus your attention and try to listen to the melody as closely as possible.</p>" +
                "<p class='p_30'>Press the [F] key on your keyboard to continue.</p>",
            post_trial_gap: 0,
            choices: ['f'],
            data: { name: 'instructions_practice' }
        };

        on_screen_prompts.push(instructions_practice)

        on_screen_prompts.push({
            type: "html-keyboard-response",
            stimulus: "<p class='p_30'>The keyboard instructions will appear on the screen throughout the experiment.</p>" +
                "<p class='p_30'>Please pay attention to the cross at the center of the screen throughout the task.</p>" +
                "<p class='p_30'>In total, this experiment takes about an hour to complete.</p>" +
                "<p class='p_30'>The melodies are very brief so we ask that you focus your attention and try to listen to the melody as closely as possible.</p>" +
                "<p class='p_30'>Press any key to begin.</p>",
            post_trial_gap: 0,
            data: { name: 'message' }
        })


        var instructions_trial = {
            type: "html-keyboard-response",
            stimulus: "<p>Experimental Session, block " + block_no + " of " + experiment_data.length + ".</p>" +
                "" +
                "<p>Press any key to begin.</p>",
            post_trial_gap: 0,
            data: { name: 'instructions_trial' }

        };
        /* test trials */
        var fixation = {
            type: 'html-keyboard-response',
            stimulus: '<div id="fixation_guy" style="font-size:60px;">+</div>',
            choices: jsPsych.NO_KEYS,
            trial_duration: ITI_dur,
            data: { name: 'fixation_cross' },
            post_trial_gap: 0,
        }
        var play_scale = {
            type: 'html-button-response',
            stimulus: function() {
                console.log(json)
                let path
                if(json.type=="pentatonic") path = 'public/animations/6 notes/data.json'
                else if(json.type=="diatonic") path = 'public/animations/8 notes/data.json'
                else alert("error")

                let scale_up = [...json.transposed_in_mode,json.transposed_in_mode[0]+12]
                let up_down = [...scale_up,...[scale_up.reverse()]]


                return '<p style="font-size: 45px;line-height: 1.4em;">Press the button to hear the scale.<br>Note: All of the following questions will refer to this scale.<br>' +
                    '<input id="play_btn" class="jspsych-btn" type="button" value="Press here to hear scale" onclick="play_animation(\'' + path + '\',[' + up_down + '],1000,1000)">'+ '</p><br>' +
                    '<div id="animation_container" class="animation_cont"></div>'


            },
            button_html: '<button class="jspsych-btn hidden">%choice%</button>',
            choices: ['Continue'],
        };

        var procedure = []
        for(let ind in json['Q']) {

            let Q = json['Q'][ind]



            var play_interval = {
                type: 'html-keyboard-response',
                prompt: '<div id="animation_container" class="animation_cont"></div>',
                stimulus: function () {

                    return '<input id="play_btn" class="jspsych-btn" type="button" value="Click here to hear reference and comparison notes" onclick="play_animation(\'\',[' + notes + '],2000)">'+ '</p><br>'

                },
                choices: jsPsych.NO_KEYS,
                data: { name: 'fixation_cross' },
                post_trial_gap: 0,
            }

            var play_interval = {
                type: 'html-button-response',
                stimulus: function() {
                    let path = 'public/animations/test/data.json'
                    let notes = [Q["reference_note"],Q["test_note"]]


                    return '<p style="font-size: 45px;line-height: 1.4em;">' +
                        '<input id="play_btn" class="jspsych-btn" type="button" value="Click here to hear reference and comparison notes" onclick="play_animation(\'' + path + '\',[' + notes + '],2000)">'+ '</p><br>' +
                        '<div id="animation_container" class="animation_cont"></div>'


                },
                button_html: '<button class="jspsych-btn hidden">%choice%</button>',
                choices: ['Continue'],
            };


            var choice_screen = {
                type: "html-button-response",
                stimulus: "<p style='font-size: 45px;line-height: 1.4em;'>How far apart is the reference note from the test note.</p>" +

                    "<div style='width: 1200px'>" +
                    "<div style='float: left;width: 333px; font-size: 25px;line-height: 1.4em;'>[1] The test note is 1 away from the reference note</div>" +
                    "<div style='float: right; width:333px;font-size: 25px;line-height: 1.4em;'>[3] The test note is 3 away from the reference note</div>" +
                    "<div style='margin:0 auto; width:333px;font-size: 25px;line-height: 1.4em;'>[2] The test note is 2 away from the reference note</div></div>" +
                    "</div>" +
                    "<img src='../images/onscreen.png' style='width: 1000px'><br>",
                choices: ['1','2','3'],
                data: { name: 'choice' },
                on_finish: function(data){
                    data.response = parseInt(data['button_pressed'])+1
                    for (let key in Q) {
                        data[key] = Q[key]
                    }
                    for (let key in json) {
                        if(key=="Q") continue
                        data[key] = json[key]
                    }
                    data['stimulus']=""
                    total_responses+=1
                    if(Math.abs(Q['delta'])==data.response) correct_responses+=1
                }
            }
            var questions_left_after_practice = {
                type: "html-keyboard-response",
                stimulus: "<p style='font-size: 45px'>Practice is now over and the experiment will begin (following the same structure as the practice session).<br><br>Section " + block_no +", Question" + parseInt(parseInt(ind)+1) + "/" + json.length + "</p>" +
                    "<br><p>Press any key to hear the test melody and the two comparison melodies.</p>",
                data: { name: 'interquestion screen' },
            }

            let section_name
            if(block_no==0) section_name = '"practice"'
            else section_name = block_no
            var questions_left = {
                type: "html-keyboard-response",
                stimulus: "<p style='font-size: 45px'>Section " + section_name +", Question " + parseInt(parseInt(ind)+1) + "/" + json.length + "</p>" +
                    "<br><p>Press any key to hear the test melody and the two comparison melodies.</p>",
                data: { name: 'interquestion screen' },
            }

            procedure.push(play_interval)
            procedure.push(choice_screen)
            procedure.push(fixation)


        }



        var final_message_practice = {type: "html-keyboard-response",
            stimulus: "<p>Practice is now over and the experiment will begin (following the same structure as the practice session).</p>" +
                "<p>You may now rest, and when you are ready,<br>" +
                "Press any key to continue.</p>",
            post_trial_gap: 0,
            data: { name: 'final_message' }
        }

        var final_message = {type: "html-keyboard-response",
            stimulus: function () {

            return "<p>You have finished the block.</p>" +
                "<p>Out of " + total_responses + " questions, you answered " + correct_responses + " correctly.</p>"
                "<p>You may now rest, and when you are ready,<br>" +
                "Press [H] to continue.</p>"
            },
            post_trial_gap: 0,
            choices:['h'],
            data: { name: 'final_message' }
        }

        if(block_no==1) {
            let fullscreen = {
                type: 'fullscreen',
                    fullscreen_mode: true
            }
            timeline.push(welcome,fullscreen,...on_screen_prompts,play_scale,...procedure,final_message);
            // timeline.push(welcome,fullscreen,headphones,instructions_practice,...procedure,...quiz,final_message_practice);

        } else {
            timeline.push(instructions_trial,play_scale,...procedure,final_message);

        }

        var save_all_json = function (callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'save'); // 'write_data.php' is the path to the php file described above.
            xhr.setRequestHeader('Content-Type', 'application/json');
            // data = jsPsych.data.get().json()
            data = jsPsych.data.get().filter({name:"choice"})
            data = data.json()
            xhr.send(JSON.stringify({subject: subject_id, data: data, block: block_no}));
            xhr.onerror = function() { // only triggers if the request couldn't be made at all
                alert(`Network Error. Will try again in 5 seconds.`);
                setTimeout(save_all_json,5000)
            };
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if(xhr.status==200) {
                        console.log("saved")
                        callback()
                    }
                }
            }

        }
        var save_chunk = function (chunk_name) {
            //do nothing. Maybe write it later



        }
        jsPsych.save_all_json = save_all_json

        /* start the experiment */
        jsPsych.init({
            timeline: timeline,
            default_iti: 0,
            exclusions: {
                audio: true
            },
            on_finish: function() {
                jsPsych.data.addProperties({
                    subject: subject_id,
                    sona:sona,
                    block: block_no,
                    time: new Date()
                });
                save_all_json(callback)
            }
        });
    }


    if(experiment_data) execute_block(experiment_data[block_no-1])


}
