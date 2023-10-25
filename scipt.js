const startCameraButton = document.getElementById('start-camera-button');
const cameraFeed = document.getElementById('camera-feed');
const outputCanvas = document.getElementById('output');

let model;
let children = [];

startCameraButton.addEventListener('click', initializeCamera);

async function initializeCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraFeed.srcObject = stream;
        startCameraButton.style.display = 'none';
        cameraFeed.style.display = 'block';

        model = await cocoSsd.load();
        detectFrame();
    } catch (error) {
        console.error('カメラアクセスエラー: ', error);
    }
}

function detectFrame() {
    model.detect(cameraFeed).then(predictions => {
        clearCanvas();
        for (let i = 0; i < predictions.length; i++) {
            drawBoundingBox(predictions[i]);
        }
        requestAnimationFrame(detectFrame);
    });
}

function drawBoundingBox(prediction) {
    const ctx = outputCanvas.getContext('2d');
    const [x, y, width, height] = prediction.bbox;
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.fillStyle = 'transparent';
    ctx.stroke();
    ctx.font = '18px Arial';
    ctx.fillStyle = 'red';
    ctx.fillText(prediction.class, x, y > 10 ? y - 5 : 10);
}

function clearCanvas() {
    const ctx = outputCanvas.getContext('2d');
    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
}

outputCanvas.width = window.innerWidth;
outputCanvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    outputCanvas.width = window.innerWidth;
    outputCanvas.height = window.innerHeight;
});
