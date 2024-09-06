function handleBotResponse(response) {
    var botHtml = '<div class="message bot"><span>' + response + '</span></div>';
    $("#chat-box").append(botHtml); // Display model response in chat-box
    $("#chat-box").scrollTop($("#chat-box")[0].scrollHeight); // Scrolls to the bottom of the chat-box
}

function handleUserInput(rawText) {
    var userHtml = '<div class="message user"><span>' + rawText + '</span></div>';
    $("#chat-box").append(userHtml); // Append user input to the chat-box
    $("#chat-box").scrollTop($("#chat-box")[0].scrollHeight); // Scrolls to the bottom of the chat-box
}

$(document).ready(function() {
    $("#uploadForm").submit(function(e) {
        e.preventDefault();
        var formData = new FormData(this);

        $.ajax({
            url: '/predict',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                var prediction = response.prediction;
                handleBotResponse(prediction); // Display image prediction in chat-box
            },
            error: function(error) {
                console.log(error);
            }
        });
    });

    $("#sendButton").click(function() {
        var rawText = $("#text-input").val();
        if (rawText.trim() === "") {
            return;
        }
        handleUserInput(rawText); // Display user input in chat-box

        $.get("/get", { msg: rawText }).done(function(data) {
            handleBotResponse(data); // Display model response in chat-box
        });

        $("#text-input").val(""); // Clear input field after sending
    });

    $("#text-input").keypress(function(e) {
        if (e.which == 13) { // Enter key press triggers the handleUserInput function
            var rawText = $("#text-input").val();
            if (rawText.trim() === "") {
                return;
            }
            handleUserInput(rawText); // Display user input in chat-box

            $.get("/get", { msg: rawText }).done(function(data) {
                handleBotResponse(data); // Display model response in chat-box
            });

            $("#text-input").val(""); // Clear input field after sending
        }
    });
});

function previewImage() {
    const fileInput = document.getElementById('image-input');
    const chatBox = document.getElementById('chat-box');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const image = document.createElement('img');
            image.src = e.target.result;
            image.style.maxWidth = '100%';
            image.style.maxHeight = '300px';
            chatBox.appendChild(image);

            // Trigger form submission
            const formData = new FormData();
            formData.append('file', fileInput.files[0]);

            $.ajax({
                url: '/predict',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function(response) {
                    var prediction = response.prediction;
                    handleBotResponse(prediction); // Display image prediction in chat-box
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }

        reader.readAsDataURL(fileInput.files[0]);
    }
}

function showScreen1() {
    document.getElementById('screen1').classList.add('active');
    document.getElementById('screen2').classList.remove('active');
}

function showScreen2() {
    document.getElementById('screen1').classList.remove('active');
    document.getElementById('screen2').classList.add('active');
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('sendButton').click();
    }
}