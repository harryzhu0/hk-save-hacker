import { decode as base64decode } from "./decode.js"

document.getElementById("upload").onclick = () => {
    let input = document.createElement("input")
    input.type = "file"
    input.accept = ".dat"
    input.onchange = async e => {
        let file = e.target.files[0]
        let buffer = await file.arrayBuffer()
        processSave(buffer)
    }
    input.click()
}

function processSave(buffer) {
    let base64 = extractBase64(buffer)
    let zlibBytes = decodeBase64ToZlib(base64)
    let inflated = pako.inflate(zlibBytes)
    let text = new TextDecoder().decode(inflated)

    displayDecodedText(text)
}

export function extractBase64(buffer) {
    let text = new TextDecoder().decode(buffer)
    let json = JSON.parse(text)
    return json.data
}

export function decodeBase64ToZlib(base64String) {
    // Convert Base64 characters → ASCII codes
    let ascii = Uint8Array.from(base64String, c => c.charCodeAt(0))
    return base64decode(ascii)
}

function displayDecodedText(text) {
    document.getElementById("editor").textContent = text
}