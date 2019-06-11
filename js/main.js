// getting the DOM element
const video = document.getElementById('video')

// start video function
startVideo = () => {
    navigator.getUserMedia({
        video: {}
    },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

// promise so that all the models can properly load
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./js/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./js/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./js/models')
]).then(startVideo)

// eventlistener so that the needed model can be called when the video is playing
video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = {
        width: video.width,
        height: video.height
    }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections) // Detects area around which the face is most probable to exist 
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections) // detects the landmarks i.e. eys, nose, lips
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections) // detects the expressions i.e. neutral, happy, sad, surprised, angry
    }, 100) // 100ms is the time interval to call the eventlistener
})




