


var run_block = function (subject_id,block_no = 1,callback,sona="",quiz_questions) {
    /* global vars */
    base_dir = "/pubstore"
    sub_dir = base_dir + "/" + subject_id
    img_dir = sub_dir + "/images"
    audio_dir = sub_dir + "/audio"
    csv_dir = sub_dir + "/csv"
    ITI_dur = 1000
    question_csv = undefined
    var mapping_1st2nd = {
        "A":{rating: "1st", certainty:"high"},
        "G":{rating: "neither", certainty:"high"},
        "L":{rating: "2nd", certainty:"high"}
    }
    var mapping_yesno = {
        "Y":{rating: true, certainty:"high"},
        "N":{rating: false, certainty:"high"}
    }

    var mapping_rating = {
        '1': {rating:"disagree", numeric:1},
        '2': {rating:"somewhat disagree",numeric:2},
        '3': {rating:"neutral",numeric:3},
        '4': {rating:"somewhat agree",numeric:4},
        '5': {rating:"agree",numeric:5}
    }

    const execute_block = function (json) {
        /* create timeline */
        var timeline = [];

        /* define welcome message trial */
        var welcome = {
            type: "html-keyboard-response",
            stimulus: "<p style='font-size: 22px'> Hello and welcome to the study.<br> <br>" +
                "In this experiment, you will hear short melodies and answer questions about those melodies.<br>" +
                "At this time, please attempt to eliminate any potential distractions.<br>" +
                "We ask that you please provide us with your undivided attention during the experiment.</p>" +
                "<p style='font-size: 22px'>The results of this study depend on your performance. If you feel tired or unfocused, please hold off on performing the experiment at this time.</p>" +
                "<p style='font-size: 22px'>Press any key on your keyboard to continue.</p>",


            data: { name: 'welcome_message' }
        };
        var headphones = {
            type: "html-keyboard-response",
            stimulus: "<p style='font-size: 25px;line-height: 1.4em;'>In order to take this experiment you must use headphones.<br>" +
                "Please connect your headphones now if they are not already connected. <br>" +
                "When you are ready, press any key to continue.<br><br>" +
                "If you do not have headphones you may use earphones. Otherwise, unfortunately you cannot <br>" +
                "participate in this experiment at this time.<br> " +
                "We thank you for you time and your willingness to help. </p>",
            data: { name: 'headphones message' }
        };
        var instructions_practice = {
            type: "html-keyboard-response",
            stimulus: "<p style='font-size: 20px;line-height: 1.2em;'>In each section, you will hear melodies and be asked to answer questions about them. </p><br>" +
                "<p style='font-size: 20px;line-height: 1.2em;'>Please pay attention to the cross at the center of the screen throughout the task.</p>" +
                "<p style='font-size: 20px;line-height: 1.2em;'>In total, you will hear 220 melodies across 5 sections.</p>" +
                "<p style='font-size: 20px;line-height: 1.2em;'>The melodies are very brief so we ask that you focus your attention and try to listen to the melody as closely as possible.</p><br>" +
                "<p style='font-size: 20px;line-height: 1.2em;'>Press any key to begin.</p>",
            post_trial_gap: 0,
            data: { name: 'instructions_practice' }
        };
        var instructions_trial = {
            type: "html-keyboard-response",
            stimulus: "<p>Experimental Session, block " + block_no + " of 5.</p>" +
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
        var countdown_1 = {
            type: 'html-keyboard-response',
            stimulus: '<div id="fixation_guy" style="font-size:120px;">1...</div>',
            choices: jsPsych.NO_KEYS,
            trial_duration: 1000,
            data: { name: 'countdown' },
            post_trial_gap: 0,
        }
        var countdown_2 = {
            type: 'html-keyboard-response',
            stimulus: '<div id="fixation_guy" style="font-size:120px;">2...</div>',
            choices: jsPsych.NO_KEYS,
            trial_duration: 1000,
            data: { name: 'countdown' },
            post_trial_gap: 0,
        }
        var countdown_3 = {
            type: 'html-keyboard-response',
            stimulus: '<div id="fixation_guy" style="font-size:120px;">3...</div>',
            choices: jsPsych.NO_KEYS,
            trial_duration: 1000,
            data: { name: 'countdown' },
            post_trial_gap: 0,
        }
        var procedure = []
        for(let ind in json) {

            let Q = json[ind]
            var audio_probe = {
                type: 'audio-keyboard-response',
                stimulus: audio_dir + "/" + Q.probe_file,
                trial_ends_after_audio:true,
                response_ends_trial: false,
                choices: [],
                prompt: "<p id='fixation_guy' style='color:blue;font-size: 80px'>Please listen carefully.</p>" +
                    "<br><br><br><br>" +
                    "<div style='width: 800px'>" +
                    "</div>",
                data: { name: 'probe' },
            };
            var scale_1 = [
                "Strongly Disagree",
                "Disagree",
                "Neutral",
                "Agree",
                "Strongly Agree"
            ];

            var Q1 = {
                type: "html-keyboard-response",
                stimulus: "<form id=\"jspsych-survey-likert-form\">" +
                    "<label class=\"jspsych-survey-likert-statement\" style='font-size: x-large'>Some notes felt more important than others.<br>" +
                    "(Indicate by pressing 1-5 on your keyboard)</label>" +
                        "<ul class=\"jspsych-survey-likert-opts\" data-name=\"\" data-radio-group=\"Q1\" style='font-size: x-large'>" +
                            "<li style=\"width:20%\"><input type=\"radio\" name=\"Q1\" value=\"0\" disabled><label class=\"jspsych-survey-likert-opt-label\">[1]</br>Disagree</label></li>" +
                            "<li style=\"width:20%\"><input type=\"radio\" name=\"Q1\" value=\"1\" disabled><label class=\"jspsych-survey-likert-opt-label\">[2]</br>Somewhat Disagree</label></li>" +
                            "<li style=\"width:20%\"><input type=\"radio\" name=\"Q1\" value=\"2\" disabled><label class=\"jspsych-survey-likert-opt-label\">[3]</br>Neutral</label></li>" +
                            "<li style=\"width:20%\"><input type=\"radio\" name=\"Q1\" value=\"3\" disabled><label class=\"jspsych-survey-likert-opt-label\">[4]</br>Somewhat Agree</label></li>" +
                            "<li style=\"width:20%\"><input type=\"radio\" name=\"Q1\" value=\"4\" disabled><label class=\"jspsych-survey-likert-opt-label\">[5]</br>Agree</label></li>" +
                    "</ul></form>",
                choices: ['1','2','3','4','5'],
                data: { name: 'likert' },
                on_finish: function(data){
                    data.stimulus = "Some notes felt more important than others."
                    data.set = Q.set
                    data.rt = Math.round(data.rt)
                    data.transposition = Q.transposition
                    data.mode = Q.mode
                    data.mode_no = Q.mode_no
                    data.shift_position = Q.shift_position
                    data.probe_pitches = Q.probe
                    data.question_num = parseInt(ind+1)
                    data.response = mapping_rating[String.fromCharCode(data.key_press)].rating
                    data.response_numeric = mapping_rating[String.fromCharCode(data.key_press)].numeric
                    console.log(data.response,data.response_numeric)
                }
            }
            var Q2 = {
                type: "html-keyboard-response",
                stimulus: "<form id=\"jspsych-survey-likert-form\">" +
                    "<label class=\"jspsych-survey-likert-statement\" style='font-size: x-large'>The melody as a whole or parts of it felt familiar.<br>" +
                    "(Indicate by pressing 1-5 on your keyboard)</label>" +
                    "<ul class=\"jspsych-survey-likert-opts\" data-name=\"\" data-radio-group=\"Q2\" style='font-size: x-large'>" +
                    "<li style=\"width:20%\"><input type=\"radio\" name=\"Q2\" value=\"0\" disabled><label class=\"jspsych-survey-likert-opt-label\">[1]</br>Disagree</label></li>" +
                    "<li style=\"width:20%\"><input type=\"radio\" name=\"Q2\" value=\"1\" disabled><label class=\"jspsych-survey-likert-opt-label\">[2]</br>Somewhat Disagree</label></li>" +
                    "<li style=\"width:20%\"><input type=\"radio\" name=\"Q2\" value=\"2\" disabled><label class=\"jspsych-survey-likert-opt-label\">[3]</br>Neutral</label></li>" +
                    "<li style=\"width:20%\"><input type=\"radio\" name=\"Q2\" value=\"3\" disabled><label class=\"jspsych-survey-likert-opt-label\">[4]</br>Somewhat Agree</label></li>" +
                    "<li style=\"width:20%\"><input type=\"radio\" name=\"Q2\" value=\"4\" disabled><label class=\"jspsych-survey-likert-opt-label\">[5]</br>Agree</label></li>" +
                    "</ul></form>",
                choices: ['1','2','3','4','5'],
                data: { name: 'likert' },
                on_finish: function(data){
                    data.stimulus = "The melody as a whole or parts of it felt familiar."
                    data.rt = Math.round(data.rt)
                    data.set = Q.set
                    data.transposition = Q.transposition
                    data.mode = Q.mode
                    data.mode_no = Q.mode_no
                    data.shift_position = Q.shift_position
                    data.probe_pitches = Q.probe
                    data.question_num = parseInt(ind+1)
                    data.response = mapping_rating[String.fromCharCode(data.key_press)].rating
                    data.response_numeric = mapping_rating[String.fromCharCode(data.key_press)].numeric
                    console.log(data.response,data.response_numeric)
                }
            }
            var Q3 = {
                type: "html-keyboard-response",
                stimulus: "<form id=\"jspsych-survey-likert-form\">" +
                    "<label class=\"jspsych-survey-likert-statement\" style='font-size: x-large'>The audio clip was melodic.<br>" +
                    "(Indicate by pressing 1-5 on your keyboard)</label>" +
                    "<ul class=\"jspsych-survey-likert-opts\" data-name=\"\" data-radio-group=\"Q3\" style='font-size: x-large'>" +
                    "<li style=\"width:20%\"><input type=\"radio\" name=\"Q3\" value=\"0\" disabled><label class=\"jspsych-survey-likert-opt-label\">[1]</br>Disagree</label></li>" +
                    "<li style=\"width:20%\"><input type=\"radio\" name=\"Q3\" value=\"1\" disabled><label class=\"jspsych-survey-likert-opt-label\">[2]</br>Somewhat Disagree</label></li>" +
                    "<li style=\"width:20%\"><input type=\"radio\" name=\"Q3\" value=\"2\" disabled><label class=\"jspsych-survey-likert-opt-label\">[3]</br>Neutral</label></li>" +
                    "<li style=\"width:20%\"><input type=\"radio\" name=\"Q3\" value=\"3\" disabled><label class=\"jspsych-survey-likert-opt-label\">[4]</br>Somewhat Agree</label></li>" +
                    "<li style=\"width:20%\"><input type=\"radio\" name=\"Q3\" value=\"4\" disabled><label class=\"jspsych-survey-likert-opt-label\">[5]</br>Agree</label></li>" +
                    "</ul></form>",
                choices: ['1','2','3','4','5'],
                data: { name: 'likert' },
                on_finish: function(data){
                    data.stimulus = "The audio clip was melodic."
                    data.rt = Math.round(data.rt)
                    data.set = Q.set
                    data.transposition = Q.transposition
                    data.mode = Q.mode
                    data.mode_no = Q.mode_no
                    data.shift_position = Q.shift_position
                    data.probe_pitches = Q.probe
                    data.question_num = parseInt(ind+1)
                    data.response = mapping_rating[String.fromCharCode(data.key_press)].rating
                    data.response_numeric = mapping_rating[String.fromCharCode(data.key_press)].numeric
                    console.log(data.response,data.response_numeric)
                }
            }







            let section_name
            section_name = block_no
            var questions_left = {
                type: "html-keyboard-response",
                stimulus: "<p style='font-size: 45px'>Section " + section_name +", Question " + parseInt(parseInt(ind)+1) + "/" + json.length + "</p>" +
                    "<br><p>Press any key to hear the next melody.</p>",
                data: { name: 'interquestion screen' },
            }

            procedure.push(questions_left)
            // procedure.push(countdown_3)
            // procedure.push(countdown_2)
            // procedure.push(countdown_1)
            procedure.push(audio_probe)
            procedure.push(fixation)
            procedure.push(Q1)
            procedure.push(fixation)
            procedure.push(Q2)
            procedure.push(fixation)
            procedure.push(Q3)
            procedure.push(fixation)


        }





        var final_message = {type: "html-keyboard-response",
            stimulus: "<p>You have finished the section.</p>" +
                "<p>You may now rest, and when you are ready,<br>" +
                "Press any key to continue.</p>",
            post_trial_gap: 0,
            data: { name: 'final_message' }
        }

        if(block_no==1) {
            let fullscreen = {
                type: 'fullscreen',
                fullscreen_mode: true
            }
            timeline.push(welcome,fullscreen,headphones,instructions_practice,...procedure,final_message);

        } else {
            timeline.push(instructions_trial,...procedure,final_message);

        }

        var save_all_json = function (callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'save'); // 'write_data.php' is the path to the php file described above.
            xhr.setRequestHeader('Content-Type', 'application/json');
            // data = jsPsych.data.get().json()
            data = jsPsych.data.get().filter({name:"likert"})

            data = data.json()
            console.log(data)
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

    /*get block data*/
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
            if (xmlhttp.status == 200) {
                execute_block(JSON.parse(xmlhttp.responseText))
            }
            else alert('There seems to be an error');
        }
    };
    xmlhttp.open("GET", csv_dir + "/block_" +block_no + ".json", true);
    xmlhttp.send();

}
