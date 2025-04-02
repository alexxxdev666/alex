const elVideo = document.getElementById('video');
navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);

const cargarCamera = () => {
    navigator.getMedia(
        {
            video: true,
            audio: false
        },
        stream => elVideo.srcObject = stream,
        console.error
    );
}

// Cargar Modelos
Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
]).then(cargarCamera);

elVideo.addEventListener('play',  async () => {
    // creamos el canvas con los elementos de la face api
    const canvas = faceapi.createCanvasFromMedia(elVideo);
    // lo añadimos al body
    document.body.append(canvas);

    // tamaño del canvas
    const displaySize = { width: elVideo.width, height: elVideo.height };
    // resize the overlay canvas to the input dimensions
    
    faceapi.matchDimensions(canvas, displaySize);
    setInterval( async() =>{
    const detections = await faceapi.detectAllFaces(elVideo)
        .whithFaceExpressions()
    canvas.getCOntext('2d').clearRect(0, 0, canvas.width, canvas.height)
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    faceapi.draw.drawDetections(canvas, resizedDetections)

    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
    })
});
