/**
 * Created by tahae on 7/2/2017.
 */
let mic;
document.addEventListener('DOMContentLoaded', function (e) {
    mic = new Wit.Microphone(document.getElementById("microphone"));
    let info = function (msg) {
    };
    let error = function (msg) {
    };
    info("Microphone is not ready yet");
    mic.onready = function () {
    };
    mic.onaudiostart = function () {
    };
    mic.onaudioend = function () {
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
            url: 'http://localhost:3000/api/action',
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
    };
    mic.onconnecting = function () {
    };
    mic.ondisconnected = function () {
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