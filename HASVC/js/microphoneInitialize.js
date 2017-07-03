/**
 * Created by tahae on 7/2/2017.
 */
let mic;
document.addEventListener('DOMContentLoaded', function (e) {
    mic = new Wit.Microphone(document.getElementById("microphone"));
    let info = function (msg) {
        document.getElementById("info").innerHTML = msg;
    };
    let error = function (msg) {
        document.getElementById("error").innerHTML = msg;
    };
    info("Microphone is not ready yet");
    mic.onready = function () {
        info("Microphone is ready to record");
    };
    mic.onaudiostart = function () {
        info("Recording started");
        error("");
    };
    mic.onaudioend = function () {
        info("Recording stopped, processing started");
    };
    mic.onresult = function (intent, entities, response) {
        // let r = kv("intent", intent);
        //
        // for (let k in entities) {
        //     let e = entities[k];
        //
        //     if (!(e instanceof Array)) {
        //         r += kv(k, e.value);
        //     } else {
        //         for (let i = 0; i < e.length; i++) {
        //             r += kv(k, e[i].value);
        //         }
        //     }
        // }
        //
        // document.getElementById("result").innerHTML = r;

        $.ajax({
            url: 'http://localhost:3000/action',
            method: 'POST',
            data: {
                response: response
            }
        }).done(function (data) {
            // console.log(data.message);
            responsiveVoice.speak(data.message);
        });
    };
    mic.onerror = function (err) {
        error("Error: " + err);
    };
    mic.onconnecting = function () {
        info("Microphone is connecting");
    };
    mic.ondisconnected = function () {
        info("Microphone is not connected");
    };

    localStorage.setItem('wit_token', 'T4EWN2P2TKMG2CC5DTEZ7AMYQMY2Z53L');
    token = localStorage.getItem('wit_token');
    if (!token) {
        throw new Error("Could not find token!");
    }
    mic.connect(token);
    // mic.start();
    // mic.stop();

    function kv (k, v) {
        if (toString.call(v) !== "[object String]") {
            v = JSON.stringify(v);
        }
        return k + "=" + v + "\n";
    }
});

function changeState(s) {
    document.getElementById('current-state').textContent = s;
    mic.setContext({state: s});
    responsiveVoice.speak('state set to ' + s);
}
document.getElementById('state-foo').addEventListener('click', function (e) {
    e.preventDefault();
    changeState(document.getElementById('state-input').value);
});