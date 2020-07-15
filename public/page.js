const loadingPhrases = [ 'Processing', 'Thinking', 'Working on it', 'Reasoning', 'Contemplating', 'Deliberating' ];

function formSubmit(path, event) {
    event.preventDefault();
    const response = document.getElementById('response-message');
    const button = document.getElementById('wordify-button');
    response.innerText = `${loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]}...`;
    button.disabled = true;
    
    let data = {};
    new FormData(event.target).forEach((value, key) => data[key] = value);

    setTimeout(() => {
        let request = new XMLHttpRequest();
        request.open('POST', path);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify(data));
        request.onload = (res) => {
            let responseData = JSON.parse(request.response);
            response.innerText = responseData.content;
        };
        button.disabled = false;
    }, 1000);
}