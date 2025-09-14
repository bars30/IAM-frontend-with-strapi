const fileInput = document.getElementById("file-upload");
const filePreviewContainer = document.getElementById("file-preview-container");

let selectedFiles = [];

function initFileManager() {
  fileInput.addEventListener("change", handleFileChange);
}

function handleFileChange() {
  const newFile = fileInput.files[0];
  if (!newFile) return;

  if (selectedFiles.some(f => f.name === newFile.name)) {
    fileInput.value = "";
    return;
  }

  selectedFiles.push(newFile);

  updatePreview();
  updateFileList();
  fileInput.value = "";
}

function updatePreview() {
  filePreviewContainer.innerHTML = "";

  selectedFiles.forEach((file, index) => {
    const fileBlock = document.createElement("div");
    fileBlock.className = "file-preview";
    fileBlock.innerHTML = `
      <div class="file-header">
        <img src="./img/file.svg" alt="">
        <span class="file-name">${file.name}</span>
      </div>
      <button class="remove-file">  <img src="./img/close.svg" alt=""></button>
    `;
    filePreviewContainer.appendChild(fileBlock);

    fileBlock.querySelector(".remove-file").addEventListener("click", () => {
      selectedFiles.splice(index, 1);
      updatePreview();
      updateFileList();
    });
  });
}

function updateFileList() {
  const dt = new DataTransfer();
  selectedFiles.forEach(f => dt.items.add(f));
  fileInput.files = dt.files;
}

function getSelectedFiles() {
  return selectedFiles;
}     

function clearSelectedFiles() {
  selectedFiles = [];
  updatePreview();
  updateFileList();
}
 

export {
  initFileManager,
  getSelectedFiles,
  clearSelectedFiles,
  updatePreview,
  updateFileList
};
