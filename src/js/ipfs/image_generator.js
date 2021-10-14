import 'regenerator-runtime/runtime'

import { create } from 'ipfs-http-client';

const client = create("https://ipfs.infura.io:5001");

let fileBuffer;
let imageUpload = document.getElementById("imageUpload");
let uploadForm = document.getElementById("uploadForm");
let nftImage;

imageUpload.onchange = function() {
    let file = this.files[0];

    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
        fileBuffer =  Buffer(reader.result)
        console.log('buffer', fileBuffer);
    }
};

uploadForm.onsubmit = function(e){
    e.preventDefault();
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;

    let data = {
        title,
        description,
        image: fileBuffer
    }

    client.add(fileBuffer).then(image => {
        nftImage = 'https://ipfs.infura.io/ipfs/' + image.path;
        let nft = document.getElementById("nft");
        nft.src = nftImage;
    })
    .catch(err => {
        console.log('Error?', err.message)
    })

    console.log('hey', title, description);
}


