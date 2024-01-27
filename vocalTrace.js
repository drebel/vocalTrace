
const startRecordButton = document.getElementById('startRecord');
const stopRecordButton = document.getElementById('stopRecord');
const analyzeAudioButton = document.getElementById('analyzeAudio');
const downloadAudioButton = document.getElementById('downloadAudio');
const recordedAudio = document.getElementById('recordedAudio');

startRecordButton.disabled = false;
stopRecordButton.disabled = true;
analyzeAudioButton.disabled = true;
downloadAudioButton.disabled = true;

let mediaRecorder;
let recordedChunks = [];


startRecordButton.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'audio/wav' });
        recordedChunks = [];
        recordedAudio.src = URL.createObjectURL(blob);
    };

    mediaRecorder.start();
    startRecordButton.disabled = true;
    stopRecordButton.disabled = false;
    analyzeAudioButton.disabled = true;
    downloadAudioButton.disabled = true;
});

stopRecordButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startRecordButton.disabled = false;
    stopRecordButton.disabled = true;
    analyzeAudioButton.disabled = false;
    downloadAudioButton.disabled = false;
});

analyzeAudioButton.addEventListener('click', () => {
    console.log("analyzing audio sample")
})

downloadAudioButton.addEventListener('click', () => {
    const blob = new Blob(recordedChunks, { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recorded_audio.wav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});