function loadImage(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = reader.result;
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

function calculateSignature(img) {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
	let signature = 0;
	for (let i = 0; i < imageData.length; i += 4) {
		signature += imageData[i] + imageData[i + 1] + imageData[i + 2];
	}
	return signature;
}

async function findDuplicates() {
	const input = document.getElementById('imageInput');
	const result = document.getElementById('result');
	const files = input.files;
	const signatures = {};
	const duplicates = [];

	for (const file of files) {
		try {
			const img = await loadImage(file);
			const signature = calculateSignature(img);
			if (signature in signatures) {
				duplicates.push({ file1: file.name, file2: signatures[signature] });
			} else {
				signatures[signature] = file.name;
			}
		} catch (error) {
			console.error('Error loading image', file.name, error);
		}
	}

	result.innerHTML = '<h2>Resultados:</h2>';
	if (duplicates.length > 0) {
		duplicates.forEach(dup => {
			result.innerHTML += `<p>${dup.file1} é duplicada de ${dup.file2}</p>`;
		});
	} else {
		result.innerHTML += '<p>Nenhuma imagem duplicada encontrada.</p>';
	}
}
