var trumbowygPost;
window.addEventListener("load", (event) => {
    trumbowygPost = document.querySelector('textarea[name="trumbowyg-demo"]');
});

function submitForm() {
    var post = document.getElementById('post');
    post.value = trumbowygPost.value;
    document.getElementById('threadform').submit();
}

// required dom elements
const voiceTranscriptButton = document.getElementById('voiceTranscriptButton');
const messageEl = document.getElementById('trumbowyg-demo');

// set initial state of application variables
let isRecording = false;
let socket;
let recorder;

// runs real-time transcription and handles global variables
const run = async () => {
    if (isRecording) {
        if (socket) {
            socket.send(JSON.stringify({ terminate_session: true }));
            socket.close();
            socket = null;
        }

        if (recorder) {
            recorder.pauseRecording();
            recorder = null;
        }
    } else {
        const response = await fetch('/forum/speechToText'); // get temp session token from server.js (backend)
        const data = await response.json();

        if (data.error) {
            alert(data.error)
        }

        const { token } = data;

        // establish wss with AssemblyAI (AAI) at 16000 sample rate
        socket = await new WebSocket(`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`);

        const currentText = trumbowygPost.value;

        // handle incoming messages to display transcription to the DOM
        const texts = {};
        socket.onmessage = (message) => {
            let msg = '';
            const res = JSON.parse(message.data);
            texts[res.audio_start] = res.text;
            const keys = Object.keys(texts);
            keys.sort((a, b) => a - b);
            for (const key of keys) {
                if (texts[key]) {
                    msg += ` ${texts[key]}`;
                }
            }
            messageEl.innerHTML = currentText + msg;
            trumbowygPost.value = currentText + msg;
            console.log(msg)
        };

        socket.onerror = (event) => {
            console.error(event);
            socket.close();
        }

        socket.onclose = event => {
            console.log(event);
            socket = null;
        }

        socket.onopen = () => {
            // once socket is open, begin recording
            messageEl.style.display = '';
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then((stream) => {
                    recorder = new RecordRTC(stream, {
                        type: 'audio',
                        mimeType: 'audio/webm;codecs=pcm', // endpoint requires 16bit PCM audio
                        recorderType: StereoAudioRecorder,
                        timeSlice: 250, // set 250 ms intervals of data that sends to AAI
                        desiredSampRate: 16000,
                        numberOfAudioChannels: 1, // real-time requires only one channel
                        bufferSize: 4096,
                        audioBitsPerSecond: 128000,
                        ondataavailable: (blob) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                const base64data = reader.result;

                                // audio data must be sent as a base64 encoded string
                                if (socket) {
                                    socket.send(JSON.stringify({ audio_data: base64data.split('base64,')[1] }));
                                }
                            };
                            reader.readAsDataURL(blob);
                        },
                    });

                    recorder.startRecording();
                })
                .catch((err) => console.error(err));
        };
    }

    isRecording = !isRecording;
    voiceTranscriptButton.innerHTML = isRecording ? '<span class="lnr lnr-cross-circle"></span> Stop Voice Transcript' : '<span class="lnr lnr-mic"></span> Start Voice Transcript';
    voiceTranscriptButton.style.background = isRecording ? '#ff6c6c' : '#7844c4';
};

voiceTranscriptButton.addEventListener('click', () => run());