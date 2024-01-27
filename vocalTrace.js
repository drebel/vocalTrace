
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
    recordedChunks = []

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'audio/wav' });
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
    console.log('Analyzing audio')
    if (recordedChunks.length === 0) {
        console.error('No recorded audio to analyze');
        return;
    }

    const audioBlob = new Blob(recordedChunks, { type: 'audio/wav' });

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recorded_audio.wav');

    fetch('URL', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        console.log('API response:', data);
    })
    .catch(error => console.error('API error:', error));
});

downloadAudioButton.addEventListener('click', () => {
    const downloadBlob = new Blob(recordedChunks, { type: 'audio/wav' });

    // Log Blob size for debugging
    console.log('Blob size:', downloadBlob.size);

    const url = URL.createObjectURL(downloadBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recorded_audio.wav';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the object URL to free up resources
    URL.revokeObjectURL(url);
});