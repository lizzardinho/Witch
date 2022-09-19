let ctx, img, l_img, video, w = 800, h = 520;
let i, j, k, g, l = 10;
let error = (e) => console.log(e);
let button = document.querySelector('button');

function handleWebcam(mediaStream) {
	video = document.createElement('video');
	video.src = window.URL.createObjectURL(mediaStream);
	video.play();

	l_img = img = ctx.getImageData(0, 0, w, h);
	requestAnimationFrame(draw);
}

function glitchyEffect(img){
	for(i = 0; i < h; i++){	
		for(j = 0; j < w; j++){	
			if(j % l == 0) {
				if(i % l == 0){
					g = .299*img.data[4*(i*w + j)] + .587*img.data[4*(i*w + j)+1] + .114*img.data[4*(i*w + j)+2];
					g = parseInt(g) >> 6 << 6;
				} else {
					g = img.data[4*((i - 1)*w + j)+1];
				}
			}

			img.data[4*(i*w + j)+0] = 2/(1/(l_img.data[4*(i*w + j)+0]+1) + 1/(g/2 + 1));
			img.data[4*(i*w + j)+1] = 2/(1/(l_img.data[4*(i*w + j)+1]+1) + 1/(g + 1));
			img.data[4*(i*w + j)+2] = 0;
		}
	}
	l_img = img;
}

function draw(){
	ctx.drawImage(video, 0, 0, w, h);
	img = ctx.getImageData(0, 0, w, h);

	glitchyEffect(img);
	ctx.putImageData(img, 0, 0);
	requestAnimationFrame(draw);
}

function setup(){
	let cam = {video:true, audio:false};
	let canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	ctx = canvas.getContext('2d');
	canvas.width = w;
	canvas.height = h;

	navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia);
	navigator.getMedia(cam, handleWebcam, error);
}

button.onclick = setup;