let openEyes = document.querySelector(".fa-eye");
let container = document.querySelector(".container");

let files = [];

window.onload = () => {
    loadFilesFromLocalStorage();
    displayFiles();
};

function handleFileSelect(event) {
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
        files.push(selectedFiles[i]);
    }
    saveFilesToLocalStorage();
    displayFiles();
}

function displayFiles() {
    const fileContainer = document.getElementById('fileContainer');
    fileContainer.innerHTML = '';

    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.classList.add('file-item');

        const fileName = document.createElement('span');
        fileName.textContent = file.name;

        const fileActions = document.createElement('div');
        fileActions.classList.add('file-actions');

        const openBtn = document.createElement('button');
        openBtn.textContent = `Open `;
        openBtn.classList.add('action-btn', 'open-btn');
        let icon = document.createElement('i');
        icon.classList.add('fa', 'fa-solid', 'fa-eye');
        icon.style.color = 'blue';
        openBtn.appendChild(icon);
        openBtn.onclick = () => openFile(file);

        // const shareBtn = document.createElement('button');
        // shareBtn.textContent = 'Share';
        // shareBtn.classList.add('action-btn', 'share-btn');
        // shareBtn.onclick = () => shareFile(file);

        // <i class="fa-solid fa-delete-left"></i>

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete ';
        deleteBtn.classList.add('action-btn', 'delete-btn');

        let delIcon = document.createElement('i');
        delIcon.classList.add('fa', 'fa-solid', 'fa-delete-left');
        deleteBtn.appendChild(delIcon);

        deleteBtn.onclick = () => deleteFile(index);

        fileActions.appendChild(openBtn);
        // fileActions.appendChild(shareBtn);
        fileActions.appendChild(deleteBtn);

        fileItem.appendChild(fileName);
        fileItem.appendChild(fileActions);

        fileContainer.appendChild(fileItem);
    });
}

function openFile(file) {
    if (file) {
        // Implement file open functionality here
        console.log('Opening file:', file.name);
        // Example:
         window.open(URL.createObjectURL(file));
    } else {
        console.error('File object is undefined.');
    }
}

// function shareFile(file) {
//     // Implement file share functionality here
//     console.log('Sharing file:', file.name);
//     // Example:
//      navigator.share({ title: file.name, files: [file] });
// }


//     function shareFile(file) {
//     const phoneNumber = '1234567890'; // Replace with recipient's phone number
//     const message = `Hey, I'm sharing a file with you. Download it here: ${getFileDownloadLink(file)}`;
//     const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
//     window.open(whatsappLink, '_blank');
// }

// function getFileDownloadLink(file) {
//     // Generate a link to download the file from your server
//     // Example: 
//     return `https://your-server.com/download/${encodeURIComponent(file.name)}`;
// }



function deleteFile(index) {
    files.splice(index, 1);
    saveFilesToLocalStorage();
    displayFiles();
}

function deleteAll() {
    files = [];
    saveFilesToLocalStorage();
    displayFiles();
}

function saveFilesToLocalStorage() {
    const filesData = files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
    }));
    localStorage.setItem('uploadedFiles', JSON.stringify(filesData));
}

function loadFilesFromLocalStorage() {
    const storedFilesData = localStorage.getItem('uploadedFiles');
    if (storedFilesData) {
        const parsedFilesData = JSON.parse(storedFilesData);
        files = parsedFilesData.map(data => new File([], data.name, {
            type: data.type,
            size: data.size,
            lastModified: data.lastModified
        }));
    }
}